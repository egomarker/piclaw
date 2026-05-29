import { describe, expect, it } from "vitest";
import { streamComplete } from "../../src/extensions/smart-compaction/stream-complete.js";

function message(text: string) {
  return {
    role: "assistant" as const,
    content: [{ type: "text" as const, text }],
    stopReason: "stop" as const,
    usage: { inputTokens: 1, outputTokens: 1 },
    timestamp: Date.now(),
  };
}

function fakeStream(events: any[], finalMessage: ReturnType<typeof message>) {
  let iterated = false;
  return {
    get iterated() { return iterated; },
    async *[Symbol.asyncIterator]() {
      iterated = true;
      for (const event of events) yield event;
    },
    async result() {
      return finalMessage;
    },
  };
}

describe("streamComplete", () => {
  it("uses async custom stream functions and reports text progress", async () => {
    const finalMessage = message("hello world");
    const stream = fakeStream([
      { type: "text_delta", delta: "hello" },
      { type: "text_delta", delta: " world" },
      { type: "done", message: finalMessage },
    ], finalMessage);
    const progress: number[] = [];
    const calls: any[] = [];

    const response = await streamComplete({
      model: { id: "test-model" },
      systemPrompt: "system",
      userPrompt: "summarize",
      maxTokens: 128,
      signal: new AbortController().signal,
      apiKey: "key",
      headers: { "x-test": "1" },
      streamFn: async (model, context, options) => {
        calls.push({ model, context, options });
        return stream;
      },
      onProgress: (chars) => progress.push(chars),
      progressIntervalMs: 0,
    });

    expect(response).toBe(finalMessage);
    expect(stream.iterated).toBe(true);
    expect(progress).toEqual([5, 11, 11]);
    expect(calls).toHaveLength(1);
    expect(calls[0].context).toEqual({
      systemPrompt: "system",
      messages: [{
        role: "user",
        content: [{ type: "text", text: "summarize" }],
        timestamp: expect.any(Number),
      }],
    });
    expect(calls[0].options).toMatchObject({
      maxTokens: 128,
      apiKey: "key",
      headers: { "x-test": "1" },
    });
  });

  it("does not iterate streams when no progress callback is provided", async () => {
    const finalMessage = message("done");
    const stream = fakeStream([{ type: "text_delta", delta: "ignored" }], finalMessage);

    const response = await streamComplete({
      model: { id: "test-model" },
      systemPrompt: "system",
      userPrompt: "summarize",
      maxTokens: 128,
      signal: new AbortController().signal,
      streamFn: () => stream,
    });

    expect(response).toBe(finalMessage);
    expect(stream.iterated).toBe(false);
  });
});
