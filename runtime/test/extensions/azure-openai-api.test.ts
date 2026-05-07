import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  applySessionCorrelationHeaders,
  buildBaseOptions,
  processResponsesStream,
  resolveCacheRetention,
  resolveCacheSessionId,
  resolvePiAiResponsesSharedModulePath,
} from "../../src/extensions/azure-openai-api.js";

test("resolvePiAiResponsesSharedModulePath finds the bundled pi-ai helper", () => {
  const resolved = resolvePiAiResponsesSharedModulePath();
  expect(resolved.endsWith(join("@earendil-works", "pi-ai", "dist", "providers", "openai-responses-shared.js"))).toBe(true);
});

test("resolvePiAiResponsesSharedModulePath walks up to a parent node_modules", () => {
  const startDir = join(process.cwd(), "runtime", "src", "extensions", "nested", "deeper");
  const resolved = resolvePiAiResponsesSharedModulePath(startDir);
  expect(existsSync(resolved)).toBe(true);
  expect(resolved.endsWith(join("@earendil-works", "pi-ai", "dist", "providers", "openai-responses-shared.js"))).toBe(true);
});

test("processResponsesStream maps reasoning_text events into thinking events", async () => {
  async function* events() {
    yield {
      type: "response.output_item.added",
      item: { id: "rs_1", type: "reasoning", content: [] },
      output_index: 0,
      sequence_number: 1,
    };
    yield {
      type: "response.content_part.added",
      item_id: "rs_1",
      output_index: 0,
      content_index: 0,
      sequence_number: 2,
      part: { type: "reasoning_text", text: "" },
    };
    yield {
      type: "response.reasoning_text.delta",
      item_id: "rs_1",
      output_index: 0,
      content_index: 0,
      sequence_number: 3,
      delta: "plan",
    };
    yield {
      type: "response.reasoning_text.done",
      item_id: "rs_1",
      output_index: 0,
      content_index: 0,
      sequence_number: 4,
      text: "plan",
    };
    yield {
      type: "response.output_item.done",
      output_index: 0,
      sequence_number: 5,
      item: {
        id: "rs_1",
        type: "reasoning",
        content: [{ type: "reasoning_text", text: "plan" }],
      },
    };
  }

  const output: any = { content: [] };
  const pushed: any[] = [];
  const stream = { push: (event: any) => pushed.push(event) };
  const model: any = { id: "gpt-5-4", provider: "azure-openai", api: "responses" };

  await processResponsesStream(events(), output, stream, model);

  expect(pushed.some((event) => event.type === "thinking_start")).toBe(true);
  expect(pushed.some((event) => event.type === "thinking_delta" && event.delta === "plan")).toBe(true);
  expect(pushed.some((event) => event.type === "thinking_end" && event.content.includes("plan"))).toBe(true);
  expect(output.content[0]?.type).toBe("thinking");
  expect(output.content[0]?.thinking).toContain("plan");
});

test("applySessionCorrelationHeaders aligns session_id and x-client-request-id", () => {
  expect(applySessionCorrelationHeaders({}, "sess_123")).toEqual({
    session_id: "sess_123",
    "x-client-request-id": "sess_123",
  });
});

test("applySessionCorrelationHeaders optionally includes x-ms-client-request-id", () => {
  expect(applySessionCorrelationHeaders({ existing: "value" }, "sess_456", { includeAzureClientRequestId: true })).toEqual({
    existing: "value",
    session_id: "sess_456",
    "x-client-request-id": "sess_456",
    "x-ms-client-request-id": "sess_456",
  });
});

test("applySessionCorrelationHeaders leaves headers untouched when no session id is provided", () => {
  const headers = { existing: "value" };
  const next = applySessionCorrelationHeaders(headers, undefined);

  expect(next).toEqual({ existing: "value" });
  expect(next).not.toBe(headers);
  expect(headers).toEqual({ existing: "value" });
});

test("applySessionCorrelationHeaders overwrites stale correlation headers consistently", () => {
  expect(applySessionCorrelationHeaders({
    existing: "value",
    session_id: "old-session",
    "x-client-request-id": "old-request",
    "x-ms-client-request-id": "old-azure-request",
  }, "sess_789", { includeAzureClientRequestId: true })).toEqual({
    existing: "value",
    session_id: "sess_789",
    "x-client-request-id": "sess_789",
    "x-ms-client-request-id": "sess_789",
  });
});

test("applySessionCorrelationHeaders clears stale x-ms-client-request-id when Azure mirroring is disabled", () => {
  expect(applySessionCorrelationHeaders({
    existing: "value",
    "x-ms-client-request-id": "old-azure-request",
  }, "sess_no_azure")).toEqual({
    existing: "value",
    session_id: "sess_no_azure",
    "x-client-request-id": "sess_no_azure",
  });
});

test("buildBaseOptions preserves session/cache-affinity fields for downstream requests", () => {
  const signal = new AbortController().signal;
  const onPayload = () => {};
  const headers = { existing: "value" };
  const metadata = { phase: "commentary" };

  expect(buildBaseOptions({ maxTokens: 64000 }, {
    temperature: 0.2,
    maxTokens: 4096,
    signal,
    cacheRetention: "ephemeral",
    sessionId: "sess_abc",
    headers,
    onPayload,
    maxRetryDelayMs: 15000,
    metadata,
  }, "token-from-bootstrap")).toEqual({
    temperature: 0.2,
    maxTokens: 4096,
    signal,
    apiKey: "token-from-bootstrap",
    cacheRetention: "ephemeral",
    sessionId: "sess_abc",
    headers,
    onPayload,
    maxRetryDelayMs: 15000,
    metadata,
  });
});

test("resolveCacheRetention defaults to short and honors PI_CACHE_RETENTION=long", () => {
  const previous = process.env.PI_CACHE_RETENTION;
  try {
    delete process.env.PI_CACHE_RETENTION;
    expect(resolveCacheRetention(undefined)).toBe("short");

    process.env.PI_CACHE_RETENTION = "long";
    expect(resolveCacheRetention(undefined)).toBe("long");
    expect(resolveCacheRetention("none")).toBe("none");
  } finally {
    if (previous === undefined) {
      delete process.env.PI_CACHE_RETENTION;
    } else {
      process.env.PI_CACHE_RETENTION = previous;
    }
  }
});

test("resolveCacheSessionId suppresses session affinity when cache retention is none", () => {
  expect(resolveCacheSessionId("sess_cache", "none")).toBeUndefined();
  expect(resolveCacheSessionId("sess_cache", "short")).toBe("sess_cache");
  expect(resolveCacheSessionId(undefined, "short")).toBeUndefined();
});


test("buildBaseOptions falls back to model maxTokens and options apiKey when bootstrap key is absent", () => {
  expect(buildBaseOptions({ maxTokens: 12000 }, {
    apiKey: "token-from-options",
    sessionId: "sess_xyz",
  }, undefined)).toEqual({
    temperature: undefined,
    maxTokens: 12000,
    signal: undefined,
    apiKey: "token-from-options",
    cacheRetention: undefined,
    sessionId: "sess_xyz",
    headers: undefined,
    onPayload: undefined,
    maxRetryDelayMs: undefined,
    metadata: undefined,
  });
});

test("processResponsesStream reroutes commentary-phase output_text into thinking events", async () => {
  async function* events() {
    yield {
      type: "response.output_item.added",
      item: { id: "msg_1", type: "message", phase: "commentary", status: "in_progress", content: [], role: "assistant" },
      output_index: 0,
      sequence_number: 1,
    };
    yield {
      type: "response.content_part.added",
      item_id: "msg_1",
      output_index: 0,
      content_index: 0,
      sequence_number: 2,
      part: { type: "output_text", text: "" },
    };
    yield {
      type: "response.output_text.delta",
      item_id: "msg_1",
      output_index: 0,
      content_index: 0,
      sequence_number: 3,
      delta: "thinking aloud",
    };
    yield {
      type: "response.output_text.done",
      item_id: "msg_1",
      output_index: 0,
      content_index: 0,
      sequence_number: 4,
      text: "thinking aloud",
      logprobs: [],
    };
    yield {
      type: "response.output_item.done",
      output_index: 0,
      sequence_number: 5,
      item: {
        id: "msg_1",
        type: "message",
        phase: "commentary",
        role: "assistant",
        content: [{ type: "output_text", text: "thinking aloud", annotations: [] }],
      },
    };
  }

  const output: any = { content: [] };
  const pushed: any[] = [];
  const stream = { push: (event: any) => pushed.push(event) };
  const model: any = { id: "gpt-5-4", provider: "azure-openai", api: "responses" };

  await processResponsesStream(events(), output, stream, model);

  expect(pushed.some((event) => event.type === "thinking_start")).toBe(true);
  expect(pushed.some((event) => event.type === "thinking_delta" && event.delta === "thinking aloud")).toBe(true);
  expect(pushed.some((event) => event.type === "thinking_end" && event.content.includes("thinking aloud"))).toBe(true);
  expect(pushed.some((event) => event.type === "text_delta")).toBe(false);
  expect(output.content[0]?.type).toBe("thinking");
  expect(output.content[0]?.thinking).toContain("thinking aloud");
});
