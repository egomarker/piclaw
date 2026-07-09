/**
 * utils/safe-truncate.ts \u2014 UTF-16 surrogate-safe string truncation.
 *
 * JavaScript strings are UTF-16. Slicing by code unit can split a surrogate
 * pair (e.g. an emoji like \ud83e\udd14 occupies two code units), leaving an orphan
 * high or low surrogate at the boundary. Storing such a string in SQLite as
 * TEXT preserves the bytes but renders as \ufffd or breaks JSON consumers.
 *
 * safeTruncateUtf16 backs off by one code unit when the cut would leave a
 * dangling high surrogate, so the result is always a valid UTF-16 sequence.
 */

/** High surrogate range: U+D800-U+DBFF (first half of an emoji/surrogate pair). */
const HIGH_SURROGATE_MIN = 0xD800;
const HIGH_SURROGATE_MAX = 0xDBFF;

/**
 * Truncate a string to at most `maxChars` UTF-16 code units, ensuring the
 * result never ends with an orphan high surrogate.
 *
 * @param text Source string.
 * @param maxChars Maximum code unit count for the returned string. Must be
 *                 non-negative. Values \u2264 0 return an empty string.
 * @returns A truncated string of length \u2264 maxChars whose final character is
 *          never a lone high surrogate.
 */
export function safeTruncateUtf16(text: string, maxChars: number): string {
  if (!text || maxChars <= 0) return "";
  if (text.length <= maxChars) return text;
  let cutoff = maxChars;
  const lastCharCode = text.charCodeAt(cutoff - 1);
  // If the last kept code unit is a high surrogate, the pair extends past
  // cutoff. Back off by one to avoid the orphan.
  if (lastCharCode >= HIGH_SURROGATE_MIN && lastCharCode <= HIGH_SURROGATE_MAX) {
    cutoff -= 1;
  }
  return text.slice(0, cutoff);
}
