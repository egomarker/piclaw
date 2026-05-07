/**
 * test/agent-control/session-rotate-integration.test.ts – Integration coverage for
 * manual session rotation against real persisted session files.
 *
 * Verifies that the rotation handler archives the old file, creates a fresh
 * successor session, and that SessionManager.continueRecent(...) resumes the
 * new file after a simulated restart.
 */

import { afterEach, expect, test } from "bun:test";
import { existsSync } from "fs";
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

function createAssistantMessage(text: string) {
  return {
    role: "assistant",
    content: [{ type: "text", text }],
    provider: "openai",
    model: "gpt-test",
    usage: {
      input: 4,
      output: 8,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 12,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    },
    stopReason: "stop",
    timestamp: Date.now(),
  } as const;
}

function createRuntime(session: IntegrationSession): AgentSessionRuntime {
  return {
    session: session as any,
    cwd: session.workspace,
    diagnostics: [],
    services: {} as any,
    modelFallbackMessage: undefined,
    newSession: async (options?: { parentSession?: string; setup?: (sessionManager: SessionManager) => Promise<void> | void }) => ({
      cancelled: !(await session.newSession(options)),
    }),
    switchSession: async () => ({ cancelled: false }),
    fork: async () => ({ cancelled: false }),
    importFromJsonl: async () => ({ cancelled: false }),
    dispose: async () => {},
  } as any;
}

class IntegrationSession {
  workspace: string;
  sessionDir: string;
  sessionManager: SessionManager;
  sessionFile: string | undefined;
  sessionName = "Rotation integration";
  model = { provider: "openai", id: "gpt-test", reasoning: true } as const;
  isStreaming = false;
  isCompacting = false;
  isRetrying = false;
  pendingMessageCount = 0;

  constructor(workspace: string, sessionDir: string) {
    this.workspace = workspace;
    this.sessionDir = sessionDir;
    this.sessionManager = SessionManager.create(workspace, sessionDir);
    this.sessionManager.appendMessage({ role: "user", content: "Please remember this context", timestamp: Date.now() } as const);
    this.sessionManager.appendMessage(createAssistantMessage("Initial assistant answer"));
    this.sessionFile = this.sessionManager.getSessionFile();
  }

  async compact() {
    const firstKeptEntryId = this.sessionManager.getEntries()[0]?.id ?? "root";
    this.sessionManager.appendCompaction("Rotation summary", firstKeptEntryId, 1234);
    this.sessionFile = this.sessionManager.getSessionFile();
    return {
      summary: "Rotation summary",
      firstKeptEntryId,
      tokensBefore: 1234,
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
}

test("session rotation archives the old file and continueRecent resumes the rotated successor", async () => {
  tempWorkspace = createTempWorkspace("piclaw-session-rotate-");
  restoreEnv = setEnv({
    PICLAW_WORKSPACE: tempWorkspace.workspace,
    PICLAW_STORE: tempWorkspace.store,
    PICLAW_DATA: tempWorkspace.data,
  });

  const { ensureSessionDir } = await importFresh<typeof import("../src/agent-pool/session.js")>("../src/agent-pool/session.js");
  const { handleSessionRotate } = await importFresh<typeof import("../src/agent-control/handlers/session.js")>("../src/agent-control/handlers/session.js");

  const sessionDir = ensureSessionDir("web:default");
  const session = new IntegrationSession(tempWorkspace.workspace, sessionDir);
  const runtime = createRuntime(session);
  const previousSessionFile = session.sessionFile;
  expect(previousSessionFile).toBeTruthy();
  expect(previousSessionFile && existsSync(previousSessionFile)).toBe(true);

  const result = await handleSessionRotate(session as any, runtime as any, {
    type: "session_rotate",
    instructions: "keep only what matters for the resumed session",
    raw: "/session-rotate keep only what matters for the resumed session",
  });

  expect(result.status).toBe("success");
  expect(result.message).toContain("Session rotated.");

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

  const resumedContext = resumed.buildSessionContext();
  expect(resumedContext.messages.some((message) => message.role === "compactionSummary")).toBe(true);
  expect(
    resumedContext.messages.some((message) =>
      message.role === "assistant"
        && Array.isArray(message.content)
        && message.content.some((block) => block.type === "text" && block.text === "Initial assistant answer")
    )
  ).toBe(true);
});

test("session rotation rejects queued follow-ups and leaves the active file untouched", async () => {
  tempWorkspace = createTempWorkspace("piclaw-session-rotate-pending-");
  restoreEnv = setEnv({
    PICLAW_WORKSPACE: tempWorkspace.workspace,
    PICLAW_STORE: tempWorkspace.store,
    PICLAW_DATA: tempWorkspace.data,
  });

  const { ensureSessionDir } = await importFresh<typeof import("../src/agent-pool/session.js")>("../src/agent-pool/session.js");
  const { handleSessionRotate } = await importFresh<typeof import("../src/agent-control/handlers/session.js")>("../src/agent-control/handlers/session.js");

  const sessionDir = ensureSessionDir("web:default");
  const session = new IntegrationSession(tempWorkspace.workspace, sessionDir);
  const runtime = createRuntime(session);
  const previousSessionFile = session.sessionFile;
  session.pendingMessageCount = 2;

  const result = await handleSessionRotate(session as any, runtime as any, {
    type: "session_rotate",
    raw: "/session-rotate",
  });

  expect(result.status).toBe("error");
  expect(result.message).toContain("queued steering or follow-up messages are pending");
  expect(session.sessionFile).toBe(previousSessionFile);
  expect(previousSessionFile && existsSync(previousSessionFile)).toBe(true);
  expect(existsSync(join(sessionDir, "archive", basename(previousSessionFile!)))).toBe(false);
});
