import { normalizeForMatch } from "../data/groceryPrices";
import { generateId } from "./id";
import type { MatchResult } from "./matching";
import type { GroceryItem } from "../state/store";

export function buildGroceryList(matches: MatchResult[], selectedIds: string[]): GroceryItem[] {
  const selected = matches.filter((match) => selectedIds.includes(match.cookmark.id));
  const byNormalizedName = new Map<string, { name: string; quantities: string[] }>();

  for (const match of selected) {
    for (const ingredient of match.missing) {
      const key = normalizeForMatch(ingredient.name) || ingredient.name.toLowerCase();
      const existing = byNormalizedName.get(key);
      const quantity = ingredient.quantity.trim();
      if (existing) {
        if (quantity && !existing.quantities.includes(quantity)) existing.quantities.push(quantity);
      } else {
        byNormalizedName.set(key, { name: ingredient.name, quantities: quantity ? [quantity] : [] });
      }
    }
  }

  return Array.from(byNormalizedName.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ name, quantities }) => ({
      id: generateId(),
      name,
      detail: quantities.join(" + "),
      checked: false,
    }));
}
