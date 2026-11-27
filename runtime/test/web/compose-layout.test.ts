import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

import { shouldShowComposeAgentAffordance } from "../../web/src/ui/compose-layout.js";
import { observeComposeSessionPill, resolveComposeSessionPillOffset } from "../../web/src/ui/compose-session-pill.js";

const chatCss = readFileSync(path.join(import.meta.dir, "../../web/src/styles/shared/chat.css"), "utf8");
const responsiveCss = readFileSync(path.join(import.meta.dir, "../../web/src/styles/shared/responsive.css"), "utf8");

test("shows compose agent affordance when the footer is wide enough", () => {
  expect(shouldShowComposeAgentAffordance({
    footerWidth: 760,
    visibleAgentCount: 2,
    hasContextIndicator: true,
  })).toBe(true);
});

test("hides compose agent affordance when the footer is too narrow", () => {
  expect(shouldShowComposeAgentAffordance({
    footerWidth: 540,
    visibleAgentCount: 2,
    hasContextIndicator: true,
  })).toBe(false);
});

test("hides compose agent affordance when there are no visible agents", () => {
  expect(shouldShowComposeAgentAffordance({
    footerWidth: 900,
    visibleAgentCount: 0,
    hasContextIndicator: true,
  })).toBe(false);
});

test("session pill is bounded and truncates only the label without reserving input width", () => {
  const anchor = chatCss.match(/\.compose-session-trigger-top\s*\{[^}]+\}/)?.[0];
  const button = chatCss.match(/\.compose-session-trigger-top > \.compose-session-trigger-pill\s*\{[^}]+\}/)?.[0];
  const label = chatCss.match(/\.compose-session-trigger-label\s*\{[^}]+\}/)?.[0];
  const mobileRules = [...responsiveCss.matchAll(/\.compose-session-trigger-top\s*\{[^}]+\}/g)].map(([rule]) => rule);

  expect(anchor).toContain("position: absolute;");
  expect(anchor).toContain("right: 6px;");
  expect(anchor).toContain("max-width: min(var(--compose-session-trigger-max-width), calc(100% - 12px));");
  expect(anchor).toContain("pointer-events: none;");
  expect(anchor).not.toContain("transform:");
  expect(button).toContain("max-width: 100%;");
  expect(button).toContain("pointer-events: auto;");
  expect(button).toContain("transform: translateY(var(--compose-session-pill-offset-y, 0px));");
  expect(label).toContain("min-width: 0;");
  expect(label).toContain("white-space: nowrap;");
  expect(label).toContain("overflow: hidden;");
  expect(label).toContain("text-overflow: ellipsis;");
  expect(mobileRules).toHaveLength(2);
  for (const rule of mobileRules) {
    expect(rule).toContain("--compose-session-trigger-max-width:");
    expect(rule).not.toContain("position:");
  }
  expect(responsiveCss).not.toContain(".compose-session-trigger-top + .compose-input-main textarea");
  expect(chatCss.match(/\.compose-session-trigger-top \+ \.compose-input-main textarea\s*\{[^}]+\}/)?.[0]).not.toContain("padding-right:");
});

const home = { left: 200, right: 310, top: 104, bottom: 132 };
const editor = { top: 106, bottom: 190 };
const overlappingCaret = { left: 245, right: 246, top: 110, bottom: 129 };

test("dodges below the caret and returns to the original corner when it clears", () => {
  expect(resolveComposeSessionPillOffset(home, overlappingCaret, editor, 40)).toBe(27);
  // The caret has moved but still overlaps the home position, not the displaced pill.
  const caretStillInCorner = { ...overlappingCaret, left: 302, right: 303 };
  expect(resolveComposeSessionPillOffset(home, caretStillInCorner, editor, 40)).toBe(27);
  const caretOnNextLine = { ...overlappingCaret, top: 137, bottom: 156 };
  expect(resolveComposeSessionPillOffset(home, caretOnNextLine, editor, 40)).toBe(0);
  const caretToTheLeft = { ...overlappingCaret, left: 180, right: 181 };
  expect(resolveComposeSessionPillOffset(home, caretToTheLeft, editor, 40)).toBe(0);
});

test("parks above a short editor if there is room, otherwise yields without entering the footer", () => {
  const shortEditor = { ...editor, bottom: 153 };
  expect(resolveComposeSessionPillOffset(home, overlappingCaret, shortEditor, 50)).toBe(-28);
  expect(resolveComposeSessionPillOffset(home, overlappingCaret, shortEditor, 80)).toBeNull();
});

test("coalesces editing and caret events without polling or work after blur", () => {
  const frames = new Map<number, FrameRequestCallback>();
  let frameId = 0;
  const win = Object.assign(new EventTarget(), {
    requestAnimationFrame(callback: FrameRequestCallback) {
      const id = frameId++;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame(id: number) { frames.delete(id); },
  });
  const doc = Object.assign(new EventTarget(), { defaultView: win, activeElement: null as EventTarget | null });
  const editorTarget = Object.assign(new EventTarget(), { ownerDocument: doc, value: "" });
  const anchor = Object.assign(new EventTarget(), { parentElement: {} });
  const observer = observeComposeSessionPill(editorTarget as unknown as HTMLTextAreaElement, anchor as unknown as HTMLElement);
  try {
    expect(frames.size).toBe(0);
    doc.activeElement = editorTarget;
    editorTarget.dispatchEvent(new Event("focus"));
    editorTarget.dispatchEvent(new Event("input"));
    doc.dispatchEvent(new Event("selectionchange"));
    expect(frames.size).toBe(1);
    const runFrame = () => {
      const [[id, callback]] = frames;
      frames.delete(id);
      callback(0);
    };
    runFrame();
    expect(frames.size).toBe(0);
    doc.dispatchEvent(new Event("selectionchange"));
    expect(frames.size).toBe(1);
    doc.activeElement = null;
    editorTarget.dispatchEvent(new Event("blur"));
    expect(frames.size).toBe(0);
    doc.dispatchEvent(new Event("selectionchange"));
    expect(frames.size).toBe(0);
  } finally {
    observer?.dispose();
  }
});
