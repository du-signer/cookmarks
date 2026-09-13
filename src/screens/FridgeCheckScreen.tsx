import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookmarksStore } from "../state/store";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { IngredientChipList } from "../components/IngredientChipList";
import { parseIngredientsFromSpeech, parseIngredientsFromText } from "../lib/parseIngredients";

export function FridgeCheckScreen() {
  const navigate = useNavigate();
  const { fridgeItems, setFridgeItems, cookmarks } = useCookmarksStore();
  const [items, setItems] = useState<string[]>(fridgeItems);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textDraft, setTextDraft] = useState("");
  const speech = useSpeechRecognition();

  function addParsed(parsed: string[]) {
    if (parsed.length === 0) return;
    setItems((prev) => {
      const existingLower = new Set(prev.map((item) => item.toLowerCase()));
      const additions = parsed.filter((item) => !existingLower.has(item.toLowerCase()));
      return [...prev, ...additions];
    });
  }

  function handleMicToggle() {
    if (speech.isListening) {
      speech.stop();
      return;
    }
    // Voice transcripts often run items together with no punctuation
    // ("broccoli egg cheese"), so segment against known ingredient phrases.
    speech.start((finalText) => addParsed(parseIngredientsFromSpeech(finalText)));
  }

  function handleTextSubmit() {
    addParsed(parseIngredientsFromText(textDraft));
    setTextDraft("");
  }

  function handleCheckCookmarks() {
    setFridgeItems(items);
    navigate("/fridge/results");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-8 sm:pb-14">
      <p className="text-sm font-medium uppercase tracking-wide text-dusty-blue">Fridge check</p>
      <h1 className="mt-2 font-serif text-3xl text-ink">What's in your fridge?</h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
        Tell us what you've got, and we'll match it against your Cookmarks.
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-line bg-paper-dim px-6 py-10">
        <div className="relative flex h-20 w-20 items-center justify-center">
          {!speech.isListening && speech.isSupported && (
            <span className="absolute inset-0 animate-ping rounded-full bg-dusty-blue/30" />
          )}
          <button
            type="button"
            onClick={handleMicToggle}
            disabled={!speech.isSupported}
            aria-pressed={speech.isListening}
            className={`relative flex h-20 w-20 items-center justify-center rounded-full shadow-soft transition active:scale-95 disabled:opacity-40 ${
              speech.isListening ? "bg-coral text-white animate-pulse-soft" : "bg-ink text-paper"
            }`}
          >
            <MicIcon />
          </button>
        </div>
        <p className="text-center text-sm font-medium text-ink-soft">
          {speech.isListening
            ? "Listening… tap to stop"
            : speech.isSupported
              ? "Tap the mic to start talking"
              : "Voice input isn't supported here"}
        </p>
        {speech.interimTranscript && (
          <p className="max-w-sm text-center text-sm italic text-muted">“{speech.interimTranscript}”</p>
        )}
        {speech.error && <p className="text-sm text-coral">{speech.error}</p>}

        <button
          type="button"
          onClick={() => setShowTextInput((prev) => !prev)}
          className="text-sm font-medium text-dusty-blue underline underline-offset-2"
        >
          Type instead
        </button>

        {showTextInput && (
          <div className="mt-1 flex w-full max-w-sm gap-2">
            <input
              value={textDraft}
              onChange={(event) => setTextDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleTextSubmit();
                }
              }}
              placeholder="eggs, spinach, garlic…"
              className="flex-1 rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-dusty-blue"
            />
            <button
              type="button"
              onClick={handleTextSubmit}
              className="rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-paper transition active:scale-95"
            >
              Add
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Your ingredients</h2>
        <IngredientChipList items={items} onChange={setItems} />
      </div>

      <button
        type="button"
        onClick={handleCheckCookmarks}
        disabled={cookmarks.length === 0}
        className="mt-8 w-full rounded-2xl bg-ink px-5 py-3.5 text-sm font-medium text-paper shadow-soft transition active:scale-[0.98] disabled:opacity-40"
      >
        Check my Cookmarks
      </button>
      {cookmarks.length === 0 && (
        <p className="mt-2 text-center text-sm text-muted">Save a Cookmark first to check it against your fridge.</p>
      )}
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
    </svg>
  );
}
