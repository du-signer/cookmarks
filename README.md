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

## AI setup

**On Vercel (production):** the app calls a serverless proxy at
`api/generate-recipe.js`, which holds the site owner's Anthropic key
server-side as the `ANTHROPIC_API_KEY` environment variable — visitors get
real recipe generation with no key of their own. Set it in the Vercel
dashboard (Project → Settings → Environment Variables), never by committing
it to the repo or pasting it anywhere client-side. If that shared key runs
out of credits, the app detects Anthropic's "credit balance is too low"
error and automatically prompts each visitor to add their own key instead
(Settings → paste a personal `sk-ant-…` key, stored only in their browser's
`localStorage`).

**Locally (`npm run dev`) and on static hosts (e.g. GitHub Pages):** there's
no serverless function to call — `vite dev` doesn't run `api/`, and GitHub
Pages can't run server code at all. Both fall back straight to the
bring-your-own-key flow: tap the gear icon, paste a personal Anthropic key.

Without any key at all, the 4 example dishes on the Upload screen still work
end-to-end everywhere (pre-baked recipe data, no API call), so the demo
always has content.

**Security note:** never ship a real API key inside client-side code (env
vars prefixed for Vite, hardcoded strings, etc.) — anyone can read it via
devtools. The serverless function is the only safe place for it, since that
code runs on Vercel's servers and its environment variables are never sent
to the browser.

## How it's put together

- `api/generate-recipe.js` — Vercel serverless function; proxies the vision
  call to Anthropic using the shared `ANTHROPIC_API_KEY` env var so it never
  reaches the browser. Returns a `credits_exhausted` flag the client can key
  off of when the owner's balance runs low.
- `src/lib/llm.ts` — `generateRecipeFromPhoto(file, apiKey, options)`, an
  isolated function that tries the shared serverless proxy first, then falls
  back to calling the Anthropic Messages API directly from the browser with
  a visitor-supplied key (tool-use, so the response comes back as structured
  JSON) and parses/sanitizes the result into a `Recipe`.
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
