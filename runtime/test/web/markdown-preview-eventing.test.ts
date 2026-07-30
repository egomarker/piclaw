import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { getPreviewContainerHeight } from '../../web/src/components/markdown-preview.js';

const source = readFileSync(join(import.meta.dir, "../../web/src/components/markdown-preview.ts"), "utf8");

test('markdown preview skips display-contents ancestors when sizing its splitter', () => {
  const appShell = { offsetHeight: 800, parentElement: null };
  const displayContentsParent = { offsetHeight: 0, parentElement: appShell };
  const panel = { parentElement: displayContentsParent };
  expect(getPreviewContainerHeight(panel)).toBe(800);
  expect(getPreviewContainerHeight(null, 640)).toBe(640);
});

test("editor markdown preview uses content-change events instead of polling", () => {
  expect(source).toContain("subscribeContentChange");
  expect(source).toContain("RENDER_DEBOUNCE_MS");
  expect(source).not.toContain("setInterval");
});
