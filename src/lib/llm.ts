import type { Difficulty, Recipe } from "../types";

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const ANTHROPIC_VERSION = "2023-06-01";

export class RecipeGenerationError extends Error {}

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
 * Sends a food photo to a vision-capable Claude model and asks for a
 * structured recipe back. Runs directly from the browser (no backend) using
 * a user-supplied API key — fine for a local prototype, not for production,
 * since the key is visible to anyone inspecting network requests.
 */
export async function generateRecipeFromPhoto(imageFile: File, apiKey: string): Promise<Recipe> {
  if (!apiKey.trim()) {
    throw new RecipeGenerationError("Add your Anthropic API key in Settings first.");
  }

  const base64Data = await fileToBase64(imageFile);
  const mediaType = imageFile.type || "image/jpeg";

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
