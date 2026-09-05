import { expect, test } from "bun:test";
import { gunzipSync } from "bun";

import {
  resolveStaticCompatibilityPath,
  serveStatic,
} from "../../../src/channels/web/http/static.js";

function notFound(): Response {
  return new Response("not found", { status: 404 });
}

test("serveStatic renders the Mobile shell marker", async () => {
  const response = await serveStatic("mobile/index.html", notFound);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toContain("text/html");
  expect(response.headers.get("Cache-Control")).toContain("no-cache");
  const html = await response.text();
  expect(html).toContain('data-piclaw-ui="mobile"');
  expect(html).toContain('/static/mobile/dist/app.bundle.css');
  expect(html).toContain('/static/mobile/dist/app.bundle.js');
});

test("serveStatic no longer serves Classic or Visual shells", async () => {
  for (const path of ["classic/index.html", "visual/index.html", "visual/dist/app.bundle.js", "classic/css/base.css"]) {
    expect((await serveStatic(path, notFound)).status).toBe(404);
  }
});

test("serveStatic maps legacy Classic dist URLs to canonical Mobile assets", async () => {
  expect(resolveStaticCompatibilityPath("classic/dist/editor.bundle.js")).toBe("mobile/dist/editor.bundle.js");
  expect(resolveStaticCompatibilityPath("mobile/dist/editor.bundle.js")).toBe("mobile/dist/editor.bundle.js");
  const editor = await serveStatic("classic/dist/editor.bundle.js", notFound);
  expect(editor.status).toBe(200);
  expect(await editor.text()).toBe(await (await serveStatic("mobile/dist/editor.bundle.js", notFound)).text());
  expect((await serveStatic("classic/dist/../../../../package.json", notFound)).status).toBe(404);

  const legacy = await serveStatic("classic/dist/app.bundle.css", notFound);
  const canonical = await serveStatic("mobile/dist/app.bundle.css", notFound);

  expect(legacy.status).toBe(200);
  expect(legacy.headers.get("Cache-Control")).toContain("no-cache");
  expect(await legacy.text()).toBe(await canonical.text());
});

test("serveStatic gzip-compresses compressible assets when requested", async () => {
  const req = new Request("https://example.test/static/mobile/dist/app.bundle.css", {
    headers: { "Accept-Encoding": "gzip" },
  });

  const response = await serveStatic("mobile/dist/app.bundle.css", notFound, req);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Encoding")).toBe("gzip");
  expect(response.headers.get("Vary")).toBe("Accept-Encoding");
  expect(response.headers.get("Content-Type")).toContain("text/css");

  const compressed = new Uint8Array(await response.arrayBuffer());
  const text = new TextDecoder().decode(gunzipSync(Buffer.from(compressed)));
  expect(text).toContain(":root");
});

test("serveStatic falls back to runtime gzip when brotli is accepted but no sidecar exists", async () => {
  const req = new Request("https://example.test/static/mobile/dist/app.bundle.css", {
    headers: { "Accept-Encoding": "br, gzip" },
  });

  const response = await serveStatic("mobile/dist/app.bundle.css", notFound, req);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Encoding")).toBe("gzip");
});

test("serveStatic serves vendored ESM modules with a JavaScript MIME type", async () => {
  const response = await serveStatic("common/js/vendor/xterm/xterm.mjs", notFound);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Encoding")).toBeNull();
  expect(response.headers.get("Content-Type")).toBe("text/javascript; charset=utf-8");
  expect(response.headers.get("Vary")).toBe("Accept-Encoding");
});

test("serveStatic gzip-compresses wasm assets when requested", async () => {
  const req = new Request("https://example.test/static/common/js/vendor/remote-display-decoder.wasm", {
    headers: { "Accept-Encoding": "gzip" },
  });

  const response = await serveStatic("common/js/vendor/remote-display-decoder.wasm", notFound, req);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Encoding")).toBe("gzip");
  expect(response.headers.get("Vary")).toBe("Accept-Encoding");
  expect(response.headers.get("Content-Type")).toBe("application/wasm");

  const compressed = new Uint8Array(await response.arrayBuffer());
  const wasm = new Uint8Array(gunzipSync(Buffer.from(compressed)));
  expect(Array.from(wasm.slice(0, 4))).toEqual([0x00, 0x61, 0x73, 0x6d]);
});

test("serveStatic leaves already-compressed assets unencoded", async () => {
  const req = new Request("https://example.test/static/favicon.ico", {
    headers: { "Accept-Encoding": "gzip" },
  });

  const response = await serveStatic("favicon.ico", notFound, req);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Encoding")).toBeNull();
  expect(response.headers.get("Vary")).toBeNull();
});

test("serveStatic adds Vary for compressible assets even without compression", async () => {
  const response = await serveStatic("mobile/dist/app.bundle.css", notFound);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Encoding")).toBeNull();
  expect(response.headers.get("Vary")).toBe("Accept-Encoding");
});
