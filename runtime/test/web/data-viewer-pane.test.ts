/**
 * test/web/data-viewer-pane.test.ts – Resolution tests for the data viewer pane.
 */

import { describe, expect, test } from "bun:test";

import { dataViewerPaneExtension } from "../../web/src/panes/data-viewer-pane.js";

describe("csv viewer pane", () => {
  test("claims csv and tsv files for both preview and tab contexts", () => {
    expect(dataViewerPaneExtension.canHandle?.({ path: "data/report.csv", mode: "view" } as any)).toBe(55);
    expect(dataViewerPaneExtension.canHandle?.({ path: "data/report.tsv", mode: "view" } as any)).toBe(55);
    expect(dataViewerPaneExtension.canHandle?.({ path: "data/report.csv", mode: "edit" } as any)).toBe(55);
  });

  test("does not claim non-tabular files", () => {
    expect(dataViewerPaneExtension.canHandle?.({ path: "notes/readme.md", mode: "view" } as any)).toBe(false);
  });
});
