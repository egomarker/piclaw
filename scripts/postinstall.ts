#!/usr/bin/env bun
/**
 * postinstall.ts — Run after `bun add -g github:rcarmo/piclaw`.
 *
 * Only uses bun and node:* builtins — no devDependencies required.
 */

import { resolve, dirname } from "node:path";

const ROOT = dirname(import.meta.dir);
const LOG = "[postinstall]";

// ── CodeMirror singleton enforcement ─────────────────────────────────────────
// Bun can install duplicate nested copies of core CodeMirror packages.
// Multiple instances of @codemirror/state break `instanceof` checks at runtime,
// producing "Unrecognized extension value in extension set" errors.
// Remove any nested duplicates so every package resolves to the single root copy.
const CM_SINGLETONS = ["@codemirror/commands", "@codemirror/state", "@codemirror/view", "@codemirror/language"];
const nodeModules = resolve(ROOT, "node_modules");

import { readdirSync, rmSync, existsSync } from "node:fs";

function removeNestedCmDuplicates(pkg: string): number {
  // Find every nested node_modules/@codemirror/state (etc.) that is NOT the
  // root node_modules/<pkg>.  We only look one level deep inside each package
  // directory — the pattern is always:
  //   node_modules/<scope>/<name>/node_modules/<pkg>
  let removed = 0;
  const segments = pkg.split("/");
  const rootPkg = resolve(nodeModules, ...segments);
  // Scan all directories that could contain a nested node_modules
  const scanDirs: string[] = [];
  try {
    for (const entry of readdirSync(nodeModules, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const full = resolve(nodeModules, entry.name);
      if (entry.name.startsWith("@")) {
        // Scoped: look inside each sub-package
        try {
          for (const sub of readdirSync(full, { withFileTypes: true })) {
            if (sub.isDirectory()) scanDirs.push(resolve(full, sub.name));
          }
        } catch { /* ignore */ }
      } else {
        scanDirs.push(full);
      }
    }
  } catch { /* ignore */ }
  for (const dir of scanDirs) {
    const nested = resolve(dir, "node_modules", ...segments);
    if (nested === rootPkg) continue;
    if (existsSync(resolve(nested, "package.json"))) {
      try {
        rmSync(nested, { recursive: true, force: true });
        removed++;
      } catch { /* best-effort */ }
    }
  }
  return removed;
}

let cmDupsRemoved = 0;
for (const pkg of CM_SINGLETONS) {
  cmDupsRemoved += removeNestedCmDuplicates(pkg);
}
if (cmDupsRemoved > 0) {
  console.log(`${LOG} Removed ${cmDupsRemoved} nested CodeMirror duplicate(s) to enforce singleton instances`);
}

console.log(`${LOG} Done`);
