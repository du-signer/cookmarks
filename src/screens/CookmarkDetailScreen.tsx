import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCookmarksStore, PLACEHOLDER_PHOTO } from "../state/store";
import { PhotoFrame } from "../components/PhotoFrame";
import { RecipeView } from "../components/RecipeView";
import { generateRecipeFromPhoto, RecipeGenerationError } from "../lib/llm";
import { resizeImageToDataUrl } from "../lib/image";
import type { Recipe } from "../types";

export function CookmarkDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cookmarks, updateCookmarkRecipe, updateCookmarkPhoto, deleteCookmark, apiKey } = useCookmarksStore();
  const cookmark = cookmarks.find((c) => c.id === id);

  const [isReprocessing, setIsReprocessing] = useState(false);
  const [reprocessError, setReprocessError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!cookmark) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="font-serif text-xl text-ink">This Cookmark is gone.</p>
        <Link to="/cookmarks" className="mt-3 inline-block text-sm font-medium text-sage underline underline-offset-2">
          Back to Cookmarks
        </Link>
      </div>
    );
  }

  async function handleReplacePhoto(file: File) {
    setReprocessError(null);
    const photo = await resizeImageToDataUrl(file);
    setIsReprocessing(true);
    try {
      const recipe = await generateRecipeFromPhoto(file, apiKey);
      updateCookmarkPhoto(cookmark!.id, photo, false);
      updateCookmarkRecipe(cookmark!.id, recipe);
    } catch (error) {
      const message =
        error instanceof RecipeGenerationError || error instanceof Error
          ? error.message
          : "Couldn't re-read that photo.";
      setReprocessError(message);
    } finally {
      setIsReprocessing(false);
    }
  }

  function handleDeletePhoto() {
    updateCookmarkPhoto(cookmark!.id, PLACEHOLDER_PHOTO, true);
  }

  function handleRecipeChange(recipe: Recipe) {
    updateCookmarkRecipe(cookmark!.id, recipe);
  }

  function handleDeleteCookmark() {
    deleteCookmark(cookmark!.id);
    navigate("/cookmarks");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-6 sm:pb-14">
      <Link to="/cookmarks" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-soft">
        <BackIcon /> Cookmarks
      </Link>

      <div className="flex flex-col gap-6">
        <div className="relative">
          <PhotoFrame
            src={cookmark.photo}
            alt={cookmark.title}
            onReplace={handleReplacePhoto}
            onDelete={handleDeletePhoto}
            deleteLabel="Remove photo"
          />
          {isReprocessing && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ink/50 text-sm font-medium text-paper backdrop-blur-sm">
              Reading the new photo…
            </div>
          )}
        </div>

        {reprocessError && (
          <p className="rounded-xl bg-coral-soft px-4 py-3 text-sm text-[#7a4130]">{reprocessError}</p>
        )}

        <RecipeView recipe={cookmark} onChange={handleRecipeChange} />

        <div className="border-t border-line pt-5">
          {confirmingDelete ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-ink-soft">Delete this Cookmark for good?</p>
              <button
                type="button"
                onClick={handleDeleteCookmark}
                className="rounded-full bg-coral px-4 py-2 text-sm font-medium text-white transition active:scale-95"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition active:scale-95"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="text-sm font-medium text-coral"
            >
              Delete Cookmark
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
