import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dir, "../../..");
const source = readFileSync(resolve(repoRoot, "runtime/web/src/components/image-annotator.ts"), "utf8");
const classicCss = readFileSync(resolve(repoRoot, "runtime/web/static/classic/css/overlays.css"), "utf8");
const visualCss = readFileSync(resolve(repoRoot, "runtime/web/static/visual/css/overlays.css"), "utf8");

test("image annotator renders as a centered modal with a clipped stage and protected toolbar", () => {
  expect(source).toContain('role="dialog"');
  expect(source).toContain('class="image-annotator-stage"');

  for (const css of [classicCss, visualCss]) {
    expect(css).toContain(".post-inline-annotator {");
    expect(css).toContain("position: fixed;");
    expect(css).toContain("align-items: center;");
    expect(css).toContain("justify-content: center;");
    expect(css).toContain(".image-annotator-stage {");
    expect(css).toContain("overflow: hidden;");
    expect(css).toContain(".image-annotator-toolbar {");
    expect(css).toContain("z-index: 20;");
    expect(css).toContain("pointer-events: auto;");
  }
});

test("image annotator treats two-finger gestures as pinch instead of committed drawing", () => {
  expect(source).toContain("gestureModeRef");
  expect(source).toContain("beginPinch(e)");
  expect(source).toContain("cancelActiveDrawing()");
  expect(source).toContain("redrawAll(ctx, historyRef.current, canvas.width, canvas.height)");
  expect(source).toContain("suppressTouchDrawUntilRef.current = Date.now() + 250");
});
