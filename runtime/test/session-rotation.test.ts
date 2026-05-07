import { afterEach, expect, test } from "bun:test";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";

import type { AgentSessionRuntime } from "@earendil-works/pi-coding-agent";
import { SessionManager } from "@earendil-works/pi-coding-agent";

import { createTempWorkspace, importFresh, setEnv } from "./helpers.js";

let restoreEnv: (() => void) | null = null;
let cleanupWorkspace: (() => void) | null = null;

afterEach(() => {
  restoreEnv?.();
  cleanupWorkspace?.();
  restoreEnv = null;
  cleanupWorkspace = null;
});

function createPersistedSession(workspace: string, sessionDir: string, sessionName: string) {
  const sessionManager = SessionManager.create(workspace, sessionDir);
  sessionManager.appendSessionInfo(sessionName);
  sessionManager.appendMessage({
    role: "user",
    content: "Preserve this context",
    timestamp: Date.now(),
  } as const);
  const sessionFile = sessionManager.getSessionFile();
  const header = sessionManager.getHeader();
  if (sessionFile && header) {
    const entries = sessionManager.getEntries();
    const content = [header, ...entries].map((entry) => JSON.stringify(entry)).join("\n");
    writeFileSync(sessionFile, `${content}\n`);
  }

  return {
    sessionManager,
    sessionFile,
    sessionName,
    model: null,
    isStreaming: false,
    isCompacting: false,
    isRetrying: false,
    pendingMessageCount: 0,
    async compact() {
      sessionManager.appendCompaction("Rotation summary", "root", 128);
    },
  };
}

test("rotateSession restores the previous session when a cancelled newSession already replaced runtime.session", async () => {
  const workspace = createTempWorkspace("piclaw-rotate-session-cancelled-");
  cleanupWorkspace = workspace.cleanup;
  restoreEnv = setEnv({
    PICLAW_WORKSPACE: workspace.workspace,
    PICLAW_STORE: workspace.store,
    PICLAW_DATA: workspace.data,
  });

  const { rotateSession, getArchivePath } = await importFresh<typeof import("../src/session-rotation.js")>("../src/session-rotation.js");
  const sessionDir = join(workspace.workspace, "session-rotation");
  const originalSession = createPersistedSession(workspace.workspace, sessionDir, "Original session");
  const previousSessionFile = originalSession.sessionFile;
  expect(previousSessionFile).toBeTruthy();

  const archivePath = getArchivePath(previousSessionFile!);
  let switchCalls = 0;

  const runtime = {
    session: originalSession,
    cwd: workspace.workspace,
    diagnostics: [],
    services: {} as any,
    modelFallbackMessage: undefined,
    newSession: async (options?: { parentSession?: string; setup?: (sessionManager: SessionManager) => Promise<void> | void }) => {
      const replacementManager = SessionManager.create(workspace.workspace, sessionDir);
      replacementManager.newSession({ parentSession: options?.parentSession });
      await options?.setup?.(replacementManager);
      runtime.session = {
        ...createPersistedSession(workspace.workspace, sessionDir, "Cancelled replacement"),
        sessionManager: replacementManager,
        sessionFile: replacementManager.getSessionFile(),
      } as any;
      return { cancelled: true };
    },
    switchSession: async (sessionPath: string) => {
      switchCalls += 1;
      expect(sessionPath).toBe(previousSessionFile);
      runtime.session = originalSession as any;
      return { cancelled: false };
    },
    fork: async () => ({ cancelled: false }),
    importFromJsonl: async () => ({ cancelled: false }),
    dispose: async () => {},
  } as AgentSessionRuntime;

  const result = await rotateSession(originalSession as any, runtime, { reason: "manual" });

  expect(result.status).toBe("error");
  expect(result.message).toBe("Session rotation cancelled.");
  expect(switchCalls).toBe(1);
  expect(runtime.session.sessionFile).toBe(previousSessionFile);
  expect(existsSync(previousSessionFile!)).toBe(true);
  expect(existsSync(archivePath)).toBe(false);
});
