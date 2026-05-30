#!/usr/bin/env bun
/**
 * vendor-office-viewer.ts — Vendor lightweight Office viewer JS libraries.
 *
 * Copies pre-built browser bundles from npm packages into the office-viewer
 * extension vendor directory. Generates a metadata file with versions,
 * licenses, checksums, and sizes.
 *
 * Libraries:
 *   - docx-preview  — .docx → HTML rendering
 *   - @e965/xlsx (SheetJS fork) — .xlsx/.xls/.csv parsing → HTML table
 *   - chart.js       — peer dependency for pptxviewjs chart rendering
 *   - pptxviewjs     — .pptx → canvas-based slide rendering
 *   - jszip          — peer dependency for pptxviewjs
 */

import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const PROJECT_DIR = process.cwd();
const OUTPUT_DIR = "extensions/viewers/office-viewer/vendor";
const METADATA_FILE = resolve(PROJECT_DIR, OUTPUT_DIR, "office-viewer-libs.meta.json");
const LOG_PREFIX = "[vendor:office-viewer-libs]";

function resolveInstalledPath(packagePath: string): string {
  const candidates = [
    resolve(PROJECT_DIR, packagePath),
    resolve(PROJECT_DIR, "..", packagePath),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return candidates[0];
}

interface VendorEntry {
  packageName: string;
  packagePath: string;
  outputFile: string;
}

const VENDOR_ENTRIES: VendorEntry[] = [
  {
    packageName: "docx-preview",
    packagePath: "dist/docx-preview.min.js",
    outputFile: `${OUTPUT_DIR}/docx-preview.min.js`,
  },
  {
    packageName: "@e965/xlsx",
    packagePath: "dist/xlsx.full.min.js",
    outputFile: `${OUTPUT_DIR}/xlsx.full.min.js`,
  },
  {
    packageName: "chart.js",
    packagePath: "dist/chart.umd.min.js",
    outputFile: `${OUTPUT_DIR}/chart.umd.min.js`,
  },
  {
    packageName: "pptxviewjs",
    packagePath: "dist/PptxViewJS.min.js",
    outputFile: `${OUTPUT_DIR}/PptxViewJS.min.js`,
  },
  {
    packageName: "jszip",
    packagePath: "dist/jszip.min.js",
    outputFile: `${OUTPUT_DIR}/jszip.min.js`,
  },
  {
    packageName: "@fontsource-variable/inter",
    packagePath: "files/inter-latin-wght-normal.woff2",
    outputFile: `${OUTPUT_DIR}/inter-latin.woff2`,
  },
  {
    packageName: "@fontsource-variable/inter",
    packagePath: "files/inter-latin-ext-wght-normal.woff2",
    outputFile: `${OUTPUT_DIR}/inter-latin-ext.woff2`,
  },
];

function sha256ForFile(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

interface PackageMeta {
  name: string;
  version: string;
  license: string;
  repository: string | null;
}

function readPackageMeta(packageName: string): PackageMeta {
  const pkgPath = resolveInstalledPath(`node_modules/${packageName}/package.json`);
  if (!existsSync(pkgPath)) {
    throw new Error(`${LOG_PREFIX} Package not installed: ${packageName}. Run bun install first.`);
  }
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const repo = typeof pkg.repository === "string"
    ? pkg.repository
    : pkg.repository?.url || pkg.homepage || null;
  return {
    name: pkg.name || packageName,
    version: pkg.version || "unknown",
    license: pkg.license || "unknown",
    repository: repo,
  };
}

function main(): void {
  mkdirSync(resolve(PROJECT_DIR, OUTPUT_DIR), { recursive: true });

  const outputs: Array<{
    package_name: string;
    package_path: string;
    output_file: string;
    sha256: string;
    size_bytes: number;
  }> = [];

  const packageMetas: Record<string, PackageMeta> = {};

  for (const entry of VENDOR_ENTRIES) {
    const meta = readPackageMeta(entry.packageName);
    packageMetas[entry.packageName] = meta;

    const sourcePath = resolveInstalledPath(`node_modules/${entry.packageName}/${entry.packagePath}`);
    const outputPath = resolve(PROJECT_DIR, entry.outputFile);

    if (!existsSync(sourcePath)) {
      throw new Error(
        `${LOG_PREFIX} Missing source file: ${sourcePath}\n` +
        `  Ensure ${entry.packageName} is installed and the dist file exists.`
      );
    }

    mkdirSync(dirname(outputPath), { recursive: true });
    copyFileSync(sourcePath, outputPath);

    const sha = sha256ForFile(outputPath);
    const size = readFileSync(outputPath).byteLength;
    outputs.push({
      package_name: entry.packageName,
      package_path: entry.packagePath,
      output_file: relative(PROJECT_DIR, outputPath),
      sha256: sha,
      size_bytes: size,
    });

    process.stdout.write(
      `${LOG_PREFIX} exported ${entry.packageName}@${meta.version} → ${relative(PROJECT_DIR, outputPath)} (${(size / 1024).toFixed(0)} KB)\n`
    );
  }

  const metadata = {
    manifest_id: "office-viewer-libs",
    packages: Object.fromEntries(
      Object.entries(packageMetas).map(([name, meta]) => [name, {
        version: meta.version,
        license: meta.license,
        repository: meta.repository,
      }])
    ),
    output_files: outputs,
    metadata_file: relative(PROJECT_DIR, METADATA_FILE),
    total_size_bytes: outputs.reduce((sum, o) => sum + o.size_bytes, 0),
  };

  writeFileSync(METADATA_FILE, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");

  const totalKb = (metadata.total_size_bytes / 1024).toFixed(0);
  process.stdout.write(
    `${LOG_PREFIX} vendored ${outputs.length} files (${totalKb} KB total)\n` +
    `${LOG_PREFIX} metadata: ${relative(PROJECT_DIR, METADATA_FILE)}\n`
  );
}

main();
