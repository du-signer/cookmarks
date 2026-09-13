import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCookmarksStore } from "../state/store";
import { CookmarkCard } from "../components/CookmarkCard";

export function CookmarksListScreen() {
  const { cookmarks } = useCookmarksStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cookmarks;
    return cookmarks.filter(
      (c) => c.title.toLowerCase().includes(q) || c.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );
  }, [cookmarks, query]);

  return (
    <div className="mx-auto max-w-4xl px-5 pb-28 pt-8 sm:pb-14">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-sage">Your collection</p>
        <h1 className="mt-2 font-serif text-3xl text-ink">Cookmarks</h1>
      </div>

      {cookmarks.length > 0 && (
        <div className="relative mb-6">
          <SearchIcon />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by dish or ingredient…"
            className="w-full rounded-full border border-line bg-paper py-3 pl-10 pr-4 text-sm outline-none focus:border-sage"
          />
        </div>
      )}

      {cookmarks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-16 text-center">
          <p className="font-serif text-xl text-ink">No Cookmarks yet</p>
          <p className="max-w-xs text-sm text-ink-soft">
            Save your first dish to start building your collection.
          </p>
          <Link
            to="/"
            className="mt-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition active:scale-95"
          >
            Add a photo
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">No Cookmarks match “{query}”.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((cookmark) => (
            <CookmarkCard key={cookmark.id} cookmark={cookmark} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
