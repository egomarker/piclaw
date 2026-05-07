import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { AuthStorage, ModelRegistry, SessionManager, SettingsManager, getAgentDir } from "@earendil-works/pi-coding-agent";
import "../helpers.js";
import { createSessionInDir } from "../../src/agent-pool/session.ts";

function makeAssistantMessage(text = "ready") {
  return {
    role: "assistant",
    content: [{ type: "text", text }],
    stopReason: "end_turn",
    timestamp: Date.now(),
  } as any;
}

function makeOversizedReadToolResult(imageChars = 1_500_000) {
  return {
    role: "toolResult",
    toolCallId: "call-test",
    toolName: "read",
    content: [
      {
        type: "text",
        text: "Read image file [image/png] [Image: original 1080x2828, displayed at 764x2000. Multiply coordinates by 1.41 to map to original image.]",
      },
      {
        type: "image",
        data: "A".repeat(imageChars),
        mimeType: "image/png",
      },
    ],
    timestamp: Date.now(),
  } as any;
}

describe("session persistence sanitizer", () => {
  const originalWarn = console.warn;

  afterEach(() => {
    console.warn = originalWarn;
  });

  test("createSessionInDir sanitizes oversized persisted tool results before resume", async () => {
    console.warn = () => {};
    const tempRoot = mkdtempSync(join(tmpdir(), "piclaw-session-sanitize-resume-"));
    const sessionDir = join(tempRoot, "session");
    const workspaceDir = "/workspace";
    const authStorage = AuthStorage.create();
    const modelRegistry = ModelRegistry.inMemory(authStorage);
    const settingsManager = SettingsManager.create(workspaceDir, getAgentDir());

    try {
      const seed = SessionManager.create(workspaceDir, sessionDir);
      seed.appendMessage(makeAssistantMessage());
      seed.appendMessage(makeOversizedReadToolResult());

      const sessionFile = seed.getSessionFile();
      expect(sessionFile).toBeTruthy();
      const beforeSize = statSync(sessionFile!).size;
      expect(beforeSize).toBeGreaterThan(500_000);
      const beforeText = readFileSync(sessionFile!, "utf8");
      expect(beforeText).toContain('"type":"image"');

      const runtime = await createSessionInDir(sessionDir, {
        authStorage,
        modelRegistry,
        settingsManager,
        tools: [],
        chatJid: "web:test",
      });

      const afterSize = statSync(sessionFile!).size;
      const afterText = readFileSync(sessionFile!, "utf8");
      const context = runtime.session.sessionManager.buildSessionContext();
      const toolResult = context.messages.find((message: any) => message.role === "toolResult") as any;

      expect(afterSize).toBeLessThan(beforeSize / 4);
      expect(afterText).not.toContain('"type":"image"');
      expect(toolResult).toBeTruthy();
      expect(Array.isArray(toolResult.content)).toBe(true);
      expect(toolResult.content.some((block: any) => block?.type === "image")).toBe(false);
      expect(toolResult.content.some((block: any) => block?.type === "text" && String(block.text || "").includes("Persisted tool result sanitized"))).toBe(true);

      await runtime.dispose();
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  test("createSessionInDir sanitizes oversized future tool results on append", async () => {
    console.warn = () => {};
    const tempRoot = mkdtempSync(join(tmpdir(), "piclaw-session-sanitize-append-"));
    const sessionDir = join(tempRoot, "session");
    const workspaceDir = "/workspace";
    const authStorage = AuthStorage.create();
    const modelRegistry = ModelRegistry.inMemory(authStorage);
    const settingsManager = SettingsManager.create(workspaceDir, getAgentDir());

    try {
      const runtime = await createSessionInDir(sessionDir, {
        authStorage,
        modelRegistry,
        settingsManager,
        tools: [],
        chatJid: "web:test",
      });

      runtime.session.sessionManager.appendMessage(makeAssistantMessage("seed"));
      runtime.session.sessionManager.appendMessage(makeOversizedReadToolResult());

      const sessionFile = runtime.session.sessionFile;
      expect(sessionFile).toBeTruthy();
      const sessionText = readFileSync(sessionFile!, "utf8");
      const context = runtime.session.sessionManager.buildSessionContext();
      const toolResult = context.messages.find((message: any) => message.role === "toolResult") as any;

      expect(sessionText).not.toContain('"type":"image"');
      expect(toolResult).toBeTruthy();
      expect(toolResult.content.some((block: any) => block?.type === "image")).toBe(false);
      expect(toolResult.content.some((block: any) => block?.type === "text" && String(block.text || "").includes("Persisted tool result sanitized"))).toBe(true);

      await runtime.dispose();
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
