import { expect, test } from "bun:test";
import { gunzipSync } from "bun";

import { serveStatic } from "../../../src/channels/web/http/static.js";

function notFound(): Response {
  return new Response("not found", { status: 404 });
}

test("serveStatic gzip-compresses compressible assets when requested", async () => {
  const req = new Request("https://example.test/static/classic/dist/app.bundle.css", {
    headers: { "Accept-Encoding": "gzip" },
  });

  const response = await serveStatic("classic/dist/app.bundle.css", notFound, req);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Encoding")).toBe("gzip");
  expect(response.headers.get("Vary")).toBe("Accept-Encoding");
  expect(response.headers.get("Content-Type")).toContain("text/css");

  const compressed = new Uint8Array(await response.arrayBuffer());
  const text = new TextDecoder().decode(gunzipSync(Buffer.from(compressed)));
  expect(text).toContain(":root");
});

test("serveStatic falls back to runtime gzip when brotli is accepted but no sidecar exists", async () => {
  const req = new Request("https://example.test/static/classic/dist/app.bundle.css", {
    headers: { "Accept-Encoding": "br, gzip" },
  });

  const response = await serveStatic("classic/dist/app.bundle.css", notFound, req);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Encoding")).toBe("gzip");
});

test("serveStatic gzip-compresses wasm assets when requested", async () => {
  const req = new Request("https://example.test/static/common/js/vendor/ghostty-vt.wasm", {
    headers: { "Accept-Encoding": "gzip" },
  });

  const response = await serveStatic("common/js/vendor/ghostty-vt.wasm", notFound, req);

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
  const response = await serveStatic("classic/dist/app.bundle.css", notFound);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Encoding")).toBeNull();
  expect(response.headers.get("Vary")).toBe("Accept-Encoding");
});
