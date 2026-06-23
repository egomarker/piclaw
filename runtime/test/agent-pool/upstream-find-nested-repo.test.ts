import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, closeSync, openSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createFindToolDefinition } from "@earendil-works/pi-coding-agent";

const tempRoots: string[] = [];

function makeNestedRepoFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "piclaw-find-nested-"));
  tempRoots.push(root);
  mkdirSync(join(root, ".git"));
  mkdirSync(join(root, "build"));
  mkdirSync(join(root, "nested", ".git"), { recursive: true });
  mkdirSync(join(root, "nested", "build"), { recursive: true });
  writeFileSync(join(root, ".gitignore"), "build/\n");
  closeSync(openSync(join(root, "build", "root-hidden.txt"), "w"));
  closeSync(openSync(join(root, "nested", "build", "nested-visible.txt"), "w"));
  return root;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

describe("upstream find nested repo behavior", () => {
  test("inherits nested .gitignore boundary handling from @earendil-works/pi-coding-agent", async () => {
    const root = makeNestedRepoFixture();
    const tool = createFindToolDefinition(root);

    const result = await tool.execute(
      "find-call-1",
      { pattern: "*.txt", limit: 100 },
      undefined,
      undefined,
      undefined as never,
    );
    const text = result.content.find((block) => block.type === "text")?.text ?? "";

    expect(text).toContain("nested/build/nested-visible.txt");
    expect(text).not.toContain("build/root-hidden.txt");
  });
});
