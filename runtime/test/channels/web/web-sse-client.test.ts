/**
 * test/channels/web/web-sse-client.test.ts – Tests for the browser-side SSEClient.
 *
 * Verifies reconnection scheduling, cooldown enforcement, and
 * event dispatch in the frontend SSE client class.
 */

import { expect, test } from "bun:test";
import "../../helpers.js";

import { SSEClient, streamSidePrompt } from "../../../web/src/api.ts";

test("SSEClient scheduleReconnect triggers cooldown", () => {
  const client = new SSEClient(() => {}, () => {});

  const originalSetTimeout = globalThis.setTimeout;
  const originalNow = Date.now;
  let scheduledDelay = 0;

  globalThis.setTimeout = ((_, delay) => {
    scheduledDelay = Number(delay);
    return 1 as unknown as ReturnType<typeof setTimeout>;
  }) as typeof setTimeout;
  Date.now = () => 1000;

  client.reconnectAttempts = 10;
  client.scheduleReconnect();

  expect(client.cooldownUntil).toBe(61000);
  expect(scheduledDelay).toBe(60000);

  globalThis.setTimeout = originalSetTimeout;
  Date.now = originalNow;
});

test("SSEClient reconnectIfNeeded respects cooldown", () => {
  const client = new SSEClient(() => {}, () => {});
  let connected = false;
  client.connect = () => {
    connected = true;
  };

  client.status = "disconnected";
  client.cooldownUntil = Date.now() + 10000;
  client.reconnectIfNeeded();

  expect(connected).toBe(false);
});

test("SSEClient connects to a chat-scoped SSE stream when chatJid is provided", () => {
  const OriginalEventSource = globalThis.EventSource;
  const opened: string[] = [];

  class FakeEventSource {
    onopen: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(url: string) {
      opened.push(url);
    }
    addEventListener() {}
    close() {}
  }

  globalThis.EventSource = FakeEventSource as any;
  try {
    const client = new SSEClient(() => {}, () => {}, { chatJid: "web:branch-a" });
    client.connect();
    expect(opened[0]).toBe("/sse/stream?chat_jid=web%3Abranch-a");
  } finally {
    globalThis.EventSource = OriginalEventSource;
  }
});

test("SSEClient no longer registers stale agent_request listeners", () => {
  const OriginalEventSource = globalThis.EventSource;
  const seenEvents: string[] = [];

  class FakeEventSource {
    onopen: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(_url: string) {}
    addEventListener(event: string) {
      seenEvents.push(event);
    }
    close() {}
  }

  globalThis.EventSource = FakeEventSource as any;
  try {
    const client = new SSEClient(() => {}, () => {});
    client.connect();
    expect(seenEvents).not.toContain("agent_request");
    expect(seenEvents).not.toContain("agent_request_timeout");
    expect(seenEvents).toContain("agent_status");
    expect(seenEvents).toContain("active_chats_changed");
    expect(seenEvents).toContain("new_post");
    expect(seenEvents).toContain("workspace_update");
    expect(seenEvents).toContain("extension_ui_request");
    expect(seenEvents).toContain("extension_ui_notify");
    expect(seenEvents).toContain("extension_ui_error");
  } finally {
    globalThis.EventSource = OriginalEventSource;
  }
});

test("streamSidePrompt parses SSE event frames, returns the final payload, and forwards the active chat_jid", async () => {
  const originalFetch = globalThis.fetch;
  let seenBody: any = null;
  globalThis.fetch = (async (_url, init) => {
    seenBody = init?.body ? JSON.parse(String(init.body)) : null;
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('event: side_prompt_start\ndata: {"chat_jid":"web:branch-a"}\n\n'));
        controller.enqueue(encoder.encode('event: side_prompt_thinking_delta\ndata: {"delta":"plan"}\n\n'));
        controller.enqueue(encoder.encode('event: side_prompt_text_delta\ndata: {"delta":"answer"}\n\n'));
        controller.enqueue(encoder.encode('event: side_prompt_done\ndata: {"status":"success","result":"answer","thinking":"plan","model":"openai/gpt-test"}\n\n'));
        controller.close();
      },
    });
    return new Response(stream, {
      status: 200,
      headers: { "Content-Type": "text/event-stream" },
    });
  }) as typeof fetch;

  const seen: Array<string> = [];
  const result = await streamSidePrompt("What changed?", {
    chatJid: "web:branch-a",
    onThinkingDelta: (delta) => seen.push(`thinking:${delta}`),
    onTextDelta: (delta) => seen.push(`text:${delta}`),
  });

  expect(seenBody).toEqual({
    prompt: "What changed?",
    chat_jid: "web:branch-a",
  });
  expect(seen).toEqual(["thinking:plan", "text:answer"]);
  expect(result).toEqual({
    status: "success",
    result: "answer",
    thinking: "plan",
    model: "openai/gpt-test",
  });

  globalThis.fetch = originalFetch;
});
