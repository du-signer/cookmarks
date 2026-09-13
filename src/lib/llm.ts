import type { Difficulty, Recipe } from "../types";

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const ANTHROPIC_VERSION = "2023-06-01";
const SHARED_PROXY_ENDPOINT = "/api/generate-recipe";

export class RecipeGenerationError extends Error {}

/** The site owner's shared key (via the serverless proxy) ran out of credits. */
class SharedKeyExhaustedError extends Error {}

/** No serverless backend is reachable at all (e.g. a static host like GitHub Pages). */
class ProxyUnavailableError extends Error {}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("Could not read the photo file."));
    reader.readAsDataURL(file);
  });
}

const VALID_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

function sanitizeRecipe(raw: unknown): Recipe {
  if (typeof raw !== "object" || raw === null) {
    throw new RecipeGenerationError("The model returned an unexpected response.");
  }
  const data = raw as Record<string, unknown>;

  const title = typeof data.title === "string" && data.title.trim() ? data.title.trim() : "Untitled dish";

  const ingredients = Array.isArray(data.ingredients)
    ? data.ingredients
        .map((entry) => {
          if (typeof entry === "string") return { name: entry, quantity: "" };
          if (entry && typeof entry === "object") {
            const e = entry as Record<string, unknown>;
            return {
              name: typeof e.name === "string" ? e.name : "",
              quantity: typeof e.quantity === "string" ? e.quantity : "",
            };
          }
          return { name: "", quantity: "" };
        })
        .filter((ingredient) => ingredient.name.trim().length > 0)
    : [];

  const steps = Array.isArray(data.steps)
    ? data.steps.filter((step): step is string => typeof step === "string" && step.trim().length > 0)
    : [];

  const servings = typeof data.servings === "number" && data.servings > 0 ? Math.round(data.servings) : 4;

  const difficulty: Difficulty = VALID_DIFFICULTIES.includes(data.difficulty as Difficulty)
    ? (data.difficulty as Difficulty)
    : "medium";

  if (ingredients.length === 0 || steps.length === 0) {
    throw new RecipeGenerationError("The model couldn't identify a full recipe from that photo.");
  }

  return { title, ingredients, steps, servings, difficulty };
}

/**
 * Tries the site's shared serverless proxy first (api/generate-recipe),
 * which holds the owner's API key server-side. Only exists on hosts that
 * run serverless functions (e.g. Vercel) — on a static host like GitHub
 * Pages this 404s immediately and we fall back to a visitor-supplied key.
 */
async function generateViaSharedProxy(base64Data: string, mediaType: string): Promise<Recipe> {
  let response: Response;
  try {
    response = await fetch(SHARED_PROXY_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ imageBase64: base64Data, mediaType }),
    });
  } catch {
    throw new ProxyUnavailableError("Shared AI service isn't reachable.");
  }

  if (response.status === 404 || response.status === 405) {
    throw new ProxyUnavailableError("No shared AI service is configured here.");
  }

  let payload: { recipe?: unknown; error?: string; message?: string };
  try {
    payload = await response.json();
  } catch {
    throw new ProxyUnavailableError("Shared AI service returned an unexpected response.");
  }

  if (!response.ok) {
    if (payload.error === "credits_exhausted") {
      throw new SharedKeyExhaustedError(payload.message ?? "The shared AI credits have run out.");
    }
    throw new ProxyUnavailableError(payload.message ?? "The shared AI service hit an error.");
  }

  return sanitizeRecipe(payload.recipe);
}

async function generateViaDirectFetch(base64Data: string, mediaType: string, apiKey: string): Promise<Recipe> {
  if (!apiKey.trim()) {
    throw new RecipeGenerationError("Add your Anthropic API key in Settings first.");
  }

  let response: Response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey.trim(),
        "anthropic-version": ANTHROPIC_VERSION,
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: base64Data },
              },
              {
                type: "text",
                text: "This is a photo of a dish (could be homemade, a restaurant plate, or a social media screenshot). Identify the dish and propose a home-cookable recipe for it, then save it with the save_recipe tool.",
              },
            ],
          },
        ],
        tools: [
          {
            name: "save_recipe",
            description: "Save a structured recipe derived from the photo.",
            input_schema: {
              type: "object",
              properties: {
                title: { type: "string", description: "A short, appetizing title for the dish." },
                servings: { type: "number", description: "How many servings this recipe makes." },
                difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                ingredients: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      quantity: { type: "string" },
                    },
                    required: ["name", "quantity"],
                  },
                },
                steps: {
                  type: "array",
                  items: { type: "string" },
                  description: "Numbered cooking steps, one instruction per entry.",
                },
              },
              required: ["title", "servings", "difficulty", "ingredients", "steps"],
            },
          },
        ],
        tool_choice: { type: "tool", name: "save_recipe" },
      }),
    });
  } catch {
    throw new RecipeGenerationError("Couldn't reach the AI service. Check your connection and try again.");
  }

  if (!response.ok) {
    let message = `The AI service returned an error (${response.status}).`;
    try {
      const errorBody = await response.json();
      if (errorBody?.error?.message) message = errorBody.error.message;
    } catch {
      // ignore parse failure, use default message
    }
    if (response.status === 401) message = "That API key was rejected. Double-check it in Settings.";
    throw new RecipeGenerationError(message);
  }

  const payload = await response.json();
  const toolUse = (payload.content as Array<Record<string, unknown>> | undefined)?.find(
    (block) => block.type === "tool_use" && block.name === "save_recipe"
  );

  if (!toolUse) {
    throw new RecipeGenerationError("The model didn't return a structured recipe. Try again.");
  }

  return sanitizeRecipe(toolUse.input);
}

interface GenerateOptions {
  /** Called once if the shared/owner key turns out to be exhausted, so the UI can remember this and prompt for a personal key from then on. */
  onSharedKeyExhausted?: () => void;
}

/**
 * Sends a food photo to a vision-capable Claude model and asks for a
 * structured recipe back. Tries the site's shared serverless proxy first
 * (no visitor key needed) and falls back to a visitor-supplied API key —
 * calling Anthropic directly from the browser — if the shared proxy is
 * unavailable (e.g. a static host) or its credits have run out.
 */
export async function generateRecipeFromPhoto(
  imageFile: File,
  apiKey: string,
  options: GenerateOptions = {}
): Promise<Recipe> {
  const base64Data = await fileToBase64(imageFile);
  const mediaType = imageFile.type || "image/jpeg";

  try {
    return await generateViaSharedProxy(base64Data, mediaType);
  } catch (error) {
    if (error instanceof SharedKeyExhaustedError) {
      options.onSharedKeyExhausted?.();
      if (!apiKey.trim()) {
        throw new RecipeGenerationError(
          "This site's shared AI credits have run out. Add your own Anthropic API key in Settings to keep generating recipes."
        );
      }
    } else if (!(error instanceof ProxyUnavailableError) && !apiKey.trim()) {
      const message = error instanceof Error ? error.message : "The shared AI service hit a snag.";
      throw new RecipeGenerationError(`${message} Add your own Anthropic API key in Settings to continue.`);
    }
    // ProxyUnavailableError (no backend here, e.g. GitHub Pages) falls
    // through silently to the existing bring-your-own-key flow.
  }

  return generateViaDirectFetch(base64Data, mediaType, apiKey);
}
