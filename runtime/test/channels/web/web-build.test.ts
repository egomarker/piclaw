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

const WEB_BUILD_TEST_TIMEOUT_MS = 45_000;

function projectRoot(): string {
  return join(import.meta.dir, "..", "..", "..");
}

test("build:web produces bundle assets", async () => {
  const root = projectRoot();
  const proc = Bun.spawn(["bun", "run", "build:web"], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });

  const exitCode = await proc.exited;
  expect(exitCode).toBe(0);

  const appBundlePath = join(root, "web", "static", "classic", "dist", "app.bundle.js");
  const appMapPath = join(root, "web", "static", "classic", "dist", "app.bundle.js.map");
  const appCssPath = join(root, "web", "static", "classic", "dist", "app.bundle.css");

  const loginBundlePath = join(root, "web", "static", "common", "dist", "login.bundle.js");
  const loginMapPath = join(root, "web", "static", "common", "dist", "login.bundle.js.map");
  const loginCssPath = join(root, "web", "static", "common", "dist", "login.bundle.css");
  const pdfViewerBundlePath = join(root, "web", "static", "common", "dist", "pdf-viewer-mobile.bundle.js");
  const pdfViewerMapPath = join(root, "web", "static", "common", "dist", "pdf-viewer-mobile.bundle.js.map");
  const pdfWorkerBundlePath = join(root, "web", "static", "common", "dist", "pdf-viewer-worker.bundle.js");
  const pdfWorkerMapPath = join(root, "web", "static", "common", "dist", "pdf-viewer-worker.bundle.js.map");
  const pdfViewerCssPath = join(root, "web", "static", "common", "pdfjs", "pdf_viewer.css");
  const pdfAssetsMetadataPath = join(root, "web", "static", "common", "pdfjs", "pdfjs-assets.meta.json");

  const editorBundlePath = join(root, "web", "static", "classic", "dist", "editor.bundle.js");
  const editorMapPath = join(root, "web", "static", "classic", "dist", "editor.bundle.js.map");

  expect(existsSync(appBundlePath)).toBe(true);
  expect(existsSync(appMapPath)).toBe(true);
  expect(existsSync(appCssPath)).toBe(true);

  expect(existsSync(loginBundlePath)).toBe(true);
  expect(existsSync(loginMapPath)).toBe(true);
  expect(existsSync(loginCssPath)).toBe(true);
  expect(existsSync(pdfViewerBundlePath)).toBe(true);
  expect(existsSync(pdfViewerMapPath)).toBe(true);
  expect(existsSync(pdfWorkerBundlePath)).toBe(true);
  expect(existsSync(pdfWorkerMapPath)).toBe(true);
  expect(existsSync(pdfViewerCssPath)).toBe(true);
  expect(existsSync(pdfAssetsMetadataPath)).toBe(true);

  expect(existsSync(editorBundlePath)).toBe(true);
  expect(existsSync(editorMapPath)).toBe(true);

  const appBundle = readFileSync(appBundlePath, "utf8");
  const editorBundle = readFileSync(editorBundlePath, "utf8");
  const pdfViewerBundle = readFileSync(pdfViewerBundlePath, "utf8");
  const pdfWorkerBundle = readFileSync(pdfWorkerBundlePath, "utf8");
  const pdfAssetsMetadata = JSON.parse(readFileSync(pdfAssetsMetadataPath, "utf8"));
  expect(appBundle).toContain('#editor-vendor/codemirror');
  expect(appBundle).not.toContain("mountMobilePdfViewer");
  expect(appBundle).not.toContain("WorkerMessageHandler");
  expect(editorBundle).toContain('#editor-vendor/codemirror');
  expect(pdfViewerBundle).toContain("mountMobilePdfViewer");
  expect(pdfWorkerBundle).toContain("WorkerMessageHandler");
  expect(pdfAssetsMetadata.package.version).toBe("6.2.108");

  expect(statSync(appBundlePath).size).toBeLessThan(1_500_000);
  expect(statSync(editorBundlePath).size).toBeLessThan(500_000);
  expect(statSync(pdfViewerBundlePath).size).toBeLessThan(1_000_000);
  expect(statSync(pdfWorkerBundlePath).size).toBeLessThan(2_000_000);
}, WEB_BUILD_TEST_TIMEOUT_MS);
