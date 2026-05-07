/**
 * test/agent-pool/session-auto-rotation.test.ts – Integration coverage for
 * automatic session rotation during AgentPool runs.
 */

import { afterEach, expect, test } from "bun:test";
import { existsSync, truncateSync } from "fs";
import { basename, join } from "path";
import type { AgentSessionRuntime } from "@earendil-works/pi-coding-agent";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import { createTempWorkspace, importFresh, setEnv, type TempWorkspace } from "../helpers.js";

let restoreEnv: (() => void) | null = null;
let tempWorkspace: TempWorkspace | null = null;

afterEach(() => {
  restoreEnv?.();
  restoreEnv = null;
  tempWorkspace?.cleanup();
  tempWorkspace = null;
});

function createRuntime(session: any): AgentSessionRuntime {
  return {
    session,
    cwd: "/workspace",
    diagnostics: [],
    services: {} as any,
    modelFallbackMessage: undefined,
    newSession: async (options?: { parentSession?: string; setup?: (sessionManager: SessionManager) => Promise<void> | void }) => ({
      cancelled: !(await session.newSession(options)),
    }),
    switchSession: async () => ({ cancelled: false }),
    fork: async () => ({ cancelled: false }),
    importFromJsonl: async () => ({ cancelled: false }),
    dispose: async () => {
      session.dispose?.();
    },
  } as any;
}

function createAssistantMessage(text: string) {
  return {
    role: "assistant",
    content: [{ type: "text", text }],
    provider: "openai",
    model: "gpt-test",
    usage: {
      input: 3,
      output: 6,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 9,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    },
    stopReason: "stop",
    timestamp: Date.now(),
  } as const;
}

class AutoRotateSession {
  private listeners: Array<(event: any) => void> = [];
  workspace: string;
  sessionDir: string;
  sessionManager: SessionManager;
  sessionFile: string | undefined;
  sessionName = "Auto rotate integration";
  model = { provider: "openai", id: "gpt-test", reasoning: true } as const;
  thinkingLevel = "low" as const;
  isStreaming = false;
  isCompacting = false;
  isRetrying = false;
  autoCompactionEnabled = false;
  autoRetryEnabled = false;
  steeringMode = "one-at-a-time" as const;
  followUpMode = "one-at-a-time" as const;
  pendingMessageCount = 0;
  sessionId = "auto-rotate-session";
  compactCalls = 0;

  constructor(workspace: string, sessionDir: string) {
    this.workspace = workspace;
    this.sessionDir = sessionDir;
    this.sessionManager = SessionManager.create(workspace, sessionDir);
    this.sessionManager.appendMessage({ role: "user", content: "Remember this before rotation", timestamp: Date.now() } as const);
    this.sessionManager.appendMessage(createAssistantMessage("Assistant context before auto-rotate"));
    this.sessionFile = this.sessionManager.getSessionFile();
  }

  subscribe(listener: (event: any) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((entry) => entry !== listener);
    };
  }

  async compact() {
    this.compactCalls += 1;
    const firstKeptEntryId = this.sessionManager.getEntries()[0]?.id ?? "root";
    this.sessionManager.appendCompaction("Automatic rotation summary", firstKeptEntryId, 2048);
    this.sessionFile = this.sessionManager.getSessionFile();
    return {
      summary: "Automatic rotation summary",
      firstKeptEntryId,
      tokensBefore: 2048,
    };
  }

  async newSession(options?: { parentSession?: string; setup?: (sessionManager: SessionManager) => Promise<void> | void }) {
    const manager = SessionManager.create(this.workspace, this.sessionDir);
    manager.newSession({ parentSession: options?.parentSession });
    if (options?.setup) {
      await options.setup(manager);
    }
    this.sessionManager = manager;
    this.sessionFile = manager.getSessionFile();
    return true;
  }

  async prompt(_prompt: string) {
    for (const listener of this.listeners) {
      listener({
        type: "message_update",
        assistantMessageEvent: { type: "text_delta", delta: "rotated reply" },
      });
    }
  }

  async abort() {}
  dispose() {}
}

test("agent pool auto-rotates oversized persisted sessions before prompting", async () => {
  tempWorkspace = createTempWorkspace("piclaw-auto-rotate-");
  restoreEnv = setEnv({
    PICLAW_WORKSPACE: tempWorkspace.workspace,
    PICLAW_STORE: tempWorkspace.store,
    PICLAW_DATA: tempWorkspace.data,
    PICLAW_SESSION_AUTO_ROTATE: "1",
    PICLAW_SESSION_MAX_SIZE_MB: "1",
  });

  const { ensureSessionDir } = await importFresh<typeof import("../src/agent-pool/session.js")>("../src/agent-pool/session.js");
  const { AgentPool } = await importFresh<typeof import("../src/agent-pool.js")>("../src/agent-pool.js");

  const sessionDir = ensureSessionDir("web:default");
  const session = new AutoRotateSession(tempWorkspace.workspace, sessionDir);
  const previousSessionFile = session.sessionFile;
  expect(previousSessionFile).toBeTruthy();
  truncateSync(previousSessionFile!, 2 * 1024 * 1024);

  const pool = new AgentPool({
    createSession: async () => createRuntime(session) as any,
  });

  const result = await pool.runAgent("hello", "web:default", { timeoutMs: 0 });
  expect(result.status).toBe("success");
  expect(result.result).toBe("rotated reply");
  expect(session.compactCalls).toBe(1);

  const rotatedSessionFile = session.sessionFile;
  expect(rotatedSessionFile).toBeTruthy();
  expect(rotatedSessionFile).not.toBe(previousSessionFile);
  expect(rotatedSessionFile && existsSync(rotatedSessionFile)).toBe(true);
  expect(previousSessionFile && existsSync(previousSessionFile)).toBe(false);

  const archivePath = join(sessionDir, "archive", basename(previousSessionFile!));
  expect(existsSync(archivePath)).toBe(true);

  const resumed = SessionManager.continueRecent(tempWorkspace.workspace, sessionDir);
  expect(resumed.getSessionFile()).toBe(rotatedSessionFile);
  expect(resumed.getHeader()?.parentSession).toBe(archivePath);

  await pool.shutdown();
});

test("agent pool waits for an oversized busy session to settle before auto-rotating", async () => {
  tempWorkspace = createTempWorkspace("piclaw-auto-rotate-busy-");
  restoreEnv = setEnv({
    PICLAW_WORKSPACE: tempWorkspace.workspace,
    PICLAW_STORE: tempWorkspace.store,
    PICLAW_DATA: tempWorkspace.data,
    PICLAW_SESSION_AUTO_ROTATE: "1",
    PICLAW_SESSION_MAX_SIZE_MB: "1",
    PICLAW_SESSION_IDLE_MAX_WAIT_MS: "1000",
  });

  const { ensureSessionDir } = await importFresh<typeof import("../src/agent-pool/session.js")>("../src/agent-pool/session.js");
  const { AgentPool } = await importFresh<typeof import("../src/agent-pool.js")>("../src/agent-pool.js");

  const sessionDir = ensureSessionDir("web:default");
  const session = new AutoRotateSession(tempWorkspace.workspace, sessionDir);
  const previousSessionFile = session.sessionFile;
  expect(previousSessionFile).toBeTruthy();
  truncateSync(previousSessionFile!, 2 * 1024 * 1024);
  session.isStreaming = true;
  setTimeout(() => {
    session.isStreaming = false;
  }, 120);

  const pool = new AgentPool({
    createSession: async () => createRuntime(session) as any,
  });

  const result = await pool.runAgent("hello after settle", "web:default", { timeoutMs: 0 });
  expect(result.status).toBe("success");
  expect(result.result).toBe("rotated reply");
  expect(session.compactCalls).toBe(1);
  expect(session.sessionFile).not.toBe(previousSessionFile);
  expect(previousSessionFile && existsSync(previousSessionFile)).toBe(false);
  expect(existsSync(join(sessionDir, "archive", basename(previousSessionFile!)))).toBe(true);

  await pool.shutdown();
});
