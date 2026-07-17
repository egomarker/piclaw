import { expect, test } from "bun:test";

import { runSidePrompt } from "../../src/agent-pool/side-prompt-runner.js";

test("runSidePrompt returns an error when no model is active", async () => {
  const result = await runSidePrompt("web:default", "hello", {}, {
    getOrCreate: async () => ({ model: null }) as any,
    getOrCreateSideRuntime: async () => ({ session: {} }) as any,
    syncSideSessionFromMain: async () => {},
    modelRuntime: { streamSimple: () => { throw new Error("not called"); } } as any,
  });

  expect(result.status).toBe("error");
  expect(result.error).toContain("No active model selected");
});

test("runSidePrompt routes simple side prompts through the shared ModelRuntime", async () => {
  const seen: Array<{ prompt: string; reasoning: unknown; signal: unknown }> = [];
  const session = {
    model: { provider: "openai", id: "gpt-test", reasoning: true },
    thinkingLevel: "high",
  };
  const signal = new AbortController().signal;
  const streamSimple = (_model: any, context: any, options: any) => {
    seen.push({
      prompt: String(context.messages[0].content[0].text),
      reasoning: options?.reasoning,
      signal: options?.signal,
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
  };

  const result = await runSidePrompt("web:default", "hello", { systemPrompt: "brief", signal }, {
    getOrCreate: async () => session as any,
    getOrCreateSideRuntime: async () => ({ session: {} }) as any,
    syncSideSessionFromMain: async () => {},
    modelRuntime: { streamSimple } as any,
    sideStreamSimple: streamSimple as any,
  });

  expect(result.status).toBe("success");
  expect(result.result).toBe("answer");
  expect(result.thinking).toBe("plan");
  expect(result.model).toBe("openai/gpt-test");
  expect(seen).toEqual([{ prompt: "hello", reasoning: "high", signal }]);
});
