import { afterAll, afterEach, describe, expect, test } from "bun:test";

import { storeAgentTurn } from "../../../src/channels/web/messaging/agent-message-store.js";
import { addLogSink, removeLogSink, type LogRecord } from "../../../src/utils/logger.js";

const sinkRecords: LogRecord[] = [];
const sink = (record: LogRecord) => {
  sinkRecords.push(record);
};

addLogSink(sink);

afterEach(() => {
  sinkRecords.length = 0;
});

afterAll(() => {
  removeLogSink(sink);
});

describe("agent message store", () => {
  test("dispatches Web Push for terminal persisted replies", async () => {
    const interaction = {
      id: 101,
      chat_jid: "web:default",
      timestamp: "2026-04-14T22:10:00.000Z",
      data: {
        content: "Final reply",
      },
    } as any;

    const deliveries: any[] = [];
    const emitter = {
      response(payload: any) {
        deliveries.push({ type: "response", payload });
      },
    } as any;

    const pushCalls: any[] = [];
    const ok = storeAgentTurn({
      consumeQueuedFollowupPlaceholder: () => null,
      replaceQueuedFollowupPlaceholder: () => null,
      broadcastEvent: () => {},
      storeMessage: () => interaction,
    } as any, emitter, {
      chatJid: "web:default",
      text: "Final reply",
      attachments: [],
      channelName: "web" as any,
      isTerminalAgentReply: true,
      dispatchWebPushNotification: async (payload) => {
        pushCalls.push(payload);
      },
    });

    expect(typeof ok === "number" && ok > 0).toBe(true);
    expect(deliveries).toHaveLength(1);
    await Promise.resolve();
    expect(pushCalls).toEqual([interaction]);
  });

  test("does not dispatch Web Push for non-terminal replies", async () => {
    const interaction = {
      id: 102,
      chat_jid: "web:default",
      timestamp: "2026-04-14T22:11:00.000Z",
      data: {
        content: "Intermediate reply",
      },
    } as any;

    const pushCalls: any[] = [];
    const ok = storeAgentTurn({
      consumeQueuedFollowupPlaceholder: () => null,
      replaceQueuedFollowupPlaceholder: () => null,
      broadcastEvent: () => {},
      storeMessage: () => interaction,
    } as any, {
      response: () => {},
    } as any, {
      chatJid: "web:default",
      text: "Intermediate reply",
      attachments: [],
      channelName: "web" as any,
      isTerminalAgentReply: false,
      dispatchWebPushNotification: async (payload) => {
        pushCalls.push(payload);
      },
    });

    expect(typeof ok === "number" && ok > 0).toBe(true);
    await Promise.resolve();
    expect(pushCalls).toEqual([]);
  });

  test("warns when a plain web reply contains SVG source markup without an attachment or widget", () => {
    const ok = storeAgentTurn({
      consumeQueuedFollowupPlaceholder: () => null,
      replaceQueuedFollowupPlaceholder: () => null,
      broadcastEvent: () => {},
      storeMessage: () => ({ id: 103, chat_jid: "web:default", timestamp: "2026-04-29T10:00:00.000Z", data: {} }),
    } as any, {
      response: () => {},
    } as any, {
      chatJid: "web:default",
      text: '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" /></svg>',
      attachments: [],
      channelName: "web" as any,
      isTerminalAgentReply: true,
    });

    expect(typeof ok === "number" && ok > 0).toBe(true);
    const warning = sinkRecords.find((record) => record.operation === "web.agent_message_store.svg_source_guardrail");
    expect(warning).toBeTruthy();
    expect(warning?.level).toBe("warn");
    expect(String(warning?.textPreview || "")).toContain("<svg");
  });
});
