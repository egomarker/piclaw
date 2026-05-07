import { expect, test } from "bun:test";

import type { AgentSessionRuntime } from "@earendil-works/pi-coding-agent";
import { AgentSessionBinder } from "../../src/agent-pool/session-binder.js";

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
    dispose: async () => {},
  } as any;
}

test("AgentSessionBinder binds existing sessions and handles binder failures", async () => {
  const pool = new Map<string, { runtime: any; lastUsed: number }>();
  const calls: Array<{ session: string; chatJid: string }> = [];
  const errors: string[] = [];

  pool.set("web:one", { runtime: createRuntime({ id: "one" }), lastUsed: Date.now() });
  pool.set("web:two", { runtime: createRuntime({ id: "two" }), lastUsed: Date.now() });

  const binder = new AgentSessionBinder({
    pool: pool as any,
    onError: (message) => errors.push(message),
  });

  binder.setBinder((runtime: any, chatJid) => {
    const session = runtime.session;
    calls.push({ session: session.id, chatJid });
    if (chatJid === "web:two") throw new Error("boom");
  });

  await binder.bindSession(createRuntime({ id: "three" }) as any, "web:three");

  expect(calls).toEqual([
    { session: "one", chatJid: "web:one" },
    { session: "two", chatJid: "web:two" },
    { session: "three", chatJid: "web:three" },
  ]);
  expect(errors).toEqual(["Failed to bind session"]);
});

test("AgentSessionBinder reports async binder failures for existing sessions", async () => {
  const pool = new Map<string, { runtime: any; lastUsed: number }>();
  const errors: string[] = [];

  pool.set("web:one", { runtime: createRuntime({ id: "one" }), lastUsed: Date.now() });
  pool.set("web:two", { runtime: createRuntime({ id: "two" }), lastUsed: Date.now() });

  const binder = new AgentSessionBinder({
    pool: pool as any,
    onError: (message) => errors.push(message),
  });

  binder.setBinder(async (_runtime: any, chatJid) => {
    if (chatJid === "web:two") throw new Error("async boom");
  });

  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(errors).toEqual(["Failed to bind session"]);
});
