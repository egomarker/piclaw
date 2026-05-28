import { expect, test } from "bun:test";

import { sanitizeProviderPayloadItemIds } from "../../src/extensions/provider-request-sanitizer.js";

test("leaves provider payloads without duplicate input item IDs untouched", () => {
  const payload = {
    model: "gpt-5.5",
    input: [
      { type: "message", id: "msg_1", role: "assistant", content: [] },
      { type: "message", id: "msg_2", role: "assistant", content: [] },
      { type: "function_call_output", call_id: "call_1", output: "ok" },
    ],
  };

  expect(sanitizeProviderPayloadItemIds(payload)).toBe(payload);
});

test("deduplicates repeated Responses input item IDs while preserving first occurrence", () => {
  const first = { type: "message", id: "msg_25", role: "assistant", content: [{ type: "output_text", text: "thinking", annotations: [] }] };
  const duplicate = { type: "message", id: "msg_25", role: "assistant", content: [{ type: "output_text", text: "answer", annotations: [] }] };
  const payload = {
    model: "gpt-5.5",
    input: [first, duplicate],
  };

  const sanitized = sanitizeProviderPayloadItemIds(payload) as typeof payload;

  expect(sanitized).not.toBe(payload);
  expect(sanitized.input).not.toBe(payload.input);
  expect(sanitized.input[0]).toBe(first);
  expect(sanitized.input[1]).not.toBe(duplicate);
  expect(sanitized.input[0].id).toBe("msg_25");
  expect(sanitized.input[1].id).toStartWith("msg_25_");
  expect(sanitized.input[1].id).not.toBe("msg_25");
  expect(new Set(sanitized.input.map((item) => item.id)).size).toBe(2);
});

test("keeps generated duplicate IDs within Responses API length constraints", () => {
  const longId = `msg_${"x".repeat(90)}`;
  const payload = {
    input: [
      { type: "message", id: longId, role: "assistant", content: [] },
      { type: "message", id: longId, role: "assistant", content: [] },
      { type: "message", id: longId, role: "assistant", content: [] },
    ],
  };

  const sanitized = sanitizeProviderPayloadItemIds(payload) as typeof payload;
  const ids = sanitized.input.map((item) => item.id);

  expect(new Set(ids).size).toBe(3);
  expect(ids[0]).toBe(longId);
  expect(ids[1].length).toBeLessThanOrEqual(64);
  expect(ids[2].length).toBeLessThanOrEqual(64);
});
