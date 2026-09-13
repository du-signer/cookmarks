import { GROCERY_PRICES } from "../data/groceryPrices";

const KNOWN_INGREDIENT_PHRASES = new Set(Object.keys(GROCERY_PRICES));
const MAX_PHRASE_WORDS = Math.max(...Object.keys(GROCERY_PRICES).map((phrase) => phrase.split(" ").length));

function cleanupPhrase(phrase: string): string {
  return phrase.replace(/^i (have|got|also have)\s+/i, "").replace(/^(some|a|an)\s+/i, "").trim();
}

/**
 * Splits on explicit delimiters only (commas, "and", line breaks). Used for
 * typed input, where punctuation reliably marks item boundaries.
 */
export function parseIngredientsFromText(text: string): string[] {
  return text
    .split(/,|\band\b|\n|;/gi)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(cleanupPhrase)
    .filter(Boolean);
}

/**
 * Voice transcripts often run several items together with no punctuation at
 * all (e.g. "broccoli egg cheese" instead of "broccoli, egg, cheese"), since
 * the Web Speech API only inserts pauses it's confident about. After
 * splitting on whatever explicit delimiters *are* present, this further
 * breaks each chunk into individual ingredients by greedily matching known
 * grocery-item phrases (longest phrase first, e.g. "olive oil" stays
 * together) and otherwise falling back to one word per ingredient.
 */
export function parseIngredientsFromSpeech(text: string): string[] {
  return parseIngredientsFromText(text).flatMap(segmentRunOnPhrase);
}

/** Length of the longest known phrase starting exactly at `pos`, else null. */
function matchLengthAt(words: string[], pos: number): number | null {
  const remaining = words.length - pos;
  for (let len = Math.min(MAX_PHRASE_WORDS, remaining); len >= 1; len -= 1) {
    const candidate = words
      .slice(pos, pos + len)
      .join(" ")
      .toLowerCase();
    if (KNOWN_INGREDIENT_PHRASES.has(candidate)) return len;
  }
  return null;
}

function segmentRunOnPhrase(phrase: string): string[] {
  const words = phrase.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [phrase];

  const result: string[] = [];
  let i = 0;
  while (i < words.length) {
    const lengthHere = matchLengthAt(words, i);
    if (lengthHere != null) {
      result.push(words.slice(i, i + lengthHere).join(" "));
      i += lengthHere;
      continue;
    }

    // Nothing recognizable starts at `i` (e.g. "whipped" on its own isn't a
    // known ingredient). Rather than peel it off as its own bogus item,
    // look ahead for the next word that *does* start a known ingredient and
    // fold everything in between into it — "whipped" + "cream" becomes the
    // single item "whipped cream" instead of two chips.
    let lookahead = i + 1;
    let lengthAhead: number | null = null;
    while (lookahead < words.length) {
      lengthAhead = matchLengthAt(words, lookahead);
      if (lengthAhead != null) break;
      lookahead += 1;
    }

    if (lengthAhead != null) {
      result.push(words.slice(i, lookahead + lengthAhead).join(" "));
      i = lookahead + lengthAhead;
    } else {
      // No known ingredient anywhere in the rest of the phrase — keep it
      // together as one item rather than guessing where to split.
      result.push(words.slice(i).join(" "));
      i = words.length;
    }
  }
  return result;
}
