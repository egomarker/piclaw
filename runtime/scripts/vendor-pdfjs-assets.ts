#!/usr/bin/env bun
/**
 * vendor-pdfjs-assets.ts — Copy PDF.js browser resources into Piclaw static assets.
 *
 * PDF.js loads CMaps, standard fonts, ICC profiles, WASM decoders, and viewer
 * images at runtime. Keep those resources same-origin so authenticated mobile
 * browser and PWA previews never depend on a third-party CDN.
 */

import { createHash } from "node:crypto";
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, relative, resolve } from "node:path";

const PROJECT_DIR = process.cwd();
const OUTPUT_DIR = resolve(PROJECT_DIR, "web/static/common/pdfjs");
const LOG_PREFIX = "[vendor:pdfjs-assets]";
const TEXT_ASSET_EXTENSIONS = new Set([".css", ".js", ".json", ".svg", ".txt"]);

function resolvePackageDir(): string {
  const candidates = [
    resolve(PROJECT_DIR, "node_modules/pdfjs-dist"),
    resolve(PROJECT_DIR, "../node_modules/pdfjs-dist"),
  ];
  const packageDir = candidates.find((candidate) => existsSync(resolve(candidate, "package.json")));
  if (!packageDir) {
    throw new Error(`${LOG_PREFIX} pdfjs-dist is not installed. Run bun install first.`);
  }
  return packageDir;
}

function listFiles(root: string): string[] {
  const files: string[] = [];
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile()) files.push(path);
    }
  };
  visit(root);
  return files.sort((a, b) => a.localeCompare(b));
}

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function normalizeVendoredText(path: string): void {
  if (!TEXT_ASSET_EXTENSIONS.has(extname(path)) && !basename(path).startsWith("LICENSE")) return;
  const source = readFileSync(path, "utf8");
  const normalized = source.replace(/[\t ]+$/gm, "").replace(/\n*$/, "\n");
  if (normalized !== source) writeFileSync(path, normalized, "utf8");
}

function main(): void {
  const packageDir = resolvePackageDir();
  const packageJson = JSON.parse(readFileSync(resolve(packageDir, "package.json"), "utf8"));
  const sources = [
    ["cmaps", "cmaps"],
    ["iccs", "iccs"],
    ["standard_fonts", "standard_fonts"],
    ["wasm", "wasm"],
    ["web/images", "images"],
  ] as const;

  rmSync(OUTPUT_DIR, { recursive: true, force: true });
  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const [source, destination] of sources) {
    const sourcePath = resolve(packageDir, source);
    if (!existsSync(sourcePath)) {
      throw new Error(`${LOG_PREFIX} Missing pdfjs-dist resource directory: ${source}`);
    }
    cpSync(sourcePath, resolve(OUTPUT_DIR, destination), { recursive: true });
  }

  const viewerCss = resolve(packageDir, "web/pdf_viewer.css");
  const license = resolve(packageDir, "LICENSE");
  mkdirSync(dirname(resolve(OUTPUT_DIR, "pdf_viewer.css")), { recursive: true });
  copyFileSync(viewerCss, resolve(OUTPUT_DIR, "pdf_viewer.css"));
  copyFileSync(license, resolve(OUTPUT_DIR, "LICENSE"));

  for (const path of listFiles(OUTPUT_DIR)) normalizeVendoredText(path);

  const outputFiles = listFiles(OUTPUT_DIR).map((path) => ({
    path: relative(PROJECT_DIR, path),
    size_bytes: statSync(path).size,
    sha256: sha256(path),
  }));

  const metadata = {
    manifest_id: "pdfjs-mobile-viewer-assets",
    package: {
      name: packageJson.name,
      version: packageJson.version,
      license: packageJson.license,
      repository: typeof packageJson.repository === "string"
        ? packageJson.repository
        : packageJson.repository?.url || null,
    },
    output_files: outputFiles,
    total_size_bytes: outputFiles.reduce((sum, file) => sum + file.size_bytes, 0),
  };

  writeFileSync(
    resolve(OUTPUT_DIR, "pdfjs-assets.meta.json"),
    `${JSON.stringify(metadata, null, 2)}\n`,
    "utf8",
  );

  process.stdout.write(
    `${LOG_PREFIX} copied pdfjs-dist@${packageJson.version}: ` +
    `${outputFiles.length} files, ${(metadata.total_size_bytes / 1024 / 1024).toFixed(2)} MiB\n`,
  );
}

main();
