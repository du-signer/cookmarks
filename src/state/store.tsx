import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { computeCostPerServing } from "../lib/cost";
import { generateId } from "../lib/id";
import { SEED_COOKMARKS } from "../data/seedCookmarks";
import type { Cookmark, Recipe } from "../types";

interface CookmarksStore {
  cookmarks: Cookmark[];
  addCookmark: (recipe: Recipe, photo: string, isPlaceholderPhoto?: boolean) => Cookmark;
  updateCookmarkRecipe: (id: string, recipe: Recipe) => void;
  updateCookmarkPhoto: (id: string, photo: string, isPlaceholderPhoto?: boolean) => void;
  deleteCookmark: (id: string) => void;
  importCookmarks: (imported: Cookmark[]) => number;

  fridgeItems: string[];
  setFridgeItems: (items: string[]) => void;

  apiKey: string;
  setApiKey: (key: string) => void;

  sharedKeyExhausted: boolean;
  setSharedKeyExhausted: (value: boolean) => void;

  selectedForCooking: string[];
  setSelectedForCooking: (ids: string[]) => void;

  groceryList: GroceryItem[];
  setGroceryList: (items: GroceryItem[]) => void;
}

export interface GroceryItem {
  id: string;
  name: string;
  detail: string;
  checked: boolean;
}

const PLACEHOLDER_PHOTO =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#F2EDE3"/><circle cx="100" cy="100" r="72" fill="#FAF7F1" stroke="#E6DDCF" stroke-width="2"/><path d="M75 120c8-30 42-30 50 0" stroke="#C9BEAE" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="82" cy="90" r="5" fill="#C9BEAE"/><circle cx="118" cy="90" r="5" fill="#C9BEAE"/></svg>`
  );

export { PLACEHOLDER_PHOTO };

const CookmarksContext = createContext<CookmarksStore | null>(null);

export function CookmarksProvider({ children }: { children: ReactNode }) {
  const [cookmarks, setCookmarks] = useLocalStorage<Cookmark[]>("cookmarks:list", SEED_COOKMARKS);
  const [fridgeItems, setFridgeItems] = useLocalStorage<string[]>("cookmarks:fridge", []);
  const [apiKey, setApiKey] = useLocalStorage<string>("cookmarks:apiKey", "");
  const [sharedKeyExhausted, setSharedKeyExhausted] = useLocalStorage<boolean>("cookmarks:sharedKeyExhausted", false);
  const [selectedForCooking, setSelectedForCooking] = useLocalStorage<string[]>("cookmarks:selected", []);
  const [groceryList, setGroceryList] = useLocalStorage<GroceryItem[]>("cookmarks:grocery", []);

  const value = useMemo<CookmarksStore>(
    () => ({
      cookmarks,
      addCookmark: (recipe, photo, isPlaceholderPhoto) => {
        const cookmark: Cookmark = {
          ...recipe,
          id: generateId(),
          photo,
          isPlaceholderPhoto,
          costPerServing: computeCostPerServing(recipe.ingredients, recipe.servings),
          createdAt: Date.now(),
        };
        setCookmarks((prev) => [cookmark, ...prev]);
        return cookmark;
      },
      updateCookmarkRecipe: (id, recipe) => {
        setCookmarks((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, ...recipe, costPerServing: computeCostPerServing(recipe.ingredients, recipe.servings) }
              : c
          )
        );
      },
      updateCookmarkPhoto: (id, photo, isPlaceholderPhoto) => {
        setCookmarks((prev) => prev.map((c) => (c.id === id ? { ...c, photo, isPlaceholderPhoto } : c)));
      },
      deleteCookmark: (id) => {
        setCookmarks((prev) => prev.filter((c) => c.id !== id));
        setSelectedForCooking((prev) => prev.filter((selectedId) => selectedId !== id));
      },
      importCookmarks: (imported) => {
        let addedCount = 0;
        setCookmarks((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const additions = imported.filter((c) => {
            if (!c || typeof c.id !== "string" || existingIds.has(c.id)) return false;
            existingIds.add(c.id);
            return true;
          });
          addedCount = additions.length;
          return [...additions, ...prev];
        });
        return addedCount;
      },

      fridgeItems,
      setFridgeItems,

      apiKey,
      setApiKey,

      sharedKeyExhausted,
      setSharedKeyExhausted,

      selectedForCooking,
      setSelectedForCooking,

      groceryList,
      setGroceryList,
    }),
    [
      cookmarks,
      fridgeItems,
      apiKey,
      sharedKeyExhausted,
      selectedForCooking,
      groceryList,
      setCookmarks,
      setFridgeItems,
      setApiKey,
      setSharedKeyExhausted,
      setSelectedForCooking,
      setGroceryList,
    ]
  );

  return <CookmarksContext.Provider value={value}>{children}</CookmarksContext.Provider>;
}

export function useCookmarksStore(): CookmarksStore {
  const ctx = useContext(CookmarksContext);
  if (!ctx) throw new Error("useCookmarksStore must be used within CookmarksProvider");
  return ctx;
}
