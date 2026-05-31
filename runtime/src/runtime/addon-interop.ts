import { parseControlCommand } from "../agent-control/index.js";
import { attachMediaToMessage, getDb, getMessageByRowId, storeChatMetadata, storeMessage } from "../db.js";
import type { AgentQueue } from "../queue.js";
import { detectChannel, formatOutbound } from "../router.js";
import type { NewMessage } from "../types.js";
import { createUuid } from "../utils/ids.js";
import { createLogger } from "../utils/logger.js";
import { processMessages, type MessageProcessingDeps } from "./message-loop.js";
import { isAllowedNonWebControlCommand } from "./non-web-command-policy.js";
import type { RuntimeState } from "./state.js";
import { registerChannelTransport, type RuntimeChannelTransport, type RuntimeSendMessageOptions } from "./channel-transport-registry.js";

const log = createLogger("runtime.addon-interop");

export interface RuntimeInboundMessageOptions {
  source?: string;
  messageId?: string;
  sender?: string;
  senderName?: string;
  timestamp?: string;
  mediaIds?: number[];
  contentBlocks?: Array<Record<string, unknown>>;
  screenHint?: string | null;
  threadId?: number | null;
  chatName?: string;
  isFromMe?: boolean;
  isBotMessage?: boolean;
  enqueue?: boolean;
  forcePrompt?: boolean;
}

interface RuntimeAddonInteropWebBridge {
  broadcastEvent?(eventType: string, data: unknown): void;
}

interface InstallAddonRuntimeInteropOptions {
  queue: AgentQueue;
  web?: RuntimeAddonInteropWebBridge | null;
  state: RuntimeState;
  agentPool: MessageProcessingDeps["agentPool"];
  assistantName: string;
  triggerPattern: RegExp;
  sendMessage: (jid: string, text: string, options?: RuntimeSendMessageOptions) => Promise<void>;
}

type RuntimeInteropBridge = {
  getAssistantName?: () => string;
  postMessage?: (chatJid: string, content: string, options?: RuntimeInboundMessageOptions) => Promise<{ messageId: string; rowId: number | null }>;
  registerChannelTransport?: (channel: string, transport: RuntimeChannelTransport) => (() => void);
};

function ensureChatTracked(state: RuntimeState, chatJid: string): void {
  if (state.chatJids.has(chatJid)) return;
  state.chatJids.add(chatJid);
  state.saveChats();
}

function toPositiveMediaIds(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((id): id is number => Number.isFinite(id) && id > 0)
    : [];
}

function normalizeContentBlocks(value: unknown): Array<Record<string, unknown>> | undefined {
  return Array.isArray(value)
    ? value.filter((block): block is Record<string, unknown> => Boolean(block) && typeof block === "object")
    : undefined;
}

export function installAddonRuntimeInterop(options: InstallAddonRuntimeInteropOptions): void {
  const runtimeInterop = ((globalThis as { __piclawRuntimeInterop?: RuntimeInteropBridge }).__piclawRuntimeInterop ||= {});
  runtimeInterop.getAssistantName = () => options.assistantName;
  runtimeInterop.registerChannelTransport = registerChannelTransport;
  runtimeInterop.postMessage = async (chatJid, content, inboundOptions = {}) => {
    const normalizedChatJid = String(chatJid || "").trim();
    if (!normalizedChatJid) {
      throw new Error("Runtime addon inbound message requires a chat JID.");
    }

    const timestamp = typeof inboundOptions.timestamp === "string" && inboundOptions.timestamp.trim()
      ? inboundOptions.timestamp.trim()
      : new Date().toISOString();
    const source = typeof inboundOptions.source === "string" && inboundOptions.source.trim()
      ? inboundOptions.source.trim().toLowerCase()
      : "addon";
    const messageId = typeof inboundOptions.messageId === "string" && inboundOptions.messageId.trim()
      ? inboundOptions.messageId.trim()
      : `${source}:${createUuid("message")}`;
    const mediaIds = toPositiveMediaIds(inboundOptions.mediaIds);
    const explicitThreadId = Number.isInteger(inboundOptions.threadId) && Number(inboundOptions.threadId) > 0
      ? Number(inboundOptions.threadId)
      : null;
    const message: NewMessage = {
      id: messageId,
      chat_jid: normalizedChatJid,
      sender: typeof inboundOptions.sender === "string" && inboundOptions.sender.trim()
        ? inboundOptions.sender.trim()
        : source,
      sender_name: typeof inboundOptions.senderName === "string" && inboundOptions.senderName.trim()
        ? inboundOptions.senderName.trim()
        : (typeof inboundOptions.sender === "string" && inboundOptions.sender.trim() ? inboundOptions.sender.trim() : source),
      content: typeof content === "string" ? content : String(content || ""),
      screen_hint: typeof inboundOptions.screenHint === "string" && inboundOptions.screenHint.trim()
        ? inboundOptions.screenHint.trim()
        : null,
      timestamp,
      is_from_me: inboundOptions.isFromMe === true,
      is_bot_message: inboundOptions.isBotMessage === true,
      content_blocks: Array.isArray(inboundOptions.contentBlocks) ? inboundOptions.contentBlocks : undefined,
      thread_id: explicitThreadId,
    };

    const rowId = storeMessage(message);
    if (rowId > 0 && mediaIds.length > 0) {
      attachMediaToMessage(rowId, mediaIds);
    }
    if (rowId > 0 && explicitThreadId === null && message.is_bot_message !== true) {
      getDb().prepare("UPDATE messages SET thread_id = ? WHERE rowid = ?").run(rowId, rowId);
    }
    storeChatMetadata(normalizedChatJid, timestamp, typeof inboundOptions.chatName === "string" ? inboundOptions.chatName.trim() || undefined : undefined);
    ensureChatTracked(options.state, normalizedChatJid);

    if (rowId > 0) {
      const interaction = getMessageByRowId(normalizedChatJid, rowId);
      if (interaction) {
        options.web?.broadcastEvent?.("new_post", interaction);
      }
    }

    const parsedCommand = message.is_bot_message !== true
      ? parseControlCommand(message.content, options.triggerPattern)
      : null;
    const channel = detectChannel(normalizedChatJid);
    const immediateAbortCommand = parsedCommand?.type === "abort"
      ? parsedCommand
      : null;
    const immediateSteerCommand = parsedCommand?.type === "steer"
      ? parsedCommand
      : null;
    const immediateSteerText = immediateSteerCommand?.message?.trim() || "";
    const replyThreadId = explicitThreadId ?? (rowId > 0 ? rowId : undefined);

    if (inboundOptions.enqueue !== false && immediateAbortCommand && options.agentPool.isActive(normalizedChatJid)) {
      if (!isAllowedNonWebControlCommand(normalizedChatJid, immediateAbortCommand)) {
        options.state.markCommandProcessed(normalizedChatJid, messageId);
        return {
          messageId,
          rowId: rowId > 0 ? rowId : null,
        };
      }

      const result = await options.agentPool.applyControlCommand(normalizedChatJid, immediateAbortCommand);
      options.state.markCommandProcessed(normalizedChatJid, messageId);

      const formatted = formatOutbound(result.message || "", channel);
      if (formatted || result.mediaIds?.length || result.contentBlocks?.length) {
        await options.sendMessage(normalizedChatJid, formatted || "", {
          ...(replyThreadId !== undefined ? { threadId: replyThreadId } : {}),
          source: "control",
          mediaIds: result.mediaIds,
          contentBlocks: normalizeContentBlocks(result.contentBlocks),
        });
      }

      log.info("Handled inbound abort command immediately", {
        operation: "runtime_addon_interop.post_message.immediate_abort",
        chatJid: normalizedChatJid,
        messageId,
        rowId: rowId > 0 ? rowId : null,
        status: result.status,
      });

      return {
        messageId,
        rowId: rowId > 0 ? rowId : null,
      };
    }

    if (inboundOptions.enqueue !== false && immediateSteerCommand && immediateSteerText && options.agentPool.isStreaming(normalizedChatJid)) {
      if (!isAllowedNonWebControlCommand(normalizedChatJid, immediateSteerCommand)) {
        options.state.markCommandProcessed(normalizedChatJid, messageId);
        return {
          messageId,
          rowId: rowId > 0 ? rowId : null,
        };
      }

      const steerResult = await options.agentPool.queueStreamingMessage(normalizedChatJid, immediateSteerText, "steer");
      if (steerResult.queued) {
        options.state.markCommandProcessed(normalizedChatJid, messageId);

        log.info("Handled inbound steer command immediately", {
          operation: "runtime_addon_interop.post_message.immediate_steer",
          chatJid: normalizedChatJid,
          messageId,
          rowId: rowId > 0 ? rowId : null,
        });

        return {
          messageId,
          rowId: rowId > 0 ? rowId : null,
        };
      }
    }

    if (inboundOptions.enqueue !== false) {
      const forcePrompt = inboundOptions.forcePrompt === true;
      options.queue.enqueue(async () => {
        const ok = await processMessages(normalizedChatJid, {
          agentPool: options.agentPool,
          state: options.state,
          assistantName: options.assistantName,
          triggerPattern: options.triggerPattern,
          sendMessage: options.sendMessage,
        }, { forcePrompt });
        if (!ok) {
          throw new Error(`Addon inbound processing failed for ${normalizedChatJid}`);
        }
      }, `addon-inbound:${normalizedChatJid}:${messageId}`, `chat:${normalizedChatJid}`);
    }

    log.info("Stored inbound addon message", {
      operation: "runtime_addon_interop.post_message",
      chatJid: normalizedChatJid,
      messageId,
      rowId: rowId > 0 ? rowId : null,
      mediaCount: mediaIds.length,
      enqueue: inboundOptions.enqueue !== false,
      forcePrompt: inboundOptions.forcePrompt === true,
      source,
    });

    return {
      messageId,
      rowId: rowId > 0 ? rowId : null,
    };
  };
}
