/**
 * test/web/markdown-live-preview-gating.test.ts — Pure tests for markdown
 * live-preview cursor gating rules.
 */

import { expect, test } from "bun:test";
import { EditorState } from "#editor-vendor/codemirror";
import {
  isAlwaysDecoratedNode,
  usesBlockCursorGate,
} from "../../extensions/viewers/editor/markdown/cursor-gating.ts";
import { shouldDecorateBlockquote } from "../../extensions/viewers/editor/markdown/blockquote-utils.ts";
import { parseMarkdownImageSource } from "../../extensions/viewers/editor/markdown/image-block.ts";
import { normalizeLinkHref } from "../../extensions/viewers/editor/markdown/link.ts";
import { isTableBoundaryPosition } from "../../extensions/viewers/editor/markdown/table-keymap.ts";
import { shouldSignalTreeGrowth } from "../../extensions/viewers/editor/markdown/tree-progress.ts";
import {
  getSelectionLineSignature,
  livePreviewFrozenField,
  pushSafeReplace,
  setLivePreviewFrozen,
  splitRangeByDocumentLines,
} from "../../extensions/viewers/editor/markdown/live-preview.ts";

test("blockquote nodes are not suppressed by generic block cursor gating", () => {
  expect(usesBlockCursorGate("Blockquote")).toBe(false);
  expect(usesBlockCursorGate("Table")).toBe(true);
});

test("list items remain always decorated", () => {
  expect(isAlwaysDecoratedNode("ListItem")).toBe(true);
});

test("inline code remains decorated so monospaced spans render on the active line", () => {
  expect(isAlwaysDecoratedNode("InlineCode")).toBe(true);
});

test("regular blockquotes stay decorated while editing inside them", () => {
  expect(shouldDecorateBlockquote("> quoted bullet list", true)).toBe(true);
});

test("callouts still back off while editing inside them", () => {
  expect(shouldDecorateBlockquote("> [!warning] Heads up", true)).toBe(false);
  expect(shouldDecorateBlockquote("> [!warning] Heads up", false)).toBe(true);
});

test("live preview selection signature is stable while cursor moves within one line", () => {
  const lineStarts = [0, 11, 22];
  const doc = {
    length: 32,
    lineAt(pos: number) {
      const start = [...lineStarts].reverse().find((value) => pos >= value) ?? 0;
      return { from: start };
    },
  };

  const lineOneA = { state: { doc, selection: { ranges: [{ anchor: 2, head: 4 }] } } };
  const lineOneB = { state: { doc, selection: { ranges: [{ anchor: 5, head: 8 }] } } };
  const lineTwo = { state: { doc, selection: { ranges: [{ anchor: 12, head: 12 }] } } };

  expect(getSelectionLineSignature(lineOneA as any)).toBe(getSelectionLineSignature(lineOneB as any));
  expect(getSelectionLineSignature(lineTwo as any)).not.toBe(getSelectionLineSignature(lineOneA as any));
});

function makeLineDoc(text: string) {
  const starts: number[] = [0];
  const ends: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) === 10) {
      ends.push(i);
      starts.push(i + 1);
    }
  }
  ends.push(text.length);

  return {
    length: text.length,
    lineAt(pos: number) {
      let index = 0;
      for (let i = 0; i < starts.length; i++) {
        if (starts[i] <= pos) index = i;
      }
      return { from: starts[index], to: ends[index] };
    },
  };
}

test("safe replace splitting keeps replacement ranges on single lines", () => {
  const doc = makeLineDoc("abc\ndef\nghi");

  expect(splitRangeByDocumentLines(doc, 1, 10)).toEqual([
    { from: 1, to: 3 },
    { from: 4, to: 7 },
    { from: 8, to: 10 },
  ]);
});

test("safe replace helper pushes one decoration entry per same-line segment", () => {
  const doc = makeLineDoc("abc\ndef\nghi");
  const entries: Array<{ from: number; to: number }> = [];

  pushSafeReplace(entries as any, doc, 0, 9);

  expect(entries.map(({ from, to }) => ({ from, to }))).toEqual([
    { from: 0, to: 3 },
    { from: 4, to: 7 },
    { from: 8, to: 9 },
  ]);
});

test("live preview freeze field toggles from pointer freeze effects", () => {
  const state = EditorState.create({ extensions: [livePreviewFrozenField] });
  const frozen = state.update({ effects: setLivePreviewFrozen.of(true) }).state;
  const thawed = frozen.update({ effects: setLivePreviewFrozen.of(false) }).state;

  expect(state.field(livePreviewFrozenField)).toBe(false);
  expect(frozen.field(livePreviewFrozenField)).toBe(true);
  expect(thawed.field(livePreviewFrozenField)).toBe(false);
});

test("tree progress signals on bounded growth threshold or complete parse", () => {
  expect(shouldSignalTreeGrowth(0, 1024, 10_000)).toBe(false);
  expect(shouldSignalTreeGrowth(0, 8192, 10_000)).toBe(true);
  expect(shouldSignalTreeGrowth(7000, 7999, 7999)).toBe(true);
});

test("image block parser accepts common markdown image sources and rejects unsafe shapes", () => {
  expect(parseMarkdownImageSource('![Alt text](https://example.com/a.png "caption")')).toEqual({
    alt: 'Alt text',
    url: 'https://example.com/a.png',
  });
  expect(parseMarkdownImageSource('[not image](https://example.com/a.png)')).toBeNull();
  expect(parseMarkdownImageSource('![multi](https://example.com/a b.png)')).toBeNull();
});

test("link normalization preserves Piclaw link safety policy", () => {
  expect(normalizeLinkHref('#section')).toBe('#section');
  expect(normalizeLinkHref('/workspace/file.md')).toBe('/workspace/file.md');
  expect(normalizeLinkHref('https://example.com/a')).toBe('https://example.com/a');
  expect(normalizeLinkHref('javascript:alert(1)')).toBeNull();
  expect(normalizeLinkHref('data:text/html,hi')).toBeNull();
});

test("table boundary helper treats the table as an atomic unit before destructive backspace", () => {
  expect(isTableBoundaryPosition(42, 42)).toBe(true);
  expect(isTableBoundaryPosition(42, 43)).toBe(true);
  expect(isTableBoundaryPosition(42, 44)).toBe(false);
});
