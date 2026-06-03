import { afterEach, expect, test } from "bun:test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
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

test("rotateSession times out stuck compaction and leaves the active session in place", async () => {
  const workspace = createTempWorkspace("piclaw-rotate-session-timeout-");
  cleanupWorkspace = workspace.cleanup;
  restoreEnv = setEnv({
    PICLAW_WORKSPACE: workspace.workspace,
    PICLAW_STORE: workspace.store,
    PICLAW_DATA: workspace.data,
    PICLAW_COMPACTION_TIMEOUT_MS: "5",
  });

  const { rotateSession, getArchivePath } = await importFresh<typeof import("../src/session-rotation.js")>("../src/session-rotation.js");
  const sessionDir = join(workspace.workspace, "session-rotation-timeout");
  const originalSession = createPersistedSession(workspace.workspace, sessionDir, "Timeout session");
  const previousSessionFile = originalSession.sessionFile;
  expect(previousSessionFile).toBeTruthy();

  let abortCalls = 0;
  let releaseCompaction!: () => void;
  const session = {
    ...originalSession,
    async compact() {
      await new Promise<void>((resolve) => {
        releaseCompaction = resolve;
      });
    },
    async abort() {
      abortCalls += 1;
      releaseCompaction?.();
    },
  };
  const runtime = {
    session,
    cwd: workspace.workspace,
    diagnostics: [],
    services: {} as any,
    modelFallbackMessage: undefined,
    newSession: async () => {
      throw new Error("newSession should not be called after compaction timeout");
    },
    switchSession: async () => ({ cancelled: false }),
    fork: async () => ({ cancelled: false }),
    importFromJsonl: async () => ({ cancelled: false }),
    dispose: async () => {},
  } as AgentSessionRuntime;

  const result = await rotateSession(session as any, runtime, { reason: "manual", chatJid: "web:rotation-timeout" });

  expect(result.status).toBe("error");
  expect(result.message).toContain("Compaction timed out");
  expect(abortCalls).toBe(1);
  expect(runtime.session.sessionFile).toBe(previousSessionFile);
  expect(existsSync(previousSessionFile!)).toBe(true);
  expect(existsSync(getArchivePath(previousSessionFile!))).toBe(false);
});

test("rotateSession emergency fallback archives bloated context when compaction fails", async () => {
  const workspace = createTempWorkspace("piclaw-rotate-session-emergency-");
  cleanupWorkspace = workspace.cleanup;
  restoreEnv = setEnv({
    PICLAW_WORKSPACE: workspace.workspace,
    PICLAW_STORE: workspace.store,
    PICLAW_DATA: workspace.data,
  });

  const { rotateSession, getArchivePath } = await importFresh<typeof import("../src/session-rotation.js")>("../src/session-rotation.js");
  const sessionDir = join(workspace.workspace, "session-rotation-emergency");
  const sessionManager = SessionManager.create(workspace.workspace, sessionDir);
  sessionManager.appendSessionInfo("Bloated session");
  sessionManager.appendCompaction("Existing stable context", "root", 4096);
  sessionManager.appendMessage({ role: "user", content: "Recent user instruction to preserve", timestamp: Date.now() } as const);
  sessionManager.appendMessage({
    role: "assistant",
    content: [
      { type: "thinking", thinking: "PRIVATE_REASONING".repeat(100), thinkingSignature: "ENCRYPTED_SIGNATURE".repeat(100) },
      { type: "text", text: "Recent visible assistant answer" },
      { type: "toolCall", name: "bash", arguments: { command: "echo secret bulk" } },
    ],
    provider: "openai",
    model: "gpt-test",
    usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
    stopReason: "toolUse",
    timestamp: Date.now(),
  } as any);
  sessionManager.appendMessage({ role: "toolResult", toolCallId: "call-1", toolName: "bash", content: [{ type: "text", text: "FULL_TOOL_RESULT".repeat(200) }] } as any);
  const sessionFile = sessionManager.getSessionFile();
  const header = sessionManager.getHeader();
  expect(sessionFile).toBeTruthy();
  writeFileSync(sessionFile!, `${[header, ...sessionManager.getEntries()].map((entry) => JSON.stringify(entry)).join("\n")}\n`);
  const archivePath = getArchivePath(sessionFile!);

  const session = {
    sessionManager,
    sessionFile,
    sessionName: "Bloated session",
    model: { provider: "openai", id: "gpt-test" },
    isStreaming: false,
    isCompacting: false,
    isRetrying: false,
    pendingMessageCount: 0,
    async compact() {
      throw new Error("Compaction timed out after 180s");
    },
  };
  const runtime = {
    session,
    cwd: workspace.workspace,
    diagnostics: [],
    services: {} as any,
    modelFallbackMessage: undefined,
    newSession: async (options?: { parentSession?: string; setup?: (sessionManager: SessionManager) => Promise<void> | void }) => {
      const nextManager = SessionManager.create(workspace.workspace, sessionDir);
      nextManager.newSession({ parentSession: options?.parentSession });
      await options?.setup?.(nextManager);
      runtime.session = {
        ...session,
        sessionManager: nextManager,
        sessionFile: nextManager.getSessionFile(),
        async compact() {},
      } as any;
      return { cancelled: false };
    },
    switchSession: async () => ({ cancelled: false }),
    fork: async () => ({ cancelled: false }),
    importFromJsonl: async () => ({ cancelled: false }),
    dispose: async () => {},
  } as AgentSessionRuntime;

  const result = await rotateSession(session as any, runtime, { reason: "automatic", fallbackOnCompactionFailure: true });

  expect(result.status).toBe("success");
  expect(result.emergencyFallback).toBe(true);
  expect(existsSync(archivePath)).toBe(true);
  expect(existsSync(sessionFile!)).toBe(false);
  expect(runtime.session.sessionFile).toBeTruthy();
  const nextContent = readFileSync(runtime.session.sessionFile!, "utf8");
  expect(nextContent).toContain("Emergency session rotation handoff");
  expect(nextContent).toContain("Existing stable context");
  expect(nextContent).toContain("Recent user instruction to preserve");
  expect(nextContent).toContain("Recent visible assistant answer");
  expect(nextContent).not.toContain("ENCRYPTED_SIGNATURE");
  expect(nextContent).not.toContain("FULL_TOOL_RESULT");

  expect(() => runtime.session.sessionManager.appendMessage({
    role: "assistant",
    content: [{ type: "text", text: "Turn after emergency rotation" }],
    provider: "openai",
    model: "gpt-test",
    usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
    stopReason: "stop",
    timestamp: Date.now(),
  } as any)).not.toThrow();
  const appendedContent = readFileSync(runtime.session.sessionFile!, "utf8");
  expect(appendedContent).toContain("Turn after emergency rotation");
});

test("rotateSession syncs active in-memory model to carried model after emergency successor creation", async () => {
  const workspace = createTempWorkspace("piclaw-rotate-session-model-sync-");
  cleanupWorkspace = workspace.cleanup;
  restoreEnv = setEnv({
    PICLAW_WORKSPACE: workspace.workspace,
    PICLAW_STORE: workspace.store,
    PICLAW_DATA: workspace.data,
  });

  const { rotateSession } = await importFresh<typeof import("../src/session-rotation.js")>("../src/session-rotation.js");
  const sessionDir = join(workspace.workspace, "session-rotation-model-sync");
  const sessionManager = SessionManager.create(workspace.workspace, sessionDir);
  sessionManager.appendSessionInfo("Model sync session");
  sessionManager.appendMessage({ role: "user", content: "Continue the carried model work", timestamp: Date.now() } as const);
  const sessionFile = sessionManager.getSessionFile();
  const header = sessionManager.getHeader();
  expect(sessionFile).toBeTruthy();
  writeFileSync(sessionFile!, `${[header, ...sessionManager.getEntries()].map((entry) => JSON.stringify(entry)).join("\n")}\n`);

  const carriedModel = { provider: "github-copilot", id: "gpt-5.5", api: "openai-responses" };
  const staleDefaultModel = { provider: "openai-codex", id: "gpt-5.5", api: "openai-codex-responses" };
  const modelRegistry = {
    find(provider: string, modelId: string) {
      if (provider === carriedModel.provider && modelId === carriedModel.id) return carriedModel;
      if (provider === staleDefaultModel.provider && modelId === staleDefaultModel.id) return staleDefaultModel;
      return undefined;
    },
    hasConfiguredAuth(model: { provider: string }) {
      return model.provider === carriedModel.provider;
    },
  };
  const makeSession = (manager: SessionManager, file: string | undefined, activeModel: typeof carriedModel | typeof staleDefaultModel) => ({
    sessionManager: manager,
    sessionFile: file,
    sessionName: "Model sync session",
    agent: { state: { model: activeModel } },
    modelRegistry,
    get model() { return this.agent.state.model; },
    isStreaming: false,
    isCompacting: false,
    isRetrying: false,
    pendingMessageCount: 0,
    async compact() {
      throw new Error("Compaction timed out after 180s");
    },
  });

  const originalSession = makeSession(sessionManager, sessionFile, carriedModel);
  const runtime = {
    session: originalSession,
    cwd: workspace.workspace,
    diagnostics: [],
    services: {} as any,
    modelFallbackMessage: undefined,
    newSession: async (options?: { parentSession?: string; setup?: (sessionManager: SessionManager) => Promise<void> | void }) => {
      const nextManager = SessionManager.create(workspace.workspace, sessionDir);
      nextManager.newSession({ parentSession: options?.parentSession });
      // Mirror pi-coding-agent new-session behavior: the fresh in-memory session
      // starts on its default model before Piclaw seeds the carried model entry.
      nextManager.appendModelChange(staleDefaultModel.provider, staleDefaultModel.id);
      await options?.setup?.(nextManager);
      runtime.session = makeSession(nextManager, nextManager.getSessionFile(), staleDefaultModel) as any;
      return { cancelled: false };
    },
    switchSession: async () => ({ cancelled: false }),
    fork: async () => ({ cancelled: false }),
    importFromJsonl: async () => ({ cancelled: false }),
    dispose: async () => {},
  } as AgentSessionRuntime;

  const result = await rotateSession(originalSession as any, runtime, { reason: "automatic", fallbackOnCompactionFailure: true });

  expect(result.status).toBe("success");
  expect(runtime.session.model.provider).toBe("github-copilot");
  expect(runtime.session.model.id).toBe("gpt-5.5");
  const nextEntries = readFileSync(runtime.session.sessionFile!, "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  const modelChanges = nextEntries.filter((entry) => entry.type === "model_change");
  expect(modelChanges.map((entry) => `${entry.provider}/${entry.modelId}`)).toEqual([
    "openai-codex/gpt-5.5",
    "github-copilot/gpt-5.5",
  ]);
});

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
  let replacementSessionFile: string | undefined;

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
      replacementSessionFile = replacementManager.getSessionFile()!;
      const header = replacementManager.getHeader();
      expect(header).toBeTruthy();
      writeFileSync(replacementSessionFile, `${JSON.stringify(header)}\n`);
      runtime.session = {
        ...originalSession,
        sessionManager: replacementManager,
        sessionFile: replacementSessionFile,
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
  expect(replacementSessionFile).toBeTruthy();
  expect(existsSync(replacementSessionFile!)).toBe(false);
});

test("rotateSession restores the previous session and removes orphan successor when persistence fails", async () => {
  const workspace = createTempWorkspace("piclaw-rotate-session-persist-fails-");
  cleanupWorkspace = workspace.cleanup;
  restoreEnv = setEnv({
    PICLAW_WORKSPACE: workspace.workspace,
    PICLAW_STORE: workspace.store,
    PICLAW_DATA: workspace.data,
  });

  const { rotateSession, getArchivePath } = await importFresh<typeof import("../src/session-rotation.js")>("../src/session-rotation.js");
  const sessionDir = join(workspace.workspace, "session-rotation-persist-fails");
  const originalSession = createPersistedSession(workspace.workspace, sessionDir, "Original session");
  const previousSessionFile = originalSession.sessionFile;
  expect(previousSessionFile).toBeTruthy();

  const archivePath = getArchivePath(previousSessionFile!);
  let switchCalls = 0;
  let replacementSessionFile: string | undefined;

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
      replacementSessionFile = replacementManager.getSessionFile()!;
      mkdirSync(replacementSessionFile);
      runtime.session = {
        ...originalSession,
        sessionManager: replacementManager,
        sessionFile: replacementSessionFile,
      } as any;
      return { cancelled: false };
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
  expect(switchCalls).toBe(1);
  expect(runtime.session.sessionFile).toBe(previousSessionFile);
  expect(existsSync(previousSessionFile!)).toBe(true);
  expect(existsSync(archivePath)).toBe(false);
  expect(replacementSessionFile).toBeTruthy();
  expect(existsSync(replacementSessionFile!)).toBe(false);
});
