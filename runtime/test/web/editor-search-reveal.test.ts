import { expect, test } from "bun:test";
import { EditorState } from "#editor-vendor/codemirror";
import {
  buildRevealCandidates,
  findRevealRange,
} from "../../extensions/viewers/editor/search-reveal.ts";

test("reveal candidates include exact, collapsed, lines, and truncated snippets", () => {
  const long = `${"alpha ".repeat(40)}\nsecond line match`;
  const candidates = buildRevealCandidates(long);

  expect(candidates[0]).toBe(long.trim());
  expect(candidates).toContain("second line match");
  expect(candidates.some((candidate) => candidate.length === 140)).toBe(true);
  expect(candidates.some((candidate) => candidate.length === 80)).toBe(true);
});

test("reveal range finds exact and line fallback matches", () => {
  const state = EditorState.create({ doc: "Intro\nTarget paragraph with enough text\nTail" });

  expect(findRevealRange(state.doc, "Target paragraph with enough text")).toEqual({ from: 6, to: 39 });
  expect(findRevealRange(state.doc, "missing first line\nTarget paragraph with enough text")).toEqual({ from: 6, to: 39 });
});

test("reveal range ignores empty queries", () => {
  const state = EditorState.create({ doc: "Target paragraph" });
  expect(findRevealRange(state.doc, "   ")).toBeNull();
});
