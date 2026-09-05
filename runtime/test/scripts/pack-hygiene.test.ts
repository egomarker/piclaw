import { describe, expect, test } from "bun:test";
import {
  REQUIRED_PACK_ENTRIES,
  extractPackedFiles,
  findBlockedPackEntries,
  findMissingRequiredPackEntries,
} from "../../scripts/pack-hygiene.ts";

describe("pack-hygiene", () => {
  test("extractPackedFiles parses bun pack output", () => {
    const output = [
      "packed 2.96KB package.json",
      "packed 4.27KB docs/tool-context-optimizations.md",
      "packed 1.00KB src/index.ts",
      "",
    ].join("\n");

    expect(extractPackedFiles(output)).toEqual([
      "package.json",
      "docs/tool-context-optimizations.md",
      "src/index.ts",
    ]);
  });

  test("findBlockedPackEntries flags blocked prefixes", () => {
    const files = [
      "src/index.ts",
      "test/remote/ssrf.test.ts",
      "coverage/lcov.info",
      "runtime/generated/dist/runtime.js",
      "runtime/generated/coverage/lcov.info",
    ];

    expect(findBlockedPackEntries(files)).toEqual([
      "test/remote/ssrf.test.ts",
      "coverage/lcov.info",
      "runtime/generated/dist/runtime.js",
      "runtime/generated/coverage/lcov.info",
    ]);
  });

  test("findBlockedPackEntries allows runtime files", () => {
    const files = ["src/index.ts", "runtime/web/static/mobile/index.html", "docs/architecture.md"];
    expect(findBlockedPackEntries(files)).toEqual([]);
  });

  test("rejects all retired shell assets, including stale compressed copies", () => {
    const retired = [
      "runtime/web/static/classic/index.html",
      "runtime/web/static/classic/dist/app.bundle.js.gz",
      "runtime/web/static/visual/index.html",
      "runtime/web/static/visual/dist/app.bundle.js.br",
      "runtime/web/static/visual/frontend/src/App.tsx",
    ];
    expect(findBlockedPackEntries([...retired, "runtime/web/static/mobile/index.html"])).toEqual(retired);
  });

  test("detects required shell and dream-memory seed entries missing from the package", () => {
    const [firstRequired] = REQUIRED_PACK_ENTRIES;
    const files = REQUIRED_PACK_ENTRIES.filter((entry) => entry !== firstRequired);

    expect(findMissingRequiredPackEntries(files)).toEqual([firstRequired]);
  });

  test("findMissingRequiredPackEntries accepts a complete required runtime set", () => {
    expect(findMissingRequiredPackEntries([...REQUIRED_PACK_ENTRIES])).toEqual([]);
  });
});
