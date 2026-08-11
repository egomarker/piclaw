/**
 * chat-tool – send a message from the current chat session to another destination.
 *
 * Local destinations use the normal inbound-message path so queue semantics,
 * follow-up handling, and agent execution remain unchanged. Explicit non-web
 * chat JIDs may instead use a registered channel transport when the destination
 * is the current or another known chat.
 */
import { Type } from "typebox";
import type { AgentToolResult, ExtensionAPI, ExtensionFactory } from "@earendil-works/pi-coding-agent";
import { getChatJid } from "../core/chat-context.js";
import { localChatAddressFromSelector, parseChatAddress } from "./chat-address.js";
import {
  sendViaChatTransport,
  setLocalChatTransport,
  type ChatTransportResult,
} from "./chat-transport-registry.js";

export type ChatRelayMode = "auto" | "queue" | "steer";

export type ChatRelayRequest = {
  source_chat_jid: string;
  target_chat_jid?: string;
  target_agent_name?: string;
  content: string;
  mode: ChatRelayMode;
};

export type ChatRelayResult = {
  status?: string;
  relayed?: boolean;
  source_chat_jid: string;
  source_agent_name?: string;
  source_agent_display_name?: string;
  target_chat_jid: string;
  target_agent_name?: string;
  target_agent_display_name?: string;
  reply_to?: Record<string, unknown>;
  source_session_tree?: Record<string, unknown>;
  target_session_tree?: Record<string, unknown>;
  row_id?: number | null;
  queued?: string;
  thread_id?: number | null;
  created?: boolean;
};

export type ChatToolRelayFn = (request: ChatRelayRequest) => Promise<ChatRelayResult>;

export type ChatChannelDeliveryRequest = {
  source_chat_jid: string;
  target_chat_jid: string;
  content: string;
};

export type ChatChannelDeliveryResult =
  | { handled: false }
  | { handled: true; result: ChatTransportResult };

export type ChatToolChannelDeliveryFn = (
  request: ChatChannelDeliveryRequest,
) => Promise<ChatChannelDeliveryResult>;

let chatToolChannelDeliveryFn: ChatToolChannelDeliveryFn | undefined;

/** Install or remove the optional direct channel-delivery attempt. */
export function setChatToolChannelDeliveryFn(fn: ChatToolChannelDeliveryFn | undefined): void {
  chatToolChannelDeliveryFn = fn;
}

/** Install or remove the built-in local relay behind the generic transport seam. */
export function setChatToolRelayFn(fn: ChatToolRelayFn | undefined): void {
  if (!fn) {
    setLocalChatTransport(undefined);
    return;
  }

  setLocalChatTransport({
    id: "local",
    async send(request) {
      if (request.address.kind !== "local") throw new Error("Local chat transport received a non-local address.");
      const result = await fn({
        source_chat_jid: request.source_chat_jid,
        ...(request.address.targetKind === "chat"
          ? { target_chat_jid: request.address.target }
          : { target_agent_name: request.address.target }),
        content: request.content,
        mode: request.mode,
      });
      return result;
    },
  });
}

const ChatSchema = Type.Object({
  target_address: Type.Optional(Type.String({ description: "Destination address. Local examples: '@research'. One-hop remote example: 'lab!@research'. Mutually exclusive with target_chat_jid and target_agent_name." })),
  target_chat_jid: Type.Optional(Type.String({ description: "Destination chat JID. Recognized non-web prefixes use an available channel transport for current or known chats; all other JIDs use the existing local session relay. Prefer target_agent_name/@alias for local sessions." })),
  target_agent_name: Type.Optional(Type.String({ description: "Preferred destination branch handle/alias, e.g. 'research' or '@research'. Resolves through the internal session tree mapping." })),
  content: Type.String({ description: "Text body to send to the destination." }),
  mode: Type.Optional(Type.Union([
    Type.Literal("auto"),
    Type.Literal("queue"),
    Type.Literal("steer"),
  ], { description: "Relay mode for local or peer targets: steer (default), queue, or auto. Direct channel delivery sends immediately." })),
  idempotency_key: Type.Optional(Type.String({ description: "Optional transport idempotency key. Used by transports that support durable retry deduplication." })),
  in_reply_to: Type.Optional(Type.String({ description: "Optional opaque transport reply token or message id." })),
});

export type ChatToolParams = {
  target_address?: string;
  target_chat_jid?: string;
  target_agent_name?: string;
  content: string;
  mode?: ChatRelayMode;
  idempotency_key?: string;
  in_reply_to?: string;
};

const HINT = [
  "## Cross-session chat",
  "Use the chat tool when one agent session needs to message another session or an installed channel transport.",
  "Prefer target_agent_name with an @alias (for example @research) for local sessions. Use target_chat_jid for an explicit chat JID.",
  "A recognized non-web target_chat_jid uses its registered channel transport when available and the destination is the current or another known chat. Web, unprefixed, unknown-prefix, unknown-chat, and unavailable-transport JIDs retain the normal local session relay.",
  "Use target_address for an explicit address. Local aliases use @name; installed transports may add one-hop peer!target addresses. Multi-hop bang paths are rejected.",
  "@aliases are resolved through the internal Pi chat-branch/session-tree registry before delivery; do not use opaque session IDs when an alias is available.",
  "Sender identity is derived from the current chat session and cannot be supplied by the caller; local destination identity is resolved before relay.",
  "Local relay messages steer the target immediately by default. Use mode='queue' to enqueue behind active work, or mode='auto' for standard request behavior.",
  "The chat tool sends text only; attachments are not forwarded.",
].join("\n");

function err(message: string): AgentToolResult<Record<string, unknown>> {
  return {
    content: [{ type: "text", text: message }],
    details: { relayed: false, error: message },
  };
}

function normalizeTargetAgentName(value: string | undefined): string {
  return String(value || "").trim().replace(/^@+/, "").trim();
}

function describeTarget(result: ChatTransportResult): string {
  if (result.target_agent_name && result.target_chat_jid) {
    return `@${result.target_agent_name} (${result.target_chat_jid})`;
  }
  return result.target_address
    ? String(result.target_address)
    : result.target_chat_jid
      ? String(result.target_chat_jid)
      : result.target_agent_name
        ? `@${result.target_agent_name}`
        : "destination";
}

/** Built-in tool for local relay and direct channel text delivery. */
export const chatTool: ExtensionFactory = (pi: ExtensionAPI) => {
  pi.on("before_agent_start", async (event) => ({
    systemPrompt: `${event.systemPrompt}\n\n${HINT}`,
  }));

  pi.registerTool({
    name: "chat",
    label: "chat",
    description: "Send text from the current session to another local session, a current or known non-web channel JID, or a destination handled by an installed chat transport.",
    promptSnippet: "chat: send text to a local @alias, an explicit channel chat JID, or a one-hop transport address. Prefer target_agent_name='@alias' for local sessions.",
    parameters: ChatSchema,
    async execute(_toolCallId, params: ChatToolParams) {
      const sourceChatJid = getChatJid("").trim();
      if (!sourceChatJid) return err("Cannot determine the source chat. The chat tool requires an active chat context.");

      const targetAddress = params.target_address?.trim() || "";
      const targetChatJid = params.target_chat_jid?.trim() || "";
      const targetAgentName = normalizeTargetAgentName(params.target_agent_name);
      const selectorCount = Number(Boolean(targetAddress)) + Number(Boolean(targetChatJid)) + Number(Boolean(targetAgentName));
      if (selectorCount === 0) {
        return err("Provide target_address, target_agent_name (@alias preferred), or target_chat_jid.");
      }
      if (selectorCount > 1) {
        return err("Provide only one target selector: target_address, target_chat_jid, or target_agent_name.");
      }

      const content = params.content?.trim() || "";
      if (!content) return err("Provide content.");

      try {
        if (targetChatJid && chatToolChannelDeliveryFn) {
          const delivery = await chatToolChannelDeliveryFn({
            source_chat_jid: sourceChatJid,
            target_chat_jid: targetChatJid,
            content,
          });
          if (delivery.handled) {
            const result = delivery.result;
            const target = describeTarget(result);
            const transportSuffix = result.transport ? ` via ${result.transport}` : "";
            return {
              content: [{ type: "text", text: `Sent to ${target}${transportSuffix}.` }],
              details: {
                tool: "chat",
                relayed: true,
                delivered: true,
                delivery: "channel",
                ...result,
              },
            };
          }
        }

        const address = targetAddress
          ? parseChatAddress(targetAddress)
          : localChatAddressFromSelector({ targetChatJid, targetAgentName });
        const result = await sendViaChatTransport({
          source_chat_jid: sourceChatJid,
          address,
          content,
          mode: params.mode || "steer",
          ...(params.idempotency_key?.trim() ? { idempotency_key: params.idempotency_key.trim() } : {}),
          ...(params.in_reply_to?.trim() ? { in_reply_to: params.in_reply_to.trim() } : {}),
        }, { annotate: Boolean(targetAddress) });

        const target = describeTarget(result);
        const statusText = result.queued === "followup"
          ? `Relayed to ${target} and queued as a follow-up.`
          : `Relayed to ${target}.`;

        return {
          content: [{ type: "text", text: statusText }],
          details: {
            tool: "chat",
            relayed: true,
            ...result,
          },
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error || "Chat delivery failed.");
        return err(message || "Chat delivery failed.");
      }
    },
  });
};
