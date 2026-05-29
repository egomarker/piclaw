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

export interface TelegramMessage {
  message_id: number;
  date: number;
  text?: string;
  caption?: string;
  from?: TelegramUser;
  chat: TelegramChat;
  photo?: TelegramPhotoSize[];
  document?: TelegramDocument;
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
    const json = await response.json() as TelegramApiEnvelope<T>;
    if (!response.ok || !json.ok || json.result === undefined) {
      throw new Error(`Telegram ${method} failed: ${json.description || response.statusText || response.status}`);
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

  async sendMessage(chatId: string | number, text: string): Promise<void> {
    await this.requestJson("sendMessage", {
      chat_id: chatId,
      text,
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
    const json = await response.json() as TelegramApiEnvelope<unknown>;
    if (!response.ok || !json.ok) {
      throw new Error(`Telegram ${method} failed: ${json.description || response.statusText || response.status}`);
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

export class TelegramChannel {
  private api: TelegramBotApi | null = null;
  private connected = false;
  private stopped = false;
  private pollingPromise: Promise<void> | null = null;
  private lastUpdateId = 0;
  private botUser: TelegramUser | null = null;

  constructor(private readonly options: TelegramChannelOptions) {}

  async connect(): Promise<void> {
    if (this.connected) return;
    this.api = new TelegramBotApi(this.options.botToken);
    this.lastUpdateId = Math.max(0, Math.trunc(this.options.getLastUpdateId?.() || 0));
    this.botUser = await this.api.getMe();
    this.connected = true;
    this.stopped = false;
    await this.options.onConnected?.(this.botUser);
    this.pollingPromise = this.pollLoop();
  }

  async disconnect(): Promise<void> {
    this.stopped = true;
    this.connected = false;
    const pending = this.pollingPromise;
    this.pollingPromise = null;
    await pending?.catch(() => undefined);
    await this.options.onDisconnected?.();
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
    const trimmed = String(text || "").trim();

    if (trimmed) {
      await this.api.sendMessage(chatId, trimmed);
    }

    for (const attachment of attachments) {
      if (attachment.kind === "image" && shouldSendAsTelegramPhoto(attachment)) {
        await this.api.sendPhoto(chatId, attachment);
      } else {
        await this.api.sendDocument(chatId, attachment);
      }
    }
  }

  async setTyping(chatJid: string, isTyping: boolean): Promise<void> {
    if (!isTyping || !this.api || !this.connected) return;
    const { chatId } = parseTelegramChatJid(chatJid);
    await this.api.sendChatAction(chatId, "typing");
  }

  private async pollLoop(): Promise<void> {
    let reconnectAttempts = 0;
    while (!this.stopped && this.api) {
      try {
        const updates = await this.api.getUpdates({
          offset: this.lastUpdateId > 0 ? this.lastUpdateId + 1 : undefined,
          timeout: resolveTelegramLongPollTimeoutSeconds(this.options.pollingTimeoutSeconds),
          allowed_updates: ["message"],
        });

        reconnectAttempts = 0;
        for (const update of updates) {
          this.setLastUpdateId(update.update_id);
          await this.options.onUpdate(update, this.api);
        }
      } catch (error) {
        if (this.stopped) return;
        await this.options.onDisconnected?.(error);
        if (!isRecoverableTelegramNetworkError(error)) {
          throw error;
        }
        reconnectAttempts += 1;
        const delayMs = Math.min(30_000, 1_000 * 2 ** Math.min(reconnectAttempts, 5));
        await Bun.sleep(delayMs);
      }
    }
  }
}
