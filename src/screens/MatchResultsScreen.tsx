import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookmarksStore } from "../state/store";
import { matchCookmarksToFridge } from "../lib/matching";
import { buildGroceryList } from "../lib/grocery";
import { DifficultyBadge } from "../components/DifficultyBadge";
import { formatCost } from "../lib/cost";

export function MatchResultsScreen() {
  const navigate = useNavigate();
  const { cookmarks, fridgeItems, selectedForCooking, setSelectedForCooking, setGroceryList } = useCookmarksStore();

  const matches = useMemo(() => matchCookmarksToFridge(cookmarks, fridgeItems), [cookmarks, fridgeItems]);
  const ready = matches.filter((m) => m.ready);
  const missing = matches.filter((m) => !m.ready).sort((a, b) => a.missing.length - b.missing.length);

  const [selected, setSelected] = useState<string[]>(selectedForCooking);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function selectAll() {
    setSelected(matches.map((m) => m.cookmark.id));
  }

  function selectTopPicks() {
    const topPicks = [...ready, ...missing.filter((m) => m.missing.length <= 2)].slice(0, 4);
    setSelected(topPicks.map((m) => m.cookmark.id));
  }

  function clearSelection() {
    setSelected([]);
  }

  function handleBuildGroceryList() {
    setSelectedForCooking(selected);
    setGroceryList(buildGroceryList(matches, selected));
    navigate("/grocery");
  }

  if (cookmarks.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="font-serif text-xl text-ink">No Cookmarks to check yet.</p>
        <Link to="/" className="mt-3 inline-block text-sm font-medium text-sage underline underline-offset-2">
          Add your first photo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-32 pt-8 sm:pb-14">
      <Link to="/fridge" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-soft">
        <BackIcon /> Edit fridge list
      </Link>
      <p className="text-sm font-medium uppercase tracking-wide text-dusty-blue">Match results</p>
      <h1 className="mt-2 font-serif text-3xl text-ink">What can you make?</h1>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={selectTopPicks}
          className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink-soft transition active:scale-95"
        >
          Top picks
        </button>
        <button
          type="button"
          onClick={selectAll}
          className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink-soft transition active:scale-95"
        >
          Select all
        </button>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={clearSelection}
            className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink-soft transition active:scale-95"
          >
            Clear
          </button>
        )}
      </div>

      {ready.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-sage">
            <span className="h-2 w-2 rounded-full bg-sage" /> Ready to make
          </h2>
          <div className="flex flex-col gap-2">
            {ready.map((match) => (
              <MatchRow
                key={match.cookmark.id}
                match={match}
                selected={selected.includes(match.cookmark.id)}
                onToggle={() => toggle(match.cookmark.id)}
              />
            ))}
          </div>
        </section>
      )}

      {missing.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-coral">
            <span className="h-2 w-2 rounded-full bg-coral" /> Missing a few things
          </h2>
          <div className="flex flex-col gap-2">
            {missing.map((match) => (
              <MatchRow
                key={match.cookmark.id}
                match={match}
                selected={selected.includes(match.cookmark.id)}
                onToggle={() => toggle(match.cookmark.id)}
              />
            ))}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        <button
          type="button"
          onClick={handleBuildGroceryList}
          disabled={selected.length === 0}
          className="mx-auto block w-full max-w-2xl rounded-2xl bg-ink px-5 py-3.5 text-sm font-medium text-paper shadow-soft transition active:scale-[0.98] disabled:opacity-40"
        >
          {selected.length === 0
            ? "Select Cookmarks to continue"
            : `Build grocery list (${selected.length} selected)`}
        </button>
      </div>
    </div>
  );
}

function MatchRow({
  match,
  selected,
  onToggle,
}: {
  match: ReturnType<typeof matchCookmarksToFridge>[number];
  selected: boolean;
  onToggle: () => void;
}) {
  const { cookmark, missing, ready } = match;
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition ${
        selected ? "border-sage bg-sage-soft/40" : "border-line bg-paper"
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="h-5 w-5 shrink-0 accent-sage"
      />
      <img src={cookmark.photo} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-base text-ink">{cookmark.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <DifficultyBadge difficulty={cookmark.difficulty} />
          <span className="text-xs text-muted">{formatCost(cookmark.costPerServing)}/serving</span>
          {!ready && (
            <span className="rounded-full bg-coral-soft px-2 py-0.5 text-xs font-medium text-[#7a4130]">
              {missing.length} missing
            </span>
          )}
        </div>
        {!ready && (
          <p className="mt-1 truncate text-xs text-coral">
            Missing: {missing.map((m) => m.name).join(", ")}
          </p>
        )}
      </div>
    </label>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
