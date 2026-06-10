import {
  ensureTelegramChannelDetectorRegistered,
  getPiclawRuntimeApi,
  getTelegramRuntimeInterop,
  readAssistantName,
  updateTelegramRuntimeState,
} from "../interop.ts";
import {
  loadTelegramConfig,
  saveTelegramLastUpdateId,
  type TelegramConfig,
} from "../storage.ts";
import { buildTelegramChatJid, isTelegramDirectChatId } from "../telegram-targets.ts";
import {
  TelegramChannel,
  type TelegramBinaryAttachment,
  type TelegramBotApi,
  type TelegramDocument,
  type TelegramLocation,
  type TelegramMessage,
  type TelegramPhotoSize,
  type TelegramUpdate,
  type TelegramUser,
} from "../telegram.ts";
import { isRecoverableTelegramNetworkError } from "../telegram-network-errors.ts";

type TelegramRuntimeController = {
  started: boolean;
  starting: boolean;
  channel: TelegramChannel | null;
  transportCleanup: (() => void) | null;
};

const CONTROLLER_KEY = "__piclaw_telegram_runtime_controller";
const UNAUTHORIZED_TEXT = "Not authorized.";

function getController(): TelegramRuntimeController {
  const existing = (globalThis as Record<string, unknown>)[CONTROLLER_KEY];
  if (existing && typeof existing === "object") {
    return existing as TelegramRuntimeController;
  }
  const created: TelegramRuntimeController = {
    started: false,
    starting: false,
    channel: null,
    transportCleanup: null,
  };
  (globalThis as Record<string, unknown>)[CONTROLLER_KEY] = created;
  return created;
}

function log(level: "info" | "warn" | "error", message: string, details?: unknown): void {
  const prefix = `[telegram-addon] ${message}`;
  if (level === "error") {
    console.error(prefix, details ?? "");
    return;
  }
  if (level === "warn") {
    console.warn(prefix, details ?? "");
    return;
  }
  console.info(prefix, details ?? "");
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function buildUserDisplayName(user: TelegramUser | undefined, fallback: string): string {
  const first = normalizeText(user?.first_name);
  const last = normalizeText(user?.last_name);
  const joined = [first, last].filter(Boolean).join(" ").trim();
  if (joined) return joined;
  const username = normalizeText(user?.username);
  if (username) return `@${username}`;
  return fallback;
}

function buildChatName(message: TelegramMessage): string {
  const title = normalizeText(message.chat.title);
  if (title) return title;
  const first = normalizeText(message.chat.first_name);
  const last = normalizeText(message.chat.last_name);
  const joined = [first, last].filter(Boolean).join(" ").trim();
  if (joined) return joined;
  const username = normalizeText(message.chat.username);
  if (username) return `@${username}`;
  return buildUserDisplayName(message.from, String(message.chat.id));
}

function getUnsupportedKind(message: TelegramMessage): string | null {
  if (message.sticker) return "sticker";
  if (message.voice) return "voice";
  if (message.video) return "video";
  if (message.audio) return "audio";
  if (message.animation) return "animation";
  return null;
}

function pickLargestPhoto(photo: TelegramPhotoSize[]): TelegramPhotoSize | null {
  if (!Array.isArray(photo) || photo.length === 0) return null;
  return [...photo].sort((a, b) => (b.file_size || 0) - (a.file_size || 0))[0] ?? photo[photo.length - 1] ?? null;
}

function buildAttachmentContentBlock(
  mediaId: number,
  kind: "image" | "file",
  filename: string,
  mimeType: string,
  size: number | null,
): Record<string, unknown> {
  return {
    type: kind,
    media_id: mediaId,
    name: filename,
    filename,
    mime_type: mimeType,
    ...(typeof size === "number" && Number.isFinite(size) && size > 0 ? { size } : {}),
  };
}

export function formatTelegramLocationText(location: TelegramLocation): string {
  const lines = ["Location:"];
  const fields: Array<[string, number | undefined]> = [
    ["latitude", location.latitude],
    ["longitude", location.longitude],
    ["horizontal_accuracy", location.horizontal_accuracy],
    ["live_period", location.live_period],
    ["heading", location.heading],
    ["proximity_alert_radius", location.proximity_alert_radius],
  ];

  for (const [field, value] of fields) {
    if (typeof value === "number" && Number.isFinite(value)) {
      lines.push(`${field}: ${value}`);
    }
  }

  return lines.join("\n");
}

async function downloadTelegramFile(
  api: TelegramBotApi,
  fileId: string,
): Promise<Uint8Array> {
  const file = await api.getFile(fileId);
  if (!file.file_path) {
    throw new Error(`Telegram file ${fileId} did not include a file_path.`);
  }
  return await api.downloadFile(file.file_path);
}

async function importPhotoAttachment(
  api: TelegramBotApi,
  message: TelegramMessage,
  photo: TelegramPhotoSize,
): Promise<{ mediaId: number; contentBlock: Record<string, unknown>; summary: string } | null> {
  const runtimeApi = getPiclawRuntimeApi();
  if (!runtimeApi?.createMedia) return null;
  const data = await downloadTelegramFile(api, photo.file_id);
  const filename = `telegram-photo-${message.chat.id}-${message.message_id}.jpg`;
  const mimeType = "image/jpeg";
  const mediaId = runtimeApi.createMedia(filename, mimeType, data, null, {
    source: "telegram",
    kind: "photo",
    chat_id: String(message.chat.id),
    message_id: message.message_id,
    file_id: photo.file_id,
  });
  return {
    mediaId,
    contentBlock: buildAttachmentContentBlock(mediaId, "image", filename, mimeType, photo.file_size ?? data.byteLength),
    summary: "[Photo attachment]",
  };
}

async function importDocumentAttachment(
  api: TelegramBotApi,
  message: TelegramMessage,
  document: TelegramDocument,
): Promise<{ mediaId: number; contentBlock: Record<string, unknown>; summary: string } | null> {
  const runtimeApi = getPiclawRuntimeApi();
  if (!runtimeApi?.createMedia) return null;
  const data = await downloadTelegramFile(api, document.file_id);
  const filename = normalizeText(document.file_name) || `telegram-file-${message.chat.id}-${message.message_id}`;
  const mimeType = normalizeText(document.mime_type) || "application/octet-stream";
  const mediaId = runtimeApi.createMedia(filename, mimeType, data, null, {
    source: "telegram",
    kind: "document",
    chat_id: String(message.chat.id),
    message_id: message.message_id,
    file_id: document.file_id,
  });
  return {
    mediaId,
    contentBlock: buildAttachmentContentBlock(mediaId, mimeType.startsWith("image/") ? "image" : "file", filename, mimeType, document.file_size ?? data.byteLength),
    summary: `[File attachment: ${filename}]`,
  };
}

export async function buildInboundPayload(
  api: TelegramBotApi,
  message: TelegramMessage,
): Promise<{
  content: string;
  mediaIds: number[];
  contentBlocks: Array<Record<string, unknown>>;
}> {
  const baseText = normalizeText(message.text || message.caption);
  const summaries: string[] = [];
  const mediaIds: number[] = [];
  const contentBlocks: Array<Record<string, unknown>> = [];

  if (message.location) {
    summaries.push(formatTelegramLocationText(message.location));
  }

  if (Array.isArray(message.photo) && message.photo.length > 0) {
    try {
      const photo = pickLargestPhoto(message.photo);
      if (photo) {
        const imported = await importPhotoAttachment(api, message, photo);
        if (imported) {
          mediaIds.push(imported.mediaId);
          contentBlocks.push(imported.contentBlock);
          summaries.push(imported.summary);
        }
      }
    } catch (error) {
      summaries.push("[Photo attachment unavailable]");
      log("warn", "Failed to import Telegram photo attachment", { err: error, messageId: message.message_id });
    }
  }

  if (message.document?.file_id) {
    try {
      const imported = await importDocumentAttachment(api, message, message.document);
      if (imported) {
        mediaIds.push(imported.mediaId);
        contentBlocks.push(imported.contentBlock);
        summaries.push(imported.summary);
      }
    } catch (error) {
      summaries.push("[File attachment unavailable]");
      log("warn", "Failed to import Telegram document attachment", { err: error, messageId: message.message_id });
    }
  }

  const unsupportedKind = getUnsupportedKind(message);
  if (unsupportedKind && summaries.length === 0) {
    summaries.push(`[Unsupported Telegram ${unsupportedKind} message]`);
  }

  const content = [baseText, ...summaries].filter(Boolean).join(baseText && summaries.length > 0 ? "\n\n" : "\n").trim();
  return {
    content: content || "[Telegram message]",
    mediaIds,
    contentBlocks,
  };
}

function shouldForcePrompt(
  config: TelegramConfig,
  content: string,
  botUser: TelegramUser | null,
): boolean {
  if (config.triggerMode === "always") return true;
  const normalized = normalizeText(content).toLowerCase();
  if (!normalized) return false;
  if (normalized.startsWith("/")) return true;

  const botUsername = normalizeText(botUser?.username).toLowerCase();
  if (botUsername && normalized.includes(`@${botUsername}`)) return true;

  const assistantName = normalizeText(readAssistantName()).toLowerCase();
  if (assistantName && normalized.includes(assistantName)) return true;

  return false;
}

export function shouldForcePromptForInboundMessage(
  config: TelegramConfig,
  message: TelegramMessage,
  content: string,
  botUser: TelegramUser | null,
): boolean {
  if (message.location) return true;
  return shouldForcePrompt(config, content, botUser);
}

function isAuthorizedChat(config: TelegramConfig, message: TelegramMessage): boolean {
  const chatId = String(message.chat.id);
  return message.chat.type === "private"
    && isTelegramDirectChatId(chatId)
    && config.allowedChatIds.includes(chatId);
}

async function buildOutboundAttachments(options: {
  attachments?: Array<{ id: number; name: string; contentType: string; kind: "image" | "file" }>;
  mediaIds?: number[];
} | undefined): Promise<TelegramBinaryAttachment[]> {
  const runtimeApi = getPiclawRuntimeApi();
  if (!runtimeApi?.getMediaById) return [];

  const byId = new Map<number, { kind: "image" | "file"; name?: string; contentType?: string }>();
  for (const attachment of options?.attachments || []) {
    if (Number.isFinite(attachment.id) && attachment.id > 0) {
      byId.set(attachment.id, {
        kind: attachment.kind,
        name: attachment.name,
        contentType: attachment.contentType,
      });
    }
  }
  for (const mediaId of options?.mediaIds || []) {
    if (Number.isFinite(mediaId) && mediaId > 0 && !byId.has(mediaId)) {
      byId.set(mediaId, { kind: "file" });
    }
  }

  const results: TelegramBinaryAttachment[] = [];
  for (const [mediaId, meta] of byId.entries()) {
    const media = runtimeApi.getMediaById(mediaId);
    if (!media?.data) continue;
    const contentType = normalizeText(media.content_type) || normalizeText(meta.contentType) || "application/octet-stream";
    results.push({
      filename: normalizeText(media.filename) || normalizeText(meta.name) || `attachment-${mediaId}`,
      contentType,
      data: media.data,
      kind: meta.kind === "image" || contentType.startsWith("image/") ? "image" : "file",
    });
  }
  return results;
}

async function startTelegramRuntime(): Promise<void> {
  const controller = getController();
  if (controller.started || controller.starting) return;
  controller.starting = true;

  let createdChannel: TelegramChannel | null = null;
  let transportCleanup: (() => void) | null = null;

  try {
    ensureTelegramChannelDetectorRegistered();
    const config = loadTelegramConfig();
    if (!config.enabled) {
      updateTelegramRuntimeState({ connected: false, lastError: null });
      log("info", "Telegram runtime not started because it is disabled.");
      return;
    }
    if (!normalizeText(config.botToken)) {
      updateTelegramRuntimeState({ connected: false, lastError: "Telegram bot token is not configured." });
      log("warn", "Telegram runtime not started because no bot token is configured.");
      return;
    }

    const interop = getTelegramRuntimeInterop();
    if (!interop?.postMessage || !interop.registerChannelTransport) {
      throw new Error("Telegram runtime interop is unavailable.");
    }

    const channel = new TelegramChannel({
      botToken: config.botToken,
      pollingTimeoutSeconds: config.pollingTimeoutSeconds,
      getLastUpdateId: () => config.lastUpdateId,
      setLastUpdateId: (updateId) => {
        config.lastUpdateId = updateId;
        saveTelegramLastUpdateId(updateId);
      },
      onConnected: async (me) => {
        updateTelegramRuntimeState({
          connected: true,
          botId: me.id,
          botUsername: normalizeText(me.username) || null,
          lastError: null,
          lastEventAt: new Date().toISOString(),
        });
        log("info", "Telegram runtime connected.", { botId: me.id, username: me.username || null });
      },
      onDisconnected: async (error) => {
        updateTelegramRuntimeState({
          connected: false,
          lastError: error ? String((error as { message?: unknown })?.message || error) : null,
          lastEventAt: new Date().toISOString(),
        });
        if (error) {
          log("warn", "Telegram runtime disconnected.", { err: error });
        }
      },
      onUpdate: async (update: TelegramUpdate, api: TelegramBotApi) => {
        const message = update.message ?? update.edited_message;
        if (!message) return;

        const botUser = channel.getBotUser();
        if (message.from?.is_bot || (botUser && message.from?.id === botUser.id)) {
          return;
        }

        if (message.chat.type !== "private" || !isTelegramDirectChatId(String(message.chat.id))) {
          return;
        }

        if (!isAuthorizedChat(config, message)) {
          if (config.unauthorizedMode === "reply_not_authorized") {
            await api.sendMessage(String(message.chat.id), UNAUTHORIZED_TEXT).catch((error) => {
              log("warn", "Failed to send unauthorized Telegram reply", { err: error, chatId: message.chat.id });
            });
          }
          return;
        }

        const payload = await buildInboundPayload(api, message);
        const chatJid = buildTelegramChatJid(message.chat.id);
        const senderId = String(message.from?.id || message.chat.id);
        const senderName = buildUserDisplayName(message.from, senderId);
        const timestamp = new Date((message.date || Math.floor(Date.now() / 1000)) * 1000).toISOString();

        await interop.postMessage(chatJid, payload.content, {
          source: "telegram",
          messageId: `telegram:${message.chat.id}:${message.message_id}`,
          sender: senderId,
          senderName,
          timestamp,
          mediaIds: payload.mediaIds,
          contentBlocks: payload.contentBlocks,
          chatName: buildChatName(message),
          enqueue: true,
          forcePrompt: shouldForcePromptForInboundMessage(config, message, payload.content, botUser),
        });

        updateTelegramRuntimeState({
          connected: true,
          lastError: null,
          lastEventAt: new Date().toISOString(),
        });
      },
    });

    createdChannel = channel;
    await channel.connect();
    transportCleanup = interop.registerChannelTransport("telegram", {
      sendMessage: async (chatJid, text, options) => {
        const attachments = await buildOutboundAttachments(options);
        await channel.sendMessage(chatJid, text, { attachments });
        updateTelegramRuntimeState({
          connected: channel.isConnected(),
          lastError: null,
          lastEventAt: new Date().toISOString(),
        });
      },
      setTyping: async (chatJid, isTyping) => {
        await channel.setTyping(chatJid, isTyping);
      },
      createProgressMessage: async (chatJid, initialText, options) => {
        return await channel.createProgressMessage(chatJid, initialText, {
          replyToExternalMessageId: typeof options?.replyToExternalMessageId === "string"
            ? options.replyToExternalMessageId
            : null,
        });
      },
    });

    controller.channel = channel;
    controller.transportCleanup = transportCleanup;
    controller.started = true;
  } catch (error) {
    controller.started = false;
    controller.channel = null;
    controller.transportCleanup = null;
    transportCleanup?.();
    await createdChannel?.disconnect().catch(() => undefined);
    throw error;
  } finally {
    controller.starting = false;
  }
}

async function bootTelegramRuntime(): Promise<void> {
  let attempt = 0;

  while (true) {
    try {
      await startTelegramRuntime();
      return;
    } catch (error) {
      updateTelegramRuntimeState({
        connected: false,
        lastError: String((error as { message?: unknown })?.message || error),
        lastEventAt: new Date().toISOString(),
      });

      if (!isRecoverableTelegramNetworkError(error)) {
        log("error", "Telegram runtime failed to start.", { err: error });
        return;
      }

      attempt += 1;
      const delayMs = Math.min(30_000, 1_000 * 2 ** Math.min(attempt - 1, 5));
      log("warn", "Telegram runtime startup failed; retrying.", { attempt, delayMs, err: error });
      await Bun.sleep(delayMs);
    }
  }
}

void bootTelegramRuntime().catch((error) => {
  updateTelegramRuntimeState({
    connected: false,
    lastError: String((error as { message?: unknown })?.message || error),
    lastEventAt: new Date().toISOString(),
  });
  log("error", "Telegram runtime bootstrap failed unexpectedly.", { err: error });
});

export {};
