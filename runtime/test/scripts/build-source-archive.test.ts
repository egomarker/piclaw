import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

import { createTempWorkspace } from "../helpers.js";
import { buildSourceArchive } from "../../../scripts/release/build-source-archive.js";

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function listTar(path: string): string[] {
  const result = Bun.spawnSync(["tar", "-tzf", path], { stdout: "pipe", stderr: "pipe" });
  expect(result.exitCode, new TextDecoder().decode(result.stderr)).toBe(0);
  return new TextDecoder().decode(result.stdout).trim().split(/\r?\n/).filter(Boolean);
}

test("buildSourceArchive emits source tarball, zip, checksums, and manifest", async () => {
  const workspace = createTempWorkspace("piclaw-source-archive-test-");
  try {
    const outputDir = join(workspace.base, "release");
    const prefix = "piclaw-test-source";
    await buildSourceArchive({ outputDir, prefix, keepWorkdir: false });

    const tarPath = join(outputDir, `${prefix}.tar.gz`);
    const zipPath = join(outputDir, `${prefix}.zip`);
    const sumsPath = join(outputDir, `${prefix}.SHA256SUMS`);
    const manifestPath = join(outputDir, `${prefix}.manifest.json`);

    expect(existsSync(tarPath)).toBe(true);
    expect(existsSync(zipPath)).toBe(true);
    expect(existsSync(sumsPath)).toBe(true);
    expect(existsSync(manifestPath)).toBe(true);

    const sums = readFileSync(sumsPath, "utf8");
    expect(sums).toContain(`${sha256(tarPath)}  ${prefix}.tar.gz`);
    expect(sums).toContain(`${sha256(zipPath)}  ${prefix}.zip`);

    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    expect(manifest).toMatchObject({
      name: "piclaw-source-archive",
      prefix,
      archives: [
        { file: `${prefix}.tar.gz`, sha256: sha256(tarPath) },
        { file: `${prefix}.zip`, sha256: sha256(zipPath) },
      ],
      checksum_file: `${prefix}.SHA256SUMS`,
    });
    expect(manifest.tracked_file_count).toBeGreaterThan(100);

    const tarEntries = listTar(tarPath);
    expect(tarEntries).toContain(`${prefix}/package.json`);
    expect(tarEntries).toContain(`${prefix}/README.md`);
    expect(tarEntries.some((entry) => entry.includes("node_modules/"))).toBe(false);
    expect(tarEntries.some((entry) => entry.includes(".git/"))).toBe(false);
    expect(tarEntries.some((entry) => entry.startsWith(`${prefix}/artifacts/`))).toBe(false);
    expect(tarEntries.some((entry) => entry.startsWith(`${prefix}/runtime/generated/`))).toBe(false);
  } finally {
    workspace.cleanup();
  }
}, 30_000);
