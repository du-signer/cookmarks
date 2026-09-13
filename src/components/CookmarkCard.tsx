import { Link } from "react-router-dom";
import type { Cookmark } from "../types";
import { DifficultyBadge } from "./DifficultyBadge";
import { formatCost } from "../lib/cost";

export function CookmarkCard({ cookmark }: { cookmark: Cookmark }) {
  return (
    <Link
      to={`/cookmarks/${cookmark.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-soft transition active:scale-[0.98]"
    >
      <div className="aspect-square w-full overflow-hidden bg-paper-dim">
        <img
          src={cookmark.photo}
          alt={cookmark.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="font-serif text-base leading-snug text-ink line-clamp-2">{cookmark.title}</h3>
        <div className="mt-auto flex flex-col items-start gap-1.5 pt-1">
          <DifficultyBadge difficulty={cookmark.difficulty} />
          <span className="text-sm text-muted">{formatCost(cookmark.costPerServing)}/serving</span>
        </div>
      </div>
    </Link>
  );
}
