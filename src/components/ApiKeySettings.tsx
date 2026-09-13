import { useRef, useState } from "react";
import { Modal } from "./Modal";
import { useCookmarksStore } from "../state/store";
import type { Cookmark } from "../types";

function isCookmarkLike(value: unknown): value is Cookmark {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.title === "string" &&
    Array.isArray(c.ingredients) &&
    Array.isArray(c.steps)
  );
}

export function ApiKeySettings({ onClose }: { onClose: () => void }) {
  const { apiKey, setApiKey, cookmarks, importCookmarks } = useCookmarksStore();
  const [draft, setDraft] = useState(apiKey);
  const [importMessage, setImportMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const payload = { exportedAt: new Date().toISOString(), cookmarks };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cookmarks-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(file: File) {
    setImportMessage(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const candidates: unknown[] = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.cookmarks) ? parsed.cookmarks : [];
      const valid = candidates.filter(isCookmarkLike);
      if (valid.length === 0) {
        setImportMessage({ text: "That file didn't contain any recognizable Cookmarks.", isError: true });
        return;
      }
      const added = importCookmarks(valid);
      const skipped = valid.length - added;
      setImportMessage({
        text:
          added === 0
            ? "Those Cookmarks are already in your collection."
            : `Added ${added} Cookmark${added === 1 ? "" : "s"}.${skipped > 0 ? ` (${skipped} already existed.)` : ""}`,
        isError: false,
      });
    } catch {
      setImportMessage({ text: "Couldn't read that file — make sure it's a Cookmarks export.", isError: true });
    }
  }

  return (
    <Modal title="Settings" onClose={onClose}>
      <p className="text-sm text-ink-soft">
        Cookmarks has no server of its own — recipe generation calls the Anthropic API directly from your
        browser using your own key. It's stored only in this browser's local storage.
      </p>
      <label className="mt-4 block text-sm font-medium text-ink">Anthropic API key</label>
      <input
        type="password"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="sk-ant-…"
        className="mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-sage"
        autoComplete="off"
        spellCheck={false}
      />
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setApiKey(draft.trim());
            onClose();
          }}
          className="flex-1 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-paper transition active:scale-[0.98]"
        >
          Save
        </button>
        {apiKey && (
          <button
            type="button"
            onClick={() => {
              setApiKey("");
              setDraft("");
            }}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink-soft transition active:scale-[0.98]"
          >
            Remove
          </button>
        )}
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <p className="text-sm font-medium text-ink">Your Cookmarks data</p>
        <p className="mt-1 text-sm text-ink-soft">
          Saved Cookmarks live only in this browser. Moving to a different browser or device? Export here,
          then Import on the other side.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={cookmarks.length === 0}
            className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink-soft transition active:scale-[0.98] disabled:opacity-40"
          >
            Export ({cookmarks.length})
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink-soft transition active:scale-[0.98]"
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleImportFile(file);
              event.target.value = "";
            }}
          />
        </div>
        {importMessage && (
          <p className={`mt-2 text-sm ${importMessage.isError ? "text-coral" : "text-sage"}`}>
            {importMessage.text}
          </p>
        )}
      </div>
    </Modal>
  );
}
