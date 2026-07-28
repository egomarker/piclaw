import { describe, expect, test } from "bun:test";
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { createFakeExtensionApi } from "./fake-extension-api.js";
import { importFresh, withTempWorkspaceEnv } from "../helpers.js";

function compactionEnv(vars: Record<string, string> = {}): Record<string, string> {
  return {
    PICLAW_TOOL_RESULT_COMPACTION_ENABLED: "1",
    PICLAW_TOOL_RESULT_COMPACTION_TOOLS: "bash,powershell,exec_batch",
    ...vars,
  };
}

describe("context-mode integration", () => {
  test("stores large bash outputs from fullOutputPath and points agents to search_tool_output", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }), async (workspace) => {
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

  test("routes semantic summarization through the runtime-owned executor without auth overrides", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_ENABLED: "1",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();
      const execution = await importFresh<any>("../src/extensions/model-execution-runtime.ts");
      const calls: any[][] = [];
      execution.__setRuntimeModelExecutorForTests({
        completeSimple: async (...args: any[]) => {
          calls.push(args);
          return {
            stopReason: "stop",
            content: [{ type: "text", text: "Summary:\n- Runtime-owned semantic facts\n\nKey facts:\n- exact\n\nWarnings/Errors:\n- none\n\nFollow-up cues:\n- inspect handle" }],
          };
        },
      });

      try {
        const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
        const fake = createFakeExtensionApi({ allTools: [] });
        contextMode.default(fake.api);
        const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
        const result = await toolResult?.({
          toolName: "bash",
          content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
          details: {},
          input: { command: "printf" },
          isError: false,
          toolCallId: "tool-runtime-semantic",
          type: "tool_result",
        }, { model: { provider: "test", id: "model" } });

        expect(result?.content?.[0]?.text).toContain("Runtime-owned semantic facts");
        expect(calls).toHaveLength(1);
        expect(calls[0][2].apiKey).toBeUndefined();
        expect(calls[0][2].headers).toBeUndefined();
        expect(calls[0][2].env).toBeUndefined();
      } finally {
        execution.__setRuntimeModelExecutorForTests(null);
      }
    });
  });

  test("uses semantic summary text when semantic summarization succeeds", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_ENABLED: "1",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      contextMode.__setSemanticToolResultSummarizerForTests(async () => "Summary:\n- Detected semantic facts\n\nKey facts:\n- line count: 3\n\nWarnings/Errors:\n- none\n\nFollow-up cues:\n- Use search_tool_output for details");

      try {
        const fake = createFakeExtensionApi({ allTools: [] });
        contextMode.default(fake.api);

        const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
        const result = await toolResult?.({
          toolName: "bash",
          content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
          details: {},
          input: { command: "printf" },
          isError: false,
          toolCallId: "tool-sem-1",
          type: "tool_result",
        });

        expect(result?.content?.[0]?.text).toContain("Semantic summary:");
        expect(result?.content?.[0]?.text).toContain("Detected semantic facts");
        expect(result?.content?.[0]?.text).not.toContain("Preview:");
      } finally {
        contextMode.__setSemanticToolResultSummarizerForTests(null);
      }
    });
  });

  test("reuses a successful semantic summary for identical tool output", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_ENABLED: "1",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      let summarizeCalls = 0;
      contextMode.__setSemanticToolResultSummarizerForTests(async () => {
        summarizeCalls += 1;
        return "Summary:\n- Stable semantic facts\n\nKey facts:\n- exact\n\nWarnings/Errors:\n- none\n\nFollow-up cues:\n- inspect handle";
      });

      try {
        const fake = createFakeExtensionApi({ allTools: [] });
        contextMode.default(fake.api);
        const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
        const event = {
          toolName: "bash",
          content: [{ type: "text", text: "same\nsemantic\noutput\n" }],
          details: {},
          input: { command: "printf same" },
          isError: false,
          toolCallId: "tool-sem-stable",
          type: "tool_result",
        };

        const first = await toolResult?.(event, { model: { provider: "test", id: "model" } });
        const second = await toolResult?.({ ...event, toolCallId: "tool-sem-stable-2" }, { model: { provider: "test", id: "model" } });

        expect(second?.content?.[0]?.text).toBe(first?.content?.[0]?.text);
        expect(summarizeCalls).toBe(1);
      } finally {
        contextMode.__setSemanticToolResultSummarizerForTests(null);
      }
    });
  });

  test("skips semantic summarization when turn signal is already aborted", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_ENABLED: "1",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      let summarizeCalls = 0;
      contextMode.__setSemanticToolResultSummarizerForTests(async () => {
        summarizeCalls += 1;
        return "Summary:\n- should not run";
      });

      try {
        const fake = createFakeExtensionApi({ allTools: [] });
        contextMode.default(fake.api);

        const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
        const abortController = new AbortController();
        abortController.abort();

        const result = await toolResult?.({
          toolName: "bash",
          content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
          details: {},
          input: { command: "printf" },
          isError: false,
          toolCallId: "tool-sem-aborted",
          type: "tool_result",
        }, {
          signal: abortController.signal,
        });

        expect(result?.content?.[0]?.text).toContain("Preview:");
        expect(result?.content?.[0]?.text).not.toContain("Semantic summary:");
        expect(summarizeCalls).toBe(0);
      } finally {
        contextMode.__setSemanticToolResultSummarizerForTests(null);
      }
    });
  });

  test("falls back to preview when semantic summarization fails", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_ENABLED: "1",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      contextMode.__setSemanticToolResultSummarizerForTests(async () => {
        throw new Error("semantic summary timeout");
      });

      try {
        const fake = createFakeExtensionApi({ allTools: [] });
        contextMode.default(fake.api);

        const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
        const result = await toolResult?.({
          toolName: "bash",
          content: [{ type: "text", text: "delta\nepsilon\nzeta\n" }],
          details: {},
          input: { command: "printf delta" },
          isError: false,
          toolCallId: "tool-sem-2",
          type: "tool_result",
        });

        expect(result?.content?.[0]?.text).toContain("Preview:");
        expect(result?.content?.[0]?.text).not.toContain("Semantic summary:");
      } finally {
        contextMode.__setSemanticToolResultSummarizerForTests(null);
      }
    });
  });

  test("retries semantic summary for cached outputs after an earlier failure", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_ENABLED: "1",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      let attempts = 0;
      contextMode.__setSemanticToolResultSummarizerForTests(async () => {
        attempts += 1;
        if (attempts === 1) throw new Error("semantic fail once");
        return "Summary:\n- semantic retry succeeded\n\nKey facts:\n- retries: 2\n\nWarnings/Errors:\n- none\n\nFollow-up cues:\n- inspect stored handle";
      });

      try {
        const fake = createFakeExtensionApi({ allTools: [] });
        contextMode.default(fake.api);

        const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
        const first = await toolResult?.({
          toolName: "bash",
          content: [{ type: "text", text: "same\noutput\ncontent\n" }],
          details: {},
          input: { command: "printf same" },
          isError: false,
          toolCallId: "tool-sem-retry-1",
          type: "tool_result",
        });
        expect(first?.content?.[0]?.text).toContain("Preview:");

        const second = await toolResult?.({
          toolName: "bash",
          content: [{ type: "text", text: "same\noutput\ncontent\n" }],
          details: {},
          input: { command: "printf same" },
          isError: false,
          toolCallId: "tool-sem-retry-2",
          type: "tool_result",
        });
        expect(second?.content?.[0]?.text).toContain("Semantic summary:");
        expect(second?.content?.[0]?.text).toContain("semantic retry succeeded");
        expect(attempts).toBe(2);
      } finally {
        contextMode.__setSemanticToolResultSummarizerForTests(null);
      }
    });
  });

  test("does not compact large non-configured tool results", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "16",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }), async () => {
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

      expect(result).toBeUndefined();
    });
  });

  test("compacts large tool results when tool is explicitly enabled", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "16",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_COMPACTION_TOOLS: "bash,proxmox",
    }), async () => {
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
        toolCallId: "tool-2-enabled",
        type: "tool_result",
      });

      expect(result?.content?.[0]?.text).toContain("Output stored as tool-output:");
      expect(result?.details?.storedOutputId).toBeTruthy();
      expect(result?.details?.storedOutputSource).toBe("tool:proxmox");
    });
  });

  test("does not compact large read tool results", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
      const result = await toolResult?.({
        toolName: "read",
        content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        details: {},
        isError: false,
        toolCallId: "tool-2-read",
        type: "tool_result",
      });

      expect(result).toBeUndefined();
    });
  });

  test("does not re-store outputs that already carry stored-output details", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }), async () => {
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
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }), async () => {
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
        toolName: "bash",
        content: [{ type: "text", text: "Output stored as tool-output:out_existing_3\nUse search_tool_output with handle \"out_existing_3\"" }],
        details: {},
        input: { command: "cat existing" },
        isError: false,
        toolCallId: "tool-5",
        type: "tool_result",
      });
      expect(markerResult).toBeUndefined();
    });
  });

  test("keeps small tool results inline (no compaction)", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
      const result = await toolResult?.({
        toolName: "bash",
        content: [{ type: "text", text: "ok" }],
        details: {},
        input: { command: "echo ok" },
        isError: false,
        toolCallId: "tool-6",
        type: "tool_result",
      });

      expect(result).toBeUndefined();
    });
  });

  test("respects settings gate and skips compaction when disabled", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_COMPACTION_ENABLED: "0",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
      const result = await toolResult?.({
        toolName: "bash",
        content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        details: {},
        input: { command: "printf" },
        isError: false,
        toolCallId: "tool-6b",
        type: "tool_result",
      });

      expect(result).toBeUndefined();

      const context = fake.handlers.find((entry) => entry.event === "context")?.handler;
      const contextResult = await context?.({
        messages: [{
          role: "toolResult",
          toolName: "bash",
          content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        }],
      });
      expect(contextResult).toEqual({});
    });
  });

  test("compacts legacy top-level toolResult messages in provider context", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const context = fake.handlers.find((entry) => entry.event === "context")?.handler;
      const result = await context?.({
        messages: [{
          role: "toolResult",
          toolName: "bash",
          content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        }],
      });

      expect(result?.messages?.[0]?.content?.[0]?.text).toContain("Legacy tool output compacted for provider context");
      expect(result?.messages?.[0]?.content?.[0]?.text).toContain("Preview:");
      expect(result?.messages?.[0]?.content?.[0]?.text).not.toContain("tool-output:");
    });
  });

  test("keeps repeated legacy provider-context compaction byte-identical without semantic model calls", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_ENABLED: "1",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      let summarizeCalls = 0;
      contextMode.__setSemanticToolResultSummarizerForTests(async () => {
        summarizeCalls += 1;
        return `Summary:\n- unstable ${summarizeCalls}`;
      });

      try {
        const fake = createFakeExtensionApi({ allTools: [] });
        contextMode.default(fake.api);
        const context = fake.handlers.find((entry) => entry.event === "context")?.handler;
        const event = {
          messages: [{
            role: "toolResult",
            toolName: "bash",
            content: [{ type: "text", text: "stable\nlegacy\nprovider\ncontext\n" }],
          }],
        };

        const first = await context?.(event, { model: { provider: "test", id: "model" } });
        const second = await context?.(event, { model: { provider: "test", id: "model" } });

        expect(JSON.stringify(second)).toBe(JSON.stringify(first));
        expect(first?.messages?.[0]?.content?.[0]?.text).toContain("Preview:");
        expect(summarizeCalls).toBe(0);
      } finally {
        contextMode.__setSemanticToolResultSummarizerForTests(null);
      }
    });
  });

  test("keeps legacy provider-context compaction stable across session recreation", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_ENABLED: "1",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();
      const event = {
        messages: [{
          role: "toolResult",
          toolName: "bash",
          content: [{ type: "text", text: "stable\nlegacy\nprovider\nrecreation\n" }],
        }],
      };

      const runFreshProjection = async () => {
        const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
        let summarizeCalls = 0;
        contextMode.__setSemanticToolResultSummarizerForTests(async () => {
          summarizeCalls += 1;
          return `Summary:\n- unstable ${summarizeCalls}`;
        });
        try {
          const fake = createFakeExtensionApi({ allTools: [] });
          contextMode.default(fake.api);
          const context = fake.handlers.find((entry) => entry.event === "context")?.handler;
          const result = await context?.(event, { model: { provider: "test", id: "model" } });
          return { serialized: JSON.stringify(result), summarizeCalls };
        } finally {
          contextMode.__setSemanticToolResultSummarizerForTests(null);
        }
      };

      const first = await runFreshProjection();
      const second = await runFreshProjection();

      expect(second.serialized).toBe(first.serialized);
      expect(first.serialized).toContain("Legacy tool output compacted for provider context");
      expect(first.serialized).not.toContain("tool-output:");
      expect(first.summarizeCalls).toBe(0);
      expect(second.summarizeCalls).toBe(0);
    });
  });

  test("skips legacy read tool results in provider context", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }), async () => {
      const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
      db.initDatabase();

      const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
      const fake = createFakeExtensionApi({ allTools: [] });
      contextMode.default(fake.api);

      const context = fake.handlers.find((entry) => entry.event === "context")?.handler;
      const result = await context?.({
        messages: [{
          role: "toolResult",
          toolName: "read",
          content: [{ type: "text", text: "alpha\nbeta\ngamma\n" }],
        }],
      });

      expect(result).toEqual({});
    });
  });

  test("compacts nested tool_result blocks in provider context", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }), async () => {
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
      expect(nestedText).toContain("Legacy tool output compacted for provider context");
      expect(nestedText).toContain("Preview:");
      expect(nestedText).not.toContain("tool-output:");
    });
  });

  test("supports per-tool threshold overrides", async () => {
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
      PICLAW_TOOL_RESULT_COMPACTION_TOOLS: "bash,proxmox",
      PICLAW_TOOL_OUTPUT_STORE_THRESHOLDS_BY_TOOL: JSON.stringify({
        proxmox: { bytes: 100_000, lines: 10_000 },
      }),
    }), async () => {
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
    await withTempWorkspaceEnv("piclaw-context-mode-", compactionEnv({
      PICLAW_TOOL_OUTPUT_STORE_BYTES: "8",
      PICLAW_TOOL_OUTPUT_STORE_LINES: "2",
    }), async () => {
      const blockedDir = join(process.env.PICLAW_DATA!, "tool-output");
      const now = new Date();
      const blockedShardDir = join(blockedDir, now.toISOString().slice(0, 7), now.toISOString().slice(8, 10));
      mkdirSync(blockedShardDir, { recursive: true });
      chmodSync(blockedShardDir, 0o500);

      try {
        const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
        db.initDatabase();

        const contextMode = await importFresh<any>("../extensions/integrations/context-mode.ts");
        const fake = createFakeExtensionApi({ allTools: [] });
        contextMode.default(fake.api);

        const toolResult = fake.handlers.find((entry) => entry.event === "tool_result")?.handler;
        const result = await toolResult?.({
          toolName: "bash",
          content: [{ type: "text", text: "blocked-write-only\nline-1\nline-2\nline-3\n" }],
          details: {},
          input: { command: "printf blocked" },
          isError: false,
          toolCallId: "tool-7",
          type: "tool_result",
        });

        expect(result).toBeUndefined();
      } finally {
        chmodSync(blockedShardDir, 0o700);
      }
    });
  });
});
