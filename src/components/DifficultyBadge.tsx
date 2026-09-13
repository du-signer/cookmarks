import type { Difficulty } from "../types";

const STYLES: Record<Difficulty, string> = {
  easy: "bg-sage-soft text-[#4d5c3f]",
  medium: "bg-yellow-soft text-[#6b5423]",
  hard: "bg-coral-soft text-[#7a4130]",
};

const LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[difficulty]}`}>
      {LABELS[difficulty]}
    </span>
  );
}
