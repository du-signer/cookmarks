import { priceForIngredient } from "../data/groceryPrices";
import type { Ingredient } from "../types";

export interface CostLineItem {
  name: string;
  price: number;
}

export interface CostBreakdown {
  items: CostLineItem[];
  total: number;
  servings: number;
  perServing: number;
}

export function computeCostBreakdown(ingredients: Ingredient[], servings: number): CostBreakdown {
  const items = ingredients.map((ingredient) => ({
    name: ingredient.name,
    price: priceForIngredient(ingredient.name),
  }));
  const total = Math.round(items.reduce((sum, item) => sum + item.price, 0) * 100) / 100;
  const safeServings = servings > 0 ? servings : 1;
  const perServing = Math.round((total / safeServings) * 100) / 100;
  return { items, total, servings: safeServings, perServing };
}

export function computeCostPerServing(ingredients: Ingredient[], servings: number): number {
  return computeCostBreakdown(ingredients, servings).perServing;
}

export function formatCost(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
