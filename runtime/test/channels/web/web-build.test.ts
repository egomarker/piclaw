/**
 * test/channels/web/web-build.test.ts – Build verification tests.
 *
 * Confirms that the web/static output directory contains the expected
 * JS, CSS, and HTML files after a build.
 */

import { expect, test } from "bun:test";
import "../../helpers.js";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const WEB_BUILD_TEST_TIMEOUT_MS = Number(process.env.WEB_BUILD_TEST_TIMEOUT_MS || 20_000);

function projectRoot(): string {
  return join(import.meta.dir, "..", "..", "..");
}

test("build:web produces Mobile-only assets and cleans stale retired shells", async () => {
  const root = projectRoot();
  const retiredDirs = ["classic", "visual"].map((name) => join(root, "web", "static", name));
  for (const dir of retiredDirs) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), "stale shell");
    writeFileSync(join(dir, "app.bundle.js.gz"), "stale compressed asset");
  }
  const proc = Bun.spawn(["bun", "run", "build:web"], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });

  try {
    const [exitCode, stdout, stderr] = await Promise.all([
      proc.exited,
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    expect(exitCode, stderr || stdout).toBe(0);
    for (const dir of retiredDirs) expect(existsSync(dir)).toBe(false);
  } finally {
    for (const dir of retiredDirs) rmSync(dir, { recursive: true, force: true });
  }

  const appBundlePath = join(root, "web", "static", "mobile", "dist", "app.bundle.js");
  const appMapPath = join(root, "web", "static", "mobile", "dist", "app.bundle.js.map");
  const appCssPath = join(root, "web", "static", "mobile", "dist", "app.bundle.css");

  const loginBundlePath = join(root, "web", "static", "common", "dist", "login.bundle.js");
  const loginMapPath = join(root, "web", "static", "common", "dist", "login.bundle.js.map");
  const loginCssPath = join(root, "web", "static", "common", "dist", "login.bundle.css");

  const editorBundlePath = join(root, "web", "static", "mobile", "dist", "editor.bundle.js");
  const editorMapPath = join(root, "web", "static", "mobile", "dist", "editor.bundle.js.map");
  const legacyClassicDistPath = join(root, "web", "static", "classic", "dist");
  const legacyClassicCssPath = join(root, "web", "static", "classic", "css");
  const legacyMobileCssPath = join(root, "web", "static", "mobile", "css");

  expect(existsSync(appBundlePath)).toBe(true);
  expect(existsSync(appMapPath)).toBe(true);
  expect(existsSync(appCssPath)).toBe(true);

  expect(existsSync(loginBundlePath)).toBe(true);
  expect(existsSync(loginMapPath)).toBe(true);
  expect(existsSync(loginCssPath)).toBe(true);

  expect(existsSync(editorBundlePath)).toBe(true);
  expect(existsSync(editorMapPath)).toBe(true);
  expect(existsSync(legacyClassicDistPath)).toBe(false);
  expect(existsSync(legacyClassicCssPath)).toBe(false);
  expect(existsSync(legacyMobileCssPath)).toBe(false);

  const appBundle = readFileSync(appBundlePath, "utf8");
  const editorBundle = readFileSync(editorBundlePath, "utf8");
  expect(appBundle).toContain('#editor-vendor/codemirror');
  expect(editorBundle).toContain('#editor-vendor/codemirror');

  expect(statSync(appBundlePath).size).toBeLessThan(1_500_000);
  expect(statSync(editorBundlePath).size).toBeLessThan(500_000);
}, WEB_BUILD_TEST_TIMEOUT_MS);
