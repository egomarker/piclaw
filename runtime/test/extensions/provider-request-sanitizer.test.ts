import { expect, test } from "bun:test";

import {
  providerRequestSanitizer,
  sanitizeProviderPayloadItemIds,
} from "../../src/extensions/provider-request-sanitizer.js";

test("leaves provider payloads with valid IDs and tool-call pairs untouched", () => {
  const payload = {
    model: "gpt-5.5",
    input: [
      { type: "message", id: "msg_1", role: "assistant", content: [] },
      { type: "function_call", id: "fc_1", call_id: "call_1", name: "read", arguments: "{}" },
      { type: "function_call_output", call_id: "call_1", output: "ok" },
    ],
  };

  expect(sanitizeProviderPayloadItemIds(payload)).toBe(payload);
});

test("drops Responses function-call outputs whose matching calls are absent", () => {
  const orphan = { type: "function_call_output", call_id: "call_orphan", output: "secret tool output" };
  const payload = {
    model: "gpt-5.6-sol",
    input: [
      { type: "message", role: "user", content: [{ type: "input_text", text: "continue" }] },
      orphan,
      { type: "function_call", call_id: "call_valid", name: "read", arguments: "{}" },
      { type: "function_call_output", call_id: "call_valid", output: "ok" },
    ],
  };

  const sanitized = sanitizeProviderPayloadItemIds(payload) as any;

  expect(sanitized.input).toEqual([
    payload.input[0],
    payload.input[2],
    payload.input[3],
  ]);
  expect(payload.input).toContain(orphan);
});

test("drops output-before-call items because the provider requires a preceding call", () => {
  const payload = {
    input: [
      { type: "function_call_output", call_id: "call_late", output: "orphan at this boundary" },
      { type: "function_call", call_id: "call_late", name: "read", arguments: "{}" },
    ],
  };

  const sanitized = sanitizeProviderPayloadItemIds(payload) as any;
  expect(sanitized.input).toEqual([payload.input[1]]);
});

test("leaves malformed output items without call_id for provider schema validation", () => {
  const malformed = { type: "function_call_output", output: "missing identifier" };
  const payload = { input: [malformed] };

  expect(sanitizeProviderPayloadItemIds(payload)).toBe(payload);
});

test("does not treat a function-call item id as a call_id match", () => {
  const payload = {
    input: [
      { type: "function_call", id: "call_same_text", name: "read", arguments: "{}" },
      { type: "function_call_output", call_id: "call_same_text", output: "orphan" },
    ],
  };

  const sanitized = sanitizeProviderPayloadItemIds(payload) as any;
  expect(sanitized.input).toEqual([payload.input[0]]);
});

test("bounds orphan diagnostic IDs without exposing output content", () => {
  let diagnostic: any;
  const payload = {
    input: Array.from({ length: 40 }, (_, index) => ({
      type: "function_call_output",
      call_id: `call_${String(index).padStart(2, "0")}_${"x".repeat(200)}`,
      output: `secret-${index}`,
    })),
  };

  sanitizeProviderPayloadItemIds(payload, {
    onOrphanFunctionCallOutputs: (value) => { diagnostic = value; },
  });

  expect(diagnostic.removedCount).toBe(40);
  expect(diagnostic.callIds).toHaveLength(32);
  expect(diagnostic.callIds.every((callId: string) => callId.length <= 128)).toBe(true);
  expect(JSON.stringify(diagnostic)).not.toContain("secret-");
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

test("provider extension removes orphan Responses outputs and enables stateless replay only for GitHub Copilot", async () => {
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
      { type: "function_call_output", call_id: "call_orphan", output: "secret" },
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
