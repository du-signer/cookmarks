// Vercel serverless function. Holds the site owner's Anthropic API key as an
// environment variable (ANTHROPIC_API_KEY, set in the Vercel dashboard) so
// visitors get real AI recipe generation without needing their own key. The
// key never reaches the browser — only this server process sees it.
//
// Not available on static-only hosts (e.g. GitHub Pages): there, requests to
// this path 404 and the client falls back to asking for a visitor-supplied
// key (see src/lib/llm.ts).

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const ANTHROPIC_VERSION = "2023-06-01";

const RECIPE_TOOL = {
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
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "server_misconfigured", message: "No shared API key is configured." });
    return;
  }

  const { imageBase64, mediaType } = req.body || {};
  if (!imageBase64 || typeof imageBase64 !== "string") {
    res.status(400).json({ error: "bad_request", message: "Missing image data." });
    return;
  }

  let anthropicResponse;
  try {
    anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
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
                source: { type: "base64", media_type: mediaType || "image/jpeg", data: imageBase64 },
              },
              {
                type: "text",
                text: "This is a photo of a dish (could be homemade, a restaurant plate, or a social media screenshot). Identify the dish and propose a home-cookable recipe for it, then save it with the save_recipe tool.",
              },
            ],
          },
        ],
        tools: [RECIPE_TOOL],
        tool_choice: { type: "tool", name: "save_recipe" },
      }),
    });
  } catch {
    res.status(502).json({ error: "upstream_unreachable", message: "Couldn't reach the AI service." });
    return;
  }

  if (!anthropicResponse.ok) {
    let message = `The AI service returned an error (${anthropicResponse.status}).`;
    try {
      const body = await anthropicResponse.json();
      if (body?.error?.message) message = body.error.message;
    } catch {
      // ignore parse failure, use default message
    }
    const isCreditsExhausted = anthropicResponse.status === 400 && /credit balance/i.test(message);
    res.status(anthropicResponse.status).json({
      error: isCreditsExhausted ? "credits_exhausted" : "upstream_error",
      message,
    });
    return;
  }

  const payload = await anthropicResponse.json();
  const toolUse = (payload.content || []).find(
    (block) => block.type === "tool_use" && block.name === "save_recipe"
  );

  if (!toolUse) {
    res.status(502).json({ error: "no_tool_use", message: "The model didn't return a structured recipe." });
    return;
  }

  res.status(200).json({ recipe: toolUse.input });
}
