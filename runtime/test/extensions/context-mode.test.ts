import { describe, expect, test } from "bun:test";
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { createFakeExtensionApi } from "./fake-extension-api.js";
import { importFresh, withTempWorkspaceEnv } from "../helpers.js";

describe("context-mode integration", () => {
  test("stores large bash outputs from fullOutputPath and points agents to search_tool_output", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", {
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }, async (workspace) => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      expect(fake.tools.has("search_tool_output")).toBe(true);
      expect(fake.tools.has("exec_batch")).toBe(true);
      expect(fake.tools.has("tool_output_search")).toBe(false);

      const fullOutputPath = join(workspace.workspace, "full-output.log");
      writeFileSync(fullOutputPath, "header\nneedle line from file\nfooter\n", "utf8");

      const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
      expect(typeof toolResult).toBe("function");

      const result = await toolResult?.({
        toolName: "bash",
        content: [{ type: "text", text: "short inline preview" }],
        details: { fullOutputPath },
        input: { command: "cat full-output.log" },
        isError: false,
        toolCallId: "tool-1",
        type: "tool_result",
      });

      expect(result?.content?.[0]?.text).toContain("Output stored as tool-output:");
      expect(result?.content?.[0]?.text).toContain("search_tool_output");
      expect(result?.content?.[0]?.text).not.toContain("tool_output_search");
      expect(result?.details?.storedOutputId).toBeTruthy();
      expect(result?.details?.storedOutputPath).toBeTruthy();
      expect(result?.details?.storedOutputSource).toContain("bash:");

      const searchTool = fake.tools.get("search_tool_output");
      const searchResult = await searchTool.execute("tool-2", {
        handle: result.details.storedOutputId,
        query: "needle",
      });

      expect(searchResult.content[0].text).toContain('Matches for "needle"');
      expect(searchResult.content[0].text).toContain("[needle] line from file");
    });
  }, 15_000);

  test("stores large non-bash text tool results", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", {
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "16",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }, async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
      const result = await toolResult?.({
        toolName: "proxmox",
        content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        details: {},
        isError: false,
        toolCallId: "tool-2",
        type: "tool_result",
      });

      expect(result?.content?.[0]?.text).toContain("Output stored as tool-output:");
      expect(result?.details?.storedOutputId).toBeTruthy();
      expect(result?.details?.storedOutputSource).toBe("tool:proxmox");
    });
  });

  test("does not re-store outputs that already carry stored-output details", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", {
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }, async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
      const result = await toolResult?.({
        toolName: "bash",
        content: [{ type: "text", text: "already summarized" }],
        details: { storedOutputId: "out_existing", storedOutputPath: "/tmp/existing.log" },
        input: { command: "echo hi" },
        isError: false,
        toolCallId: "tool-3",
        type: "tool_result",
      });

      expect(result).toBeUndefined();

      const addonStyleResult = await toolResult?.({
        toolName: "proxmox",
        content: [{ type: "text", text: "already summarized" }],
        details: {
          response_tool_output: {
            id: "out_existing_2",
            path: "/tmp/existing-2.log",
          },
        },
        isError: false,
        toolCallId: "tool-3b",
        type: "tool_result",
      });

      expect(addonStyleResult).toBeUndefined();
    });
  });

  test("skips image-heavy or already-compacted text payloads", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", {
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }, async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;

      const imageResult = await toolResult?.({
        toolName: "read_attachment",
        content: [{ type: "image", mimeType: "image/png", data: "aGVsbG8=" }],
        details: {},
        isError: false,
        toolCallId: "tool-4",
        type: "tool_result",
      });
      expect(imageResult).toBeUndefined();

      const markerResult = await toolResult?.({
        toolName: "portainer",
        content: [{ type: "text", text: "Output stored as tool-output:out_existing_3\nUse search_tool_output with handle \"out_existing_3\"" }],
        details: {},
        isError: false,
        toolCallId: "tool-5",
        type: "tool_result",
      });
      expect(markerResult).toBeUndefined();
    });
  });

  test("keeps small tool results inline (no compaction)", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", {
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }, async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
      const result = await toolResult?.({
        toolName: "proxmox",
        content: [{ type: "text", text: "ok" }],
        details: {},
        isError: false,
        toolCallId: "tool-6",
        type: "tool_result",
      });

      expect(result).toBeUndefined();
    });
  });

  test("respects settings gate and skips compaction when disabled", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", {
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_COMPACTION_ENABLED: "0",
    }, async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
      const result = await toolResult?.({
        toolName: "proxmox",
        content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        details: {},
        isError: false,
        toolCallId: "tool-6b",
        type: "tool_result",
      });

      expect(result).toBeUndefined();

      const context = fake.handlers.find((entry) => entry.event === "context")?.handler;
      const contextResult = await context?.({
        messages: [{
          role: "toolResult",
          toolName: "proxmox",
          content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        }],
      });
      expect(contextResult).toEqual({});
    });
  });

  test("compacts legacy top-level toolResult messages in provider context", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", {
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }, async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const context = fake.handlers.find((entry) => entry.event === "context")?.handler;
      const result = await context?.({
        messages: [{
          role: "toolResult",
          toolName: "proxmox",
          content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        }],
      });

      expect(result?.messages?.[0]?.content?.[0]?.text).toContain("Output stored as tool-output:");
      expect(result?.messages?.[0]?.content?.[0]?.text).toContain("search_tool_output");
    });
  });

  test("compacts nested tool_result blocks in provider context", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", {
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }, async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const context = fake.handlers.find((entry) => entry.event === "context")?.handler;
      const result = await context?.({
        messages: [{
          role: "assistant",
          content: [{
            type: "tool_result",
            name: "bash",
            content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
          }],
        }],
      });

      const nestedText = result?.messages?.[0]?.content?.[0]?.content?.[0]?.text;
      expect(typeof nestedText).toBe("string");
      expect(nestedText).toContain("Output stored as tool-output:");
    });
  });

  test("supports per-tool threshold overrides", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", {
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_OUTPUT_STORE_THRESHOLDS_BY_TOOL: JSON.stringify({
        proxmox: { bytes: 100_000, lines: 10_000 },
      }),
    }, async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;

      const proxmoxResult = await toolResult?.({
        toolName: "proxmox",
        content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        details: {},
        isError: false,
        toolCallId: "tool-6c",
        type: "tool_result",
      });
      expect(proxmoxResult).toBeUndefined();

      const context = fake.handlers.find((entry) => entry.event === "context")?.handler;
      const contextProxmox = await context?.({
        messages: [{
          role: "toolResult",
          toolName: "proxmox",
          content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        }],
      });
      expect(contextProxmox).toEqual({});

      const bashResult = await toolResult?.({
        toolName: "bash",
        content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        details: { fullOutputPath: "" },
        input: { command: "printf" },
        isError: false,
        toolCallId: "tool-6d",
        type: "tool_result",
      });
      expect(bashResult?.details?.storedOutputId).toBeTruthy();
    });
  });

  test("fails open when persistence cannot write tool-output files", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", {
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }, async () => {
      const config = await importFresh<typeof import("../src/core/config.js")>("../src/core/config.js");
      const blockedDir = join(config.DATA_DIR, "tool-output");
      mkdirSync(blockedDir, { recursive: true });
      chmodSync(blockedDir, 0o500);

      try {
        const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
        db.initDatabase();

        const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
        const fake = createFakeExtensionApi({ allTools: [] });
        contextMode.default(fake.api);

        const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
        const result = await toolResult?.({
          toolName: "proxmox",
          content: [{ type: "text", text: "blocked-write-only\nline-1\nline-2\nline-3\n" }],
          details: {},
          isError: false,
          toolCallId: "tool-7",
          type: "tool_result",
        });

        expect(result).toBeUndefined();
      } finally {
        chmodSync(blockedDir, 0o700);
      }
    });
  });
});
