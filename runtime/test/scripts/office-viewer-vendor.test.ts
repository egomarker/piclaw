import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

const vendorDir = resolve(import.meta.dir, "../../extensions/viewers/office-viewer/vendor");

test("office viewer vendors a compatible docx-preview UMD API", () => {
  const context: Record<string, unknown> = {
    console,
    setTimeout,
    clearTimeout,
    TextDecoder,
    TextEncoder,
    Uint8Array,
    ArrayBuffer,
    Blob,
    URL,
  };
  context.globalThis = context;
  context.self = context;
  context.window = context;

  vm.runInNewContext(readFileSync(resolve(vendorDir, "jszip.min.js"), "utf8"), context, { filename: "jszip.min.js" });
  vm.runInNewContext(readFileSync(resolve(vendorDir, "docx-preview.min.js"), "utf8"), context, { filename: "docx-preview.min.js" });

  expect(typeof (context.JSZip as { loadAsync?: unknown })?.loadAsync).toBe("function");
  expect(typeof (context.docx as { renderAsync?: unknown })?.renderAsync).toBe("function");
  expect(typeof (context.docx as { parseAsync?: unknown })?.parseAsync).toBe("function");
});
