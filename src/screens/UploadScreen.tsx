import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PhotoInput } from "../components/PhotoInput";
import { PhotoFrame } from "../components/PhotoFrame";
import { RecipeView } from "../components/RecipeView";
import { ApiKeySettings } from "../components/ApiKeySettings";
import { EXAMPLE_DISHES } from "../data/exampleDishes";
import { generateRecipeFromPhoto, RecipeGenerationError } from "../lib/llm";
import { resizeImageToDataUrl } from "../lib/image";
import { useCookmarksStore } from "../state/store";
import type { ExampleDish, ProcessingState, Recipe } from "../types";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const LOADING_MESSAGES = [
  "Taking a closer look…",
  "Working out the ingredients…",
  "Sketching out the steps…",
];

export function UploadScreen() {
  const navigate = useNavigate();
  const { cookmarks, addCookmark, apiKey, sharedKeyExhausted, setSharedKeyExhausted } = useCookmarksStore();
  const recentCookmarks = cookmarks.slice(0, 6);
  const hasCookmarks = recentCookmarks.length > 0;
  const [state, setState] = useState<ProcessingState>({ status: "idle" });
  const [recipeDraft, setRecipeDraft] = useState<Recipe | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const retryRef = useRef<() => void>(() => {});

  async function handleRealPhoto(file: File) {
    const photo = await resizeImageToDataUrl(file);
    setState({ status: "loading", photo });
    retryRef.current = () => handleRealPhoto(file);
    try {
      const recipe = await generateRecipeFromPhoto(file, apiKey, {
        onSharedKeyExhausted: () => setSharedKeyExhausted(true),
      });
      setState({ status: "success", photo, recipe });
      setRecipeDraft(recipe);
    } catch (error) {
      const message =
        error instanceof RecipeGenerationError || error instanceof Error
          ? error.message
          : "Something went wrong while reading that photo.";
      setState({ status: "error", photo, message });
    }
  }

  async function handleExample(example: ExampleDish) {
    setState({ status: "loading", photo: example.photo });
    retryRef.current = () => handleExample(example);
    await wait(850);
    setState({ status: "success", photo: example.photo, recipe: example.recipe });
    setRecipeDraft(example.recipe);
  }

  function reset() {
    setState({ status: "idle" });
    setRecipeDraft(null);
  }

  function handleSave() {
    if (state.status !== "success" || !recipeDraft) return;
    const cookmark = addCookmark(recipeDraft, state.photo);
    reset();
    navigate(`/cookmarks/${cookmark.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-8 sm:pb-14">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="eyebrow text-sm font-medium uppercase tracking-wide text-sage">Cookmarks</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            What are you craving to remember?
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Snap a plate — yours, a restaurant's, or a screenshot you saved — and we'll turn it into a
            recipe you can actually cook.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          aria-label="Settings"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition active:scale-90"
        >
          <GearIcon />
        </button>
      </div>

      {state.status === "idle" && (
        <div className="flex flex-col gap-8">
          <PhotoInput onSelect={handleRealPhoto} />

          <div>
            <p className="mb-3 text-sm font-medium text-muted">
              {hasCookmarks ? "Or revisit one of your Cookmarks" : "Or try one of these"}
            </p>
            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
              {hasCookmarks
                ? recentCookmarks.map((cookmark) => (
                    <Link
                      key={cookmark.id}
                      to={`/cookmarks/${cookmark.id}`}
                      className="flex w-28 shrink-0 flex-col items-center gap-2 text-center"
                    >
                      <span className="block h-24 w-24 overflow-hidden rounded-2xl border border-line bg-paper-dim shadow-soft transition active:scale-95">
                        <img src={cookmark.photo} alt={cookmark.title} className="h-full w-full object-cover" />
                      </span>
                      <span className="line-clamp-2 text-xs leading-snug text-ink-soft">{cookmark.title}</span>
                    </Link>
                  ))
                : EXAMPLE_DISHES.map((example) => (
                    <button
                      key={example.id}
                      type="button"
                      onClick={() => handleExample(example)}
                      className="flex w-28 shrink-0 flex-col items-center gap-2 text-center"
                    >
                      <span className="block h-24 w-24 overflow-hidden rounded-2xl border border-line bg-paper-dim shadow-soft transition active:scale-95">
                        <img src={example.photo} alt={example.label} className="h-full w-full object-cover" />
                      </span>
                      <span className="text-xs leading-snug text-ink-soft">{example.label}</span>
                    </button>
                  ))}
            </div>
          </div>

          {!apiKey && (
            <p className="rounded-xl bg-lavender-soft px-4 py-3 text-sm text-[#4a3f63]">
              {sharedKeyExhausted ? (
                <>
                  This site's shared AI credits have run out. Add your own Anthropic API key in{" "}
                  <button onClick={() => setShowSettings(true)} className="underline underline-offset-2">
                    Settings
                  </button>{" "}
                  to keep generating recipes from your own photos.
                </>
              ) : (
                <>
                  Recipes from your own photos use this site's shared AI key automatically — no setup
                  needed. If that's ever unavailable, add your own key in{" "}
                  <button onClick={() => setShowSettings(true)} className="underline underline-offset-2">
                    Settings
                  </button>{" "}
                  as a backup.
                </>
              )}
              {hasCookmarks ? "" : " The example dishes above always work without one."}
            </p>
          )}
        </div>
      )}

      {state.status === "loading" && (
        <div className="flex flex-col items-center gap-6 py-10 text-center">
          <div className="relative h-40 w-40 overflow-hidden rounded-3xl bg-paper-dim shadow-soft">
            <img src={state.photo} alt="Processing" className="h-full w-full animate-pulse-soft object-cover" />
          </div>
          <div className="animate-float-slow">
            <p className="font-serif text-xl text-ink">{LOADING_MESSAGES[0]}</p>
            <p className="mt-1 text-sm text-muted">This usually takes a few seconds.</p>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-line bg-paper-dim px-6 py-10 text-center">
          <div className="h-16 w-16 overflow-hidden rounded-2xl opacity-60">
            <img src={state.photo} alt="" className="h-full w-full object-cover grayscale" />
          </div>
          <div>
            <p className="font-serif text-xl text-ink">Couldn't read that one</p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-ink-soft">{state.message}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => retryRef.current()}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition active:scale-95"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-soft transition active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {state.status === "success" && recipeDraft && (
        <div className="flex flex-col gap-6">
          <PhotoFrame
            src={state.photo}
            alt={recipeDraft.title}
            onReplace={handleRealPhoto}
            onDelete={reset}
            deleteLabel="Discard photo"
          />
          <RecipeView recipe={recipeDraft} onChange={setRecipeDraft} />
          <div className="sticky bottom-20 flex gap-2 sm:static">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-2xl bg-ink px-5 py-3.5 text-sm font-medium text-paper shadow-soft transition active:scale-[0.98]"
            >
              Save to Cookmarks
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-2xl border border-line bg-paper px-5 py-3.5 text-sm font-medium text-ink-soft shadow-soft transition active:scale-[0.98]"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {showSettings && <ApiKeySettings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="3.2" />
      <path
        d="M12 4.5v1.6M12 17.9v1.6M19.5 12h-1.6M6.1 12H4.5M17.3 6.7l-1.1 1.1M7.8 16.2l-1.1 1.1M17.3 17.3l-1.1-1.1M7.8 7.8 6.7 6.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
