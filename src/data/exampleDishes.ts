import type { ExampleDish } from "../types";

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const pastaSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#F2EDE3"/>
  <circle cx="100" cy="100" r="72" fill="#FAF7F1" stroke="#E6DDCF" stroke-width="2"/>
  <g stroke="#D1A94A" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.85">
    <path d="M55 95c10-18 30-18 40 0s30 18 40 0"/>
    <path d="M50 112c10-18 30-18 40 0s30 18 40 0"/>
    <path d="M58 78c10-18 30-18 40 0s30 18 40 0"/>
  </g>
  <circle cx="78" cy="100" r="5" fill="#D98F77"/>
  <circle cx="118" cy="88" r="4.5" fill="#93A97E"/>
  <circle cx="132" cy="112" r="5" fill="#D98F77"/>
  <circle cx="95" cy="122" r="4" fill="#93A97E"/>
</svg>`;

const tacoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#F2EDE3"/>
  <circle cx="100" cy="100" r="72" fill="#FAF7F1" stroke="#E6DDCF" stroke-width="2"/>
  <path d="M45 100a55 34 0 0 1 110 0Z" fill="#D1A94A" opacity="0.9"/>
  <path d="M55 96c8-4 14 3 22 0s14-6 22 0 14 3 22 0 12-4 18 1" stroke="#93A97E" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M58 106c8 5 14-2 22 1s14 5 22 1 14-4 22 1" stroke="#D98F77" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="70" cy="88" r="3.5" fill="#7F9AB3"/>
  <circle cx="128" cy="88" r="3.5" fill="#7F9AB3"/>
</svg>`;

const soupSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#F2EDE3"/>
  <circle cx="100" cy="108" r="66" fill="#FAF7F1" stroke="#E6DDCF" stroke-width="2"/>
  <path d="M48 100a52 40 0 0 0 104 0Z" fill="#7F9AB3" opacity="0.85"/>
  <circle cx="85" cy="98" r="4" fill="#93A97E"/>
  <circle cx="112" cy="104" r="5" fill="#D98F77"/>
  <circle cx="98" cy="112" r="3.5" fill="#F1E6CC"/>
  <g stroke="#A396BB" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7">
    <path d="M82 55c-6-8 6-12 0-20"/>
    <path d="M100 50c-6-8 6-12 0-20"/>
    <path d="M118 55c-6-8 6-12 0-20"/>
  </g>
</svg>`;

const saladSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#F2EDE3"/>
  <circle cx="100" cy="100" r="72" fill="#FAF7F1" stroke="#E6DDCF" stroke-width="2"/>
  <ellipse cx="100" cy="112" rx="56" ry="30" fill="#93A97E" opacity="0.35"/>
  <circle cx="76" cy="100" r="8" fill="#93A97E"/>
  <circle cx="100" cy="92" r="7" fill="#D98F77"/>
  <circle cx="124" cy="102" r="8" fill="#93A97E"/>
  <circle cx="112" cy="116" r="6" fill="#F1E6CC"/>
  <circle cx="88" cy="118" r="6" fill="#D98F77"/>
  <circle cx="140" cy="118" r="5" fill="#A396BB"/>
</svg>`;

export const EXAMPLE_DISHES: ExampleDish[] = [
  {
    id: "example-pasta",
    label: "Restaurant pasta",
    photo: svgToDataUri(pastaSvg),
    recipe: {
      title: "Garlic Butter Shrimp Pasta",
      servings: 4,
      difficulty: "medium",
      ingredients: [
        { name: "spaghetti", quantity: "12 oz" },
        { name: "shrimp", quantity: "1 lb" },
        { name: "butter", quantity: "3 tbsp" },
        { name: "garlic", quantity: "4 cloves" },
        { name: "olive oil", quantity: "2 tbsp" },
        { name: "parmesan cheese", quantity: "1/2 cup" },
        { name: "parsley", quantity: "2 tbsp" },
        { name: "red pepper flakes", quantity: "1/2 tsp" },
        { name: "lemon", quantity: "1" },
      ],
      steps: [
        "Cook spaghetti in salted boiling water until al dente; reserve 1 cup pasta water and drain.",
        "Pat shrimp dry and season with salt and pepper.",
        "Heat olive oil in a large skillet over medium-high heat and sear shrimp 1-2 minutes per side; remove.",
        "Lower heat, melt butter, and sauté garlic and red pepper flakes until fragrant, about 1 minute.",
        "Add pasta, a splash of reserved pasta water, and shrimp back to the skillet; toss to coat.",
        "Finish with parmesan, parsley, and a squeeze of lemon. Serve warm.",
      ],
    },
  },
  {
    id: "example-tacos",
    label: "Taco truck photo",
    photo: svgToDataUri(tacoSvg),
    recipe: {
      title: "Loaded Veggie Tacos",
      servings: 3,
      difficulty: "easy",
      ingredients: [
        { name: "tortilla", quantity: "6 small" },
        { name: "black beans", quantity: "1 can" },
        { name: "corn", quantity: "1 cup" },
        { name: "bell pepper", quantity: "1" },
        { name: "onion", quantity: "1/2" },
        { name: "avocado", quantity: "1" },
        { name: "cilantro", quantity: "1/4 cup" },
        { name: "lime", quantity: "1" },
        { name: "cumin", quantity: "1 tsp" },
        { name: "chili powder", quantity: "1 tsp" },
      ],
      steps: [
        "Sauté diced onion and bell pepper over medium heat until soft, about 5 minutes.",
        "Add black beans, corn, cumin, and chili powder; cook 5 minutes, mashing beans slightly.",
        "Warm tortillas in a dry pan or over a flame until lightly charred.",
        "Fill tortillas with the bean mixture, sliced avocado, and cilantro.",
        "Finish with a squeeze of lime and serve immediately.",
      ],
    },
  },
  {
    id: "example-soup",
    label: "Cozy soup screenshot",
    photo: svgToDataUri(soupSvg),
    recipe: {
      title: "Miso Ginger Noodle Soup",
      servings: 2,
      difficulty: "easy",
      ingredients: [
        { name: "broth", quantity: "4 cups" },
        { name: "ginger", quantity: "1 tbsp" },
        { name: "garlic", quantity: "2 cloves" },
        { name: "scallion", quantity: "2" },
        { name: "mushroom", quantity: "1 cup" },
        { name: "spinach", quantity: "2 cups" },
        { name: "soy sauce", quantity: "1 tbsp" },
        { name: "egg", quantity: "1" },
        { name: "rice", quantity: "1 cup cooked" },
      ],
      steps: [
        "Simmer broth with ginger and garlic for 10 minutes to infuse.",
        "Add mushrooms and cook until tender, about 4 minutes.",
        "Stir in soy sauce, then add spinach until just wilted.",
        "Crack in the egg and gently stir to form ribbons, or poach whole for 3 minutes.",
        "Spoon over cooked rice and top with sliced scallions.",
      ],
    },
  },
  {
    id: "example-salad",
    label: "Summer salad snap",
    photo: svgToDataUri(saladSvg),
    recipe: {
      title: "Summer Berry & Feta Salad",
      servings: 4,
      difficulty: "easy",
      ingredients: [
        { name: "spinach", quantity: "5 cups" },
        { name: "cheese", quantity: "1/2 cup" },
        { name: "avocado", quantity: "1" },
        { name: "cucumber", quantity: "1" },
        { name: "olive oil", quantity: "3 tbsp" },
        { name: "vinegar", quantity: "1 tbsp" },
        { name: "honey", quantity: "1 tsp" },
      ],
      steps: [
        "Whisk olive oil, vinegar, and honey together with a pinch of salt for the dressing.",
        "Toss spinach with sliced cucumber and avocado in a large bowl.",
        "Crumble cheese over the top.",
        "Drizzle with dressing just before serving and toss gently.",
      ],
    },
  },
];
