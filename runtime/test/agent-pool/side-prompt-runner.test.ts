import { expect, test } from "bun:test";

import { runSidePrompt } from "../../src/agent-pool/side-prompt-runner.js";

test("runSidePrompt returns an error when no model is active", async () => {
  const result = await runSidePrompt("web:default", "hello", {}, {
    getOrCreate: async () => ({ model: null }) as any,
    getOrCreateSideRuntime: async () => ({ session: {} }) as any,
    syncSideSessionFromMain: async () => {},
    modelRegistry: {},
  });

  expect(result.status).toBe("error");
  expect(result.error).toContain("No active model selected");
});

test("runSidePrompt handles streamSimple side prompts", async () => {
  const seen: Array<{ prompt: string; reasoning: unknown; headers: unknown; env: unknown }> = [];
  const session = {
    model: { provider: "openai", id: "gpt-test", reasoning: true },
    thinkingLevel: "high",
  };

  const result = await runSidePrompt("web:default", "hello", { systemPrompt: "brief" }, {
    getOrCreate: async () => session as any,
    getOrCreateSideRuntime: async () => ({ session: {} }) as any,
    syncSideSessionFromMain: async () => {},
    modelRegistry: {
      getApiKeyAndHeaders: async () => ({ ok: true, apiKey: "key", headers: { "X-Test": "1" }, env: { TEST_BASE_URL: "https://example.test" } }),
    },
    sideStreamSimple: (_model, context, options) => {
      seen.push({
        prompt: String((context.messages[0] as any).content[0].text),
        reasoning: options?.reasoning,
        headers: options?.headers,
        env: options?.env,
      });
      return (async function* () {
        yield { type: "thinking_delta", delta: "plan" } as any;
        yield { type: "text_delta", delta: "answer" } as any;
        yield {
          type: "done",
          message: {
            role: "assistant",
            content: [{ type: "text", text: "answer" }],
            usage: { totalTokens: 1 },
            stopReason: "stop",
          },
        } as any;
      })() as any;
    },
  });

  expect(result.status).toBe("success");
  expect(result.result).toBe("answer");
  expect(result.thinking).toBe("plan");
  expect(result.model).toBe("openai/gpt-test");
  expect(seen).toEqual([{
    prompt: "hello",
    reasoning: "high",
    headers: { "X-Test": "1" },
    env: { TEST_BASE_URL: "https://example.test" },
  }]);
});
