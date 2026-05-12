/**
 * editor-vendor-route.ts — Serves editor vendor assets via the extension-route registry.
 *
 * This lets the browser-side editor bundle import CodeMirror directly from
 * /editor-vendor/* without baking the large vendor payload into classic/dist.
 *
 * Registered as a side effect when imported by request-router-service.ts.
 */

import { dirname, extname, resolve } from "node:path";
import { existsSync, realpathSync, statSync } from "node:fs";
import { registerExtensionRoute } from "./extension-routes.js";
import { isRealPathWithin } from "../../../utils/path-safety.js";

const EXT_DIR = resolve(
  process.env.PICLAW_RUNTIME_ROOT || resolve(import.meta.dir, "..", "..", "..", ".."),
  "extensions",
  "viewers",
  "editor",
);
const VENDOR_DIR = resolve(EXT_DIR, "vendor");
const ROUTE_PREFIX = "/editor-vendor";

const MIME_TYPES: Record<string, string> = {
  ".js": "application/javascript; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

function getMimeType(filePath: string): string {
  return MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream";
}

function handleEditorVendorRoute(req: Request, pathname: string): Response | null {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let relative = pathname.replace(/^\/editor-vendor\/?/, "") || "codemirror.js";
  const queryIndex = relative.indexOf("?");
  if (queryIndex >= 0) relative = relative.slice(0, queryIndex);

  if (relative.includes("..") || relative.startsWith("/")) {
    return new Response("Forbidden", { status: 403 });
  }

  const filePath = resolve(VENDOR_DIR, relative);

  let realPath: string;
  try {
    realPath = realpathSync(filePath);
  } catch {
    return new Response("Not Found", { status: 404 });
  }

  const realVendorDir = realpathSync(VENDOR_DIR);
  if (!isRealPathWithin(realVendorDir, realPath)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!existsSync(realPath)) {
    return new Response("Not Found", { status: 404 });
  }

  const stat = statSync(realPath);
  if (!stat.isFile()) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(req.method === "HEAD" ? null : Bun.file(realPath), {
    status: 200,
    headers: {
      "Content-Type": getMimeType(realPath),
      "Content-Length": String(stat.size),
      "Cache-Control": "public, max-age=300",
    },
  });
}

registerExtensionRoute(ROUTE_PREFIX, handleEditorVendorRoute, dirname(VENDOR_DIR));
