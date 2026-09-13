import { useNavigate } from "react-router-dom";
import { useCookmarksStore } from "../state/store";

export function GroceryListScreen() {
  const navigate = useNavigate();
  const { groceryList, setGroceryList } = useCookmarksStore();

  function toggleItem(id: string) {
    setGroceryList(groceryList.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  }

  const checkedCount = groceryList.filter((item) => item.checked).length;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-32 pt-8 sm:pb-14">
      <p className="text-sm font-medium uppercase tracking-wide text-coral">Grocery list</p>
      <h1 className="mt-2 font-serif text-3xl text-ink">What to pick up</h1>

      {groceryList.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-16 text-center">
          <p className="font-serif text-xl text-ink">Nothing on the list</p>
          <p className="max-w-xs text-sm text-ink-soft">
            Everything you selected is already in your fridge — or you haven't checked your Cookmarks yet.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm text-muted">
            {checkedCount} of {groceryList.length} picked up
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {groceryList.map((item) => (
              <li key={item.id}>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 transition ${
                    item.checked ? "border-line bg-paper-dim" : "border-line bg-paper"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                    className="h-5 w-5 shrink-0 accent-coral"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`capitalize text-ink ${item.checked ? "text-muted line-through" : ""}`}>
                      {item.name}
                    </p>
                    {item.detail && <p className="text-xs text-muted">{item.detail}</p>}
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="fixed inset-x-0 bottom-16 z-30 flex gap-2 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur sm:static sm:mt-10 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        <button
          type="button"
          onClick={() => navigate("/fridge/results")}
          className="flex-1 rounded-2xl border border-line bg-paper px-5 py-3.5 text-sm font-medium text-ink shadow-soft transition active:scale-[0.98]"
        >
          Start a new list
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex-1 rounded-2xl bg-ink px-5 py-3.5 text-sm font-medium text-paper shadow-soft transition active:scale-[0.98]"
        >
          Add a photo
        </button>
      </div>
    </div>
  );
}
