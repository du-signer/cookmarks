import type { Cookmark } from "../types";

/**
 * Real Cookmarks generated during development, baked in as default
 * content so the app has substance for every first-time visitor. Once a
 * visitor edits, deletes, or adds a Cookmark, their own localStorage
 * takes over and these are no longer re-seeded on reload.
 */
export const SEED_COOKMARKS: Cookmark[] = [
  {
    "id": "73252330-4e95-48f6-9478-3dba98b87308",
    "title": "Pesto Gnocchi",
    "servings": 2,
    "difficulty": "medium",
    "ingredients": [
      {
        "name": "Gnocchi",
        "quantity": "1 lb"
      },
      {
        "name": "Fresh basil",
        "quantity": "2 cups"
      },
      {
        "name": "Pine nuts",
        "quantity": "1/4 cup"
      },
      {
        "name": "Garlic cloves",
        "quantity": "3"
      },
      {
        "name": "Parmesan cheese",
        "quantity": "1/2 cup grated"
      },
      {
        "name": "Extra virgin olive oil",
        "quantity": "1/2 cup"
      },
      {
        "name": "Fresh ricotta cheese",
        "quantity": "1/2 cup"
      },
      {
        "name": "Lemon juice",
        "quantity": "1 tablespoon"
      },
      {
        "name": "Salt",
        "quantity": "to taste"
      },
      {
        "name": "Black pepper",
        "quantity": "to taste"
      }
    ],
    "steps": [
      "Toast pine nuts in a dry pan over medium heat for 2-3 minutes until fragrant, then set aside.",
      "In a food processor, combine fresh basil, garlic, and pine nuts, pulse until roughly chopped.",
      "Add grated Parmesan cheese to the processor and pulse to combine.",
      "With the processor running, slowly drizzle in olive oil until you reach a smooth pesto consistency.",
      "Stir in lemon juice, salt, and pepper to taste.",
      "Bring a large pot of salted water to boil.",
      "Add gnocchi to the boiling water and cook until they float to the surface, then cook for an additional 2-3 minutes.",
      "Reserve 1 cup of pasta water, then drain the gnocchi.",
      "In a large bowl, gently toss the warm gnocchi with the pesto sauce, adding pasta water as needed to achieve desired consistency.",
      "Divide gnocchi between serving plates and top each portion with a generous dollop of fresh ricotta cheese.",
      "Garnish with fresh basil leaves and a drizzle of olive oil before serving."
    ],
    "photo": "./seed/pesto-gnocchi.jpg",
    "costPerServing": 3.45,
    "createdAt": 1789263175759
  },
  {
    "id": "328072b2-9136-46f5-99d7-5caa39c3f441",
    "title": "Apricot Cheesecake with Vanilla Cream",
    "servings": 8,
    "difficulty": "hard",
    "ingredients": [
      {
        "name": "Graham cracker crumbs",
        "quantity": "1.5 cups"
      },
      {
        "name": "Butter, melted",
        "quantity": "4 tablespoons"
      },
      {
        "name": "Cream cheese, softened",
        "quantity": "16 oz"
      },
      {
        "name": "Sugar",
        "quantity": "0.75 cup"
      },
      {
        "name": "Eggs",
        "quantity": "2"
      },
      {
        "name": "Vanilla extract",
        "quantity": "1 teaspoon"
      },
      {
        "name": "Sour cream",
        "quantity": "0.5 cup"
      },
      {
        "name": "Fresh apricots",
        "quantity": "4-6"
      },
      {
        "name": "Honey or apricot jam",
        "quantity": "3 tablespoons"
      },
      {
        "name": "Powdered sugar",
        "quantity": "2 tablespoons"
      },
      {
        "name": "Heavy cream",
        "quantity": "0.5 cup"
      }
    ],
    "steps": [
      "Preheat oven to 325\u00b0F. Mix graham cracker crumbs with melted butter and press into the bottom of a 9-inch springform pan.",
      "Beat softened cream cheese and sugar until smooth and creamy.",
      "Add eggs one at a time, beating after each addition. Stir in vanilla extract and sour cream.",
      "Pour cheesecake mixture over crust and bake for 35-40 minutes until center is set.",
      "Cool cheesecake completely, then refrigerate for at least 4 hours or overnight.",
      "Slice apricots in half and arrange on top of the cheesecake slice. Glaze with honey or melted apricot jam.",
      "Whip heavy cream to soft peaks and season with a touch of vanilla and powdered sugar.",
      "Dust the plate with powdered sugar. Place cheesecake slice on plate and top with vanilla cream."
    ],
    "photo": "./seed/apricot-cheesecake-with-vanilla-cream.jpg",
    "costPerServing": 0.99,
    "createdAt": 1789260760857
  },
  {
    "id": "7b379dad-d58b-403e-a0a4-defd75fa13f5",
    "title": "Okonomiyaki - Japanese Savory Pancake",
    "servings": 2,
    "difficulty": "medium",
    "ingredients": [
      {
        "name": "All-purpose flour",
        "quantity": "1 cup"
      },
      {
        "name": "Dashi (Japanese broth) or water",
        "quantity": "3/4 cup"
      },
      {
        "name": "Eggs",
        "quantity": "2 large"
      },
      {
        "name": "Napa cabbage, shredded",
        "quantity": "3 cups"
      },
      {
        "name": "Green onions, chopped",
        "quantity": "1/4 cup"
      },
      {
        "name": "Bonito flakes (katsuobushi)",
        "quantity": "2 tablespoons"
      },
      {
        "name": "Vegetable oil",
        "quantity": "3 tablespoons"
      },
      {
        "name": "Okonomiyaki sauce",
        "quantity": "1/4 cup"
      },
      {
        "name": "Japanese mayo",
        "quantity": "2 tablespoons"
      },
      {
        "name": "Salt and pepper",
        "quantity": "To taste"
      }
    ],
    "steps": [
      "In a large bowl, mix flour, dashi/water, and eggs until you form a smooth batter.",
      "Add shredded cabbage and green onions to the batter and mix gently but thoroughly.",
      "Heat oil in a large skillet or griddle over medium-high heat.",
      "Pour the batter onto the skillet and shape into a round pancake about 1/2 inch thick.",
      "Cook for 4-5 minutes until the bottom is golden brown and crispy.",
      "Carefully flip the pancake and cook the other side for another 4-5 minutes until golden.",
      "Transfer to a serving plate while still hot.",
      "Drizzle okonomiyaki sauce in a crisscross pattern over the top.",
      "Drizzle Japanese mayo in a crisscross pattern on top.",
      "Sprinkle bonito flakes over the finished pancake.",
      "Serve immediately while hot, allowing the heat to make the bonito flakes dance."
    ],
    "photo": "./seed/okonomiyaki-japanese-savory-pancake.jpg",
    "costPerServing": 2.75,
    "createdAt": 1789260566623
  },
  {
    "id": "23bc7117-4b78-4dd4-ac8f-1fbfa384c1ed",
    "title": "Matcha Latte with Mango",
    "servings": 2,
    "difficulty": "easy",
    "ingredients": [
      {
        "name": "Matcha powder",
        "quantity": "2 teaspoons"
      },
      {
        "name": "Hot water",
        "quantity": "1/4 cup"
      },
      {
        "name": "Milk (dairy or non-dairy)",
        "quantity": "1.5 cups"
      },
      {
        "name": "Mango puree",
        "quantity": "2-3 tablespoons"
      },
      {
        "name": "Whipped cream or foam",
        "quantity": "1/4 cup"
      },
      {
        "name": "Matcha powder (for garnish)",
        "quantity": "1/4 teaspoon"
      },
      {
        "name": "Honey",
        "quantity": "2-3 tablespoons"
      }
    ],
    "steps": [
      "Sift 1 teaspoon of matcha powder into a bowl to remove lumps",
      "Pour 1/4 cup of hot water (not boiling, around 170\u00b0F) into the bowl with matcha",
      "Whisk vigorously with a matcha whisk or fork until smooth and frothy",
      "Add mango puree to the base of 2 cups",
      "Add ice to the cups, filling about halfway",
      "Pour the matcha mixture evenly into both glasses",
      "Heat or froth 1.5 cups of milk and mix in honey or sweetener to taste",
      "Pour the milk mixture into each glass, leaving space at the top",
      "Top each drink with whipped cream or milk foam",
      "Dust the top with matcha powder for garnish",
      "Stir well before drinking and enjoy!"
    ],
    "photo": "./seed/matcha-latte-with-mango.jpg",
    "costPerServing": 2.85,
    "createdAt": 1789148474853
  }
];
