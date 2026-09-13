/**
 * Mock grocery price dataset. Prices are rough US averages for a typical
 * purchase unit (not per-recipe-quantity) — cost.ts uses these as a flat
 * per-ingredient-use estimate rather than doing real unit conversion.
 */
export const GROCERY_PRICES: Record<string, number> = {
  // proteins
  "chicken breast": 3.5,
  "chicken thigh": 2.75,
  "ground beef": 4.25,
  "ground turkey": 3.8,
  steak: 8.5,
  bacon: 3.2,
  sausage: 3.5,
  salmon: 7.5,
  shrimp: 6.5,
  tofu: 2.25,
  eggs: 0.35,
  egg: 0.35,

  // dairy
  milk: 0.6,
  butter: 0.5,
  "cream cheese": 1.5,
  cheese: 1.25,
  "cheddar cheese": 1.5,
  "parmesan cheese": 1.75,
  mozzarella: 1.6,
  "sour cream": 0.9,
  yogurt: 0.75,
  cream: 1.2,

  // pantry / grains
  rice: 0.3,
  pasta: 0.6,
  spaghetti: 0.6,
  flour: 0.2,
  sugar: 0.2,
  "brown sugar": 0.25,
  "olive oil": 0.4,
  "vegetable oil": 0.25,
  "soy sauce": 0.3,
  vinegar: 0.25,
  honey: 0.5,
  "bread crumbs": 0.4,
  bread: 1.25,
  tortilla: 0.35,
  "peanut butter": 0.6,
  broth: 0.9,
  stock: 0.9,

  // produce
  onion: 0.6,
  garlic: 0.2,
  tomato: 0.7,
  potato: 0.5,
  carrot: 0.35,
  celery: 0.5,
  "bell pepper": 0.9,
  lettuce: 1.5,
  spinach: 1.75,
  broccoli: 1.6,
  mushroom: 1.5,
  avocado: 1.25,
  lemon: 0.5,
  lime: 0.4,
  cilantro: 0.6,
  basil: 1.0,
  parsley: 0.6,
  ginger: 0.3,
  scallion: 0.4,
  "green onion": 0.4,
  cucumber: 0.7,
  corn: 0.6,
  zucchini: 0.8,

  // spices / seasoning (cheap, small per-use cost)
  salt: 0.05,
  pepper: 0.05,
  "black pepper": 0.05,
  cumin: 0.1,
  paprika: 0.1,
  "chili powder": 0.1,
  oregano: 0.1,
  "red pepper flakes": 0.1,
  cinnamon: 0.1,
  turmeric: 0.1,
  "garlic powder": 0.1,
  "onion powder": 0.1,
  "bay leaf": 0.05,

  // canned / packaged
  "black beans": 1.0,
  "chickpeas": 1.0,
  "diced tomatoes": 1.1,
  "tomato paste": 0.6,
  "coconut milk": 1.4,
  salsa: 1.5,
};

export const DEFAULT_INGREDIENT_PRICE = 0.85;

function normalizeIngredientName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(
      /\b(fresh|chopped|diced|minced|sliced|shredded|grated|crushed|ground|large|small|medium|ripe|boneless|skinless|cooked|raw|to taste|optional)\b/g,
      " "
    )
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function singularize(word: string): string {
  if (word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.endsWith("oes")) return word.slice(0, -2);
  if (word.endsWith("es") && !word.endsWith("ses")) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

export function normalizeForMatch(raw: string): string {
  const cleaned = normalizeIngredientName(raw);
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map(singularize)
    .join(" ");
}

export function priceForIngredient(name: string): number {
  const normalized = normalizeForMatch(name);
  if (GROCERY_PRICES[normalized] != null) return GROCERY_PRICES[normalized];

  const tokens = normalized.split(" ").filter(Boolean);
  for (const key of Object.keys(GROCERY_PRICES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return GROCERY_PRICES[key];
    }
  }
  for (const token of tokens) {
    if (GROCERY_PRICES[token] != null) return GROCERY_PRICES[token];
  }
  return DEFAULT_INGREDIENT_PRICE;
}
