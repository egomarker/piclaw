/**
 * test/channels/web/web-build.test.ts – Build verification tests.
 *
 * Confirms that the web/static output directory contains the expected
 * JS, CSS, and HTML files after a build.
 */

import { expect, test } from "bun:test";
import "../../helpers.js";
import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";

const WEB_BUILD_TEST_TIMEOUT_MS = 20_000;

function projectRoot(): string {
  return join(import.meta.dir, "..", "..", "..");
}

test("build:web produces Mobile-owned bundle assets", async () => {
  const root = projectRoot();
  const proc = Bun.spawn(["bun", "run", "build:web"], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });

  const exitCode = await proc.exited;
  expect(exitCode).toBe(0);

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

test("build:web:visual uses the canonical Mobile editor bundle and removes stale copies", async () => {
  const root = projectRoot();
  const proc = Bun.spawn(["bun", "run", "build:web:visual"], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });

  const exitCode = await proc.exited;
  expect(exitCode).toBe(0);

  const visualDist = join(root, "web", "static", "visual", "dist");
  const visualAppBundlePath = join(visualDist, "app.bundle.js");
  const staleEditorBundlePath = join(visualDist, "editor.bundle.js");
  const staleEditorMapPath = join(visualDist, "editor.bundle.js.map");

  expect(existsSync(visualAppBundlePath)).toBe(true);
  expect(readFileSync(visualAppBundlePath, "utf8")).toContain("/static/mobile/dist/editor.bundle.js");
  expect(existsSync(staleEditorBundlePath)).toBe(false);
  expect(existsSync(staleEditorMapPath)).toBe(false);
}, WEB_BUILD_TEST_TIMEOUT_MS);
