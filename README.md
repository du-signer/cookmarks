# Cookmarks

A mobile-first prototype: snap a food photo, get an AI-generated recipe, save it
as a "Cookmark," then check your saved dishes against your fridge and get a
consolidated grocery list for what's missing.

**Live:** https://du-signer.github.io/cookmarks/

## Running it

```bash
npm install
npm run dev
```

## AI setup (required for your own photos)

This is a pure client-side prototype — no backend, no database. Recipe
generation calls the Anthropic API **directly from the browser** using an API
key you provide yourself:

1. Open the app, tap the gear icon on the Upload screen.
2. Paste an Anthropic API key (starts with `sk-ant-`).
3. It's saved to `localStorage` only — never sent anywhere but Anthropic's API.

Without a key, the 4 example dishes on the Upload screen still work end-to-end
(they use pre-baked recipe data so the demo has content immediately), but your
own photos will show a soft error asking you to add a key.

**Note:** shipping an API key to the browser is fine for a local demo, not for
a real product — anyone who opens devtools can see it. A production version
would proxy this call through a server.

## How it's put together

- `src/lib/llm.ts` — `generateRecipeFromPhoto(file, apiKey)`, an isolated
  function that sends the photo to a vision-capable Claude model via the
  Messages API (tool-use, so the response comes back as structured JSON) and
  parses/sanitizes the result into a `Recipe`.
- `src/data/groceryPrices.ts` + `src/lib/cost.ts` — a hardcoded mock grocery
  price dataset used to estimate cost-per-serving from the ingredient list,
  rather than trusting the model's pricing.
- `src/lib/matching.ts` — string-matching between a Cookmark's ingredients and
  the fridge list to compute "ready to make" vs. "missing a few things."
- `src/lib/grocery.ts` — consolidates missing ingredients across selected
  Cookmarks into one deduplicated checklist.
- `src/hooks/useSpeechRecognition.ts` — thin wrapper around the Web Speech
  API for the Fridge Check screen's voice input, with a "Type instead"
  fallback always visible alongside it.
- `src/state/store.tsx` — all app state (Cookmarks, fridge list, grocery list,
  API key) lives in React context backed by `localStorage` — no backend.
