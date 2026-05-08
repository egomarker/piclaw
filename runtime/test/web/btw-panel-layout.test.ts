import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const contentCss = readFileSync(path.join(import.meta.dir, "../../web/static/css/content.css"), "utf8");

function ruleFor(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = contentCss.match(new RegExp(`${escaped}\\s*\\{[^}]+\\}`));
  return match?.[0] || "";
}

test("BTW panel is bounded and scrollable without narrowing relative to the timeline", () => {
  const rule = ruleFor(".btw-panel");

  expect(rule).toContain("flex: 0 1 auto;");
  expect(rule).toContain("min-height: 0;");
  expect(rule).toContain("max-height: min(42vh, 360px);");
  expect(rule).toContain("overflow-y: auto;");
  expect(rule).toContain("overscroll-behavior: contain;");
  expect(rule).toContain("-webkit-overflow-scrolling: touch;");
  expect(rule).toContain("scrollbar-gutter: stable;");
  expect(rule).toContain("margin: 6px 0 0;");
  expect(rule).not.toMatch(/margin:\s*[^;]*var\(--spacing-(?:xs|sm|md|lg|xl)\)/);
});
