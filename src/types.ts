export type Difficulty = "easy" | "medium" | "hard";

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  servings: number;
  difficulty: Difficulty;
}

export interface Cookmark extends Recipe {
  id: string;
  photo: string;
  costPerServing: number;
  createdAt: number;
  isPlaceholderPhoto?: boolean;
}

export interface ExampleDish {
  id: string;
  label: string;
  photo: string;
  recipe: Recipe;
}

export type ProcessingState =
  | { status: "idle" }
  | { status: "loading"; photo: string }
  | { status: "success"; photo: string; recipe: Recipe }
  | { status: "error"; photo: string; message: string };
