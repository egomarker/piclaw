/**
 * web/push/web-notification-presence-service.ts – in-memory device/chat presence for notification routing.
 *
 * Tracks recent browser clients by device + tab/window. Only a visible
 * client in the reply's chat suppresses Web Push for that device.
 */

export const DEFAULT_WEB_NOTIFICATION_PRESENCE_TTL_MS = 120000;

export interface WebNotificationPresenceRecord {
  deviceId: string;
  clientId: string;
  chatJid: string;
  visibilityState: "visible" | "hidden";
  hasFocus: boolean;
  updatedAtMs: number;
}

export interface WebNotificationPresenceState {
  hasLiveClient: boolean;
  hasVisibleClient: boolean;
  clients: WebNotificationPresenceRecord[];
}

export type WebPushPresenceSuppressionReason = "visible_same_chat_client";

function normalizeTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeWebNotificationPresence(
  value: unknown,
  options: { nowMs?: number } = {},
): WebNotificationPresenceRecord | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const deviceId = normalizeTrimmedString(input.device_id ?? input.deviceId);
  const clientId = normalizeTrimmedString(input.client_id ?? input.clientId);
  const chatJid = normalizeTrimmedString(input.chat_jid ?? input.chatJid);
  if (!deviceId || !clientId || !chatJid) return null;

  const rawVisibility = normalizeTrimmedString(input.visibility_state ?? input.visibilityState).toLowerCase();
  const visibilityState = rawVisibility === "hidden" ? "hidden" : "visible";
  const hasFocus = Boolean(input.has_focus ?? input.hasFocus);
  const updatedAtMs = options.nowMs ?? Date.now();

  return {
    deviceId,
    clientId,
    chatJid,
    visibilityState,
    hasFocus,
    updatedAtMs,
  };
}

export class WebNotificationPresenceService {
  private readonly records = new Map<string, WebNotificationPresenceRecord>();
  private readonly now: () => number;
  private readonly ttlMs: number;

  constructor(options: { ttlMs?: number; now?: () => number } = {}) {
    this.ttlMs = Number.isFinite(options.ttlMs) ? Number(options.ttlMs) : DEFAULT_WEB_NOTIFICATION_PRESENCE_TTL_MS;
    this.now = typeof options.now === "function" ? options.now : () => Date.now();
  }

  private buildKey(deviceId: string, clientId: string): string {
    return `${deviceId}::${clientId}`;
  }

  private isLive(record: WebNotificationPresenceRecord, nowMs = this.now()): boolean {
    return nowMs - record.updatedAtMs <= this.ttlMs;
  }

  prune(nowMs = this.now()): void {
    for (const [key, record] of this.records.entries()) {
      if (this.isLive(record, nowMs)) continue;
      this.records.delete(key);
    }
  }

  upsert(value: unknown, options: { nowMs?: number } = {}): WebNotificationPresenceRecord {
    const nowMs = options.nowMs ?? this.now();
    const normalized = normalizeWebNotificationPresence(value, { nowMs });
    if (!normalized) {
      throw new Error("Invalid web notification presence payload.");
    }
    this.prune(nowMs);
    this.records.set(this.buildKey(normalized.deviceId, normalized.clientId), normalized);
    return normalized;
  }

  remove(value: { device_id?: unknown; deviceId?: unknown; client_id?: unknown; clientId?: unknown }): boolean {
    const deviceId = normalizeTrimmedString(value?.device_id ?? value?.deviceId);
    const clientId = normalizeTrimmedString(value?.client_id ?? value?.clientId);
    if (!deviceId || !clientId) return false;
    return this.records.delete(this.buildKey(deviceId, clientId));
  }

  getDeviceChatState(deviceId: string, chatJid: string, nowMs = this.now()): WebNotificationPresenceState {
    const normalizedDeviceId = normalizeTrimmedString(deviceId);
    const normalizedChatJid = normalizeTrimmedString(chatJid);
    if (!normalizedDeviceId || !normalizedChatJid) {
      return { hasLiveClient: false, hasVisibleClient: false, clients: [] };
    }

    this.prune(nowMs);
    const clients = Array.from(this.records.values())
      .filter((record) => record.deviceId === normalizedDeviceId && record.chatJid === normalizedChatJid && this.isLive(record, nowMs))
      .sort((left, right) => left.clientId.localeCompare(right.clientId));

    return {
      hasLiveClient: clients.length > 0,
      hasVisibleClient: clients.some((record) => record.visibilityState === "visible"),
      clients,
    };
  }

  shouldSendWebPush(deviceId: string | null | undefined, chatJid: string | null | undefined, nowMs = this.now()): boolean {
    return this.getWebPushSuppressionReason(deviceId, chatJid, nowMs) === null;
  }

  getWebPushSuppressionReason(
    deviceId: string | null | undefined,
    chatJid: string | null | undefined,
    nowMs = this.now(),
  ): WebPushPresenceSuppressionReason | null {
    const normalizedDeviceId = normalizeTrimmedString(deviceId);
    const normalizedChatJid = normalizeTrimmedString(chatJid);
    if (!normalizedDeviceId || !normalizedChatJid) return null;
    return this.getDeviceChatState(normalizedDeviceId, normalizedChatJid, nowMs).hasVisibleClient
      ? "visible_same_chat_client"
      : null;
  }

  list(nowMs = this.now()): WebNotificationPresenceRecord[] {
    this.prune(nowMs);
    return Array.from(this.records.values()).sort((left, right) => left.deviceId.localeCompare(right.deviceId) || left.clientId.localeCompare(right.clientId));
  }
}

export const webNotificationPresenceService = new WebNotificationPresenceService();
