import { afterEach, expect, test } from "bun:test";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

import { importFresh } from "./helpers.js";

afterEach(() => {
  // no-op: test uses whichever workspace path the current config module has cached
});

const acceptModelChange = async () => ({ status: "success", message: "ok" } as const);
const withSessionEvictionProtection = async <T>(_chatJid: string, operation: () => Promise<T>): Promise<T> => await operation();

test("runDreamAgentTurn applies an explicit Dream model override to the temporary dream chat", async () => {
  const config = await import("../src/core/config.js");
  rmSync(join(config.WORKSPACE_DIR, "notes"), { recursive: true, force: true });
  rmSync(join(config.DATA_DIR, "dream-backups"), { recursive: true, force: true });
  rmSync(join(config.DATA_DIR, "workspace-search"), { recursive: true, force: true });

  const db = await import("../src/db.js");
  db.initDatabase();

  const fixedNow = Date.parse("2026-01-02T03:04:05.000Z");
  const expectedDreamChatJid = `dream:manual:web_default:${fixedNow}`;
  const applied: Array<{ chatJid: string; raw: string | undefined }> = [];
  const runChats: string[] = [];
  const leaseEvents: string[] = [];
  let protectedChatJid: string | null = null;

  const realNow = Date.now;
  Date.now = () => fixedNow;
  try {
    const dream = await importFresh<typeof import("../src/dream.js")>("../src/dream.js");
    const result = await dream.runDreamAgentTurn({
      chatJid: "web:default",
      days: 2,
      mode: "manual",
      model: "openai-compatible/glm-5.1",
      agentPool: {
        withSessionEvictionProtection: async <T>(chatJid: string, operation: () => Promise<T>): Promise<T> => {
          expect(chatJid).toBe(expectedDreamChatJid);
          protectedChatJid = chatJid;
          leaseEvents.push("acquire");
          try {
            return await operation();
          } finally {
            protectedChatJid = null;
            leaseEvents.push("release");
          }
        },
        applyControlCommand: async (chatJid: string, command: { raw?: string }) => {
          expect(protectedChatJid).toBe(chatJid);
          leaseEvents.push("model");
          applied.push({ chatJid, raw: command.raw });
          return { status: "success", message: "ok" };
        },
        runAgent: async (_prompt: string, chatJid: string) => {
          expect(protectedChatJid).toBe(chatJid);
          leaseEvents.push("prompt");
          runChats.push(chatJid);
          return { status: "success", result: "Dream complete." };
        },
        disposeChatSession: async () => {
          expect(protectedChatJid).toBeNull();
          leaseEvents.push("cleanup");
        },
      } as any,
    });

    expect(result.skipped).toBe(false);
    expect(applied).toEqual([{ chatJid: expectedDreamChatJid, raw: "/model openai-compatible/glm-5.1" }]);
    expect(runChats).toEqual([expectedDreamChatJid]);
    expect(protectedChatJid).toBeNull();
    expect(leaseEvents).toEqual(["acquire", "model", "prompt", "release", "cleanup"]);
  } finally {
    Date.now = realNow;
  }
});

test("runDreamAgentTurn reaps a stale dream lock and materializes memory files after the model pass", { timeout: 15000 }, async () => {
  const config = await import("../src/core/config.js");
  rmSync(join(config.WORKSPACE_DIR, "notes"), { recursive: true, force: true });
  rmSync(join(config.DATA_DIR, "dream-backups"), { recursive: true, force: true });
  rmSync(join(config.DATA_DIR, "workspace-search"), { recursive: true, force: true });
  mkdirSync(join(config.DATA_DIR, "dream-backups"), { recursive: true });
  for (let i = 0; i < 12; i += 1) {
    writeFileSync(join(config.DATA_DIR, "dream-backups", `2026-01-01T00-00-${String(i).padStart(2, "0")}-000Z-auto-web_default.zip`), "old", "utf8");
  }
  mkdirSync(join(config.WORKSPACE_DIR, "notes", "memory"), { recursive: true });
  writeFileSync(join(config.WORKSPACE_DIR, "notes", "memory", ".dream.lock"), "999999\n", "utf8");

  const fixedNow = Date.parse("2026-01-02T03:04:05.000Z");
  const dreamChatJid = `dream:auto:web_default:${fixedNow}`;
  const dreamSessionDir = join(config.DATA_DIR, "sessions", `dream_auto_web_default_${fixedNow}`);

  const realNow = Date.now;
  Date.now = () => fixedNow;
  try {
    const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
    db.initDatabase();
    const rawDb = db.getDb();
    rawDb.prepare("INSERT OR REPLACE INTO chats (jid, name, last_message_time) VALUES (?, ?, ?)").run(dreamChatJid, "dream", "2026-01-01T00:00:00.000Z");
    rawDb.prepare("INSERT OR REPLACE INTO chat_cursors (chat_jid, cursor_ts) VALUES (?, ?)").run(dreamChatJid, "2026-01-01T00:00:00.000Z");
    rawDb.prepare("INSERT OR REPLACE INTO chat_branches (branch_id, chat_jid, root_chat_jid, parent_branch_id, agent_name, created_at, updated_at, archived_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      "dream-branch-1",
      dreamChatJid,
      dreamChatJid,
      null,
      "dream-test-agent",
      "2026-01-01T00:00:00.000Z",
      "2026-01-01T00:00:00.000Z",
      null,
    );
    rawDb.prepare("INSERT INTO token_usage (chat_jid, run_at, input_tokens, output_tokens, total_tokens, turns) VALUES (?, ?, ?, ?, ?, ?)").run(
      dreamChatJid,
      "2026-01-01T00:00:00.000Z",
      10,
      20,
      30,
      1,
    );
    mkdirSync(dreamSessionDir, { recursive: true });
    writeFileSync(join(dreamSessionDir, "session.json"), "{}", "utf8");

    const dream = await importFresh<typeof import("../src/dream.js")>("../src/dream.js");
    const result = await dream.runDreamAgentTurn({
      chatJid: "web:default",
      days: 2,
      mode: "auto",
      agentPool: {
        withSessionEvictionProtection,
        applyControlCommand: acceptModelChange,
        runAgent: async () => ({ status: "success", result: "AutoDream complete." }),
        disposeChatSession: async () => {},
      } as any,
    });

    expect(result.skipped).toBe(false);
    expect(existsSync(join(config.WORKSPACE_DIR, "notes", "memory", "MEMORY.md"))).toBe(true);
    expect(existsSync(join(config.WORKSPACE_DIR, "notes", "memory", "current-state.md"))).toBe(true);
    expect(existsSync(join(config.WORKSPACE_DIR, "notes", "memory", "recent-context.md"))).toBe(true);
    expect(result.result).toContain("Memory refreshed after Dream: yes");

    expect(rawDb.prepare("SELECT COUNT(*) AS count FROM chats WHERE jid = ?").get(dreamChatJid)).toEqual({ count: 0 });
    expect(rawDb.prepare("SELECT COUNT(*) AS count FROM chat_cursors WHERE chat_jid = ?").get(dreamChatJid)).toEqual({ count: 0 });
    expect(rawDb.prepare("SELECT COUNT(*) AS count FROM chat_branches WHERE chat_jid = ?").get(dreamChatJid)).toEqual({ count: 0 });
    expect(rawDb.prepare("SELECT COUNT(*) AS count FROM token_usage WHERE chat_jid = ?").get(dreamChatJid)).toEqual({ count: 0 });
    expect(existsSync(dreamSessionDir)).toBe(false);

    const backups = readdirSync(join(config.DATA_DIR, "dream-backups")).sort();
    expect(backups).toHaveLength(10);
    const latestBackup = join(config.DATA_DIR, "dream-backups", backups.at(-1)!);
    expect(latestBackup.endsWith(".zip")).toBe(true);
    const list = Bun.spawnSync(["unzip", "-Z1", latestBackup], { stdout: "pipe", stderr: "pipe" });
    expect(list.exitCode, list.stderr.toString()).toBe(0);
    const archived = list.stdout.toString("utf8");
    expect(archived).toContain("manifest.json");
    expect(archived).not.toContain("notes/memory/.dream.lock");
  } finally {
    Date.now = realNow;
  }
});

test("runDreamAgentTurn skips gracefully when another live Dream run holds the lock", async () => {
  const config = await import("../src/core/config.js");
  rmSync(join(config.WORKSPACE_DIR, "notes"), { recursive: true, force: true });
  mkdirSync(join(config.WORKSPACE_DIR, "notes", "memory"), { recursive: true });
  writeFileSync(join(config.WORKSPACE_DIR, "notes", "memory", ".dream.lock"), "424242\n", "utf8");

  const realKill = process.kill;
  try {
    process.kill = ((pid: number, signal?: number | NodeJS.Signals) => {
      expect(pid).toBe(424242);
      void signal;
      return true;
    }) as typeof process.kill;

    const dream = await importFresh<typeof import("../src/dream.js")>("../src/dream.js");
    const result = await dream.runDreamAgentTurn({
      chatJid: "web:default",
      days: 2,
      mode: "auto",
      agentPool: {
        withSessionEvictionProtection: async () => { throw new Error("Skipped Dream must not acquire protection"); },
        runAgent: async () => ({ status: "success", result: "should not run" }),
        disposeChatSession: async () => {},
      } as any,
    });

    expect(result.skipped).toBe(true);
    expect(result.result).toContain("Dream already running");
    expect(readFileSync(join(config.WORKSPACE_DIR, "notes", "memory", ".dream.lock"), "utf8")).toContain("424242");
  } finally {
    process.kill = realKill;
  }
});

test("runDreamAgentTurn records recovery summaries when the model pass succeeds after recovery", async () => {
  const config = await import("../src/core/config.js");
  rmSync(join(config.WORKSPACE_DIR, "notes"), { recursive: true, force: true });
  rmSync(join(config.DATA_DIR, "dream-backups"), { recursive: true, force: true });
  rmSync(join(config.DATA_DIR, "workspace-search"), { recursive: true, force: true });

  const dream = await importFresh<typeof import("../src/dream.js")>("../src/dream.js");
  const result = await dream.runDreamAgentTurn({
    chatJid: "web:default",
    days: 2,
    mode: "auto",
    agentPool: {
      withSessionEvictionProtection,
      applyControlCommand: acceptModelChange,
      runAgent: async () => ({
        status: "success",
        result: "AutoDream complete.",
        recovery: {
          attemptsUsed: 1,
          totalElapsedMs: 1200,
          recovered: true,
          exhausted: false,
          lastClassifier: "context_pressure",
          strategyHistory: ["compact_then_retry"],
        },
      }),
      disposeChatSession: async () => {},
    } as any,
  });

  expect(result.skipped).toBe(false);
  expect(result.result).toContain("AutoDream complete.");
  expect(result.result).toContain("Automatic recovery succeeded after 1 attempt");
  expect(result.result).toContain("context_pressure");
});

test("runDreamAgentTurn falls back to deterministic refresh when the model pass errors", async () => {
  const config = await import("../src/core/config.js");
  rmSync(join(config.WORKSPACE_DIR, "notes"), { recursive: true, force: true });
  rmSync(join(config.DATA_DIR, "dream-backups"), { recursive: true, force: true });
  rmSync(join(config.DATA_DIR, "workspace-search"), { recursive: true, force: true });

  const dream = await importFresh<typeof import("../src/dream.js")>("../src/dream.js");
  let capturedTimeoutMs: number | undefined;
  const result = await dream.runDreamAgentTurn({
    chatJid: "web:default",
    days: 2,
    mode: "auto",
    agentPool: {
      withSessionEvictionProtection,
      applyControlCommand: acceptModelChange,
      runAgent: async (_prompt: string, _chatJid: string, options?: { timeoutMs?: number }) => {
        capturedTimeoutMs = options?.timeoutMs;
        return {
          status: "error",
          error: "Timed out after 3m",
          recovery: {
            attemptsUsed: 2,
            totalElapsedMs: 30000,
            recovered: false,
            exhausted: true,
            lastClassifier: "budget_exhausted",
            strategyHistory: ["retry", "compact_then_retry"],
          },
        };
      },
      disposeChatSession: async () => {},
    } as any,
  });

  expect(result.skipped).toBe(false);
  expect(result.result).toContain("model pass failed; deterministic refresh completed");
  expect(result.result).toContain("Timed out after 3m");
  expect(result.result).toContain("Memory refreshed after Dream: yes");
  expect(result.result).toContain("Automatic recovery exhausted after 2 attempt");
  expect(capturedTimeoutMs).toBeGreaterThan(0);
  expect(existsSync(join(config.WORKSPACE_DIR, "notes", "memory", "MEMORY.md"))).toBe(true);
  expect(existsSync(join(config.WORKSPACE_DIR, "notes", "memory", ".dream.lock"))).toBe(false);
});

for (const outcome of ["model_error", "model_throw", "prompt_error", "prompt_throw", "cleanup_error"] as const) {
  test("runDreamAgentTurn releases protection before fallback/cleanup: " + outcome, async () => {
    const config = await import("../src/core/config.js");
    rmSync(join(config.WORKSPACE_DIR, "notes"), { recursive: true, force: true });
    rmSync(join(config.DATA_DIR, "dream-backups"), { recursive: true, force: true });
    rmSync(join(config.DATA_DIR, "workspace-search"), { recursive: true, force: true });
    const db = await import("../src/db.js");
    db.initDatabase();

    let protectedChatJid: string | null = null;
    let released = 0;
    let prompted = 0;
    let cleaned = 0;
    const dream = await importFresh<typeof import("../src/dream.js")>("../src/dream.js");
    const run = dream.runDreamAgentTurn({
      chatJid: "web:default",
      mode: "manual",
      model: "zai/glm-5.2",
      agentPool: {
        withSessionEvictionProtection: async <T>(chatJid: string, operation: () => Promise<T>): Promise<T> => {
          expect(chatJid.startsWith("dream:manual:")).toBe(true);
          protectedChatJid = chatJid;
          try {
            return await operation();
          } finally {
            protectedChatJid = null;
            released += 1;
          }
        },
        applyControlCommand: async (chatJid: string) => {
          expect(protectedChatJid).toBe(chatJid);
          if (outcome === "model_throw") throw new Error("model setup failed");
          if (outcome === "model_error") return { status: "error", message: "model unavailable" };
          return acceptModelChange();
        },
        runAgent: async (_prompt: string, chatJid: string) => {
          expect(protectedChatJid).toBe(chatJid);
          prompted += 1;
          if (outcome === "prompt_throw") throw new Error("prompt failed");
          if (outcome === "prompt_error") return { status: "error", error: "Timed out", result: null };
          return { status: "success", result: "Dream complete." };
        },
        disposeChatSession: async () => {
          expect(protectedChatJid).toBeNull();
          cleaned += 1;
          if (outcome === "cleanup_error") throw new Error("cleanup failed");
        },
      } as any,
    });

    if (outcome === "model_throw" || outcome === "prompt_throw") {
      await expect(run).rejects.toThrow(outcome === "model_throw" ? "model setup failed" : "prompt failed");
    } else {
      const result = await run;
      expect(result.skipped).toBe(false);
      if (outcome === "model_error") expect(result.result).toContain("model switch failed; deterministic refresh completed");
      if (outcome === "prompt_error") expect(result.result).toContain("model pass failed; deterministic refresh completed");
    }
    expect(prompted).toBe(outcome.startsWith("model_") ? 0 : 1);
    expect(protectedChatJid).toBeNull();
    expect(released).toBe(1);
    expect(cleaned).toBe(1);
    expect(existsSync(join(config.WORKSPACE_DIR, "notes", "memory", ".dream.lock"))).toBe(false);
  });
}
