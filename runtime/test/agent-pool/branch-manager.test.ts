import { afterEach, expect, test } from "bun:test";
import { mkdirSync, writeFileSync } from "fs";

import type { AgentSessionRuntime } from "@earendil-works/pi-coding-agent";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import { join } from "path";
import { ensureSessionDir } from "../../src/agent-pool/session.js";
import { AgentBranchManager } from "../../src/agent-pool/branch-manager.js";
import { hasDeferredBranchSeed, readDeferredBranchSeed } from "../../src/agent-pool/branch-seeding.js";
import { createTempWorkspace, importFresh, setEnv } from "../helpers.js";

let restoreEnv: (() => void) | null = null;

afterEach(() => {
  restoreEnv?.();
  restoreEnv = null;
});

function createRuntime(session: any): AgentSessionRuntime {
  return {
    session,
    cwd: "/workspace",
    diagnostics: [],
    services: {} as any,
    modelFallbackMessage: undefined,
    newSession: async () => ({ cancelled: false }),
    switchSession: async () => ({ cancelled: false }),
    fork: async () => ({ cancelled: false }),
    importFromJsonl: async () => ({ cancelled: false }),
    dispose: async () => {
      session.dispose?.();
    },
  } as any;
}

function createManager(overrides: Partial<ConstructorParameters<typeof AgentBranchManager>[0]> = {}) {
  const pool = new Map<string, { runtime: any; lastUsed: number }>();
  const sidePool = new Map<string, { runtime: any; lastUsed: number }>();
  const activeForkBaseLeafByChat = new Map<string, string | null>();
  const warns: string[] = [];

  const manager = new AgentBranchManager({
    pool,
    sidePool,
    activeForkBaseLeafByChat,
    getOrCreateRuntime: async (chatJid) => pool.get(chatJid)?.runtime,
    refreshRuntime: async () => {},
    isActive: (chatJid) => {
      const session = pool.get(chatJid)?.runtime.session;
      return Boolean(session?.isStreaming || session?.isCompacting || session?.isRetrying || session?.isBashRunning);
    },
    scheduleSessionWarmup: () => {},
    onWarn: (message) => warns.push(message),
    ...overrides,
  });

  return { manager, pool, sidePool, activeForkBaseLeafByChat, warns };
}

test("AgentBranchManager registers active chats and resolves agent handles", async () => {
  const ws = createTempWorkspace("piclaw-branch-manager-");
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
  db.initDatabase();

  const fixture = createManager();
  fixture.pool.set("web:topic", {
    runtime: createRuntime({
      sessionId: "session-1",
      sessionName: "Research Bot",
      model: { provider: "openai", id: "gpt-test" },
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      isBashRunning: false,
    }),
    lastUsed: Date.now(),
  });

  const branch = fixture.manager.ensureBranchRegistration("web:topic", fixture.pool.get("web:topic")?.runtime.session);
  expect(branch.agent_name).toBe("research-bot");

  const active = fixture.manager.listActiveChats();
  expect(active).toHaveLength(1);
  expect(active[0]?.agent_name).toBe("research-bot");
  expect(active[0]?.model).toBe("openai/gpt-test");
  expect(fixture.manager.findActiveChatByAgentName("Research Bot")?.chat_jid).toBe("web:topic");
  expect(fixture.manager.findChatByAgentName("research-bot")).toEqual({
    chat_jid: "web:topic",
    agent_name: "research-bot",
  });
  expect(fixture.manager.getAgentHandleForChat("web:topic")).toBe("research-bot");

  ws.cleanup();
});

test("AgentBranchManager renames branch handles without changing the chat JID", async () => {
  const ws = createTempWorkspace("piclaw-branch-rename-");
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
  db.initDatabase();

  let appliedSessionName = "Topic";
  const fixture = createManager();
  fixture.pool.set("web:topic", {
    runtime: createRuntime({
      sessionName: "Topic",
      setSessionName(name: string) {
        appliedSessionName = name;
        this.sessionName = name;
      },
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      isBashRunning: false,
    }),
    lastUsed: Date.now(),
  });

  const branch = await fixture.manager.renameChatBranch("web:topic", { agentName: "Research Bot" });

  expect(branch.chat_jid).toBe("web:topic");
  expect(branch.agent_name).toBe("research-bot");
  expect(appliedSessionName).toBe("research-bot");
  expect(db.getChatBranchByChatJid("web:topic")?.agent_name).toBe("research-bot");
  expect(db.getChatBranchByChatJid("web:research-bot")).toBeNull();

  ws.cleanup();
});

test("AgentBranchManager writes a deferred fork seed and schedules branch warmup without hydrating the target runtime", async () => {
  const ws = createTempWorkspace("piclaw-branch-seed-");
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
  db.initDatabase();

  const sourceManager = SessionManager.create(ws.workspace, join(ws.workspace, "source-session"));
  sourceManager.appendSessionInfo("Research");
  sourceManager.appendModelChange("openai", "gpt-test");
  sourceManager.appendMessage({ role: "user", content: "stable user", timestamp: Date.now() } as const);
  sourceManager.appendMessage({
    role: "assistant",
    content: [{ type: "text", text: "stable assistant" }],
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
  } as const);

  const scheduled: string[] = [];
  let getOrCreateCalls = 0;
  const sourceSession = {
    sessionManager: sourceManager,
    sessionFile: sourceManager.getSessionFile(),
    sessionName: "Research",
    model: { provider: "openai", id: "gpt-test", reasoning: true },
    thinkingLevel: "high",
    isStreaming: false,
    isCompacting: false,
    isRetrying: false,
    isBashRunning: false,
  };

  const fixture = createManager({
    getOrCreateRuntime: async (chatJid) => {
      getOrCreateCalls += 1;
      if (chatJid !== "web:default") throw new Error(`unexpected runtime hydration for ${chatJid}`);
      return fixture.pool.get(chatJid)?.runtime;
    },
    scheduleSessionWarmup: (chatJid) => {
      scheduled.push(chatJid);
    },
  });
  fixture.pool.set("web:default", { runtime: createRuntime(sourceSession), lastUsed: Date.now() });

  const branch = await fixture.manager.createForkedChatBranch("web:default");
  expect(branch.chat_jid).toBe("web:default:research-2");
  expect(branch.agent_name).toBe("research-2");
  expect(getOrCreateCalls).toBe(1);
  expect(scheduled).toEqual([branch.chat_jid]);

  const seed = readDeferredBranchSeed(branch.chat_jid);
  expect(seed?.version).toBe(1);
  expect(seed?.sessionName).toBe(branch.agent_name);
  expect(seed?.model).toEqual({ provider: "openai", modelId: "gpt-test" });
  expect(seed?.mode).toBe("rotated_context");

  ws.cleanup();
});

test("AgentBranchManager builds readable hierarchical JIDs from branch handles", async () => {
  const ws = createTempWorkspace("piclaw-readable-branch-jid-");
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
  db.initDatabase();
  db.storeChatMetadata("web:default", new Date().toISOString(), "Default");
  const root = db.getChatBranchByChatJid("web:default");
  db.storeChatMetadata("web:default:branch:legacy-parent", new Date().toISOString(), "Legacy Parent");
  const parent = db.ensureChatBranch({
    chat_jid: "web:default:branch:legacy-parent",
    root_chat_jid: "web:default",
    parent_branch_id: root?.branch_id ?? null,
    agent_name: "parent",
  });

  const sourceManager = SessionManager.create(ws.workspace, join(ws.workspace, "legacy-parent-session"));
  sourceManager.appendSessionInfo("Parent");
  sourceManager.appendModelChange("openai", "gpt-test");
  sourceManager.appendMessage({ role: "user", content: "stable user", timestamp: Date.now() } as const);

  const fixture = createManager();
  fixture.pool.set(parent.chat_jid, {
    runtime: createRuntime({
      sessionManager: sourceManager,
      sessionFile: sourceManager.getSessionFile(),
      sessionName: "Parent",
      model: { provider: "openai", id: "gpt-test" },
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      isBashRunning: false,
    }),
    lastUsed: Date.now(),
  });

  const child = await fixture.manager.createForkedChatBranch(parent.chat_jid, { agentName: "Child Work" });

  expect(child.chat_jid).toBe("web:default:parent:child-work");
  expect(child.root_chat_jid).toBe("web:default");
  expect(child.parent_branch_id).toBe(parent.branch_id);
  expect(child.agent_name).toBe("child-work");

  ws.cleanup();
});

test("AgentBranchManager creates independent root sessions", async () => {
  const ws = createTempWorkspace("piclaw-root-session-create-");
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
  db.initDatabase();

  const scheduled: string[] = [];
  const fixture = createManager({
    scheduleSessionWarmup: (chatJid) => scheduled.push(chatJid),
  });

  const root = await fixture.manager.createRootChatSession("Ops Room");

  expect(root.chat_jid).toBe("web:ops-room");
  expect(root.root_chat_jid).toBe("web:ops-room");
  expect(root.parent_branch_id).toBeNull();
  expect(root.agent_name).toBe("ops-room");
  expect(scheduled).toEqual(["web:ops-room"]);
  expect(db.getChatBranchByChatJid("web:ops-room")?.root_chat_jid).toBe("web:ops-room");

  ws.cleanup();
});

test("AgentBranchManager appends new child paths to the stable source JID after rename", async () => {
  const ws = createTempWorkspace("piclaw-renamed-stable-child-jid-");
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
  db.initDatabase();
  db.storeChatMetadata("web:default", new Date().toISOString(), "Default");
  const root = db.getChatBranchByChatJid("web:default");
  db.storeChatMetadata("web:default:research", new Date().toISOString(), "Research");
  const parent = db.ensureChatBranch({
    chat_jid: "web:default:research",
    root_chat_jid: "web:default",
    parent_branch_id: root?.branch_id ?? null,
    agent_name: "research",
  });
  db.renameChatBranchIdentity({ chat_jid: parent.chat_jid, agent_name: "renamed-parent" });

  const sourceManager = SessionManager.create(ws.workspace, join(ws.workspace, "renamed-parent-session"));
  sourceManager.appendSessionInfo("Renamed Parent");
  sourceManager.appendModelChange("openai", "gpt-test");

  const fixture = createManager();
  fixture.pool.set(parent.chat_jid, {
    runtime: createRuntime({
      sessionManager: sourceManager,
      sessionFile: sourceManager.getSessionFile(),
      sessionName: "Renamed Parent",
      model: { provider: "openai", id: "gpt-test" },
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      isBashRunning: false,
    }),
    lastUsed: Date.now(),
  });

  const child = await fixture.manager.createForkedChatBranch(parent.chat_jid, { agentName: "Child Work" });

  expect(child.chat_jid).toBe("web:default:research:child-work");
  expect(child.parent_branch_id).toBe(parent.branch_id);
  expect(child.agent_name).toBe("child-work");

  ws.cleanup();
});

test("AgentBranchManager prunes inactive branches and disposes cached sessions", async () => {
  const ws = createTempWorkspace("piclaw-branch-prune-");
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
  db.initDatabase();
  db.storeChatMetadata("web:default", new Date().toISOString(), "Default");
  const root = db.getChatBranchByChatJid("web:default");
  db.storeChatMetadata("web:default:branch:prune", new Date().toISOString(), "Prune Me");
  db.ensureChatBranch({
    chat_jid: "web:default:branch:prune",
    root_chat_jid: "web:default",
    parent_branch_id: root?.branch_id ?? null,
    agent_name: "prune-me",
  });

  let disposed = 0;
  const session = {
    sessionName: "Prune Me",
    isStreaming: false,
    isCompacting: false,
    isRetrying: false,
    isBashRunning: false,
    dispose() {
      disposed += 1;
    },
  };

  const cancelled: string[] = [];
  const fixture = createManager({
    cancelSessionWarmup: (chatJid) => {
      cancelled.push(chatJid);
    },
  });
  fixture.pool.set("web:default:branch:prune", { runtime: createRuntime(session), lastUsed: Date.now() });
  fixture.sidePool.set("web:default:branch:prune", { runtime: createRuntime(session), lastUsed: Date.now() });
  fixture.activeForkBaseLeafByChat.set("web:default:branch:prune", "leaf-1");
  writeFileSync(join(ensureSessionDir("web:default:branch:prune"), ".branch-seed.json"), JSON.stringify({
    version: 1,
    parentSession: null,
    sessionName: "Prune Me",
    model: null,
    thinkingLevel: null,
    mode: "rotated_context",
  }), "utf8");

  const archived = await fixture.manager.pruneChatBranch("web:default:branch:prune");
  expect(archived.archived_at).toBeTruthy();
  expect(fixture.pool.has("web:default:branch:prune")).toBe(false);
  expect(fixture.sidePool.has("web:default:branch:prune")).toBe(false);
  expect(fixture.activeForkBaseLeafByChat.has("web:default:branch:prune")).toBe(false);
  // The deferred seed must survive prune — it is the only persisted copy of
  // the forked context until the session is realized, and restoreChatBranch()
  // must be able to pick it back up.
  expect(hasDeferredBranchSeed("web:default:branch:prune")).toBe(true);
  // Prune must also cancel any queued prewarm so a background realization
  // cannot materialize a runtime for an archived chat.
  expect(cancelled).toEqual(["web:default:branch:prune"]);
  expect(disposed).toBe(2);

  ws.cleanup();
});

test("AgentBranchManager permanently purges archived branches and removes session artifacts", async () => {
  const ws = createTempWorkspace("piclaw-branch-purge-");
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
  db.initDatabase();
  db.storeChatMetadata("web:default", new Date().toISOString(), "Default");
  const root = db.getChatBranchByChatJid("web:default");
  db.storeChatMetadata("web:default:branch:purge", new Date().toISOString(), "Purge Me");
  db.ensureChatBranch({
    chat_jid: "web:default:branch:purge",
    root_chat_jid: "web:default",
    parent_branch_id: root?.branch_id ?? null,
    agent_name: "purge-me",
  });
  db.archiveChatBranch("web:default:branch:purge");

  let disposed = 0;
  const session = {
    sessionName: "Purge Me",
    isStreaming: false,
    isCompacting: false,
    isRetrying: false,
    isBashRunning: false,
    dispose() {
      disposed += 1;
    },
  };

  const fixture = createManager();
  fixture.pool.set("web:default:branch:purge", { runtime: createRuntime(session), lastUsed: Date.now() });
  fixture.sidePool.set("web:default:branch:purge", { runtime: createRuntime(session), lastUsed: Date.now() });
  const baseDir = ensureSessionDir("web:default:branch:purge");
  writeFileSync(join(baseDir, ".branch-seed.json"), JSON.stringify({ version: 1, parentSession: null, sessionName: "Purge Me", model: null, thinkingLevel: null, mode: "rotated_context" }), "utf8");
  const namedVariantDir = `${baseDir}__variant`;
  mkdirSync(namedVariantDir, { recursive: true });
  writeFileSync(join(namedVariantDir, ".branch-seed.claimed.json"), JSON.stringify({ version: 1, parentSession: null, sessionName: "Purge Me", model: null, thinkingLevel: null, mode: "rotated_context" }), "utf8");

  const result = await fixture.manager.permanentPurgeChatBranch("web:default:branch:purge");
  expect(result.branch.chat_jid).toBe("web:default:branch:purge");
  expect(result.removedSessionArtifacts).toContain(baseDir);
  expect(result.removedSessionArtifacts).toContain(namedVariantDir);
  expect(fixture.pool.has("web:default:branch:purge")).toBe(false);
  expect(fixture.sidePool.has("web:default:branch:purge")).toBe(false);
  expect(db.getChatBranchByChatJid("web:default:branch:purge")).toBeNull();
  expect(disposed).toBe(2);

  ws.cleanup();
});

test("AgentBranchManager permanently purges archived root sessions without child branches", async () => {
  const ws = createTempWorkspace("piclaw-root-session-purge-");
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
  db.initDatabase();
  db.storeChatMetadata("web:custom", new Date().toISOString(), "Custom Root");
  db.archiveChatBranch("web:custom");

  let disposed = 0;
  const session = {
    sessionId: "root-session",
    sessionName: "Custom Root",
    model: { provider: "openai", id: "gpt-test" },
    isStreaming: false,
    isCompacting: false,
    isRetrying: false,
    isBashRunning: false,
    dispose: () => { disposed += 1; },
  };

  const fixture = createManager();
  fixture.pool.set("web:custom", { runtime: createRuntime(session), lastUsed: Date.now() });
  const baseDir = ensureSessionDir("web:custom");
  writeFileSync(join(baseDir, ".branch-seed.json"), JSON.stringify({ version: 1, parentSession: null, sessionName: "Custom Root", model: null, thinkingLevel: null, mode: "rotated_context" }), "utf8");

  const result = await fixture.manager.permanentPurgeChatBranch("web:custom");
  expect(result.branch.chat_jid).toBe("web:custom");
  expect(result.removedSessionArtifacts).toContain(baseDir);
  expect(fixture.pool.has("web:custom")).toBe(false);
  expect(db.getChatBranchByChatJid("web:custom")).toBeNull();
  expect(disposed).toBe(1);

  ws.cleanup();
});

test("AgentBranchManager archives a non-default root session and blocks roots with child branches", async () => {
  const ws = createTempWorkspace("piclaw-root-session-archive-");
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
  db.initDatabase();
  db.storeChatMetadata("web:custom", new Date().toISOString(), "Custom Root");

  const fixture = createManager();
  const archivedRoot = await fixture.manager.pruneChatBranch("web:custom");
  expect(archivedRoot.archived_at).toBeTruthy();

  db.storeChatMetadata("web:family", new Date().toISOString(), "Family Root");
  const familyRoot = db.getChatBranchByChatJid("web:family");
  db.storeChatMetadata("web:family:branch:child", new Date().toISOString(), "Child");
  db.ensureChatBranch({
    chat_jid: "web:family:branch:child",
    root_chat_jid: "web:family",
    parent_branch_id: familyRoot?.branch_id ?? null,
    agent_name: "child",
  });

  await expect(fixture.manager.pruneChatBranch("web:family")).rejects.toThrow(
    "Cannot archive a root chat session while it still has active branch sessions.",
  );

  ws.cleanup();
});
