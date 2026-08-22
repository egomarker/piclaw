import { describe, expect, test } from "bun:test";
import "../../helpers.js";
import {
  generatePdfViewerPage,
  handlePdfViewerRoute,
} from "../../../src/channels/web/http/pdf-viewer-route.js";

describe("PDF viewer route", () => {
  test("keeps the native PDF object for desktop and lazy-loads PDF.js for mobile", async () => {
    const response = handlePdfViewerRoute(
      new Request("http://localhost/pdf-viewer/?path=docs/example.pdf"),
      "/pdf-viewer/",
    );

    expect(response).not.toBeNull();
    expect(response?.status).toBe(200);
    const body = await response!.text();

    expect(body).toContain("document.createElement('object')");
    expect(body).toContain("document.body.dataset.pdfRenderer = 'native'");
    expect(body).toContain("shouldUsePdfJs()");
    expect(body).toContain("/static/common/pdfjs/pdf_viewer.css?v=6.2.108-piclaw2");
    expect(body).toContain("/static/common/dist/pdf-viewer-mobile.bundle.js?v=6.2.108-piclaw2");
    expect(body).toContain("mountMobilePdfViewer({ sourceUrl: sourceUrl, name: name })");
    expect(body).not.toContain("app.bundle.js");
  });

  test("detects mobile browsers, iPad desktop UA, and touch-first installed PWAs", () => {
    const body = generatePdfViewerPage();

    expect(body).toContain("Android|webOS|iPhone|iPod");
    expect(body).toContain("navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1");
    expect(body).toContain("(display-mode: standalone)");
    expect(body).toContain("(pointer: coarse)");
    expect(body).toContain("override === 'pdfjs'");
    expect(body).toContain("override === 'native'");
  });

  test("installs collection upsert compatibility before loading PDF.js", () => {
    const body = generatePdfViewerPage();

    expect(body).toContain("installPdfJsCompatibility()");
    expect(body).toContain("installCollectionUpsertCompatibility(Map)");
    expect(body).toContain("installCollectionUpsertCompatibility(WeakMap)");
    expect(body).toContain("getOrInsertComputed");
    expect(body).toContain("callbackfn must be callable");
    expect(body).toContain("This browser could not initialize PDF compatibility support.");
  });

  test("allows same-origin PDF.js worker, WASM, and resource fetches in CSP", () => {
    const response = handlePdfViewerRoute(
      new Request("http://localhost/pdf-viewer/?path=docs/example.pdf"),
      "/pdf-viewer/",
    );
    const csp = response?.headers.get("content-security-policy") || "";

    expect(csp).toContain("script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'");
    expect(csp).toContain("worker-src 'self' blob:");
    expect(csp).toContain("connect-src 'self' blob:");
    expect(csp).toContain("object-src 'self' blob:");
    expect(csp).toContain("frame-ancestors 'self'");
  });

  test("returns a bodyless response for HEAD", async () => {
    const response = handlePdfViewerRoute(
      new Request("http://localhost/pdf-viewer/?path=docs/example.pdf", { method: "HEAD" }),
      "/pdf-viewer/",
    );

    expect(response?.status).toBe(200);
    expect(await response!.text()).toBe("");
  });

  test("rejects unsupported methods and nested paths", () => {
    const post = handlePdfViewerRoute(
      new Request("http://localhost/pdf-viewer/", { method: "POST" }),
      "/pdf-viewer/",
    );
    const nested = handlePdfViewerRoute(
      new Request("http://localhost/pdf-viewer/unknown"),
      "/pdf-viewer/unknown",
    );

    expect(post?.status).toBe(405);
    expect(nested?.status).toBe(404);
  });

  test("renders missing-source state without embedding request data server-side", () => {
    const body = generatePdfViewerPage();

    expect(body).toContain("Missing ?path=… or ?media=… query parameter.");
    expect(body).toContain("encodeURIComponent(path)");
    expect(body).toContain("/^\\d+$/.test(media)");
  });
});
