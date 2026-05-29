/**
 * runtime/message-loop.ts – Core message processing and enqueue logic.
 *
 * Implements the main polling callback that:
 *   1. Fetches new messages since the last timestamp (via db/messages.ts).
 *   2. Detects whether each message is a control command (agent-control) or
 *      a regular user message.
 *   3. Formats messages into XML and enqueues agent runs on the AgentQueue.
 *   4. Delivers agent responses to non-web channels (addon-provided).
 *
 * Also provides the processChat() helper used by the web channel to inject
 * messages directly into the queue without going through the poll cycle.
 *
 * Consumers:
 *   - runtime.ts passes processMessages() to the polling timer.
 *   - channels/web.ts calls processChat() when a web-channel message arrives.
 */

import type { AgentPool } from "../agent-pool.js";
import { formatRecoverySummary } from "../agent-pool/automatic-recovery.js";
import { parseControlCommand, type AgentControlCommand } from "../agent-control/index.js";
import { stripTrigger } from "../agent-control/parser-utils.js";
import { isSlashCommandInvocation } from "../agent-pool/slash-command.js";
import { getMessagesSince, getNewMessages } from "../db.js";
import type { AgentQueue } from "../queue.js";
import { detectChannel, formatMessages, formatOutbound } from "../router.js";
import { createLogger } from "../utils/logger.js";
import type { RuntimeSendMessageOptions } from "./channel-transport-registry.js";
import type { RuntimeState } from "./state.js";

const log = createLogger("runtime.message-loop");

function normalizeContentBlocks(value: unknown): Array<Record<string, unknown>> | undefined {
  return Array.isArray(value)
    ? value.filter((block): block is Record<string, unknown> => Boolean(block) && typeof block === "object")
    : undefined;
}

/**
 * Dependencies injected into the message-processing functions.
 * Provided by runtime.ts to avoid circular imports.
 */

export interface MessageProcessingDeps {
  agentPool: AgentPool;
  state: RuntimeState;
  assistantName: string;
  triggerPattern: RegExp;
  sendMessage: (jid: string, text: string, options?: RuntimeSendMessageOptions) => Promise<void>;
}

/** Process pending messages for a single chat: send to agent, deliver response. */
export async function processMessages(
  chatJid: string,
  deps: MessageProcessingDeps,
  options: { forcePrompt?: boolean } = {},
): Promise<boolean> {
  const since = deps.state.lastAgentTimestamp[chatJid] || "";
  const messages = getMessagesSince(chatJid, since, deps.assistantName);
  if (messages.length === 0) return true;

  const commandQueue: Array<{ message: (typeof messages)[number]; command: AgentControlCommand }> = [];
  const promptMessages: typeof messages = [];
  const channel = detectChannel(chatJid);

  for (const message of messages) {
    const command = !message.is_bot_message
      ? parseControlCommand(message.content, deps.triggerPattern)
      : null;
    if (command) {
      if (!deps.state.wasCommandProcessed(chatJid, message.id)) {
        commandQueue.push({ message, command });
      }
      continue;
    }
    promptMessages.push(message);
  }

  for (const { message, command } of commandQueue) {
    const result = await deps.agentPool.applyControlCommand(chatJid, command);
    const formatted = formatOutbound(result.message || "", channel);
    if (formatted || result.mediaIds?.length || result.contentBlocks?.length) {
      await deps.sendMessage(chatJid, formatted || "", {
        source: "control",
        mediaIds: result.mediaIds,
        contentBlocks: normalizeContentBlocks(result.contentBlocks),
      });
    }
    deps.state.markCommandProcessed(chatJid, message.id);
  }

  // Check trigger on non-command messages only
  const hasTrigger = options.forcePrompt === true || promptMessages.some((m) => deps.triggerPattern.test(m.content.trim()));
  if (!hasTrigger) return true;

  const nextTimestamp = messages[messages.length - 1].timestamp;
  const commitLastAgentTimestamp = () => {
    deps.state.lastAgentTimestamp[chatJid] = nextTimestamp;
    deps.state.saveTimestamps();
  };

  const lastPrompt = promptMessages[promptMessages.length - 1];
  const cleaned = lastPrompt ? stripTrigger(lastPrompt.content, deps.triggerPattern) : "";
  if (promptMessages.length === 1 && isSlashCommandInvocation(cleaned)) {
    log.info("Executing slash command", {
      operation: "process_messages.slash_command",
      chatJid,
    });
    const result = await deps.agentPool.applySlashCommand(chatJid, cleaned);

    if (result.message || result.mediaIds?.length || result.contentBlocks?.length) {
      const text = formatOutbound(result.message || "", channel);
      await deps.sendMessage(chatJid, text || "", {
        source: "slash-command",
        mediaIds: result.mediaIds,
        contentBlocks: normalizeContentBlocks(result.contentBlocks),
      });
    }

    if (result.status === "error") {
      log.error("Slash command failed", {
        operation: "process_messages.slash_command",
        chatJid,
        errorMessage: result.message,
      });
      return true;
    }

    commitLastAgentTimestamp();
    return true;
  }

  const prompt = formatMessages(promptMessages, channel, chatJid);

  log.info("Processing queued prompt messages", {
    operation: "process_messages.prompt",
    chatJid,
    promptMessageCount: promptMessages.length,
  });


  const output = await deps.agentPool.runAgent(prompt, chatJid, {
    onTurnComplete: async () => {
      // Non-web channels currently deliver only the terminal turn output.
    },
  });

  const recoverySummary = formatRecoverySummary(output.recovery);

  if (output.recovery?.recovered) {
    log.info("Agent run recovered before outbound delivery", {
      operation: "process_messages.prompt.recovered",
      chatJid,
      recovery: output.recovery,
      recoverySummary,
    });
  }


  if (output.status === "error") {
    log.error("Agent run failed", {
      operation: "process_messages.prompt",
      chatJid,
      errorMessage: output.error,
      recovery: output.recovery || null,
      recoverySummary,
    });
    return true;
  }

  if (output.result || output.attachments?.length) {
    const text = formatOutbound(output.result || "", channel);
    await deps.sendMessage(chatJid, text || "", {
      source: "agent",
      attachments: output.attachments,
    });
  }

  commitLastAgentTimestamp();
  return true;
}

/** Dependencies for the message polling loop. */
export interface MessageLoopDeps {
  queue: AgentQueue;
  state: RuntimeState;
  assistantName: string;
  pollIntervalMs: number;
  processMessages: (chatJid: string) => Promise<boolean>;
}

/** Start the polling loop that checks for new messages across all chats. */
export async function runMessageLoop(deps: MessageLoopDeps): Promise<void> {
  log.info("Starting runtime message loop", {
    operation: "run_message_loop.start",
    assistantName: deps.assistantName,
  });
  while (true) {
    try {
      const jids = [...deps.state.chatJids];
      const { messages, newTimestamp } = getNewMessages(jids, deps.state.lastTimestamp, deps.assistantName);
      if (messages.length > 0) {
        deps.state.lastTimestamp = newTimestamp;
        deps.state.saveTimestamps();
        // Deduplicate by chat
        const byChat = new Map<string, boolean>();
        for (const msg of messages) byChat.set(msg.chat_jid, true);
        for (const chatJid of byChat.keys()) {
          deps.queue.enqueue(async () => {
            const ok = await deps.processMessages(chatJid);
            if (!ok) throw new Error(`Agent processing failed for ${chatJid}`);
          }, `chat:${chatJid}`, `chat:${chatJid}`);
        }
      }
    } catch (error) {
      log.error("Message loop iteration failed", {
        operation: "run_message_loop.iteration",
        err: error,
      });
    }
    await Bun.sleep(deps.pollIntervalMs);
  }
}
