import { normalizeForMatch } from "../data/groceryPrices";
import type { Cookmark, Ingredient } from "../types";

export interface MatchResult {
  cookmark: Cookmark;
  missing: Ingredient[];
  ready: boolean;
}

/**
 * Groups of ingredients that are common substitutes for each other, even
 * though they don't share a spelling. Each entry is normalized once at
 * module load so lookups downstream are plain string comparisons.
 */
const SYNONYM_GROUPS: string[][] = [
  ["cilantro", "coriander", "coriander leaf"],
  ["scallion", "green onion", "spring onion"],
  ["garbanzo bean", "chickpea"],
  ["arugula", "rocket"],
  ["shrimp", "prawn"],
  ["eggplant", "aubergine"],
  ["zucchini", "courgette"],
  ["capsicum", "bell pepper", "sweet pepper"],
  ["confectioners sugar", "confectioner sugar", "powdered sugar", "icing sugar"],
  ["all purpose flour", "plain flour"],
  ["heavy cream", "heavy whipping cream", "double cream", "whipping cream"],
  ["baking soda", "bicarbonate of soda", "bicarb"],
  ["soy sauce", "tamari", "shoyu"],
  ["cornstarch", "corn flour", "cornflour"],
  ["chili powder", "chilli powder"],
  ["yogurt", "yoghurt", "curd"],
  ["ketchup", "tomato sauce", "catsup"],
  ["buttermilk", "sour milk"],
  ["hot sauce", "chili sauce", "chilli sauce"],
  ["vegetable oil", "canola oil", "cooking oil"],
].map((group) => group.map((phrase) => normalizeForMatch(phrase)));

const SYNONYM_GROUP_BY_PHRASE = new Map<string, number>();
SYNONYM_GROUPS.forEach((group, index) => {
  group.forEach((phrase) => SYNONYM_GROUP_BY_PHRASE.set(phrase, index));
});

function shareSynonymGroup(a: string, b: string): boolean {
  const groupA = SYNONYM_GROUP_BY_PHRASE.get(a);
  if (groupA == null) return false;
  return SYNONYM_GROUP_BY_PHRASE.get(b) === groupA;
}

/**
 * Words too generic to count as "sharing an ingredient" on their own (a
 * fridge item of just "sauce" shouldn't match every recipe that needs a
 * sauce). Real descriptor words like "fresh"/"chopped" are already stripped
 * by normalizeForMatch before this ever runs.
 */
const GENERIC_TOKENS = new Set([
  "hot",
  "cold",
  "warm",
  "cool",
  "sweet",
  "sauce",
  "powder",
  "oil",
  "juice",
  "leaf",
  "leaves",
  "seed",
  "seeds",
  "root",
  "paste",
  "extra",
  "sugar",
  "flour",
  "milk",
  "cream",
]);

function sharesMeaningfulToken(a: string, b: string): boolean {
  const tokensA = new Set(a.split(" ").filter((token) => token.length >= 3 && !GENERIC_TOKENS.has(token)));
  if (tokensA.size === 0) return false;
  const tokensB = b.split(" ").filter((token) => token.length >= 3 && !GENERIC_TOKENS.has(token));
  return tokensB.some((token) => tokensA.has(token));
}

function levenshteinDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const distances = Array.from({ length: rows }, (_, i) => [i, ...new Array(cols - 1).fill(0)]);
  for (let col = 1; col < cols; col += 1) distances[0][col] = col;

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      if (a[row - 1] === b[col - 1]) {
        distances[row][col] = distances[row - 1][col - 1];
      } else {
        distances[row][col] =
          1 + Math.min(distances[row - 1][col], distances[row][col - 1], distances[row - 1][col - 1]);
      }
    }
  }
  return distances[rows - 1][cols - 1];
}

/**
 * Catches near-identical spelling (ASR mistranscriptions, typos, regional
 * spelling like "yoghurt" vs "yogurt") without a hardcoded synonym entry.
 * Restricted to single words of reasonable length so short, unrelated words
 * ("ham"/"jam") don't accidentally match.
 */
function isCloseSpelling(a: string, b: string): boolean {
  if (a.includes(" ") || b.includes(" ")) return false;
  if (a.length < 4 || b.length < 4) return false;
  const longer = Math.max(a.length, b.length);
  const threshold = longer <= 6 ? 1 : 2;
  return levenshteinDistance(a, b) <= threshold;
}

function isSubstituteMatch(ingredientName: string, fridgeItem: string): boolean {
  if (ingredientName === fridgeItem) return true;
  if (fridgeItem.includes(ingredientName) || ingredientName.includes(fridgeItem)) return true;
  if (shareSynonymGroup(ingredientName, fridgeItem)) return true;
  if (sharesMeaningfulToken(ingredientName, fridgeItem)) return true;
  if (isCloseSpelling(ingredientName, fridgeItem)) return true;
  return false;
}

function isInFridge(ingredientName: string, normalizedFridge: string[]): boolean {
  const normalized = normalizeForMatch(ingredientName);
  if (!normalized) return true;
  return normalizedFridge.some((fridgeItem) => fridgeItem && isSubstituteMatch(normalized, fridgeItem));
}

export function matchCookmarksToFridge(cookmarks: Cookmark[], fridgeItems: string[]): MatchResult[] {
  const normalizedFridge = fridgeItems.map(normalizeForMatch).filter(Boolean);

  return cookmarks.map((cookmark) => {
    const missing = cookmark.ingredients.filter(
      (ingredient) => !isInFridge(ingredient.name, normalizedFridge)
    );
    return { cookmark, missing, ready: missing.length === 0 };
  });
}
