import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

function buildGhosttyVendor() {
  return Bun.spawnSync(
    [
      "bun",
      "/workspace/piclaw/runtime/scripts/build-vendored-dependency.ts",
      "--manifest",
      "vendor-manifests/ghostty-web.json",
    ],
    {
      cwd: "/workspace/piclaw/runtime",
      stdout: "pipe",
      stderr: "pipe",
    },
  );
}

test("ghostty-web export manifest vendors js + wasm with metadata", () => {
  const proc = buildGhosttyVendor();
  if (proc.exitCode !== 0) {
    throw new Error(`${proc.stdout.toString()}\n${proc.stderr.toString()}`.trim());
  }

  const jsFile = "/workspace/piclaw/runtime/web/static/common/js/vendor/ghostty-web.js";
  const wasmFile = "/workspace/piclaw/runtime/web/static/common/js/vendor/ghostty-vt.wasm";
  const metaFile = "/workspace/piclaw/runtime/web/static/common/js/vendor/ghostty-web.meta.json";

  expect(existsSync(jsFile)).toBe(true);
  expect(existsSync(wasmFile)).toBe(true);
  expect(existsSync(metaFile)).toBe(true);

  const js = readFileSync(jsFile, "utf8");
  const meta = JSON.parse(readFileSync(metaFile, "utf8")) as {
    manifest_id: string;
    package_name: string;
    package_version: string;
    output_files: Array<{ package_path: string; output_file: string; size_bytes: number }>;
  };

  expect(meta.manifest_id).toBe("ghostty-web");
  expect(meta.package_name).toBe("ghostty-web");
  expect(meta.package_version).toBe("0.9.3");
  expect(meta.output_files.length).toBe(2);
  expect(meta.output_files.some((file) => file.package_path === "dist/ghostty-web.js")).toBe(true);
  expect(meta.output_files.some((file) => file.package_path === "dist/ghostty-vt.wasm")).toBe(true);
  expect(js).toContain("ghostty-vt.wasm");
  expect(js).toContain("FitAddon");
});
