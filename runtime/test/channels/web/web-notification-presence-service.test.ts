import { describe, expect, test } from "bun:test";

import {
  WebNotificationPresenceService,
  normalizeWebNotificationPresence,
} from "../../../src/channels/web/push/web-notification-presence-service.js";

describe("web notification presence service", () => {
  test("normalizes valid client presence payloads", () => {
    const normalized = normalizeWebNotificationPresence({
      device_id: "device-1",
      client_id: "client-1",
      chat_jid: "web:default",
      visibility_state: "hidden",
      has_focus: false,
    }, { nowMs: 1234 });

    expect(normalized).toEqual({
      deviceId: "device-1",
      clientId: "client-1",
      chatJid: "web:default",
      visibilityState: "hidden",
      hasFocus: false,
      updatedAtMs: 1234,
    });
    expect(normalizeWebNotificationPresence(null)).toBeNull();
  });

  test("suppresses Web Push only for visible same-chat presence on the subscribed device", () => {
    let now = 1000;
    const service = new WebNotificationPresenceService({ now: () => now, ttlMs: 5000 });
    service.upsert({
      device_id: "device-1",
      client_id: "client-1",
      chat_jid: "web:default",
      visibility_state: "hidden",
      has_focus: false,
    });

    expect(service.shouldSendWebPush("device-1", "web:default")).toBe(true);

    service.upsert({
      device_id: "device-1",
      client_id: "client-visible",
      chat_jid: "web:default",
      visibility_state: "visible",
      has_focus: false,
    });
    expect(service.getWebPushSuppressionReason("device-1", "web:default")).toBe("visible_same_chat_client");
    expect(service.shouldSendWebPush("device-1", "web:default")).toBe(false);
    expect(service.shouldSendWebPush("device-1", "web:other")).toBe(true);
    expect(service.shouldSendWebPush("device-2", "web:default")).toBe(true);

    now = 7000;
    expect(service.shouldSendWebPush("device-1", "web:default")).toBe(true);
  });

  test("reports visible clients for the matching device/chat", () => {
    const service = new WebNotificationPresenceService({ now: () => 1000 });
    service.upsert({
      device_id: "device-1",
      client_id: "client-a",
      chat_jid: "web:default",
      visibility_state: "visible",
      has_focus: true,
    });
    service.upsert({
      device_id: "device-1",
      client_id: "client-b",
      chat_jid: "web:default",
      visibility_state: "hidden",
      has_focus: false,
    });

    expect(service.getDeviceChatState("device-1", "web:default")).toEqual({
      hasLiveClient: true,
      hasVisibleClient: true,
      clients: [
        {
          deviceId: "device-1",
          clientId: "client-a",
          chatJid: "web:default",
          visibilityState: "visible",
          hasFocus: true,
          updatedAtMs: 1000,
        },
        {
          deviceId: "device-1",
          clientId: "client-b",
          chatJid: "web:default",
          visibilityState: "hidden",
          hasFocus: false,
          updatedAtMs: 1000,
        },
      ],
    });
  });
});
