import { afterEach, expect, test } from "bun:test";
import Database from "bun:sqlite";
import { existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const script = resolve(import.meta.dir, "../../scripts/import-jsonl-sessions.ts");
const roots: string[] = [];
afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })));

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "piclaw-import-script-"));
  roots.push(root);
  const source = join(root, "session.jsonl");
  writeFileSync(source, [
    JSON.stringify({ type: "session", version: 3, id: "session", cwd: "/workspace" }),
    JSON.stringify({ type: "message", id: "entry", parentId: null, message: { role: "user", content: "hello" } }),
    "",
  ].join("\n"));
  return { root, source, target: join(root, "sessions.db") };
}

async function run(args: string[]) {
  const child = Bun.spawn({ cmd: [process.execPath, script, ...args], stdout: "pipe", stderr: "pipe" });
  const [exitCode, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);
  return { exitCode, stdout, stderr };
}

test("dry-run inventories sources without creating a target", async () => {
  const { root, target } = fixture();
  const result = await run(["--source", root, "--target", target, "--layout", "separate", "--dry-run"]);
  expect(result.exitCode).toBe(0);
  expect(JSON.parse(result.stdout).sourceFiles).toBe(1);
  expect(existsSync(target)).toBe(false);
});

test("existing separate stores are backed up before idempotent import", async () => {
  const { root, target } = fixture();
  const first = await run(["--source", root, "--target", target, "--layout", "separate"]);
  expect(first.exitCode).toBe(0);
  const second = await run(["--source", root, "--target", target, "--layout", "separate"]);
  expect(second.exitCode).toBe(0);
  expect(JSON.parse(second.stdout).alreadyImported).toBe(1);
  expect(readdirSync(root).some((name) => name.includes("pre-session-import") && name.endsWith(".backup"))).toBe(true);
});

test("refuses unified and unrelated targets", async () => {
  const { root, target } = fixture();
  const unified = await run(["--source", root, "--target", target, "--layout", "unified"]);
  expect(unified.exitCode).not.toBe(0);
  expect(unified.stderr).toContain("Unified imports are intentionally unsupported");

  const database = new Database(target, { create: true, strict: true });
  database.exec("CREATE TABLE unrelated(id INTEGER)");
  database.close();
  const unrelated = await run(["--source", root, "--target", target, "--layout", "separate"]);
  expect(unrelated.exitCode).not.toBe(0);
  expect(unrelated.stderr).toContain("unrelated table");
});
