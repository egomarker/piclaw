/**
 * test/web/video-viewer-pane.test.ts – Resolution tests for the video viewer pane.
 */

import { describe, expect, test } from "bun:test";

import { videoViewerPaneExtension } from "../../web/src/panes/video-viewer-pane.js";

describe("video viewer pane", () => {
  test("claims common video files for both preview and tab contexts", () => {
    expect(videoViewerPaneExtension.canHandle?.({ path: "media/demo.mp4", mode: "view" } as any)).toBe(54);
    expect(videoViewerPaneExtension.canHandle?.({ path: "media/demo.MP4", mode: "view" } as any)).toBe(54);
    expect(videoViewerPaneExtension.canHandle?.({ path: "media/demo.webm", mode: "view" } as any)).toBe(54);
    expect(videoViewerPaneExtension.canHandle?.({ path: "media/demo.mov", mode: "edit" } as any)).toBe(54);
  });

  test("does not claim non-video files", () => {
    expect(videoViewerPaneExtension.canHandle?.({ path: "notes/readme.md", mode: "view" } as any)).toBe(false);
    expect(videoViewerPaneExtension.canHandle?.({ path: "images/photo.png", mode: "view" } as any)).toBe(false);
  });
});
