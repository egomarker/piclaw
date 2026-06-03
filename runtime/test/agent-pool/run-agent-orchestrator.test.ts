import { afterEach, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, readdirSync, rmSync, truncateSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { DEFAULT_COMPACTION_SETTINGS } from "@earendil-works/pi-coding-agent";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import type { AgentSessionRuntime } from "@earendil-works/pi-coding-agent";

import { ensureSessionDir } from "../../src/agent-pool/session.js";
import { getAttachmentRegistry } from "../../src/agent-pool/attachments.js";
import { AgentTurnCoordinator } from "../../src/agent-pool/turn-coordinator.js";
import { createToolExecutionWatchdogHeartbeatController, runAgentPrompt } from "../../src/agent-pool/run-agent-orchestrator.js";
import { getSshConfig, initDatabase, upsertSshConfig } from "../../src/db.js";
import {
  resetProgressWatchdogForTests,
  scanForStalls,
  setProgressWatchdogTimeoutForTests,
} from "../../src/runtime/progress-watchdog.js";
import { getToolUseMessageBudget, setToolUseMessageBudget } from "../../src/core/config.js";
import {
  applyLiveSshConfig,
  hasLiveChatSshConnection,
  registerLiveChatSshSession,
  setSshConnectionResolverForTests,
  unregisterLiveChatSshSession,
} from "../../src/extensions/ssh-core.js";
import { setEnv } from "../helpers.js";

function createRuntime(session: any, retrySettings?: { enabled?: boolean; maxRetries?: number; baseDelayMs?: number; maxDelayMs?: number }): AgentSessionRuntime {
  return {
    session,
    cwd: "/workspace",
    diagnostics: [],
    services: {
      settingsManager: {
        getRetrySettings: () => ({
          enabled: retrySettings?.enabled ?? true,
          maxRetries: retrySettings?.maxRetries ?? 3,
          baseDelayMs: retrySettings?.baseDelayMs ?? 2000,
          maxDelayMs: retrySettings?.maxDelayMs ?? 60000,
        }),
      },
    } as any,
    modelFallbackMessage: undefined,
    newSession: async () => ({ cancelled: false }),
    switchSession: async () => ({ cancelled: false }),
    fork: async () => ({ cancelled: false }),
    importFromJsonl: async () => ({ cancelled: false }),
    dispose: async () => {},
  } as any;
}

const tempLogsDirs: string[] = [];

function createTestLogsDir(): string {
  const logsDir = mkdtempSync(join(tmpdir(), "piclaw-run-agent-logs-"));
  tempLogsDirs.push(logsDir);
  return logsDir;
}

afterEach(() => {
  resetProgressWatchdogForTests();
  setSshConnectionResolverForTests(null);
  while (tempLogsDirs.length > 0) {
    const logsDir = tempLogsDirs.pop();
    if (!logsDir) continue;
    rmSync(logsDir, { recursive: true, force: true });
  }
});

test("runAgentPrompt aborts and returns an interrupted result when active progress goes stale", async () => {
  initDatabase();
  const restoreWatchdogTimeout = setProgressWatchdogTimeoutForTests(10);
  class StalledSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-stale" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    aborted = false;
    private releasePrompt: (() => void) | null = null;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.isStreaming = true;
      await new Promise<void>((resolve) => {
        this.releasePrompt = resolve;
      });
      this.isStreaming = false;
    }
    async abort() {
      this.aborted = true;
      this.releasePrompt?.();
    }
  }

  try {
    const session = new StalledSession();
    const logs: Array<Record<string, unknown>> = [];
    const run = runAgentPrompt("test", "web:stale-progress", {
      timeoutMs: 0,
      skipPrePromptCompaction: true,
    }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
      onWarn: (_message, details) => logs.push(details),
    });

    let stalls = scanForStalls(Date.now());
    for (let attempt = 0; stalls.length === 0 && attempt < 20; attempt += 1) {
      await Bun.sleep(10);
      stalls = scanForStalls(Date.now());
    }
    expect(stalls).toHaveLength(1);

    const result = await run;
    expect(session.aborted).toBe(true);
    expect(result.status).toBe("error");
    expect(result.error).toContain("Stale-progress watchdog interrupted");
    expect(logs).toEqual(expect.arrayContaining([
      expect.objectContaining({ operation: "run_agent.stale_progress_abort", chatJid: "web:stale-progress" }),
    ]));
  } finally {
    restoreWatchdogTimeout();
  }
});

test("runAgentPrompt reports stale-progress abort failures", async () => {
  initDatabase();
  const restoreWatchdogTimeout = setProgressWatchdogTimeoutForTests(10);
  class AbortFailingSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-stale-fail" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      await Bun.sleep(25);
    }
    async abort() {
      throw new Error("abort unavailable");
    }
  }

  try {
    const session = new AbortFailingSession();
    const run = runAgentPrompt("test", "web:stale-abort-fail", {
      timeoutMs: 0,
      skipPrePromptCompaction: true,
    }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
      onWarn: () => {},
    });

    await Bun.sleep(15);
    expect(scanForStalls(Date.now())).toHaveLength(1);
    const result = await run;
    expect(result.status).toBe("error");
    expect(result.error).toContain("failed to abort");
    expect(result.error).toContain("abort unavailable");
  } finally {
    restoreWatchdogTimeout();
  }
});

test("progress watchdog does not abort active runs that keep heartbeating", async () => {
  initDatabase();
  const restoreWatchdogTimeout = setProgressWatchdogTimeoutForTests(20);
  class ProgressingSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-progress" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    aborted = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      for (let i = 0; i < 3; i += 1) {
        await Bun.sleep(8);
        for (const listener of this.listeners) {
          listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: i === 2 ? "done" : "." } });
        }
      }
    }
    async abort() {
      this.aborted = true;
    }
  }

  try {
    const session = new ProgressingSession();
    const run = runAgentPrompt("test", "web:progressing", {
      timeoutMs: 0,
      skipPrePromptCompaction: true,
    }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    await Bun.sleep(12);
    expect(scanForStalls(Date.now())).toHaveLength(0);
    const result = await run;
    expect(result.status).toBe("success");
    expect(session.aborted).toBe(false);
  } finally {
    restoreWatchdogTimeout();
  }
});

test("tool-execution watchdog heartbeat controller keeps pulsing while tools remain active", async () => {
  const beats: Array<Record<string, unknown> | undefined> = [];
  const controller = createToolExecutionWatchdogHeartbeatController("web:test", {
    heartbeat: (_chatJid, _phase, metadata) => {
      beats.push(metadata);
    },
    getIntervalMs: () => 10,
  });

  controller.handleEvent({ type: "tool_execution_start", toolCallId: "tool-1", toolName: "bash" });
  await Bun.sleep(35);
  controller.handleEvent({ type: "tool_execution_end", toolCallId: "tool-1", toolName: "bash" });
  const beatCountAfterEnd = beats.length;
  await Bun.sleep(25);
  controller.stop();

  expect(beatCountAfterEnd).toBeGreaterThan(0);
  expect(beats[0]).toMatchObject({
    eventType: "tool_execution_watchdog_heartbeat",
    activeToolCount: 1,
    activeToolNames: ["bash"],
  });
  expect(beats).toHaveLength(beatCountAfterEnd);
});

function createAssistantMessage(text: string) {
  return {
    role: "assistant",
    content: [{ type: "text", text }],
    provider: "openai",
    model: "gpt-test",
    usage: {
      input: 1,
      output: 1,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 2,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    },
    stopReason: "stop",
    timestamp: Date.now(),
  } as const;
}

test("runAgentPrompt clears live SSH tool redirection and stored profile at turn end", async () => {
  const chatJid = "web:ssh-turn-scope";
  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-ssh" };
    model = { provider: "openai", id: "gpt-test", contextWindow: 1000 };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "done" } });
        listener({ type: "message_update", assistantMessageEvent: { type: "message_end", message: createAssistantMessage("done") } });
      }
      return createAssistantMessage("done");
    }
  }

  setSshConnectionResolverForTests(async (_rawTarget, localCwd, localHome, port) => ({
    sshTarget: "agent@example.com",
    port,
    remoteCwd: "/srv/project",
    remoteHome: "/home/agent",
    localCwd,
    localHome,
    privateKeyPath: "/tmp/test-key",
    controlPath: "/tmp/test-control",
    strictHostKeyChecking: "yes",
    tempDir: "/tmp/piclaw-ssh-test",
  }) as any);

  initDatabase();
  upsertSshConfig({
    chat_jid: chatJid,
    ssh_target: "agent@example.com:/srv/project",
    ssh_port: 22,
    private_key_keychain: "ssh/piclaw",
    known_hosts_keychain: null,
    strict_host_key_checking: "yes",
  });
  await registerLiveChatSshSession(chatJid, { localCwd: "/workspace", localHome: "/home/agent" });
  await applyLiveSshConfig(chatJid, {
    target: "agent@example.com:/srv/project",
    port: 22,
    privateKeyKeychain: "ssh/piclaw",
    strictHostKeyChecking: "yes",
  });
  expect(hasLiveChatSshConnection(chatJid)).toBe(true);
  expect(getSshConfig(chatJid)?.ssh_target).toBe("agent@example.com:/srv/project");

  try {
    const result = await runAgentPrompt("test", chatJid, { timeoutMs: 0 }, {
      getOrCreateRuntime: async () => createRuntime(new StubSession()) as any,
      turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
      onInfo: () => {},
      onWarn: () => {},
      onError: () => {},
    });

    expect(result.status).toBe("success");
    expect(hasLiveChatSshConnection(chatJid)).toBe(false);
    expect(getSshConfig(chatJid)).toBeNull();
  } finally {
    await unregisterLiveChatSshSession(chatJid);
  }
});

test("runAgentPrompt emits turn-aware observability log metadata for turn and tool steps", async () => {
  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-obs",
      buildSessionContext: () => ({ messages: [{ role: "user", content: [{ type: "text", text: "context" }] }] }),
    };
    model = { provider: "openai", id: "gpt-test", contextWindow: 1000 };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_start" } });
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "thinking..." } });
        listener({ type: "message_end", message: { role: "assistant", content: [{ type: "toolCall", id: "tool-1", name: "read" }], stopReason: "toolUse", usage: { inputTokens: 5, outputTokens: 2, totalTokens: 7 } } });
        listener({ type: "tool_execution_start", toolCallId: "tool-1", toolName: "read", args: { path: "README.md" } });
        listener({ type: "tool_execution_end", toolCallId: "tool-1", toolName: "read", isError: false, durationMs: 12 });
        listener({ type: "message_update", assistantMessageEvent: { type: "text_start" } });
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "done" } });
        listener({ type: "message_end", message: createAssistantMessage("done") });
      }
    }
    async abort() {}
  }

  const session = new StubSession();
  const logs: Array<Record<string, unknown>> = [];
  const contextEvents: any[] = [];
  const turnCoordinator = new AgentTurnCoordinator({
    takeAttachments: () => [],
    touchSession: () => {},
    recordMessageUsage: () => {},
  });

  const result = await runAgentPrompt("test", "web:default", {
    timeoutMs: 0,
    turnId: "turn-obs-1",
    onEvent: (event) => {
      if (event.type === "context_usage_update") contextEvents.push(event);
    },
  }, {
    getOrCreateRuntime: async () => createRuntime(session) as any,
    turnCoordinator,
    clearAttachments: () => {},
    takeAttachments: () => [],
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: () => {},
    clearActiveForkBaseLeaf: () => {},
    onInfo: (_message, details) => logs.push(details),
    onWarn: (_message, details) => logs.push(details),
  });

  expect(result.status).toBe("success");
  expect(logs).toEqual(expect.arrayContaining([
    expect.objectContaining({ operation: "run_agent.prompt", turnId: "turn-obs-1", sessionLeafId: "leaf-obs" }),
    expect.objectContaining({ operation: "tool.call.start", turnId: "turn-obs-1", toolCallId: "tool-1", sessionLeafId: "leaf-obs" }),
    expect.objectContaining({ operation: "tool.call.end", turnId: "turn-obs-1", toolCallId: "tool-1", durationMs: 12, sessionLeafId: "leaf-obs" }),
    expect.objectContaining({ operation: "run_agent.prompt_resolved", turnId: "turn-obs-1", sessionLeafId: "leaf-obs" }),
    expect.objectContaining({ operation: "run_agent.complete", turnId: "turn-obs-1", sessionLeafId: "leaf-obs" }),
  ]));
  expect(contextEvents.map((event) => event.phase)).toEqual(expect.arrayContaining([
    "prompt_start",
    "message_end",
    "tool_execution_start",
    "mid_turn_tool_result",
  ]));
  expect(contextEvents.every((event) => event.contextWindow === 1000 && typeof event.tokens === "number")).toBe(true);
});

test("runAgentPrompt aggregates deltas and returns pending attachments", async () => {
  const attachments = getAttachmentRegistry();
  attachments.clear("web:default");

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      attachments.register("web:default", {
        id: 1,
        name: "out.txt",
        contentType: "text/plain",
        size: 3,
        kind: "file",
        sourcePath: "/tmp/out.txt",
      });
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "hello" } });
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: " world" } });
      }
    }
    async abort() {}
  }

  const session = new StubSession();
  const forkStates: Array<string | null> = [];
  const turnCoordinator = new AgentTurnCoordinator({
    takeAttachments: (chatJid) => attachments.take(chatJid),
    touchSession: () => {},
    recordMessageUsage: () => {},
  });

  const result = await runAgentPrompt("test", "web:default", { timeoutMs: 0 }, {
    getOrCreateRuntime: async () => createRuntime(session) as any,
    turnCoordinator,
    clearAttachments: (chatJid) => attachments.clear(chatJid),
    takeAttachments: (chatJid) => attachments.take(chatJid),
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: (_chatJid, leafId) => {
      forkStates.push(leafId);
    },
    clearActiveForkBaseLeaf: () => {
      forkStates.push(null);
    },
  });

  expect(result.status).toBe("success");
  expect(result.result).toBe("hello world");
  expect(result.attachments).toHaveLength(1);
  expect(forkStates).toEqual(["leaf-1", null]);
});

test.skip("runAgentPrompt auto-compacts before prompting when estimated context exceeds the threshold", async () => {
  const calls: string[] = [];

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-1",
      buildSessionContext: () => ({
        messages: [
          { role: "user", content: "x".repeat(200) },
        ],
      }),
    };
    settingsManager = {
      getCompactionSettings: () => ({
        ...DEFAULT_COMPACTION_SETTINGS,
        enabled: true,
        reserveTokens: 10,
      }),
    };
    model = { contextWindow: 20, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      calls.push("compact");
    }
    async prompt() {
      calls.push("prompt");
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "done" } });
      }
    }
    async abort() {}
  }

  const session = new StubSession();
  const turnCoordinator = new AgentTurnCoordinator({
    takeAttachments: () => [],
    touchSession: () => {},
    recordMessageUsage: () => {},
  });

  const result = await runAgentPrompt("test", "web:default", { timeoutMs: 0 }, {
    getOrCreateRuntime: async () => createRuntime(session) as any,
    turnCoordinator,
    clearAttachments: () => {},
    takeAttachments: () => [],
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: () => {},
    clearActiveForkBaseLeaf: () => {},
  });

  expect(result.status).toBe("success");
  expect(calls).toEqual(["compact", "prompt"]);
});

test("runAgentPrompt skips Piclaw pre-prompt compaction when requested by the caller", async () => {
  const calls: string[] = [];

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-1",
      buildSessionContext: () => ({
        messages: [
          { role: "user", content: "x".repeat(200) },
        ],
      }),
    };
    settingsManager = {
      getCompactionSettings: () => ({
        ...DEFAULT_COMPACTION_SETTINGS,
        enabled: true,
        reserveTokens: 10,
      }),
    };
    model = { contextWindow: 20, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      calls.push("compact");
    }
    async prompt() {
      calls.push("prompt");
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "done" } });
      }
    }
    async abort() {}
  }

  const session = new StubSession();
  const turnCoordinator = new AgentTurnCoordinator({
    takeAttachments: () => [],
    touchSession: () => {},
    recordMessageUsage: () => {},
  });

  const result = await runAgentPrompt("test", "web:default", { timeoutMs: 0, skipPrePromptCompaction: true }, {
    getOrCreateRuntime: async () => createRuntime(session) as any,
    turnCoordinator,
    clearAttachments: () => {},
    takeAttachments: () => [],
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: () => {},
    clearActiveForkBaseLeaf: () => {},
  });

  expect(result.status).toBe("success");
  expect(calls).toEqual(["prompt"]);
});

test("runAgentPrompt suppresses upstream auto-compaction inside session.prompt", async () => {
  initDatabase();
  const calls: string[] = [];
  const warnings: Array<Record<string, unknown>> = [];

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-upstream-auto",
      buildSessionContext: () => ({ messages: [{ role: "user", content: "short" }] }),
    };
    settingsManager = {
      getCompactionSettings: () => ({
        ...DEFAULT_COMPACTION_SETTINGS,
        enabled: true,
        reserveTokens: 25_000,
      }),
    };
    model = { contextWindow: 1_000_000, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async _checkCompaction() {
      calls.push("upstreamCheckCompaction");
      await this._runAutoCompaction("threshold", false);
    }
    async _runAutoCompaction() {
      calls.push("upstreamRunAutoCompaction");
      await new Promise(() => {});
    }
    async prompt() {
      calls.push("prompt");
      await this._checkCompaction();
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "done" } });
      }
    }
    async abort() {}
  }

  const session = new StubSession();
  const turnCoordinator = new AgentTurnCoordinator({
    takeAttachments: () => [],
    touchSession: () => {},
    recordMessageUsage: () => {},
  });

  const result = await runAgentPrompt("test", "web:upstream-auto-suppressed", {
    timeoutMs: 0,
    skipPrePromptCompaction: true,
  }, {
    getOrCreateRuntime: async () => createRuntime(session) as any,
    onWarn: (_message, details) => warnings.push(details),
    turnCoordinator,
    clearAttachments: () => {},
    takeAttachments: () => [],
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: () => {},
    clearActiveForkBaseLeaf: () => {},
  });

  expect(result.status).toBe("success");
  expect(result.result).toBe("done");
  expect(calls).toEqual(["prompt"]);
  expect(warnings).toContainEqual(expect.objectContaining({
    operation: "run_agent.suppress_upstream_auto_compaction",
    chatJid: "web:upstream-auto-suppressed",
    method: "_checkCompaction",
  }));
  expect(typeof (session as any)._checkCompaction).toBe("function");
});

test.skip("runAgentPrompt still pre-prompt compacts even when upstream auto-compaction is disabled", async () => {
  const calls: string[] = [];

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-1",
      buildSessionContext: () => ({
        messages: [
          { role: "user", content: "x".repeat(200) },
        ],
      }),
    };
    settingsManager = {
      getCompactionSettings: () => ({
        ...DEFAULT_COMPACTION_SETTINGS,
        enabled: false,
        reserveTokens: 10,
      }),
    };
    model = { contextWindow: 20, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      calls.push("compact");
    }
    async prompt() {
      calls.push("prompt");
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "done" } });
      }
    }
    async abort() {}
  }

  const session = new StubSession();
  const turnCoordinator = new AgentTurnCoordinator({
    takeAttachments: () => [],
    touchSession: () => {},
    recordMessageUsage: () => {},
  });

  const result = await runAgentPrompt("test", "web:default", { timeoutMs: 0 }, {
    getOrCreateRuntime: async () => createRuntime(session) as any,
    turnCoordinator,
    clearAttachments: () => {},
    takeAttachments: () => [],
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: () => {},
    clearActiveForkBaseLeaf: () => {},
  });

  expect(result.status).toBe("success");
  // Piclaw manages compaction at safe pre-prompt boundaries regardless of
  // upstream auto-compaction setting — compact fires before prompt.
  expect(calls).toEqual(["compact", "prompt"]);
});

test.skip("runAgentPrompt aborts a stuck pre-prompt compaction and continues", async () => {
  const restoreEnv = setEnv({ PICLAW_COMPACTION_TIMEOUT_MS: "20" });
  const calls: string[] = [];
  const compactionEvents: Array<{ type: string; errorMessage?: string }> = [];

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-1",
      buildSessionContext: () => ({
        messages: [
          { role: "user", content: "x".repeat(200) },
        ],
      }),
    };
    settingsManager = {
      getCompactionSettings: () => ({
        ...DEFAULT_COMPACTION_SETTINGS,
        enabled: true,
        reserveTokens: 10,
      }),
    };
    model = { contextWindow: 20, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      calls.push("compact");
      this.isCompacting = true;
      await new Promise(() => {});
    }
    abortCompaction() {
      calls.push("abortCompaction");
      this.isCompacting = false;
    }
    async prompt() {
      calls.push("prompt");
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "done" } });
      }
    }
    async abort() {
      calls.push("abort");
      this.isCompacting = false;
    }
  }

  try {
    const session = new StubSession();
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("test", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "compaction_start" || event.type === "compaction_end") {
          compactionEvents.push({
            type: event.type,
            errorMessage: (event as { errorMessage?: string }).errorMessage,
          });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("done");
    expect(calls).toEqual(["compact", "abortCompaction", "prompt"]);
    expect(compactionEvents).toEqual([
      { type: "compaction_start", errorMessage: undefined },
      { type: "compaction_end", errorMessage: "Pre-prompt compaction failed: Compaction timed out after 0.0s" },
    ]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt suppresses auto-compaction for chats under backoff after recent failures", async () => {
  const restoreEnv = setEnv({
    PICLAW_COMPACTION_TIMEOUT_MS: "20",
    PICLAW_COMPACTION_BACKOFF_BASE_MS: "600000",
    PICLAW_COMPACTION_BACKOFF_MAX_MS: "600000",
  });
  const chatJid = `web:compaction-backoff-${Date.now()}`;
  const db = await import("../../src/db.js");
  db.initDatabase();
  const compactionEvents: string[] = [];

  class FailingSession {
    private listeners: Array<(event: any) => void> = [];
    private _compactReject: ((err: Error) => void) | null = null;
    sessionManager = {
      getLeafId: () => "leaf-1",
      buildSessionContext: () => ({ messages: [{ role: "user", content: "x".repeat(200) }] }),
    };
    settingsManager = {
      getCompactionSettings: () => ({ ...DEFAULT_COMPACTION_SETTINGS, enabled: true, reserveTokens: 10 }),
    };
    model = { contextWindow: 20, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      this.isCompacting = true;
      await new Promise<void>((_resolve, reject) => { this._compactReject = reject; });
    }
    abortCompaction() {
      this.isCompacting = false;
      this._compactReject?.(new Error("Compaction cancelled"));
      this._compactReject = null;
    }
    async prompt() {
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "first" } });
      }
    }
    async abort() {
      this.isCompacting = false;
    }
  }

  class SuppressedSession {
    calls: string[] = [];
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-1",
      buildSessionContext: () => ({ messages: [{ role: "user", content: "x".repeat(200) }] }),
    };
    settingsManager = {
      getCompactionSettings: () => ({ ...DEFAULT_COMPACTION_SETTINGS, enabled: true, reserveTokens: 10 }),
    };
    model = { contextWindow: 20, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      this.calls.push("compact");
    }
    async prompt() {
      this.calls.push("prompt");
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "second" } });
      }
    }
    async abort() {}
  }

  try {
    const turnCoordinator = new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} });
    await runAgentPrompt("test", chatJid, { timeoutMs: 0 }, {
      getOrCreateRuntime: async () => createRuntime(new FailingSession()) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(db.getChatCompactionBackoff(chatJid)).toEqual(expect.objectContaining({ failureCount: 1 }));

    const secondSession = new SuppressedSession();
    const secondResult = await runAgentPrompt("test", chatJid, {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "compaction_suppressed") compactionEvents.push(String((event as any).type));
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(secondSession) as any,
      turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(secondResult.status).toBe("success");
    expect(secondResult.result).toBe("second");
    expect(secondSession.calls).toEqual(["prompt"]);
    expect(compactionEvents).toEqual(["compaction_suppressed"]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt records pre-prompt cancellation backoff while still prompting", async () => {
  const restoreEnv = setEnv({
    PICLAW_COMPACTION_BACKOFF_BASE_MS: "600000",
    PICLAW_COMPACTION_BACKOFF_MAX_MS: "600000",
  });
  const chatJid = `web:compaction-cancel-${Date.now()}`;
  const db = await import("../../src/db.js");
  db.initDatabase();

  class CancellingSession {
    calls: string[] = [];
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-1",
      buildSessionContext: () => ({ messages: [{ role: "user", content: "x".repeat(200) }] }),
    };
    settingsManager = {
      getCompactionSettings: () => ({ ...DEFAULT_COMPACTION_SETTINGS, enabled: true, reserveTokens: 10 }),
    };
    model = { contextWindow: 20, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      this.calls.push("compact");
      throw new Error("Compaction cancelled");
    }
    async prompt() {
      this.calls.push("prompt");
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "ok" } });
      }
    }
    async abort() {}
  }

  try {
    const session = new CancellingSession();
    const result = await runAgentPrompt("test", chatJid, { timeoutMs: 0 }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("ok");
    expect(session.calls).toEqual(["compact", "prompt"]);
    expect(db.getChatCompactionBackoff(chatJid)).toEqual(expect.objectContaining({
      failureCount: 1,
      lastErrorMessage: "Compaction cancelled",
    }));
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt suppresses active cancellation backoff and prompts without re-compacting", async () => {
  const restoreEnv = setEnv({
    PICLAW_COMPACTION_BACKOFF_BASE_MS: "600000",
    PICLAW_COMPACTION_BACKOFF_MAX_MS: "600000",
  });
  const chatJid = `web:compaction-cancel-backoff-${Date.now()}`;
  const db = await import("../../src/db.js");
  db.initDatabase();
  db.setChatCompactionBackoff(chatJid, {
    failureCount: 1,
    lastFailedAt: new Date(Date.now() - 1000).toISOString(),
    backoffUntil: new Date(Date.now() + 600_000).toISOString(),
    lastErrorMessage: "Compaction cancelled",
  });

  class StubSession {
    calls: string[] = [];
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-1",
      buildSessionContext: () => ({ messages: [{ role: "user", content: "x".repeat(200) }] }),
    };
    settingsManager = {
      getCompactionSettings: () => ({ ...DEFAULT_COMPACTION_SETTINGS, enabled: true, reserveTokens: 10 }),
    };
    model = { contextWindow: 20, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      this.calls.push("compact");
    }
    async prompt() {
      this.calls.push("prompt");
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "ok" } });
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const result = await runAgentPrompt("test", chatJid, { timeoutMs: 0 }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("ok");
    expect(session.calls).toEqual(["prompt"]);
    expect(db.getChatCompactionBackoff(chatJid)).toEqual(expect.objectContaining({
      failureCount: 1,
      lastErrorMessage: "Compaction cancelled",
    }));
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt clears compaction backoff after a successful compaction", async () => {
  const restoreEnv = setEnv({
    PICLAW_COMPACTION_BACKOFF_BASE_MS: "600000",
    PICLAW_COMPACTION_BACKOFF_MAX_MS: "600000",
  });
  const chatJid = `web:compaction-clear-${Date.now()}`;
  const db = await import("../../src/db.js");
  db.initDatabase();
  db.setChatCompactionBackoff(chatJid, {
    failureCount: 2,
    lastFailedAt: "2024-03-20T00:00:00.000Z",
    backoffUntil: new Date(Date.now() - 60_000).toISOString(),
    lastErrorMessage: "Previous compaction timed out",
  });

  class StubSession {
    calls: string[] = [];
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-1",
      buildSessionContext: () => ({ messages: [{ role: "user", content: "x".repeat(200) }] }),
    };
    settingsManager = {
      getCompactionSettings: () => ({ ...DEFAULT_COMPACTION_SETTINGS, enabled: true, reserveTokens: 10 }),
    };
    model = { contextWindow: 20, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      this.calls.push("compact");
    }
    async prompt() {
      this.calls.push("prompt");
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "ok" } });
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const result = await runAgentPrompt("test", chatJid, { timeoutMs: 0 }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(session.calls).toEqual(["compact", "prompt"]);
    expect(db.getChatCompactionBackoff(chatJid)).toBeNull();
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt schedules idle auto-compaction after a successful turn when enabled", async () => {
  const restoreEnv = setEnv({
    PICLAW_IDLE_AUTO_COMPACTION_DELAY_MS: "5",
  });
  const chatJid = `web:idle-compact-${Date.now()}`;

  class StubSession {
    calls: string[] = [];
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-idle",
      buildSessionContext: () => ({ messages: [{ role: "user", content: "x".repeat(200) }] }),
    };
    settingsManager = {
      getCompactionSettings: () => ({ ...DEFAULT_COMPACTION_SETTINGS, enabled: true, reserveTokens: 10 }),
    };
    model = { contextWindow: 20, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.calls.push("prompt");
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "ok" } });
      }
    }
    async compact() {
      this.calls.push("compact");
    }
    async abort() {}
  }

  const session = new StubSession();
  const events: Array<{ type: string; reason?: string }> = [];

  try {
    const result = await runAgentPrompt("test", chatJid, {
      timeoutMs: 0,
      skipPrePromptCompaction: true,
      scheduleIdleAutoCompaction: true,
      onEvent: (event) => {
        if (event.type === "compaction_start" || event.type === "compaction_end") {
          events.push({ type: String(event.type), reason: typeof (event as any).reason === "string" ? (event as any).reason : undefined });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(session.calls).toEqual(["prompt"]);

    await Bun.sleep(30);

    expect(session.calls).toEqual(["prompt", "compact"]);
    expect(events).toEqual([
      { type: "compaction_start", reason: "idle" },
      { type: "compaction_end", reason: "idle" },
    ]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt cancels an older idle auto-compaction when a new turn starts", async () => {
  const restoreEnv = setEnv({
    PICLAW_IDLE_AUTO_COMPACTION_DELAY_MS: "40",
  });
  const chatJid = `web:idle-cancel-${Date.now()}`;

  class StubSession {
    promptCalls = 0;
    compactCalls = 0;
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-idle-cancel",
      buildSessionContext: () => ({ messages: [{ role: "user", content: "x".repeat(200) }] }),
    };
    settingsManager = {
      getCompactionSettings: () => ({ ...DEFAULT_COMPACTION_SETTINGS, enabled: true, reserveTokens: 10 }),
    };
    model = { contextWindow: 20, provider: "test", id: "model" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: `ok-${this.promptCalls}` } });
      }
    }
    async compact() {
      this.compactCalls += 1;
    }
    async abort() {}
  }

  const session = new StubSession();
  const options = {
    getOrCreateRuntime: async () => createRuntime(session) as any,
    turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
    clearAttachments: () => {},
    takeAttachments: () => [],
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: () => {},
    clearActiveForkBaseLeaf: () => {},
  };

  try {
    const first = await runAgentPrompt("test", chatJid, {
      timeoutMs: 0,
      skipPrePromptCompaction: true,
      scheduleIdleAutoCompaction: true,
    }, options);
    const second = await runAgentPrompt("test", chatJid, {
      timeoutMs: 0,
      skipPrePromptCompaction: true,
      scheduleIdleAutoCompaction: true,
    }, options);

    expect(first.status).toBe("success");
    expect(second.status).toBe("success");

    await Bun.sleep(80);

    expect(session.promptCalls).toBe(2);
    expect(session.compactCalls).toBe(1);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt does not auto-recover generic failures after tool activity", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });
  const events: string[] = [];

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    compactCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      this.compactCalls += 1;
    }
    async prompt() {
      this.promptCalls += 1;
      for (const listener of this.listeners) {
        listener({ type: "tool_execution_start", toolCallId: "tool-1", toolName: "write_file", args: { path: "x" } });
        listener({
          type: "message_update",
          assistantMessageEvent: {
            type: "text_start",
            contentIndex: 0,
            partial: { content: [{ type: "text", textSignature: JSON.stringify({ v: 1, id: "msg_c", phase: "commentary" }) }] },
          },
        });
        listener({
          type: "message_update",
          assistantMessageEvent: {
            type: "text_delta",
            delta: "draft",
            contentIndex: 0,
            partial: { content: [{ type: "text", textSignature: JSON.stringify({ v: 1, id: "msg_c", phase: "commentary" }) }] },
          },
        });
        listener({
          type: "message_end",
          message: {
            role: "assistant",
            stopReason: "error",
            errorMessage: "Timed out after 30s",
            content: [],
          },
        });
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("test", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_start" || event.type === "recovery_end" || event.type === "compaction_start" || event.type === "compaction_end") {
          events.push(event.type);
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("error");
    expect(result.error).toContain("Timed out after 30s");
    expect(session.promptCalls).toBe(1);
    expect(session.compactCalls).toBe(0);
    expect(events).toEqual([]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt prompts the rotated runtime session after auto-rotation swaps objects", async () => {
  const workspaceBase = mkdtempSync(join(tmpdir(), "piclaw-run-agent-rotate-"));
  const restoreEnv = setEnv({
    PICLAW_WORKSPACE: workspaceBase,
    PICLAW_STORE: join(workspaceBase, "store"),
    PICLAW_DATA: join(workspaceBase, "data"),
    PICLAW_SESSION_AUTO_ROTATE: "1",
    PICLAW_SESSION_MAX_SIZE_MB: "1",
  });

  class SessionBeforeRotate {
    sessionManager: SessionManager;
    sessionFile: string | undefined;
    sessionName = "Before rotate";
    model = { provider: "openai", id: "gpt-test", reasoning: true } as const;
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    pendingMessageCount = 0;
    promptCalls = 0;

    constructor() {
      const sessionDir = ensureSessionDir("web:default");
      this.sessionManager = SessionManager.create(workspaceBase, sessionDir);
      this.sessionManager.appendMessage({ role: "user", content: "rotate me", timestamp: Date.now() } as const);
      this.sessionManager.appendMessage(createAssistantMessage("pre-rotation context"));
      this.sessionFile = this.sessionManager.getSessionFile();
      truncateSync(this.sessionFile!, 2 * 1024 * 1024);
    }

    subscribe() {
      return () => {};
    }

    async compact() {
      const firstKeptEntryId = this.sessionManager.getEntries()[0]?.id ?? "root";
      this.sessionManager.appendCompaction("rotation summary", firstKeptEntryId, 100);
      this.sessionFile = this.sessionManager.getSessionFile();
      return { summary: "rotation summary", firstKeptEntryId, tokensBefore: 100 };
    }

    async prompt() {
      this.promptCalls += 1;
      throw new Error("stale session should not be prompted after auto-rotation");
    }

    async abort() {}
  }

  class SessionAfterRotate {
    private listeners: Array<(event: any) => void> = [];
    sessionManager: SessionManager;
    sessionFile: string | undefined;
    sessionName = "After rotate";
    model = { provider: "openai", id: "gpt-test", reasoning: true } as const;
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    pendingMessageCount = 0;
    promptCalls = 0;

    constructor(sessionManager: SessionManager) {
      this.sessionManager = sessionManager;
      this.sessionFile = sessionManager.getSessionFile();
    }

    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }

    async prompt() {
      this.promptCalls += 1;
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "rotated ok" } });
      }
    }

    async abort() {}
  }

  try {
    const oldSession = new SessionBeforeRotate();
    let activeSession: SessionBeforeRotate | SessionAfterRotate = oldSession;
    const runtime = {
      get session() {
        return activeSession;
      },
      cwd: workspaceBase,
      diagnostics: [],
      services: {} as any,
      modelFallbackMessage: undefined,
      newSession: async (options?: { parentSession?: string; setup?: (sessionManager: SessionManager) => Promise<void> | void }) => {
        const manager = SessionManager.create(workspaceBase, ensureSessionDir("web:default"));
        manager.newSession({ parentSession: options?.parentSession });
        if (options?.setup) {
          await options.setup(manager);
        }
        activeSession = new SessionAfterRotate(manager);
        return { cancelled: false };
      },
      switchSession: async () => ({ cancelled: false }),
      fork: async () => ({ cancelled: false }),
      importFromJsonl: async () => ({ cancelled: false }),
      dispose: async () => {},
    } as AgentSessionRuntime;

    const forkStates: Array<string | null> = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("test", "web:default", { timeoutMs: 0 }, {
      getOrCreateRuntime: async () => runtime as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: (_chatJid, leafId) => {
        forkStates.push(leafId);
      },
      clearActiveForkBaseLeaf: () => {
        forkStates.push(null);
      },
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("rotated ok");
    expect(oldSession.promptCalls).toBe(0);
    expect((activeSession as SessionAfterRotate).promptCalls).toBe(1);
    expect(forkStates).toHaveLength(2);
    expect(forkStates.at(-1)).toBe(null);
  } finally {
    restoreEnv();
    rmSync(workspaceBase, { recursive: true, force: true });
  }
});

test("runAgentPrompt retries a recoverable interrupted turn and returns one final success", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      if (this.promptCalls === 1) {
        for (const listener of this.listeners) {
          listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "partial draft" } });
          listener({
            type: "message_end",
            message: {
              role: "assistant",
              stopReason: "error",
              errorMessage: "Response ended with an error before finalization",
              content: [],
            },
          });
        }
        return;
      }
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "recovered answer" } });
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const recoveryEvents: string[] = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("hello", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_start" || event.type === "recovery_end") {
          recoveryEvents.push(String(event.type));
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("recovered answer");
    expect(result.recovery?.recovered).toBe(true);
    expect(result.recovery?.attemptsUsed).toBe(1);
    expect(result.recovery?.diagnostics).toEqual([
      expect.objectContaining({
        phase: "attempt_failure",
        attempt: 1,
        classifier: "transient",
        strategy: "retry",
        error: "Response ended with an error before finalization",
        hadPartialOutput: true,
      }),
    ]);
    expect(session.promptCalls).toBe(2);
    expect(recoveryEvents).toEqual(["recovery_start", "recovery_end"]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt recovers a timeout-before-finalization when compaction was in progress", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    compactCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      this.compactCalls += 1;
    }
    async prompt() {
      this.promptCalls += 1;
      if (this.promptCalls === 1) {
        for (const listener of this.listeners) {
          listener({ type: "compaction_start", reason: "overflow" });
          listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "draft during compaction" } });
          listener({
            type: "message_end",
            message: {
              role: "assistant",
              stopReason: "error",
              errorMessage: "Response timed out before finalization",
              content: [],
            },
          });
        }
        return;
      }
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "recovered after compaction" } });
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const recoveryStarts: Array<{ classifier?: string; strategy?: string }> = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("hello", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_start") {
          recoveryStarts.push({
            classifier: (event as any).classifier,
            strategy: (event as any).strategy,
          });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("recovered after compaction");
    expect(result.recovery).toEqual(expect.objectContaining({
      attemptsUsed: 1,
      recovered: true,
      exhausted: false,
      lastClassifier: "context_pressure",
      strategyHistory: ["compact_then_retry"],
    }));
    expect(result.recovery?.diagnostics).toEqual([
      expect.objectContaining({
        phase: "attempt_failure",
        attempt: 1,
        classifier: "context_pressure",
        strategy: "compact_then_retry",
        error: "Response timed out before finalization",
        sawCompactionIntent: true,
      }),
    ]);
    expect(session.promptCalls).toBe(2);
    expect(session.compactCalls).toBe(1);
    expect(recoveryStarts).toEqual([{ classifier: "context_pressure", strategy: "compact_then_retry" }]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt starts the recovery budget after the first failed attempt", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });
  const originalDateNow = Date.now;
  let now = 1_000_000;
  Date.now = () => now;

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    compactCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async compact() {
      this.compactCalls += 1;
    }
    async prompt() {
      this.promptCalls += 1;
      if (this.promptCalls === 1) {
        now += 120_000;
        for (const listener of this.listeners) {
          listener({ type: "compaction_start", reason: "overflow" });
          listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "draft during slow compaction" } });
          listener({
            type: "message_end",
            message: {
              role: "assistant",
              stopReason: "error",
              errorMessage: "Response timed out before finalization",
              content: [],
            },
          });
        }
        return;
      }
      now += 1_000;
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "recovered after delayed first attempt" } });
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("hello", "web:default", {
      timeoutMs: 0,
    }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("recovered after delayed first attempt");
    expect(result.recovery).toEqual(expect.objectContaining({
      attemptsUsed: 1,
      recovered: true,
      exhausted: false,
      lastClassifier: "context_pressure",
      strategyHistory: ["compact_then_retry"],
    }));
    expect(session.promptCalls).toBe(2);
    expect(session.compactCalls).toBe(1);
  } finally {
    Date.now = originalDateNow;
    restoreEnv();
  }
});

test("runAgentPrompt writes recovery diagnostics into the agent log", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      if (this.promptCalls === 1) {
        for (const listener of this.listeners) {
          listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "partial draft" } });
          listener({
            type: "message_end",
            message: {
              role: "assistant",
              stopReason: "error",
              errorMessage: "Response ended with an error before finalization",
              content: [],
            },
          });
        }
        return;
      }
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "recovered answer" } });
      }
    }
    async abort() {}
  }

  const logsDir = createTestLogsDir();

  try {
    const session = new StubSession();
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("hello", "web:default", { timeoutMs: 0 }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir,
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    const logFile = tempLogsDirs.find((entry) => entry === logsDir);
    expect(logFile).toBe(logsDir);
    const logName = readdirSync(logsDir).find((entry: string) => entry.startsWith("agent-") && entry.endsWith(".log"));
    expect(logName).toBeTruthy();
    const content = readFileSync(join(logsDir, logName!), "utf8");
    expect(content).toContain("RecoveryAttemptsUsed: 1");
    expect(content).toContain("RecoveryRecovered: true");
    expect(content).toContain("RecoveryDiagnostics:");
    expect(content).toContain("Response ended with an error before finalization");
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt auto-compacts and retries when tool activity produced no text output", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    compactCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      for (const listener of this.listeners) {
        listener({ type: "tool_execution_start", toolCallId: "tool-1", toolName: "write_file", args: { path: "x" } });
        listener({ type: "message_end", message: { role: "assistant", stopReason: "error", errorMessage: "maximum context length exceeded", content: [] } });
      }
    }
    async compact() {
      this.compactCalls += 1;
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("hello", "web:default", { timeoutMs: 0 }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("error");
    expect(result.error).toContain("maximum context length exceeded");
    expect(session.promptCalls).toBe(3);
    expect(session.compactCalls).toBe(2);
    expect(result.recovery).toMatchObject({
      exhausted: true,
      attemptsUsed: 2,
    });
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt auto-compacts and retries after tool-use budget exhaustion", async () => {
  initDatabase();
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
    PICLAW_TURN_MAX_TOOL_USE_MESSAGES: "1",
  });
  const previousToolUseBudget = getToolUseMessageBudget();
  setToolUseMessageBudget(8);

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    compactCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      if (this.promptCalls === 1) {
        for (const listener of this.listeners) {
          for (let i = 1; i <= 9; i += 1) {
            listener({
              type: "message_end",
              message: {
                role: "assistant",
                stopReason: "toolUse",
                content: [{ type: "toolCall", id: `tool-${i}`, name: "read", arguments: { path: `/tmp/${i}` } }],
              },
            });
            if (i < 9) {
              listener({ type: "tool_execution_start", toolCallId: `tool-${i}`, toolName: "read", args: { path: `/tmp/${i}` } });
              listener({ type: "tool_execution_end", toolCallId: `tool-${i}`, toolName: "read", isError: false });
            }
          }
        }
        return;
      }
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "recovered after tool budget compaction" } });
      }
    }
    async compact() {
      this.compactCalls += 1;
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const recoveryStarts: Array<{ classifier?: string; strategy?: string }> = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("hello", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_start") {
          recoveryStarts.push({
            classifier: (event as any).classifier,
            strategy: (event as any).strategy,
          });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("recovered after tool budget compaction");
    expect(session.promptCalls).toBe(2);
    expect(session.compactCalls).toBe(1);
    expect(result.recovery).toEqual(expect.objectContaining({
      attemptsUsed: 1,
      recovered: true,
      exhausted: false,
      lastClassifier: "tool_history_pressure",
      strategyHistory: ["compact_then_retry"],
    }));
    expect(recoveryStarts).toEqual([{ classifier: "tool_history_pressure", strategy: "compact_then_retry" }]);
  } finally {
    setToolUseMessageBudget(previousToolUseBudget);
    restoreEnv();
  }
});

test("runAgentPrompt preserves tool-budget root cause when recovery retry emits no assistant reply", async () => {
  initDatabase();
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "1",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });
  const previousToolUseBudget = getToolUseMessageBudget();
  setToolUseMessageBudget(8);

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = {
      getLeafId: () => "leaf-1",
      getEntries: () => [],
    };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    compactCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      if (this.promptCalls === 1) {
        for (const listener of this.listeners) {
          for (let i = 1; i <= 9; i += 1) {
            listener({
              type: "message_end",
              message: {
                role: "assistant",
                stopReason: "toolUse",
                content: [{ type: "toolCall", id: `tool-${i}`, name: "read", arguments: { path: `/tmp/${i}` } }],
              },
            });
          }
        }
      }
    }
    async compact() {
      this.compactCalls += 1;
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const recoveryEnds: Array<{ classifier?: string | null; errorMessage?: string }> = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("hello", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_end") {
          recoveryEnds.push({
            classifier: (event as any).classifier,
            errorMessage: (event as any).errorMessage,
          });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("error");
    expect(result.error).toContain("Tool-use budget exceeded before finalization");
    expect(result.error).toContain("retry still produced no terminal assistant reply");
    expect(result.error).toContain("Ask me to continue");
    expect(result.toolBudgetExceeded).toBe(true);
    expect(result.toolStepsUsed).toBe(9);
    expect(result.toolStepsBudget).toBe(8);
    expect(result.recovery).toEqual(expect.objectContaining({
      attemptsUsed: 1,
      exhausted: true,
      recovered: false,
      lastClassifier: "tool_history_pressure",
      strategyHistory: ["compact_then_retry"],
    }));
    expect(result.recovery?.diagnostics).toEqual(expect.arrayContaining([
      expect.objectContaining({
        classifier: "tool_history_pressure",
        toolUseBudgetExceeded: true,
        assistantToolUseMessageCount: 9,
      }),
    ]));
    expect(recoveryEnds).toEqual([expect.objectContaining({
      classifier: "tool_history_pressure",
      errorMessage: expect.stringContaining("Tool-use budget exceeded"),
    })]);
    expect(session.promptCalls).toBe(2);
    expect(session.compactCalls).toBe(1);
  } finally {
    setToolUseMessageBudget(previousToolUseBudget);
    restoreEnv();
  }
});

test("runAgentPrompt soft-stops near the tool-use budget after threshold tool calls finish", async () => {
  initDatabase();
  const previousToolUseBudget = getToolUseMessageBudget();
  setToolUseMessageBudget(8);

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    private activeTools = ["bash", "read"];
    toolSets: string[][] = [];
    toolsBeforeExecution: string[][] = [];
    sessionManager = { getLeafId: () => "leaf-1", getEntries: () => [] };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    getActiveToolNames() {
      return [...this.activeTools];
    }
    setActiveToolsByName(names: string[]) {
      this.activeTools = [...names];
      this.toolSets.push([...names]);
    }
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      for (const listener of this.listeners) {
        for (let i = 1; i <= 7; i += 1) {
          listener({
            type: "message_end",
            message: {
              role: "assistant",
              stopReason: "toolUse",
              content: [{ type: "toolCall", id: `tool-${i}`, name: "read", arguments: { path: `/tmp/${i}` } }],
            },
          });
          this.toolsBeforeExecution.push([...this.activeTools]);
          listener({ type: "tool_execution_start", toolCallId: `tool-${i}`, toolName: "read", args: { path: `/tmp/${i}` } });
          listener({ type: "tool_execution_end", toolCallId: `tool-${i}`, toolName: "read", isError: false, durationMs: 1 });
        }
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "summarized before hard budget" } });
        listener({ type: "message_end", message: createAssistantMessage("summarized before hard budget") });
      }
    }
    async compact() {}
    async abort() {
      throw new Error("soft stop should not abort");
    }
  }

  try {
    const session = new StubSession();
    const warnings: Array<Record<string, unknown>> = [];
    const result = await runAgentPrompt("hello", "web:default", { timeoutMs: 0 }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
      onWarn: (_message, details) => warnings.push(details),
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("summarized before hard budget");
    expect(session.toolsBeforeExecution.at(-1)).toEqual(["bash", "read"]);
    expect(session.toolSets).toContainEqual([]);
    expect(session.toolSets.at(-1)).toEqual(["bash", "read"]);
    expect(warnings).toEqual(expect.arrayContaining([
      expect.objectContaining({ operation: "run_agent.tool_use_budget_soft_stop", assistantToolUseMessageCount: 7 }),
    ]));
  } finally {
    setToolUseMessageBudget(previousToolUseBudget);
  }
});

test("runAgentPrompt accepts draft-backed completion after a synthetic soft-stop tool miss", async () => {
  initDatabase();
  const previousToolUseBudget = getToolUseMessageBudget();
  setToolUseMessageBudget(8);

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    private activeTools = ["bash", "read"];
    toolSets: string[][] = [];
    sessionManager = { getLeafId: () => "leaf-soft-stop-draft", getEntries: () => [{ id: "baseline", type: "message" }] };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    getActiveToolNames() {
      return [...this.activeTools];
    }
    setActiveToolsByName(names: string[]) {
      this.activeTools = [...names];
      this.toolSets.push([...names]);
    }
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "Draft answer before final tool." } });
        for (let i = 1; i <= 7; i += 1) {
          listener({
            type: "message_end",
            message: {
              role: "assistant",
              stopReason: "toolUse",
              content: [{ type: "toolCall", id: `tool-${i}`, name: "read", arguments: { path: `/tmp/${i}` } }],
            },
          });
          listener({ type: "tool_execution_start", toolCallId: `tool-${i}`, toolName: "read", args: { path: `/tmp/${i}` } });
          listener({ type: "tool_execution_end", toolCallId: `tool-${i}`, toolName: "read", isError: false, durationMs: 1 });
        }
        listener({
          type: "message_end",
          message: {
            role: "assistant",
            stopReason: "toolUse",
            content: [{ type: "toolCall", id: "tool-8", name: "bash", arguments: { command: "pwd" } }],
          },
        });
        listener({ type: "tool_execution_start", toolCallId: "tool-8", toolName: "bash", args: { command: "pwd" } });
        listener({ type: "tool_execution_end", toolCallId: "tool-8", toolName: "bash", isError: true, durationMs: 1 });
        listener({ type: "message_end", message: { role: "assistant", stopReason: "stop", content: [] } });
      }
    }
    async compact() {}
    async abort() {}
  }

  try {
    const session = new StubSession();
    const result = await runAgentPrompt("hello", "web:default", { timeoutMs: 0 }, {
      getOrCreateRuntime: async () => createRuntime(session) as any,
      turnCoordinator: new AgentTurnCoordinator({ takeAttachments: () => [], touchSession: () => {}, recordMessageUsage: () => {} }),
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
      onWarn: () => {},
    });

    expect(result.status).toBe("tool_complete");
    expect(session.toolSets).toContainEqual([]);
    expect(session.toolSets.at(-1)).toEqual(["bash", "read"]);
  } finally {
    setToolUseMessageBudget(previousToolUseBudget);
  }
});

test("runAgentPrompt surfaces provider error instead of returning null result", async () => {
  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      for (const listener of this.listeners) {
        listener({
          type: "message_end",
          message: {
            role: "assistant",
            stopReason: "error",
            errorMessage:
              'Error: 400 {"type":"error","error":{"type":"invalid_request_error","message":"You\'re out of extra usage."},"request_id":"req_abc123"}',
            content: [],
          },
        });
      }
    }
    async abort() {}
  }

  const session = new StubSession();
  const turnCoordinator = new AgentTurnCoordinator({
    takeAttachments: () => [],
    touchSession: () => {},
    recordMessageUsage: () => {},
  });

  const result = await runAgentPrompt("hello", "web:default", { timeoutMs: 0 }, {
    getOrCreateRuntime: async () => createRuntime(session) as any,
    turnCoordinator,
    clearAttachments: () => {},
    takeAttachments: () => [],
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: () => {},
    clearActiveForkBaseLeaf: () => {},
  });

  expect(result.status).toBe("error");
  expect(result.error).toContain("invalid_request_error");
  expect(result.error).toContain("extra usage");
  expect(result.result).toBeNull();
});

test("runAgentPrompt surfaces latent session state errors when no final text is emitted", async () => {
  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    agent = { state: { errorMessage: "Error: HTTP 429 Too Many Requests (rate limit exceeded)" } };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      for (const listener of this.listeners) {
        listener({
          type: "message_end",
          message: {
            role: "assistant",
            content: [],
          },
        });
      }
    }
    async abort() {}
  }

  const session = new StubSession();
  const turnCoordinator = new AgentTurnCoordinator({
    takeAttachments: () => [],
    touchSession: () => {},
    recordMessageUsage: () => {},
  });

  const result = await runAgentPrompt("hello", "web:default", { timeoutMs: 0 }, {
    getOrCreateRuntime: async () => createRuntime(session, { enabled: false }) as any,
    turnCoordinator,
    clearAttachments: () => {},
    takeAttachments: () => [],
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: () => {},
    clearActiveForkBaseLeaf: () => {},
  });

  expect(result.status).toBe("error");
  expect(result.error).toContain("429");
  expect(result.error).toContain("rate limit");
  expect(result.result).toBeNull();
});

test("runAgentPrompt ignores commentary-only aborted output", async () => {
  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      for (const listener of this.listeners) {
        listener({
          type: "message_update",
          assistantMessageEvent: {
            type: "text_start",
            contentIndex: 0,
            partial: { content: [{ type: "text", textSignature: JSON.stringify({ v: 1, id: "msg_c", phase: "commentary" }) }] },
          },
        });
        listener({
          type: "message_update",
          assistantMessageEvent: {
            type: "text_delta",
            delta: "progress update",
            contentIndex: 0,
            partial: { content: [{ type: "text", textSignature: JSON.stringify({ v: 1, id: "msg_c", phase: "commentary" }) }] },
          },
        });
        listener({
          type: "message_end",
          message: {
            role: "assistant",
            content: [{ type: "text", text: "progress update", textSignature: JSON.stringify({ v: 1, id: "msg_c", phase: "commentary" }) }],
          },
        });
      }
    }
    async abort() {}
  }

  const session = new StubSession();
  const turnCoordinator = new AgentTurnCoordinator({
    takeAttachments: () => [],
    touchSession: () => {},
    recordMessageUsage: () => {},
  });

  const result = await runAgentPrompt("test", "web:default", { timeoutMs: 0 }, {
    getOrCreateRuntime: async () => createRuntime(session, { enabled: false }) as any,
    turnCoordinator,
    clearAttachments: () => {},
    takeAttachments: () => [],
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: () => {},
    clearActiveForkBaseLeaf: () => {},
  });

  expect(result.status).toBe("error");
  expect(result.error).toContain("Prompt completed without emitting an assistant reply before finalization");
  expect(result.attachments).toBeUndefined();
});

test("runAgentPrompt treats terminal UI tool completion without final prose as informational", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-terminal-tool" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      for (const listener of this.listeners) {
        listener({
          type: "message_end",
          message: {
            role: "assistant",
            stopReason: "toolUse",
            content: [{ type: "toolCall", id: "tool-widget", name: "send_dashboard_widget", arguments: { html: "<div>ok</div>" } }],
          },
        });
        listener({ type: "tool_execution_start", toolCallId: "tool-widget", toolName: "send_dashboard_widget", args: { html: "<div>ok</div>" } });
        listener({ type: "tool_execution_end", toolCallId: "tool-widget", toolName: "send_dashboard_widget", isError: false });
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const recoveryEvents: Array<{ type: string }> = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("show widget", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_start" || event.type === "recovery_end") {
          recoveryEvents.push({ type: String(event.type) });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session, { maxRetries: 5, baseDelayMs: 1, maxDelayMs: 60000 }) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("tool_complete");
    expect(result.error).toBeUndefined();
    expect(session.promptCalls).toBe(1);
    expect(recoveryEvents).toEqual([]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt treats terminal side-effect tool completion as informational even after earlier tool failures", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-terminal-side-effect" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      for (const listener of this.listeners) {
        listener({ type: "tool_execution_start", toolCallId: "tool-fail", toolName: "bash", args: { command: "false" } });
        listener({ type: "tool_execution_end", toolCallId: "tool-fail", toolName: "bash", isError: true });
        listener({
          type: "message_end",
          message: {
            role: "assistant",
            stopReason: "toolUse",
            content: [{ type: "toolCall", id: "tool-exit", name: "exit_process", arguments: { reason: "restart" } }],
          },
        });
        listener({ type: "tool_execution_start", toolCallId: "tool-exit", toolName: "exit_process", args: { reason: "restart" } });
        listener({ type: "tool_execution_end", toolCallId: "tool-exit", toolName: "exit_process", isError: false });
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const recoveryEvents: Array<{ type: string }> = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("restart after deploy", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_start" || event.type === "recovery_end") {
          recoveryEvents.push({ type: String(event.type) });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session, { maxRetries: 5, baseDelayMs: 1, maxDelayMs: 60000 }) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("tool_complete");
    expect(result.error).toBeUndefined();
    expect(session.promptCalls).toBe(1);
    expect(recoveryEvents).toEqual([]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt treats draft-backed provider stop after tool use as informational", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    private entries: any[] = [{ id: "base", type: "message" }];
    sessionManager = {
      getLeafId: () => "leaf-draft-backed-tool-stop",
      getEntries: () => this.entries,
    };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      for (const listener of this.listeners) {
        listener({
          type: "message_end",
          message: {
            role: "assistant",
            stopReason: "toolUse",
            content: [{ type: "toolCall", id: "tool-1", name: "bash", arguments: { command: "make test" } }],
          },
        });
        this.entries.push({ id: "assistant-tool", type: "message" });
        listener({ type: "tool_execution_start", toolCallId: "tool-1", toolName: "bash", args: { command: "make test" } });
        listener({ type: "tool_execution_end", toolCallId: "tool-1", toolName: "bash", isError: false });
        this.entries.push({ id: "tool-result", type: "message" });
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "Tests passed; I am preparing the final summary." } });
        listener({
          type: "message_end",
          message: {
            role: "assistant",
            stopReason: "stop",
            content: [],
          },
        });
        this.entries.push(...Array.from({ length: 113 }, (_, index) => ({ id: `entry-${index}`, type: "message" })));
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const recoveryEvents: Array<{ type: string }> = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("run tests", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_start" || event.type === "recovery_end") {
          recoveryEvents.push({ type: String(event.type) });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session, { maxRetries: 5, baseDelayMs: 1, maxDelayMs: 60000 }) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("tool_complete");
    expect(result.error).toBeUndefined();
    expect(session.promptCalls).toBe(1);
    expect(recoveryEvents).toEqual([]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt retries when provider stops after a read-only tool call without a final reply", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      if (this.promptCalls === 1) {
        for (const listener of this.listeners) {
          listener({
            type: "message_end",
            message: {
              role: "assistant",
              stopReason: "toolUse",
              content: [{ type: "toolCall", id: "tool-1", name: "read", arguments: { path: "/tmp/x" } }],
            },
          });
          listener({ type: "tool_execution_start", toolCallId: "tool-1", toolName: "read", args: { path: "/tmp/x" } });
          listener({ type: "tool_execution_end", toolCallId: "tool-1", toolName: "read", isError: false });
          listener({
            type: "message_end",
            message: {
              role: "assistant",
              stopReason: "stop",
              content: [],
            },
          });
        }
        return;
      }
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "draft restored" } });
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const recoveryEvents: Array<{ type: string; delayMs?: number }> = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("show me the draft", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_start" || event.type === "recovery_end") {
          recoveryEvents.push({ type: String(event.type), delayMs: typeof (event as any).delayMs === "number" ? (event as any).delayMs : undefined });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session, { maxRetries: 5, baseDelayMs: 1, maxDelayMs: 60000 }) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("draft restored");
    expect(result.recovery).toEqual(expect.objectContaining({
      attemptsUsed: 1,
      recovered: true,
      lastClassifier: "transient",
      strategyHistory: ["retry"],
    }));
    expect(session.promptCalls).toBe(2);
    expect(recoveryEvents).toEqual([
      { type: "recovery_start", delayMs: 1 },
      { type: "recovery_end", delayMs: undefined },
    ]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt retries once when the provider stops after emitting thinking only", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "2",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      if (this.promptCalls === 1) {
        for (const listener of this.listeners) {
          listener({
            type: "message_end",
            message: {
              role: "assistant",
              stopReason: "stop",
              content: [{ type: "thinking", thinking: "Planning document updates" }],
            },
          });
        }
        return;
      }
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "final answer after retry" } });
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const recoveryEvents: Array<{ type: string; classifier?: string; delayMs?: number }> = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("update docs", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_start" || event.type === "recovery_end") {
          recoveryEvents.push({
            type: String(event.type),
            classifier: typeof (event as any).classifier === "string" ? (event as any).classifier : undefined,
            delayMs: typeof (event as any).delayMs === "number" ? (event as any).delayMs : undefined,
          });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session, { maxRetries: 5, baseDelayMs: 1, maxDelayMs: 60000 }) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("final answer after retry");
    expect(result.recovery).toEqual(expect.objectContaining({
      attemptsUsed: 1,
      recovered: true,
      lastClassifier: "thinking_only_stop",
      strategyHistory: ["retry"],
    }));
    expect(session.promptCalls).toBe(2);
    expect(recoveryEvents).toEqual([
      { type: "recovery_start", classifier: "thinking_only_stop", delayMs: 1 },
      { type: "recovery_end", classifier: "thinking_only_stop", delayMs: undefined },
    ]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt uses existing retry settings for automatic recovery attempts", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS: "30000",
  });

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      if (this.promptCalls < 3) {
        for (const listener of this.listeners) {
          listener({
            type: "message_end",
            message: {
              role: "assistant",
              stopReason: "toolUse",
              content: [{ type: "toolCall", id: `tool-${this.promptCalls}`, name: "read", arguments: { path: "/tmp/x" } }],
            },
          });
          listener({ type: "tool_execution_start", toolCallId: `tool-${this.promptCalls}`, toolName: "read", args: { path: "/tmp/x" } });
          listener({ type: "tool_execution_end", toolCallId: `tool-${this.promptCalls}`, toolName: "read", isError: false });
          listener({
            type: "message_end",
            message: {
              role: "assistant",
              stopReason: "stop",
              content: [],
            },
          });
        }
        return;
      }
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "eventually recovered" } });
      }
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const recoveryEvents: Array<{ type: string; attempt?: number; maxAttempts?: number; delayMs?: number }> = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("show me the draft", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_start" || event.type === "recovery_end") {
          recoveryEvents.push({
            type: String(event.type),
            attempt: typeof (event as any).attempt === "number" ? (event as any).attempt : undefined,
            maxAttempts: typeof (event as any).maxAttempts === "number" ? (event as any).maxAttempts : undefined,
            delayMs: typeof (event as any).delayMs === "number" ? (event as any).delayMs : undefined,
          });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session, { maxRetries: 5, baseDelayMs: 1, maxDelayMs: 60000 }) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("eventually recovered");
    expect(result.recovery).toEqual(expect.objectContaining({
      attemptsUsed: 2,
      recovered: true,
      strategyHistory: ["retry", "retry"],
    }));
    expect(recoveryEvents).toEqual([
      { type: "recovery_start", attempt: 1, maxAttempts: 5, delayMs: 1 },
      { type: "recovery_start", attempt: 2, maxAttempts: 5, delayMs: 2 },
      { type: "recovery_end", attempt: undefined, maxAttempts: undefined, delayMs: undefined },
    ]);
  } finally {
    restoreEnv();
  }
});

test("runAgentPrompt disarms the prompt timeout as soon as prompt() resolves", async () => {
  let abortCalls = 0;

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = true;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "done" } });
      }
      setTimeout(() => {
        this.isStreaming = false;
      }, 5);
    }
    async abort() {
      abortCalls += 1;
    }
  }

  const session = new StubSession();
  const turnCoordinator = new AgentTurnCoordinator({
    takeAttachments: () => [],
    touchSession: () => {},
    recordMessageUsage: () => {},
  });

  let timeoutState: ReturnType<typeof turnCoordinator.startPromptTimeout> | null = null;
  const originalStartPromptTimeout = turnCoordinator.startPromptTimeout.bind(turnCoordinator);
  turnCoordinator.startPromptTimeout = ((...args: any[]) => {
    timeoutState = originalStartPromptTimeout(...args);
    return timeoutState!;
  }) as any;

  const result = await runAgentPrompt("test", "web:default", { timeoutMs: 50 }, {
    getOrCreateRuntime: async () => createRuntime(session) as any,
    turnCoordinator,
    clearAttachments: () => {},
    takeAttachments: () => [],
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: () => {},
    clearActiveForkBaseLeaf: () => {},
    onInfo: (message) => {
      if (message !== "session.prompt() resolved" || !timeoutState) return;
      queueMicrotask(async () => {
        if (timeoutState?.completedRef.value) return;
        timeoutState.timedOutRef.value = true;
        await session.abort();
      });
    },
  });

  await Bun.sleep(20);

  expect(result.status).toBe("success");
  expect(result.result).toBe("done");
  expect(timeoutState?.completedRef.value).toBe(true);
  expect(abortCalls).toBe(0);
});

test("runAgentPrompt ignores a queued late-timeout callback after prompt completion", async () => {
  let abortCalls = 0;
  let timeoutState: {
    timeoutId: ReturnType<typeof setTimeout> | null;
    timedOutRef: { value: boolean };
    completedRef: { value: boolean };
  } | null = null;

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-1" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      for (const listener of this.listeners) {
        listener({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "done" } });
      }
      setTimeout(() => {
        if (!timeoutState || timeoutState.completedRef.value) return;
        timeoutState.timedOutRef.value = true;
        void this.abort();
      }, 0);
    }
    async abort() {
      abortCalls += 1;
    }
  }

  const session = new StubSession();
  const turnCoordinator = new AgentTurnCoordinator({
    takeAttachments: () => [],
    touchSession: () => {},
    recordMessageUsage: () => {},
  });

  turnCoordinator.startPromptTimeout = (() => {
    timeoutState = {
      timeoutId: null,
      timedOutRef: { value: false },
      completedRef: { value: false },
    };
    return timeoutState;
  }) as any;

  const result = await runAgentPrompt("test", "web:default", { timeoutMs: 1000 }, {
    getOrCreateRuntime: async () => createRuntime(session) as any,
    turnCoordinator,
    clearAttachments: () => {},
    takeAttachments: () => [],
    logsDir: createTestLogsDir(),
    setActiveForkBaseLeaf: () => {},
    clearActiveForkBaseLeaf: () => {},
  });

  await Bun.sleep(0);

  expect(result.status).toBe("success");
  expect(result.result).toBe("done");
  expect(abortCalls).toBe(0);
});
test("runAgentPrompt suppresses repeated automatic recovery loops for the same error signature", async () => {
  const restoreEnv = setEnv({
    PICLAW_TURN_AUTO_RECOVERY_ENABLED: "1",
    PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS: "6",
    PICLAW_RECOVERY_LOOP_GUARD_ENABLED: "1",
    PICLAW_RECOVERY_LOOP_GUARD_MAX_FAILURES: "2",
    PICLAW_RECOVERY_LOOP_GUARD_WINDOW_MS: String(10 * 60 * 1000),
  });

  class StubSession {
    private listeners: Array<(event: any) => void> = [];
    sessionManager = { getLeafId: () => "leaf-loop-guard" };
    isStreaming = false;
    isCompacting = false;
    isRetrying = false;
    promptCalls = 0;
    subscribe(listener: (event: any) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      };
    }
    async prompt() {
      this.promptCalls += 1;
      throw new Error("Response timed out before finalization");
    }
    async abort() {}
  }

  try {
    const session = new StubSession();
    const recoveryEvents: Array<{ type: string; classifier?: string }> = [];
    const turnCoordinator = new AgentTurnCoordinator({
      takeAttachments: () => [],
      touchSession: () => {},
      recordMessageUsage: () => {},
    });

    const result = await runAgentPrompt("loop guard", "web:default", {
      timeoutMs: 0,
      onEvent: (event) => {
        if (event.type === "recovery_start" || event.type === "recovery_end") {
          recoveryEvents.push({
            type: String(event.type),
            classifier: typeof (event as any).classifier === "string" ? (event as any).classifier : undefined,
          });
        }
      },
    }, {
      getOrCreateRuntime: async () => createRuntime(session, { maxRetries: 6, baseDelayMs: 1, maxDelayMs: 60000 }) as any,
      turnCoordinator,
      clearAttachments: () => {},
      takeAttachments: () => [],
      logsDir: createTestLogsDir(),
      setActiveForkBaseLeaf: () => {},
      clearActiveForkBaseLeaf: () => {},
    });

    expect(result.status).toBe("error");
    expect(result.recovery).toEqual(expect.objectContaining({
      exhausted: true,
      lastClassifier: "recovery_suppressed",
    }));
    expect(session.promptCalls).toBe(2);
    expect(recoveryEvents).toEqual([
      { type: "recovery_start", classifier: "transient" },
      { type: "recovery_end", classifier: "recovery_suppressed" },
    ]);
  } finally {
    restoreEnv();
  }
});
