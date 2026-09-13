import { useState } from "react";

interface IngredientChipListProps {
  items: string[];
  onChange: (items: string[]) => void;
}

export function IngredientChipList({ items, onChange }: IngredientChipListProps) {
  const [draft, setDraft] = useState("");

  function addFromDraft() {
    const value = draft.trim();
    if (!value) return;
    if (!items.some((item) => item.toLowerCase() === value.toLowerCase())) {
      onChange([...items, value]);
    }
    setDraft("");
  }

  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-1.5 rounded-full bg-sage-soft py-1.5 pl-3 pr-2 text-sm text-[#4d5c3f]"
          >
            {item}
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={`Remove ${item}`}
              className="flex h-4 w-4 items-center justify-center rounded-full text-[#4d5c3f]/70 transition hover:bg-black/5"
            >
              ×
            </button>
          </span>
        ))}
        {items.length === 0 && <p className="text-sm text-muted">No ingredients yet — add some below.</p>}
      </div>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addFromDraft();
            }
          }}
          placeholder="Add an ingredient…"
          className="flex-1 rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-sage"
        />
        <button
          type="button"
          onClick={addFromDraft}
          className="rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-paper transition active:scale-[0.97]"
        >
          Add
        </button>
      </div>
    </div>
  );
}
