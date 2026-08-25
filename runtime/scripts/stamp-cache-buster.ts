/**
 * scripts/stamp-cache-buster.ts
 *
 * Replaces all `?v=<digits|hex>` cache-buster query strings in index.html
 * with a content-derived hash of the app bundle files.  This guarantees
 * the buster changes if and only if the bundle content changes, regardless
 * of build timestamps or git operations on index.html.
 *
 * Also stamps the vendor importmap URL with a content-hash so browser
 * caches bust when the vendor bundle changes.
 *
 * Run automatically at the end of `build:web`.
 */

import { createHash } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const INDEXES = [
  resolve(import.meta.dir, "../web/static/classic/index.html"),
  resolve(import.meta.dir, "../web/static/mobile/index.html"),
];
const APP_DIST = resolve(import.meta.dir, "../web/static/mobile/dist");
const COMMON_DIST = resolve(import.meta.dir, "../web/static/common/dist");

// Build a content hash from the main bundle files so the stamp is
// deterministic and tied to actual content, not wall-clock time.
function computeBundleContentHash(): string {
  const bundleFiles = [
    resolve(APP_DIST, "app.bundle.js"),
    resolve(APP_DIST, "app.bundle.css"),
    resolve(APP_DIST, "editor.bundle.js"),
    resolve(COMMON_DIST, "login.bundle.js"),
    resolve(COMMON_DIST, "login.bundle.css"),
  ];
  const hash = createHash("sha256");
  for (const file of bundleFiles) {
    try {
      hash.update(readFileSync(file));
    } catch (e) {
      // File may not exist in minimal builds; skip but log if unexpected.
      if (existsSync(file)) {
        console.warn(`[cache-buster] failed to read ${file}: ${e instanceof Error ? e.message : e}`);
      }
    }
  }
  return hash.digest("hex").slice(0, 12);
}

const stamp = computeBundleContentHash();

// Use the vendor bundle's sha256 prefix from the metadata file when available,
// falling back to the app bundle stamp.
const VENDOR_META = resolve(import.meta.dir, "../extensions/viewers/editor/vendor/codemirror.meta.json");
let vendorStamp = stamp;
try {
  if (existsSync(VENDOR_META)) {
    const meta = JSON.parse(readFileSync(VENDOR_META, "utf-8"));
    if (meta.sha256) vendorStamp = meta.sha256.slice(0, 12);
  }
} catch (e) {
  console.warn(`[cache-buster] failed to read vendor metadata: ${e instanceof Error ? e.message : e}`);
}

for (const indexPath of INDEXES) {
  const original = readFileSync(indexPath, "utf-8");
  let html = original;

  // Stamp static bundle references and the shared CodeMirror import map.
  html = html.replace(/\?v=(?:[\da-f]+|__APP_ASSET_VERSION__)/g, `?v=${stamp}`);
  html = html.replace(
    /(\/editor-vendor\/codemirror\.js)(\?v=[^"]*)?/g,
    `$1?v=${vendorStamp}`,
  );

  if (html !== original) {
    writeFileSync(indexPath, html, "utf-8");
    console.log(`[cache-buster] stamped ${indexPath} → v=${stamp}, vendor=${vendorStamp}`);
  } else {
    console.log(`[cache-buster] no tokens changed in ${indexPath}`);
  }
}
