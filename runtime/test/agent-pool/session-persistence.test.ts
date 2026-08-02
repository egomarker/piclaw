import { expect, test } from "bun:test";

import { createSessionManagerPersistencePort } from "../../src/agent-pool/session-persistence.js";

test("SessionManager persistence adapter exposes asynchronous reads and writes", async () => {
  const calls: string[] = [];
  const manager = {
    getLeafId: () => "leaf",
    getEntries: () => [{ type: "custom", id: "entry" }],
    getBranch: (leafId?: string | null) => [{ type: "custom", id: leafId || "current" }],
    buildSessionContext: () => ({ messages: [], thinkingLevel: "off", model: null }),
    getSessionFile: () => "/tmp/session.jsonl",
    getSessionName: () => "Session",
    appendMessage: () => { calls.push("message"); return "m1"; },
    appendThinkingLevelChange: () => { calls.push("thinking"); return "t1"; },
    appendModelChange: () => { calls.push("model"); return "model1"; },
    appendCompaction: () => { calls.push("compaction"); return "c1"; },
    appendSessionInfo: () => { calls.push("session"); return "s1"; },
    appendCustomMessageEntry: () => { calls.push("custom-message"); return "cm1"; },
    appendCustomEntry: () => { calls.push("custom"); return "ce1"; },
  } as any;
  const port = createSessionManagerPersistencePort(manager);

  expect(await port.getLeafId()).toBe("leaf");
  expect(await port.getEntries()).toEqual([{ type: "custom", id: "entry" }]);
  expect(await port.getBranch("target")).toEqual([{ type: "custom", id: "target" }]);
  expect(await port.buildContext()).toEqual({ messages: [], thinkingLevel: "off", model: null });
  expect(await port.getSessionFile()).toBe("/tmp/session.jsonl");
  expect(await port.getSessionName()).toBe("Session");
  expect(await Promise.all([
    port.appendMessage({ role: "user", content: "x", timestamp: Date.now() } as any),
    port.appendThinkingLevelChange("high"),
    port.appendModelChange("provider", "model"),
    port.appendCompaction("summary", "first", 10),
    port.appendSessionInfo("name"),
    port.appendCustomMessageEntry("x", "content", true),
    port.appendCustomEntry("x", {}),
  ])).toEqual(["m1", "t1", "model1", "c1", "s1", "cm1", "ce1"]);
  expect(calls).toEqual(["message", "thinking", "model", "compaction", "session", "custom-message", "custom"]);
});

test("SessionManager persistence adapter awaits async stores and disposes exactly once", async () => {
  let disposeCalls = 0;
  let releaseDispose!: () => void;
  const gate = new Promise<void>((resolve) => { releaseDispose = resolve; });
  const manager = {
    getLeafId: async () => null,
    getEntries: async () => [],
    getBranch: async () => [],
    buildSessionContext: async () => ({ messages: [], thinkingLevel: "off", model: null }),
    getSessionFile: async () => undefined,
    getSessionName: async () => undefined,
    appendMessage: async () => "m",
    appendThinkingLevelChange: async () => "t",
    appendModelChange: async () => "model",
    appendCompaction: async () => "c",
    appendSessionInfo: async () => "s",
    appendCustomMessageEntry: async () => "cm",
    appendCustomEntry: async () => "ce",
  } as any;
  const port = createSessionManagerPersistencePort(manager, {
    dispose: async () => { disposeCalls += 1; await gate; },
  });

  const first = port.dispose();
  const second = port.dispose();
  await Bun.sleep(0);
  expect(disposeCalls).toBe(1);
  releaseDispose();
  await Promise.all([first, second]);
  await port.dispose();
  expect(disposeCalls).toBe(1);
  expect(await port.getSessionFile()).toBeNull();
  expect(await port.getSessionName()).toBeNull();
});
