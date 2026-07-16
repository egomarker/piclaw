import { expect, test } from "bun:test";
import type { AssistantMessage } from "@earendil-works/pi-ai";
import { registerFauxProvider } from "@earendil-works/pi-ai/compat";

import "../helpers.js";
import { createCompactionStreamFn } from "../../src/agent-pool/session.js";

function assistantMessage(text: string): AssistantMessage {
  return {
    role: "assistant",
    content: [{ type: "text", text }],
    api: "faux",
    provider: "faux",
    model: "faux",
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    },
    stopReason: "stop",
    timestamp: Date.now(),
  };
}

function createFauxFixture() {
  const namespace = `compaction-auth-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const providerId = `faux-${namespace}`;
  return registerFauxProvider({
    api: providerId,
    provider: providerId,
    models: [{ id: providerId, name: `Faux ${namespace}` }],
  });
}

test("createCompactionStreamFn trusts already-resolved compaction auth options", async () => {
  const streamCalls: Array<{ model: unknown; context: unknown; options: any }> = [];
  const faux = createFauxFixture();
  faux.setResponses([(_context, options, _state, model) => {
    streamCalls.push({ model, context: _context, options });
    return assistantMessage("ok");
  }]);
  let authResolutionCount = 0;

  try {
    const streamFn = createCompactionStreamFn(
      {
        async getApiKeyAndHeaders() {
          authResolutionCount += 1;
          return {
            ok: true,
            apiKey: "second-key",
            headers: { Authorization: "Bearer second" },
            env: { TOKEN: "second" },
          };
        },
      } as any,
      {
        getProviderRetrySettings: () => ({ timeoutMs: 1234, maxRetries: 2, maxRetryDelayMs: 345 }),
      } as any,
    );

    const stream = await streamFn(
      faux.getModel()!,
      { systemPrompt: "sys", messages: [{ role: "user", content: "hello" }] },
      {
        apiKey: "first-key",
        headers: { Authorization: "Bearer first" },
        env: { TOKEN: "first" },
        maxTokens: 32,
      } as any,
    );
    await stream.result();

    expect(authResolutionCount).toBe(0);
    expect(streamCalls).toHaveLength(1);
    expect(streamCalls[0].options).toMatchObject({
      apiKey: "first-key",
      headers: { Authorization: "Bearer first" },
      env: { TOKEN: "first" },
      maxTokens: 32,
      timeoutMs: 1234,
      maxRetries: 2,
      maxRetryDelayMs: 345,
    });
  } finally {
    faux.unregister();
  }
});

test("createCompactionStreamFn resolves compaction auth exactly once when no auth options are supplied", async () => {
  const streamCalls: Array<{ model: unknown; context: unknown; options: any }> = [];
  const faux = createFauxFixture();
  faux.setResponses([(_context, options, _state, model) => {
    streamCalls.push({ model, context: _context, options });
    return assistantMessage("ok");
  }]);
  let authResolutionCount = 0;

  try {
    const streamFn = createCompactionStreamFn(
      {
        async getApiKeyAndHeaders() {
          authResolutionCount += 1;
          return {
            ok: true,
            apiKey: `key-${authResolutionCount}`,
            headers: { Authorization: `Bearer ${authResolutionCount}` },
            env: { TOKEN: `env-${authResolutionCount}` },
          };
        },
      } as any,
      {
        getProviderRetrySettings: () => ({ timeoutMs: 1234, maxRetries: 2, maxRetryDelayMs: 345 }),
      } as any,
    );

    const stream = await streamFn(
      faux.getModel()!,
      { systemPrompt: "sys", messages: [{ role: "user", content: "hello" }] },
      { maxTokens: 32 } as any,
    );
    await stream.result();

    expect(authResolutionCount).toBe(1);
    expect(streamCalls).toHaveLength(1);
    expect(streamCalls[0].options).toMatchObject({
      apiKey: "key-1",
      headers: { Authorization: "Bearer 1" },
      env: { TOKEN: "env-1" },
      maxTokens: 32,
    });
  } finally {
    faux.unregister();
  }
});
