import type { AttachmentInfo } from "../agent-pool/attachments.js";

export interface RuntimeSendMessageOptions {
  threadId?: number | null;
  forceRoot?: boolean;
  source?: string;
  mediaIds?: number[];
  contentBlocks?: Array<Record<string, unknown>>;
  attachments?: AttachmentInfo[];
}

export interface RuntimeProgressMessageOptions {
  replyToExternalMessageId?: string | null;
}

export interface RuntimeProgressMessageHandle {
  update(text: string): Promise<void> | void;
  remove(): Promise<void> | void;
}

export interface RuntimeChannelTransport {
  sendMessage(chatJid: string, text: string, options?: RuntimeSendMessageOptions): Promise<void> | void;
  setTyping?(chatJid: string, isTyping: boolean): Promise<void> | void;
  createProgressMessage?(
    chatJid: string,
    initialText: string,
    options?: RuntimeProgressMessageOptions,
  ): Promise<RuntimeProgressMessageHandle | null> | RuntimeProgressMessageHandle | null;
}

const transports = new Map<string, RuntimeChannelTransport>();

function normalizeChannelName(channel: string): string {
  return String(channel || "").trim().toLowerCase();
}

export function registerChannelTransport(channel: string, transport: RuntimeChannelTransport): () => void {
  const normalizedChannel = normalizeChannelName(channel);
  if (!normalizedChannel || !transport || typeof transport.sendMessage !== "function") {
    return () => {};
  }

  transports.set(normalizedChannel, transport);
  return () => {
    if (transports.get(normalizedChannel) === transport) {
      transports.delete(normalizedChannel);
    }
  };
}

export function getChannelTransport(channel: string | null | undefined): RuntimeChannelTransport | null {
  const normalizedChannel = normalizeChannelName(String(channel || ""));
  if (!normalizedChannel) return null;
  return transports.get(normalizedChannel) ?? null;
}

export function buildAttachmentContentBlocks(attachments: AttachmentInfo[]): Array<Record<string, unknown>> {
  return attachments.map((attachment) => ({
    type: attachment.kind === "image" ? "image" : "file",
    name: attachment.name,
    filename: attachment.name,
    mime_type: attachment.contentType,
    size: attachment.size,
  }));
}

export function resetChannelTransportRegistryForTests(): void {
  transports.clear();
}
