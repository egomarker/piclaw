// Self-isolating: forces PICLAW_DB_IN_MEMORY=1 via shared test helpers
import "../helpers.js";

import { describe, test, expect } from "bun:test";
import { safeTruncateUtf16 } from "../../src/utils/safe-truncate.js";

describe("safeTruncateUtf16", () => {
  test("returns empty for empty input", () => {
    expect(safeTruncateUtf16("", 10)).toBe("");
  });

  test("returns empty for non-positive maxChars", () => {
    expect(safeTruncateUtf16("hello", 0)).toBe("");
    expect(safeTruncateUtf16("hello", -3)).toBe("");
  });

  test("returns unchanged when shorter than maxChars", () => {
    expect(safeTruncateUtf16("abc", 10)).toBe("abc");
  });

  test("returns unchanged when exactly maxChars", () => {
    expect(safeTruncateUtf16("abcdef", 6)).toBe("abcdef");
  });

  test("plain ASCII truncates at boundary", () => {
    expect(safeTruncateUtf16("abcdef", 3)).toBe("abc");
  });

  test("backs off when cutoff lands inside a surrogate pair", () => {
    // \u{1F914} (🤔) is one code point but two UTF-16 code units
    const text = `a${String.fromCodePoint(0x1F914)}b`; // 'a', high, low, 'b' = length 4
    expect(text.length).toBe(4);
    // maxChars=2 would land after the high surrogate — must back off to 'a'
    expect(safeTruncateUtf16(text, 2)).toBe("a");
  });

  test("keeps complete surrogate pair when room available", () => {
    const emoji = String.fromCodePoint(0x1F914);
    const text = `a${emoji}b`; // length 4
    // maxChars=3 keeps 'a' + emoji (high+low) = 3 code units
    expect(safeTruncateUtf16(text, 3)).toBe(`a${emoji}`);
  });

  test("multiple surrogate pairs truncate cleanly", () => {
    const e1 = String.fromCodePoint(0x1F914); // 🤔
    const e2 = String.fromCodePoint(0x1F600); // 😀
    const text = `${e1}${e2}`; // 4 code units
    expect(safeTruncateUtf16(text, 2)).toBe(e1);
    expect(safeTruncateUtf16(text, 3)).toBe(e1); // would split e2, back off
    expect(safeTruncateUtf16(text, 4)).toBe(text);
  });

  test("result length never exceeds maxChars", () => {
    const longEmoji = String.fromCodePoint(0x1F914).repeat(100);
    for (let n = 1; n <= 50; n++) {
      const out = safeTruncateUtf16(longEmoji, n);
      expect(out.length).toBeLessThanOrEqual(n);
      // No orphan high surrogate at end
      if (out.length > 0) {
        const lastCode = out.charCodeAt(out.length - 1);
        expect(lastCode >= 0xD800 && lastCode <= 0xDBFF).toBe(false);
      }
    }
  });
});
