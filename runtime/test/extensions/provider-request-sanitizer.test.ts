import { expect, test } from "bun:test";

import {
  providerRequestSanitizer,
  sanitizeProviderPayloadItemIds,
} from "../../src/extensions/provider-request-sanitizer.js";

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

test("removes a duplicate optional Responses item ID instead of fabricating a provider-owned ID", () => {
  const first = { type: "message", id: "msg_25", role: "assistant", content: [{ type: "output_text", text: "thinking", annotations: [] }] };
  const duplicate = { type: "message", id: "msg_25", role: "assistant", content: [{ type: "output_text", text: "answer", annotations: [] }] };
  const payload = {
    model: "gpt-5.5",
    input: [first, duplicate],
  };

  const sanitized = sanitizeProviderPayloadItemIds(payload) as any;

  expect(sanitized).not.toBe(payload);
  expect(sanitized.input).not.toBe(payload.input);
  expect(sanitized.input[0]).toBe(first);
  expect(sanitized.input[1]).not.toBe(duplicate);
  expect(sanitized.input[0].id).toBe("msg_25");
  expect(sanitized.input[1].id).toBeUndefined();
  expect(duplicate.id).toBe("msg_25");
});

test("drops duplicate reasoning items whose required IDs cannot be safely rewritten", () => {
  const first = { type: "reasoning", id: "rs_1", encrypted_content: "first", summary: [] };
  const duplicate = { type: "reasoning", id: "rs_1", encrypted_content: "second", summary: [] };
  const payload = { input: [first, duplicate] };

  const sanitized = sanitizeProviderPayloadItemIds(payload) as any;

  expect(sanitized.input).toEqual([first]);
  expect(payload.input).toEqual([first, duplicate]);
});

test("strips GitHub Copilot connection-bound Responses IDs while preserving tool-call pairing", () => {
  const payload = {
    model: "gpt-5.5",
    input: [
      { type: "reasoning", id: "opaque-connection-reasoning-id", encrypted_content: "opaque", summary: [] },
      { type: "message", id: "opaque-connection-message-id", role: "assistant", content: [] },
      { type: "function_call", id: "opaque-connection-call-id", call_id: "call_1", name: "read", arguments: "{}" },
      { type: "function_call_output", call_id: "call_1", output: "ok" },
    ],
  };

  const sanitized = sanitizeProviderPayloadItemIds(payload, { stripConnectionBoundIds: true }) as any;

  expect(sanitized.input).toEqual([
    { type: "message", role: "assistant", content: [] },
    { type: "function_call", call_id: "call_1", name: "read", arguments: "{}" },
    { type: "function_call_output", call_id: "call_1", output: "ok" },
  ]);
  expect(payload.input).toHaveLength(4);
});

test("provider extension enables stateless replay sanitization only for GitHub Copilot Responses", async () => {
  let handler: ((event: any, ctx: any) => Promise<any>) | undefined;
  providerRequestSanitizer({
    on: (event: string, callback: typeof handler) => {
      if (event === "before_provider_request") handler = callback;
    },
  } as any);
  const payload = {
    input: [
      { type: "reasoning", id: "stale", encrypted_content: "opaque", summary: [] },
      { type: "message", id: "stale-message", role: "assistant", content: [] },
    ],
  };

  const result = await handler!(
    { payload },
    { model: { provider: "github-copilot", api: "openai-responses" } },
  );

  expect(result.input).toEqual([{ type: "message", role: "assistant", content: [] }]);
  expect(result).not.toHaveProperty("payload");
});

test("provider extension preserves connection-bound IDs for non-Copilot Responses providers", async () => {
  let handler: ((event: any, ctx: any) => Promise<any>) | undefined;
  providerRequestSanitizer({
    on: (event: string, callback: typeof handler) => {
      if (event === "before_provider_request") handler = callback;
    },
  } as any);
  const payload = {
    input: [
      { type: "reasoning", id: "rs_1", encrypted_content: "opaque", summary: [] },
      { type: "message", id: "msg_1", role: "assistant", content: [] },
    ],
  };

  const result = await handler!(
    { payload },
    { model: { provider: "openai", api: "openai-responses" } },
  );

  expect(result).toBe(payload);
});
