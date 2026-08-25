import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dir, "../../..");
const sourceFiles = [
  "runtime/web/src/components/post.ts",
  "runtime/web/src/components/status.ts",
  "runtime/web/src/components/system-meters-hud.ts",
  "runtime/web/src/components/workspace-explorer.ts",
  "runtime/web/src/styles/shared/base.css",
  "runtime/web/src/styles/shared/agent.css",
  "runtime/web/src/styles/shared/content.css",
  "runtime/web/src/styles/shared/shell.css",
  "runtime/web/src/styles/shared/workspace.css",
].map((file) => ({ file, text: readFileSync(path.join(repoRoot, file), "utf8") }));

test("disclosure triangles use one shared 10px primitive", () => {
  const baseCss = sourceFiles.find(({ file }) => file.endsWith("base.css"))?.text || "";
  expect(baseCss).toContain("--ui-disclosure-triangle-size: 10px;");
  expect(baseCss).toContain(".ui-disclosure-triangle");

  for (const { text } of sourceFiles) {
    expect(text).not.toMatch(/[▶▸▾▴▼▲◂◃▹▵▿]/);
  }

  const workspaceCss = sourceFiles.find(({ file }) => file.endsWith("workspace.css"))?.text || "";
  const caretIconSizeRules = [...workspaceCss.matchAll(/--workspace-caret-icon-size:\s*([^;]+);/g)].map((match) => match[1].trim());
  expect(caretIconSizeRules.length).toBeGreaterThan(0);
  expect(new Set(caretIconSizeRules)).toEqual(new Set(["var(--ui-disclosure-triangle-size)"]));
});
