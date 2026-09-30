import { beforeEach, expect, test } from "bun:test";

import "../helpers.js";
import { handleCycleModel, handleModel } from "../../src/agent-control/handlers/model.js";
import { initDatabase } from "../../src/db.js";

beforeEach(() => {
  initDatabase();
});

function makeRegistry(models: any[]) {
  return {
    refresh: async () => ({ aborted: false, errors: new Map<string, Error>() }),
    getAll: () => models,
    getAvailable: () => models,
  };
}

test("handleModel compacts with the current larger model before downshifting", async () => {
  const large = { provider: "test", id: "large", contextWindow: 200_000, reasoning: false };
  const small = { provider: "test", id: "small", contextWindow: 100_000, reasoning: false };
  let usageTokens = 120_000;
  let compactCalls = 0;
  let compactInstructions = "";
  const session: any = {
    model: large,
    thinkingLevel: "medium",
    isCompacting: false,
    getContextUsage: () => ({ tokens: usageTokens }),
    sessionManager: {
      buildSessionContext: () => ({ messages: [{ role: "user", content: [{ type: "text", text: "x" }] }] }),
    },
    async compact(instructions?: string) {
      compactCalls += 1;
      compactInstructions = instructions || "";
      expect(this.model).toBe(large);
      usageTokens = 20_000;
      return { summary: "compacted", tokensBefore: 120_000, firstKeptEntryId: "kept" };
    },
    async setModel(model: any) {
      this.model = model;
    },
    supportsThinking: () => false,
  };

  const result = await handleModel(session, makeRegistry([large, small]) as any, {
    type: "model",
    raw: "/model test/small",
    provider: "test",
    modelId: "small",
  } as any);

  expect(result.status).toBe("success");
  expect(session.model).toBe(small);
  expect(compactCalls).toBe(1);
  expect(compactInstructions).toContain("piclaw:target-context-window=100000");
  expect(result.message).toContain("Compacted with the previous model first");
});

test("model listing uses selectable models rather than the complete cached catalog", async () => {
  const available = { provider: "github-copilot", id: "confirmed", reasoning: false };
  const cacheOnly = { ...available, id: "cache-only" };
  const registry = { ...makeRegistry([available, cacheOnly]), getAvailable: () => [available] };
  const result = await handleModel({ model: available } as any, registry as any, { type: "model", raw: "/model" });
  expect(result.status).toBe("success");
  expect(result.message).toContain("github-copilot/confirmed");
  expect(result.message).not.toContain("cache-only");
  expect(result.message).not.toContain("cached catalog");
});

for (const cancelled of [false, true]) {
  test(`model listing surfaces ${cancelled ? "cancellation" : "provider errors"} without losing cached selections`, async () => {
    const available = { provider: "github-copilot", id: "confirmed", reasoning: false };
    const registry = {
      ...makeRegistry([available]),
      refresh: async () => ({
        aborted: cancelled,
        errors: new Map(cancelled ? [] : [["github-copilot", new Error("private provider detail")]]),
      }),
    };
    const result = await handleModel({ model: available } as any, registry as any, { type: "model", raw: "/model" });
    expect(result.status).toBe("success");
    expect(result.message).toContain("github-copilot/confirmed");
    expect(result.message).toContain(cancelled ? "cancelled" : "failed for github-copilot");
    expect(result.message).toContain("cached catalog");
    expect(result.message).not.toContain("private provider detail");
  });
}

test("model listing retains cached selections when refresh throws", async () => {
  const available = { provider: "test", id: "cached", reasoning: false };
  const registry = { ...makeRegistry([available]), refresh: async () => { throw new Error("reload failed"); } };
  const result = await handleModel({ model: available } as any, registry as any, { type: "model", raw: "/model" });
  expect(result.status).toBe("success");
  expect(result.message).toContain("test/cached");
  expect(result.message).toContain("refresh failed; using the cached catalog");
});

test("model cycling surfaces returned refresh errors and continues with selectable models", async () => {
  const first = { provider: "test", id: "first", reasoning: false, contextWindow: 100_000 };
  const next = { ...first, id: "next" };
  const registry = {
    ...makeRegistry([first, next]),
    refresh: async () => ({ aborted: false, errors: new Map([["test", new Error("catalog failed")]]) }),
  };
  const session = {
    model: first,
    getContextUsage: () => ({ tokens: 0 }),
    cycleModel: async () => ({ model: next, isScoped: false, thinkingLevel: "off" }),
  };
  const result = await handleCycleModel(session as any, registry as any, { type: "cycle_model", raw: "/cycle-model", direction: "next" } as any);
  expect(result.status).toBe("success");
  expect(result.model_label).toBe("test/next");
  expect(result.message).toContain("failed for test");
});
