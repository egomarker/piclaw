import { isRecoverableTelegramNetworkError } from "./telegram-network-errors.ts";
import { resolveTelegramLongPollTimeoutSeconds } from "./telegram-request-timeouts.ts";
import { parseTelegramChatJid } from "./telegram-targets.ts";

const TELEGRAM_API_BASE = "https://api.telegram.org";

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel" | string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramPhotoSize {
  file_id: string;
  file_unique_id?: string;
  width?: number;
  height?: number;
  file_size?: number;
}

export interface TelegramDocument {
  file_id: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramLocation {
  latitude: number;
  longitude: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

export interface TelegramMessage {
  message_id: number;
  date: number;
  text?: string;
  caption?: string;
  from?: TelegramUser;
  chat: TelegramChat;
  photo?: TelegramPhotoSize[];
  document?: TelegramDocument;
  location?: TelegramLocation;
  sticker?: unknown;
  voice?: unknown;
  video?: unknown;
  audio?: unknown;
  animation?: unknown;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
}

export interface TelegramFile {
  file_id: string;
  file_unique_id?: string;
  file_size?: number;
  file_path?: string;
}

export interface TelegramBinaryAttachment {
  filename: string;
  contentType: string;
  data: Uint8Array;
  kind: "image" | "file";
}

export interface TelegramChannelOptions {
  botToken: string;
  pollingTimeoutSeconds?: number;
  getLastUpdateId?: () => number;
  setLastUpdateId?: (updateId: number) => void;
  onConnected?: (me: TelegramUser) => void | Promise<void>;
  onDisconnected?: (error?: unknown) => void | Promise<void>;
  onUpdate: (update: TelegramUpdate, api: TelegramBotApi) => void | Promise<void>;
}

type TelegramApiEnvelope<T> = {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
};

interface TelegramSendMessageOptions {
  parseMode?: "Markdown" | "HTML" | null;
  replyToMessageId?: number | null;
}

// Telegram text messages are limited to ~4096 chars after entity parsing.
// Keep a little headroom so Markdown-mode sends are less likely to bounce.
const TELEGRAM_MAX_TEXT_CHARS = 4000;

export class TelegramBotApi {
  constructor(private readonly botToken: string) {}

  private endpoint(method: string): string {
    return `${TELEGRAM_API_BASE}/bot${this.botToken}/${method}`;
  }

  private fileUrl(filePath: string): string {
    return `${TELEGRAM_API_BASE}/file/bot${this.botToken}/${filePath}`;
  }

  private async requestJson<T>(method: string, payload?: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.endpoint(method), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    const raw = await response.text();
    let json: TelegramApiEnvelope<T> | null = null;
    if (raw) {
      try {
        json = JSON.parse(raw) as TelegramApiEnvelope<T>;
      } catch {
        if (!response.ok) {
          throw new Error(`Telegram ${method} failed: ${raw.trim() || response.statusText || response.status}`);
        }
        throw new Error(`Telegram ${method} returned invalid JSON.`);
      }
    }
    if (!response.ok || !json?.ok || json.result === undefined) {
      throw new Error(`Telegram ${method} failed: ${json?.description || raw.trim() || response.statusText || response.status}`);
    }
    return json.result;
  }

  async getMe(): Promise<TelegramUser> {
    return await this.requestJson<TelegramUser>("getMe");
  }

  async getUpdates(params: {
    offset?: number;
    timeout?: number;
    allowed_updates?: string[];
  }): Promise<TelegramUpdate[]> {
    return await this.requestJson<TelegramUpdate[]>("getUpdates", params);
  }

  async sendMessage(chatId: string | number, text: string, options: TelegramSendMessageOptions = {}): Promise<TelegramMessage> {
    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text,
    };
    const parseMode = options.parseMode === undefined ? "Markdown" : options.parseMode;
    if (parseMode) payload.parse_mode = parseMode;
    if (Number.isInteger(options.replyToMessageId) && Number(options.replyToMessageId) > 0) {
      payload.reply_to_message_id = Number(options.replyToMessageId);
      payload.allow_sending_without_reply = true;
    }

    try {
      return await this.requestJson<TelegramMessage>("sendMessage", payload);
    } catch (error) {
      if (parseMode !== "Markdown" || !/can't parse entities/i.test(String(error))) {
        throw error;
      }
      const fallbackPayload = {
        ...payload,
      } satisfies Record<string, unknown>;
      delete fallbackPayload.parse_mode;
      return await this.requestJson<TelegramMessage>("sendMessage", fallbackPayload);
    }
  }

  async editMessageText(
    chatId: string | number,
    messageId: number,
    text: string,
    options: { parseMode?: "Markdown" | "HTML" | null } = {},
  ): Promise<TelegramMessage> {
    const payload: Record<string, unknown> = {
      chat_id: chatId,
      message_id: messageId,
      text,
    };
    if (options.parseMode) payload.parse_mode = options.parseMode;
    return await this.requestJson<TelegramMessage>("editMessageText", payload);
  }

  async deleteMessage(chatId: string | number, messageId: number): Promise<void> {
    await this.requestJson("deleteMessage", {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  async sendChatAction(chatId: string | number, action: "typing"): Promise<void> {
    await this.requestJson("sendChatAction", {
      chat_id: chatId,
      action,
    });
  }

  private async sendBinary(method: "sendPhoto" | "sendDocument", field: "photo" | "document", chatId: string | number, attachment: TelegramBinaryAttachment): Promise<void> {
    const body = new FormData();
    body.set("chat_id", String(chatId));
    body.append(field, new Blob([attachment.data], { type: attachment.contentType || "application/octet-stream" }), attachment.filename);
    const response = await fetch(this.endpoint(method), {
      method: "POST",
      body,
    });
    const raw = await response.text();
    let json: TelegramApiEnvelope<unknown> | null = null;
    if (raw) {
      try {
        json = JSON.parse(raw) as TelegramApiEnvelope<unknown>;
      } catch {
        if (!response.ok) {
          throw new Error(`Telegram ${method} failed: ${raw.trim() || response.statusText || response.status}`);
        }
        throw new Error(`Telegram ${method} returned invalid JSON.`);
      }
    }
    if (!response.ok || !json?.ok) {
      throw new Error(`Telegram ${method} failed: ${json?.description || raw.trim() || response.statusText || response.status}`);
    }
  }

  async sendPhoto(chatId: string | number, attachment: TelegramBinaryAttachment): Promise<void> {
    await this.sendBinary("sendPhoto", "photo", chatId, attachment);
  }

  async sendDocument(chatId: string | number, attachment: TelegramBinaryAttachment): Promise<void> {
    await this.sendBinary("sendDocument", "document", chatId, attachment);
  }

  async getFile(fileId: string): Promise<TelegramFile> {
    return await this.requestJson<TelegramFile>("getFile", { file_id: fileId });
  }

  async downloadFile(filePath: string): Promise<Uint8Array> {
    const response = await fetch(this.fileUrl(filePath));
    if (!response.ok) {
      throw new Error(`Telegram file download failed: ${response.status}`);
    }
    return new Uint8Array(await response.arrayBuffer());
  }
}

function shouldSendAsTelegramPhoto(attachment: TelegramBinaryAttachment): boolean {
  const mimeType = String(attachment.contentType || "").toLowerCase();
  return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(mimeType);
}

function parseReplyToExternalMessageId(chatJid: string, externalMessageId?: string | null): number | null {
  const trimmed = String(externalMessageId || "").trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(?:telegram|tg):([^:]+):(\d+)$/i);
  if (!match) return null;
  const { chatId } = parseTelegramChatJid(chatJid);
  if (match[1] !== chatId) return null;
  const parsed = Number.parseInt(match[2] || "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function escapeTelegramHtml(text: string): string {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type TelegramProgressBlockKind = "thinking" | "tool" | "status";

type TelegramProgressBlock = {
  kind: TelegramProgressBlockKind;
  lines: string[];
};

function isThinkingPlaceholderLine(line: string): boolean {
  return /^Thinking(?:…|\.\.\.)$/i.test(String(line || "").trim());
}

function normalizeTelegramProgressLines(text: string): string[] {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (lines.length <= 1) return lines;
  const hasNonPlaceholderLine = lines.some((line) => !isThinkingPlaceholderLine(line));
  return hasNonPlaceholderLine ? lines.filter((line) => !isThinkingPlaceholderLine(line)) : lines;
}

function classifyTelegramProgressLine(line: string): { kind: TelegramProgressBlockKind; text: string } {
  if (/^Thinking:/i.test(line)) {
    return {
      kind: "thinking",
      text: String(line.replace(/^Thinking:\s*/i, "").trim() || "Thinking…"),
    };
  }
  if (/^Tool:/i.test(line)) {
    return {
      kind: "tool",
      text: String(line.replace(/^Tool:\s*/i, "").trim() || "tool"),
    };
  }
  if (isThinkingPlaceholderLine(line)) {
    return {
      kind: "thinking",
      text: "Thinking…",
    };
  }
  return {
    kind: "status",
    text: line,
  };
}

function buildTelegramProgressBlocks(text: string): TelegramProgressBlock[] {
  const blocks: TelegramProgressBlock[] = [];
  for (const line of normalizeTelegramProgressLines(text)) {
    const classified = classifyTelegramProgressLine(line);
    const current = blocks[blocks.length - 1];
    if (current?.kind === classified.kind) {
      current.lines.push(classified.text);
      continue;
    }
    blocks.push({ kind: classified.kind, lines: [classified.text] });
  }
  return blocks;
}

function renderTelegramProgressHtml(text: string): string {
  const blocks = buildTelegramProgressBlocks(text);
  if (blocks.length === 0) {
    return `<b>Thinking…</b>`;
  }
  return blocks.map((block) => {
    if (block.kind === "thinking" && block.lines.length === 1 && isThinkingPlaceholderLine(block.lines[0] || "")) {
      return `<b>Thinking…</b>`;
    }
    const body = escapeTelegramHtml(block.lines.join("\n"));
    if (block.kind === "thinking") {
      return `<b>Thinking</b>\n<blockquote>${body}</blockquote>`;
    }
    if (block.kind === "tool") {
      return `<b>Tool call</b>\n<pre><code>${body}</code></pre>`;
    }
    return `<b>Status</b>\n<blockquote>${body}</blockquote>`;
  }).join("\n\n");
}

function splitTelegramText(text: string, chunkSize = TELEGRAM_MAX_TEXT_CHARS): string[] {
  const normalized = String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!normalized) return [];

  const rawLines = normalized.split("\n");
  const lines = rawLines.map((line, index) => {
    const hasTrailingNewline = index < rawLines.length - 1;
    return hasTrailingNewline ? `${line}\n` : line;
  });

  const chunks: string[] = [];
  let buffer = "";

  const flushChunk = (chunk: string) => {
    for (let index = 0; index < chunk.length; index += chunkSize) {
      chunks.push(chunk.slice(index, index + chunkSize));
    }
  };

  for (const line of lines) {
    if (line.length > chunkSize) {
      if (buffer) {
        chunks.push(buffer);
        buffer = "";
      }
      flushChunk(line);
      continue;
    }

    if (!buffer) {
      buffer = line;
      continue;
    }

    const next = `${buffer}${line}`;
    if (next.length > chunkSize) {
      chunks.push(buffer);
      buffer = line;
      continue;
    }

    buffer = next;
  }

  if (buffer) chunks.push(buffer);
  return chunks;
}

export class TelegramChannel {
  private api: TelegramBotApi | null = null;
  private connected = false;
  private stopped = false;
  private pollingPromise: Promise<void> | null = null;
  private lastUpdateId = 0;
  private botUser: TelegramUser | null = null;

  constructor(private readonly options: TelegramChannelOptions) {}

  private async markConnected(): Promise<void> {
    if (this.connected) return;
    this.connected = true;
    if (this.botUser) {
      await this.options.onConnected?.(this.botUser);
    }
  }

  private async markDisconnected(error?: unknown): Promise<void> {
    const shouldNotify = this.connected || error !== undefined;
    this.connected = false;
    if (shouldNotify) {
      await this.options.onDisconnected?.(error);
    }
  }

  async connect(): Promise<void> {
    if (this.connected) return;
    this.api = new TelegramBotApi(this.options.botToken);
    this.lastUpdateId = Math.max(0, Math.trunc(this.options.getLastUpdateId?.() || 0));
    this.botUser = await this.api.getMe();
    this.stopped = false;
    await this.markConnected();
    this.pollingPromise = this.pollLoop().catch(async (error) => {
      await this.markDisconnected(error);
    });
  }

  async disconnect(): Promise<void> {
    this.stopped = true;
    const pending = this.pollingPromise;
    this.pollingPromise = null;
    await pending?.catch(() => undefined);
    this.api = null;
    this.botUser = null;
    await this.markDisconnected();
  }

  isConnected(): boolean {
    return this.connected;
  }

  getBotUser(): TelegramUser | null {
    return this.botUser;
  }

  private setLastUpdateId(updateId: number): void {
    this.lastUpdateId = Math.max(this.lastUpdateId, Math.trunc(updateId));
    this.options.setLastUpdateId?.(this.lastUpdateId);
  }

  async sendMessage(chatJid: string, text: string, options?: { attachments?: TelegramBinaryAttachment[] }): Promise<void> {
    if (!this.api || !this.connected) {
      throw new Error("Telegram channel is not connected.");
    }

    const { chatId } = parseTelegramChatJid(chatJid);
    const attachments = Array.isArray(options?.attachments) ? options.attachments : [];
    const textChunks = splitTelegramText(text);

    for (const chunk of textChunks) {
      await this.api.sendMessage(chatId, chunk);
    }

    for (const attachment of attachments) {
      if (attachment.kind === "image" && shouldSendAsTelegramPhoto(attachment)) {
        await this.api.sendPhoto(chatId, attachment);
      } else {
        await this.api.sendDocument(chatId, attachment);
      }
    }
  }

  async createProgressMessage(
    chatJid: string,
    initialText: string,
    options?: { replyToExternalMessageId?: string | null },
  ): Promise<{ update(text: string): Promise<void>; remove(): Promise<void> }> {
    if (!this.api || !this.connected) {
      throw new Error("Telegram channel is not connected.");
    }

    const api = this.api;
    const { chatId } = parseTelegramChatJid(chatJid);
    const trimmed = String(initialText || "").trim() || "Thinking…";
    const replyToMessageId = parseReplyToExternalMessageId(chatJid, options?.replyToExternalMessageId);
    const initialHtml = renderTelegramProgressHtml(trimmed);
    const sent = await api.sendMessage(chatId, initialHtml, {
      parseMode: "HTML",
      replyToMessageId,
    });
    const messageId = sent.message_id;
    let lastRenderedHtml = initialHtml;

    return {
      update: async (text: string) => {
        const nextText = String(text || "").trim();
        if (!nextText) return;
        const nextRenderedHtml = renderTelegramProgressHtml(nextText);
        if (nextRenderedHtml === lastRenderedHtml) return;
        try {
          await api.editMessageText(chatId, messageId, nextRenderedHtml, { parseMode: "HTML" });
        } catch (error) {
          if (/message is not modified/i.test(String(error))) return;
          throw error;
        }
        lastRenderedHtml = nextRenderedHtml;
      },
      remove: async () => {
        await api.deleteMessage(chatId, messageId);
      },
    };
  }

  async setTyping(chatJid: string, isTyping: boolean): Promise<void> {
    if (!isTyping || !this.api || !this.connected) return;
    const { chatId } = parseTelegramChatJid(chatJid);
    await this.api.sendChatAction(chatId, "typing");
  }

  private async pollLoop(): Promise<void> {
    let reconnectAttempts = 0;
    while (!this.stopped && this.api) {
      const api = this.api;
      let updates: TelegramUpdate[];

      try {
        updates = await api.getUpdates({
          offset: this.lastUpdateId > 0 ? this.lastUpdateId + 1 : undefined,
          timeout: resolveTelegramLongPollTimeoutSeconds(this.options.pollingTimeoutSeconds),
          allowed_updates: ["message"],
        });
      } catch (error) {
        if (this.stopped) return;
        await this.markDisconnected(error);
        if (!isRecoverableTelegramNetworkError(error)) {
          return;
        }
        reconnectAttempts += 1;
        const delayMs = Math.min(30_000, 1_000 * 2 ** Math.min(reconnectAttempts, 5));
        await Bun.sleep(delayMs);
        continue;
      }

      reconnectAttempts = 0;
      await this.markConnected();
      for (const update of updates) {
        this.setLastUpdateId(update.update_id);
        await this.options.onUpdate(update, api);
      }
    }
  }
}
