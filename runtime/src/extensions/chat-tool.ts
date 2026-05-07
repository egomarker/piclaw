/**
 * chat-tool – relay a message from the current chat session to another session.
 *
 * This is the tool analogue of the web peer-message relay endpoint: it routes a
 * message through the normal inbound-message path for the target chat so queue
 * semantics, follow-up handling, and agent execution remain unchanged.
 */
import { Type } from "typebox";
import type { AgentToolResult, ExtensionAPI, ExtensionFactory } from "@earendil-works/pi-coding-agent";
import { getChatJid } from "../core/chat-context.js";

type ChatRelayMode = "auto" | "queue" | "steer";

type ChatRelayRequest = {
  source_chat_jid: string;
  target_chat_jid?: string;
  target_agent_name?: string;
  content: string;
  mode: ChatRelayMode;
};

type ChatRelayResult = {
  status?: string;
  relayed?: boolean;
  source_chat_jid: string;
  source_agent_name?: string;
  target_chat_jid: string;
  target_agent_name?: string;
  row_id?: number | null;
  queued?: string;
  thread_id?: number | null;
  created?: boolean;
};

export type ChatToolRelayFn = (request: ChatRelayRequest) => Promise<ChatRelayResult>;

let registeredChatToolRelayFn: ChatToolRelayFn | undefined;

export function setChatToolRelayFn(fn: ChatToolRelayFn | undefined): void {
  registeredChatToolRelayFn = fn;
}

const ChatSchema = Type.Object({
  target_chat_jid: Type.Optional(Type.String({ description: "Destination chat JID." })),
  target_agent_name: Type.Optional(Type.String({ description: "Destination branch handle, e.g. 'research' or '@research'." })),
  content: Type.String({ description: "Message body to deliver to the destination session." }),
  mode: Type.Optional(Type.Union([
    Type.Literal("auto"),
    Type.Literal("queue"),
    Type.Literal("steer"),
  ], { description: "Delivery mode for busy targets: auto (default), queue, or steer." })),
});

type ChatToolParams = {
  target_chat_jid?: string;
  target_agent_name?: string;
  content: string;
  mode?: ChatRelayMode;
};

const HINT = [
  "## Cross-session chat",
  "Use the chat tool when one agent session needs to message another session.",
  "Provide either target_chat_jid or target_agent_name (leading @ is accepted for agent handles).",
  "The destination receives the message through its normal inbound-message path, so queueing and busy-session behavior stay consistent.",
  "Use mode='queue' to enqueue behind active work, or mode='steer' to inject steering while the target is streaming.",
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

function describeTarget(result: ChatRelayResult): string {
  return result.target_agent_name
    ? `@${result.target_agent_name} (${result.target_chat_jid})`
    : result.target_chat_jid;
}

/** Built-in tool for cross-session chat relay. */
export const chatTool: ExtensionFactory = (pi: ExtensionAPI) => {
  pi.on("before_agent_start", async (event) => ({
    systemPrompt: `${event.systemPrompt}\n\n${HINT}`,
  }));

  pi.registerTool({
    name: "chat",
    label: "chat",
    description: "Send a message from the current session to another chat session or @agent branch.",
    promptSnippet: "chat: relay a message from the current session to another session using target_chat_jid or target_agent_name.",
    parameters: ChatSchema,
    async execute(_toolCallId, params: ChatToolParams) {
      const sourceChatJid = getChatJid("").trim();
      if (!sourceChatJid) return err("Cannot determine the source chat. The chat tool requires an active chat context.");

      const targetChatJid = params.target_chat_jid?.trim() || "";
      const targetAgentName = normalizeTargetAgentName(params.target_agent_name);
      if (!targetChatJid && !targetAgentName) {
        return err("Provide target_chat_jid or target_agent_name.");
      }
      if (targetChatJid && targetAgentName) {
        return err("Provide only one target selector: target_chat_jid or target_agent_name.");
      }

      const content = params.content?.trim() || "";
      if (!content) return err("Provide content.");

      if (!registeredChatToolRelayFn) {
        return err("Cross-session chat relay is unavailable in this runtime.");
      }

      try {
        const result = await registeredChatToolRelayFn({
          source_chat_jid: sourceChatJid,
          ...(targetChatJid ? { target_chat_jid: targetChatJid } : {}),
          ...(targetAgentName ? { target_agent_name: targetAgentName } : {}),
          content,
          mode: params.mode || "auto",
        });

        const target = describeTarget(result);
        const statusText = result.queued === "followup"
          ? `Relayed to ${target} and queued as a follow-up.`
          : result.thread_id !== undefined
            ? `Relayed to ${target}.`
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
        const message = error instanceof Error ? error.message : String(error || "Cross-session chat relay failed.");
        return err(message || "Cross-session chat relay failed.");
      }
    },
  });
};
