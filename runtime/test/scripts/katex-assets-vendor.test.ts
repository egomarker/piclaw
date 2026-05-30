import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

function buildKatexAssets() {
  return Bun.spawnSync(
    ["bun", "/workspace/piclaw/runtime/scripts/vendor-katex-css-fonts.ts"],
    {
      cwd: "/workspace/piclaw/runtime",
      stdout: "pipe",
      stderr: "pipe",
    },
  );
}

test("katex asset workflow vendors rewritten CSS + woff2 fonts with provenance metadata", () => {
  const proc = buildKatexAssets();
  if (proc.exitCode !== 0) {
    throw new Error(`${proc.stdout.toString()}\n${proc.stderr.toString()}`.trim());
  }

  const cssFile = "/workspace/piclaw/runtime/web/src/styles/katex.bundle.css";
  const metaFile = "/workspace/piclaw/runtime/web/src/styles/katex.bundle.meta.json";
  const mainFontFile = "/workspace/piclaw/runtime/web/static/common/fonts/KaTeX_Main-Regular.woff2";
  const sizeFontFile = "/workspace/piclaw/runtime/web/static/common/fonts/KaTeX_Size4-Regular.woff2";

  expect(existsSync(cssFile)).toBe(true);
  expect(existsSync(metaFile)).toBe(true);
  expect(existsSync(mainFontFile)).toBe(true);
  expect(existsSync(sizeFontFile)).toBe(true);

  const css = readFileSync(cssFile, "utf8");
  const meta = JSON.parse(readFileSync(metaFile, "utf8")) as {
    manifest_id: string;
    workflow: string;
    package_name: string;
    package_version: string;
    output_files: Array<{ output_file: string; package_path: string; transform?: string }>;
    font_count: number;
  };
  const katexPackage = JSON.parse(
    readFileSync("/workspace/piclaw/node_modules/katex/package.json", "utf8"),
  ) as { version: string };

  expect(meta.manifest_id).toBe("katex-css-fonts");
  expect(meta.workflow).toBe("parallel-static-asset-workflow");
  expect(meta.package_name).toBe("katex");
  expect(meta.package_version).toBe(katexPackage.version);
  expect(meta.font_count).toBe(20);
  expect(meta.output_files[0]?.output_file).toBe("web/src/styles/katex.bundle.css");
  expect(meta.output_files[0]?.transform).toBe("rewrite-font-urls-to-static-woff2-only");
  expect(meta.output_files.some((file) => file.package_path === "dist/fonts/KaTeX_Main-Regular.woff2")).toBe(true);
  expect(meta.output_files.some((file) => file.package_path === "dist/fonts/KaTeX_Size4-Regular.woff2")).toBe(true);

  expect(css).toContain(`.katex .katex-version:after{content:"${katexPackage.version}"}`);
  expect(css).toContain("url(../../static/common/fonts/KaTeX_Main-Regular.woff2) format(\"woff2\")");
  expect(css).not.toContain("url(fonts/");
  expect(css).not.toContain('.woff) format("woff")');
  expect(css).not.toContain('.ttf) format("truetype")');
});
