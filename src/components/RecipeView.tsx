import { useState } from "react";
import type { Difficulty, Recipe } from "../types";
import { DifficultyBadge } from "./DifficultyBadge";
import { computeCostBreakdown, formatCost } from "../lib/cost";
import { moveItem } from "../lib/array";

interface RecipeViewProps {
  recipe: Recipe;
  onChange: (recipe: Recipe) => void;
}

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export function RecipeView({ recipe, onChange }: RecipeViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const breakdown = computeCostBreakdown(recipe.ingredients, recipe.servings);

  function update<K extends keyof Recipe>(key: K, value: Recipe[K]) {
    onChange({ ...recipe, [key]: value });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        {isEditing ? (
          <input
            value={recipe.title}
            onChange={(event) => update("title", event.target.value)}
            className="w-full rounded-xl border border-line bg-paper px-3 py-2 font-serif text-2xl text-ink outline-none focus:border-sage"
          />
        ) : (
          <h1 className="font-serif text-2xl leading-tight text-ink sm:text-3xl">{recipe.title}</h1>
        )}
        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition active:scale-95"
        >
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isEditing ? (
          <div className="flex gap-1.5">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => update("difficulty", level)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize transition ${
                  recipe.difficulty === level ? "bg-ink text-paper" : "bg-paper-dim text-ink-soft"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        ) : (
          <DifficultyBadge difficulty={recipe.difficulty} />
        )}
        <button
          type="button"
          onClick={() => setShowBreakdown((prev) => !prev)}
          className="text-sm text-muted underline decoration-dotted underline-offset-4"
        >
          {formatCost(breakdown.perServing)} / serving
        </button>
        {isEditing ? (
          <label className="flex items-center gap-1.5 text-sm text-muted">
            Servings
            <input
              type="number"
              min={1}
              value={recipe.servings}
              onChange={(event) => update("servings", Math.max(1, Number(event.target.value) || 1))}
              className="w-14 rounded-lg border border-line bg-paper px-2 py-1 text-sm outline-none focus:border-sage"
            />
          </label>
        ) : (
          <span className="text-sm text-muted">Serves {recipe.servings}</span>
        )}
      </div>

      {showBreakdown && (
        <div className="-mt-2 rounded-2xl border border-line bg-paper-dim px-4 py-3.5 text-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Cost breakdown</p>
          <ul className="flex flex-col gap-1.5">
            {breakdown.items.map((item, index) => (
              <li key={index} className="flex items-center justify-between gap-3 text-ink-soft">
                <span className="truncate">{item.name || "—"}</span>
                <span className="shrink-0 text-muted">{formatCost(item.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2.5 border-t border-line pt-2.5">
            <div className="flex items-center justify-between text-ink-soft">
              <span>Estimated total</span>
              <span>{formatCost(breakdown.total)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between font-medium text-ink">
              <span>÷ {breakdown.servings} servings</span>
              <span>{formatCost(breakdown.perServing)} / serving</span>
            </div>
          </div>
          <p className="mt-2.5 text-xs text-muted">
            Estimated from a mock grocery price list, not real-time prices.
          </p>
        </div>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Ingredients</h2>
        <ul className="flex flex-col gap-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-ink-soft">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
              {isEditing ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    value={ingredient.quantity}
                    onChange={(event) => {
                      const next = [...recipe.ingredients];
                      next[index] = { ...next[index], quantity: event.target.value };
                      update("ingredients", next);
                    }}
                    className="w-24 rounded-lg border border-line bg-paper px-2 py-1 text-sm outline-none focus:border-sage"
                    placeholder="qty"
                  />
                  <input
                    value={ingredient.name}
                    onChange={(event) => {
                      const next = [...recipe.ingredients];
                      next[index] = { ...next[index], name: event.target.value };
                      update("ingredients", next);
                    }}
                    className="flex-1 rounded-lg border border-line bg-paper px-2 py-1 text-sm outline-none focus:border-sage"
                    placeholder="ingredient"
                  />
                  <ReorderButtons
                    onMoveUp={() => update("ingredients", moveItem(recipe.ingredients, index, -1))}
                    onMoveDown={() => update("ingredients", moveItem(recipe.ingredients, index, 1))}
                    disableUp={index === 0}
                    disableDown={index === recipe.ingredients.length - 1}
                  />
                  <button
                    type="button"
                    onClick={() => update("ingredients", recipe.ingredients.filter((_, i) => i !== index))}
                    className="px-1 text-muted"
                    aria-label="Remove ingredient"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span>
                  {ingredient.quantity && <span className="text-muted">{ingredient.quantity} </span>}
                  {ingredient.name}
                </span>
              )}
            </li>
          ))}
        </ul>
        {isEditing && (
          <button
            type="button"
            onClick={() => update("ingredients", [...recipe.ingredients, { name: "", quantity: "" }])}
            className="mt-2 text-sm font-medium text-sage"
          >
            + Add ingredient
          </button>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Steps</h2>
        <ol className="flex flex-col gap-3">
          {recipe.steps.map((step, index) => (
            <li key={index} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-paper-dim text-xs font-semibold text-ink-soft">
                {index + 1}
              </span>
              {isEditing ? (
                <div className="flex flex-1 items-start gap-2">
                  <textarea
                    value={step}
                    onChange={(event) => {
                      const next = [...recipe.steps];
                      next[index] = event.target.value;
                      update("steps", next);
                    }}
                    rows={2}
                    className="flex-1 resize-none rounded-lg border border-line bg-paper px-2 py-1.5 text-sm outline-none focus:border-sage"
                  />
                  <ReorderButtons
                    onMoveUp={() => update("steps", moveItem(recipe.steps, index, -1))}
                    onMoveDown={() => update("steps", moveItem(recipe.steps, index, 1))}
                    disableUp={index === 0}
                    disableDown={index === recipe.steps.length - 1}
                  />
                  <button
                    type="button"
                    onClick={() => update("steps", recipe.steps.filter((_, i) => i !== index))}
                    className="px-1 text-muted"
                    aria-label="Remove step"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <p className="pt-0.5">{step}</p>
              )}
            </li>
          ))}
        </ol>
        {isEditing && (
          <button
            type="button"
            onClick={() => update("steps", [...recipe.steps, ""])}
            className="mt-2 text-sm font-medium text-sage"
          >
            + Add step
          </button>
        )}
      </section>
    </div>
  );
}

function ReorderButtons({
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  disableUp: boolean;
  disableDown: boolean;
}) {
  return (
    <div className="flex shrink-0 flex-col">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={disableUp}
        aria-label="Move up"
        className="flex h-4 w-5 items-center justify-center text-muted transition disabled:opacity-25"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m5 15 7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={disableDown}
        aria-label="Move down"
        className="flex h-4 w-5 items-center justify-center text-muted transition disabled:opacity-25"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m5 9 7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
