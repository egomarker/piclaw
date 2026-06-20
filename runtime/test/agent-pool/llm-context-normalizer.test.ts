import { describe, expect, it } from "bun:test";

import { normalizeAgentMessages, normalizeLlmContext, normalizeLlmMessages } from "../../src/agent-pool/llm-context-normalizer.js";

describe("llm context normalizer", () => {
  it("preserves valid user string and multimodal array content", () => {
    const context = {
      messages: [
        { role: "user" as const, content: "hello", timestamp: 1 },
        {
          role: "user" as const,
          content: [
            { type: "text" as const, text: "look" },
            { type: "image" as const, mimeType: "image/png", data: "AAAA" },
          ],
          timestamp: 2,
        },
      ],
    };

    expect(normalizeLlmContext(context)).toBe(context);
  });

  it("coerces malformed user content to a provider-safe string", () => {
    const normalized = normalizeLlmContext({
      messages: [
        { role: "user" as const, timestamp: 1 } as any,
        { role: "user" as const, content: { text: "object content" }, timestamp: 2 } as any,
      ],
    });

    expect(normalized.messages[0]).toMatchObject({ role: "user", content: "" });
    expect(normalized.messages[1].content).toBe('{"text":"object content"}');
  });

  it("normalizes malformed custom messages before convertToLlm can turn them into malformed users", () => {
    const messages = normalizeAgentMessages([
      { role: "custom", customType: "widget", display: true, timestamp: 1 } as any,
    ]);

    expect(messages[0]).toMatchObject({
      role: "custom",
      customType: "widget",
      content: "",
      display: true,
    });
  });

  it("normalizes assistant and tool result array content", () => {
    const normalized = normalizeLlmMessages([
      { role: "assistant", content: undefined, timestamp: "bad" } as any,
      { role: "toolResult", toolCallId: 42, toolName: null, content: undefined, isError: undefined, timestamp: 1 } as any,
    ]);

    expect(normalized.changed).toBe(true);
    expect(normalized.value[0]).toMatchObject({
      role: "assistant",
      content: [{ type: "text", text: "" }],
    });
    expect(normalized.value[1]).toMatchObject({
      role: "toolResult",
      toolCallId: "",
      toolName: "tool",
      isError: false,
      content: [{ type: "text", text: "" }],
    });
  });

  it("normalizes summary messages before coding-agent convertToLlm string concatenation", () => {
    const normalized = normalizeLlmMessages([
      { role: "branchSummary", summary: Symbol.for("bad"), fromId: null, timestamp: "bad" } as any,
      { role: "compactionSummary", summary: Symbol.for("bad"), tokensBefore: "many", timestamp: "bad" } as any,
    ]);

    expect(normalized.changed).toBe(true);
    expect(normalized.value[0]).toMatchObject({ role: "branchSummary", summary: "", fromId: "root" });
    expect(normalized.value[1]).toMatchObject({ role: "compactionSummary", summary: "", tokensBefore: 0 });
  });
});
