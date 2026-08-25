import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const cssRoot = path.join(import.meta.dir, "../../web/src/styles/shared");
const chatCss = readFileSync(path.join(cssRoot, "chat.css"), "utf8");
const agentCss = readFileSync(path.join(cssRoot, "agent.css"), "utf8");
const responsiveCss = readFileSync(path.join(cssRoot, "responsive.css"), "utf8");

function rulesFor(css: string, selector: string): string[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...css.matchAll(new RegExp(`${escaped}\\s*\\{[^}]+\\}`, "g"))].map(([rule]) => rule);
}

test("chat status panels and compose surfaces stay full-width with the timeline", () => {
  const surfaceRules = [
    ...rulesFor(agentCss, ".agent-status"),
    ...rulesFor(agentCss, ".agent-thinking"),
    ...rulesFor(chatCss, ".compose-box"),
    ...rulesFor(chatCss, ".compose-queue-stack"),
    ...rulesFor(chatCss, ".oobe-panel"),
    ...rulesFor(responsiveCss, ".compose-box"),
    ...rulesFor(responsiveCss, ".compose-queue-stack"),
    ...rulesFor(responsiveCss, ".agent-thinking"),
  ];

  expect(surfaceRules.length).toBeGreaterThan(0);
  for (const rule of surfaceRules) {
    expect(rule).not.toMatch(/margin(?:-left|-right):\s*[^;]*var\(--spacing-(?:xs|sm|md|lg|xl)\)/);
    expect(rule).not.toMatch(/margin:\s*0\s+var\(--spacing-(?:xs|sm|md|lg|xl)\)/);
    expect(rule).not.toMatch(/margin:\s*var\(--[^)]+\)\s+var\(--spacing-(?:xs|sm|md|lg|xl)\)/);
    expect(rule).not.toMatch(/padding:\s*var\(--spacing-sm\)\s+var\(--spacing-md\)\s+2px/);
  }

  expect(rulesFor(agentCss, ".agent-status").join("\n")).toContain("margin: 0;");
  expect(rulesFor(agentCss, ".agent-thinking").join("\n")).toContain("margin: 0;");
  expect(rulesFor(chatCss, ".compose-box").join("\n")).toContain("padding: var(--spacing-sm) 0 2px;");
  expect(rulesFor(chatCss, ".compose-queue-stack").join("\n")).toContain("margin: var(--chat-surface-stack-gap) 0 0;");
});
