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
import {
  getMessageThreadRootIdById,
  getRuntimeMessagesSince,
  getRuntimeNewMessages,
} from "../db.js";
import type { AgentQueue } from "../queue.js";
import { detectChannel, formatMessages, formatOutbound } from "../router.js";
import { createLogger } from "../utils/logger.js";
import {
  getChannelTransport,
  type RuntimeProgressMessageHandle,
  type RuntimeSendMessageOptions,
} from "./channel-transport-registry.js";
import type { RuntimeState } from "./state.js";

const log = createLogger("runtime.message-loop");
const TYPING_REFRESH_MS = 4_000;
const MAX_PROGRESS_LINES = 12;
const MAX_PROGRESS_LINE_CHARS = 160;

function normalizeContentBlocks(value: unknown): Array<Record<string, unknown>> | undefined {
  return Array.isArray(value)
    ? value.filter((block): block is Record<string, unknown> => Boolean(block) && typeof block === "object")
    : undefined;
}

function getReplyThreadId(chatJid: string, message: { id: string; thread_id?: number | null }): number | undefined {
  if (Number.isInteger(message.thread_id) && Number(message.thread_id) > 0) {
    return Number(message.thread_id);
  }
  return getMessageThreadRootIdById(chatJid, message.id) ?? undefined;
}

function startChannelTyping(chatJid: string, channel: string): () => void {
  const transport = getChannelTransport(channel);
  if (!transport?.setTyping) return () => {};

  let stopped = false;
  const sendTyping = async (isTyping: boolean) => {
    try {
      await transport.setTyping?.(chatJid, isTyping);
    } catch (error) {
      log.warn("Failed to update typing state", {
        operation: "process_messages.typing",
        chatJid,
        channel,
        isTyping,
        err: error,
      });
    }
  };

  void sendTyping(true);
  const timer = setInterval(() => {
    void sendTyping(true);
  }, TYPING_REFRESH_MS);

  return () => {
    if (stopped) return;
    stopped = true;
    clearInterval(timer);
    void sendTyping(false);
  };
}

function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, Math.max(1, maxLen - 1)).trimEnd()}…`;
}

function normalizeProgressLine(text: string): string {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return truncateText(normalized, MAX_PROGRESS_LINE_CHARS);
}

function extractToolArgs(args: unknown): Record<string, unknown> | null {
  if (!args) return null;
  if (typeof args === "string") {
    try {
      const parsed = JSON.parse(args);
      return parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : null;
    } catch {
      return null;
    }
  }
  if (typeof args !== "object") return null;
  const record = args as Record<string, unknown>;
  const nested =
    (record.arguments as Record<string, unknown> | undefined)
    || (record.input as Record<string, unknown> | undefined)
    || (record.params as Record<string, unknown> | undefined)
    || (record.parameters as Record<string, unknown> | undefined)
    || (record.args as Record<string, unknown> | undefined)
    || (record.payload as Record<string, unknown> | undefined);
  return nested ?? record;
}

function formatToolProgressLine(toolName: unknown, args: unknown): string {
  const baseName = typeof toolName === "string" && toolName.trim() ? toolName.trim() : "tool";
  const record = extractToolArgs(args);
  if (!record) return `Tool: ${baseName}`;

  let detail: string | null = null;
  if (typeof record.command === "string") detail = record.command;
  if (!detail && Array.isArray(record.commands)) {
    detail = record.commands.filter((item): item is string => typeof item === "string" && item.trim().length > 0).join(" && ");
  }
  const path = record.path || record.filePath || record.target;
  if (!detail && typeof path === "string") detail = path;
  if (!detail && Array.isArray(record.paths)) {
    detail = record.paths.filter((item): item is string => typeof item === "string" && item.trim().length > 0).join(", ");
  }
  const filename = record.fileName || record.filename || record.file;
  if (!detail && typeof filename === "string") detail = filename;
  if (!detail && typeof record.url === "string") detail = record.url;
  if (!detail && typeof record.query === "string") detail = record.query;

  const suffix = detail ? `: ${truncateText(detail.replace(/\s+/g, " ").trim(), 120)}` : "";
  return `Tool: ${baseName}${suffix}`;
}

function summarizeThoughtCaption(text: string): string | null {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => normalizeProgressLine(line))
    .filter(Boolean);
  const caption = lines.at(-1) || normalizeProgressLine(trimmed);
  if (!caption) return null;
  return `Thinking: ${truncateText(caption, 140)}`;
}

function formatRetryProgressLine(event: Record<string, unknown>): string {
  const attempt = Number.isInteger(event.attempt) && Number(event.attempt) > 0 ? Number(event.attempt) : null;
  const maxAttempts = Number.isInteger(event.maxAttempts) && Number(event.maxAttempts) > 0 ? Number(event.maxAttempts) : null;
  const errorMessage = typeof event.errorMessage === "string" ? event.errorMessage : "";
  const reason = /rate\s*limit|too many requests|\b429\b/i.test(errorMessage)
    ? "rate limit"
    : /network|socket|timed out|fetch failed|econn|enotfound/i.test(errorMessage)
      ? "network error"
      : "error";
  const attemptSuffix = attempt || maxAttempts
    ? ` (${attempt ?? "?"}/${maxAttempts ?? "?"})`
    : "";
  return `Retrying after ${reason}${attemptSuffix}…`;
}

type RuntimeProgressReporter = {
  onEvent(event: unknown): void;
  remove(): Promise<void>;
};

function createProgressQueue(handle: RuntimeProgressMessageHandle, chatJid: string, channel: string) {
  let closed = false;
  let pending = Promise.resolve();

  const run = (operation: string, task: () => Promise<void> | void) => {
    if (closed) return;
    pending = pending
      .catch(() => undefined)
      .then(async () => {
        await task();
      })
      .catch((error) => {
        log.warn("Transport progress update failed", {
          operation,
          chatJid,
          channel,
          err: error,
        });
      });
  };

  return {
    run,
    async remove(): Promise<void> {
      closed = true;
      await pending.catch(() => undefined);
      try {
        await handle.remove();
      } catch (error) {
        log.warn("Transport progress removal failed", {
          operation: "process_messages.progress.remove",
          chatJid,
          channel,
          err: error,
        });
      }
    },
  };
}

async function createTransportProgressReporter(
  chatJid: string,
  channel: string,
  replyToExternalMessageId?: string | null,
): Promise<RuntimeProgressReporter | null> {
  const transport = getChannelTransport(channel);
  if (!transport?.createProgressMessage) return null;

  try {
    const handle = await transport.createProgressMessage(chatJid, "Thinking…", {
      replyToExternalMessageId: replyToExternalMessageId ?? null,
    });
    if (!handle) return null;

    const lines = ["Thinking…"];
    let lastRendered = "Thinking…";
    let thoughtBuffer = "";
    const queue = createProgressQueue(handle, chatJid, channel);

    const flushRenderedText = async () => {
      const nextText = lines.slice(-MAX_PROGRESS_LINES).join("\n");
      if (!nextText || nextText === lastRendered) return;
      await handle.update(nextText);
      lastRendered = nextText;
    };

    const pushLine = (line: string) => {
      const normalized = normalizeProgressLine(line);
      if (!normalized) return;
      queue.run("process_messages.progress.update", async () => {
        if (lines[lines.length - 1] === normalized) return;
        lines.push(normalized);
        if (lines.length > MAX_PROGRESS_LINES) {
          lines.splice(0, lines.length - MAX_PROGRESS_LINES);
        }
        await flushRenderedText();
      });
    };

    const flushThought = () => {
      const caption = summarizeThoughtCaption(thoughtBuffer);
      thoughtBuffer = "";
      if (caption) pushLine(caption);
    };

    return {
      onEvent(event: unknown) {
        const record = event && typeof event === "object" ? event as Record<string, unknown> : null;
        const eventType = typeof record?.type === "string" ? record.type : "";

        if (eventType === "message_update") {
          const messageEvent = record?.assistantMessageEvent && typeof record.assistantMessageEvent === "object"
            ? record.assistantMessageEvent as Record<string, unknown>
            : null;
          const messageType = typeof messageEvent?.type === "string" ? messageEvent.type : "";
          if (messageType === "thinking_start") {
            thoughtBuffer = "";
            pushLine("Thinking…");
            return;
          }
          if (messageType === "thinking_delta") {
            if (typeof messageEvent?.delta === "string") {
              thoughtBuffer += messageEvent.delta;
            }
            return;
          }
          if (messageType === "thinking_end") {
            if (typeof messageEvent?.content === "string" && messageEvent.content.trim()) {
              thoughtBuffer = messageEvent.content;
            }
            flushThought();
          }
          return;
        }

        if (eventType === "tool_execution_start") {
          flushThought();
          pushLine(formatToolProgressLine(record?.toolName, record?.args));
          return;
        }

        if (eventType === "compaction_start") {
          flushThought();
          pushLine("Compacting context…");
          return;
        }

        if (eventType === "recovery_start") {
          flushThought();
          pushLine("Recovering from error…");
          return;
        }

        if (eventType === "auto_retry_start") {
          flushThought();
          pushLine(formatRetryProgressLine(record ?? {}));
        }
      },
      remove: () => queue.remove(),
    };
  } catch (error) {
    log.warn("Failed to create transport progress message", {
      operation: "process_messages.progress.create",
      chatJid,
      channel,
      err: error,
    });
    return null;
  }
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
  const messages = getRuntimeMessagesSince(chatJid, since, deps.assistantName);
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
      const threadId = getReplyThreadId(chatJid, message);
      await deps.sendMessage(chatJid, formatted || "", {
        ...(threadId !== undefined ? { threadId } : {}),
        source: "control",
        mediaIds: result.mediaIds,
        contentBlocks: normalizeContentBlocks(result.contentBlocks),
      });
    }
    deps.state.markCommandProcessed(chatJid, message.id);
  }

  const nextTimestamp = messages[messages.length - 1].timestamp;
  const commitLastAgentTimestamp = () => {
    deps.state.lastAgentTimestamp[chatJid] = nextTimestamp;
    deps.state.saveTimestamps();
  };

  if (promptMessages.length === 0) {
    commitLastAgentTimestamp();
    return true;
  }

  // Check trigger on non-command messages only
  const hasTrigger = options.forcePrompt === true || promptMessages.some((m) => deps.triggerPattern.test(m.content.trim()));
  if (!hasTrigger) return true;

  const lastPrompt = promptMessages[promptMessages.length - 1];
  const cleaned = lastPrompt ? stripTrigger(lastPrompt.content, deps.triggerPattern) : "";
  if (promptMessages.length === 1 && isSlashCommandInvocation(cleaned)) {
    log.info("Executing slash command", {
      operation: "process_messages.slash_command",
      chatJid,
    });
    const stopTyping = startChannelTyping(chatJid, channel);
    let result;
    try {
      result = await deps.agentPool.applySlashCommand(chatJid, cleaned);
    } finally {
      stopTyping();
    }

    if (result.message || result.mediaIds?.length || result.contentBlocks?.length) {
      const text = formatOutbound(result.message || "", channel);
      const threadId = getReplyThreadId(chatJid, lastPrompt);
      await deps.sendMessage(chatJid, text || "", {
        ...(threadId !== undefined ? { threadId } : {}),
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


  const progressReporter = await createTransportProgressReporter(chatJid, channel, lastPrompt?.id);
  const stopTyping = startChannelTyping(chatJid, channel);
  let output;
  try {
    output = await deps.agentPool.runAgent(prompt, chatJid, progressReporter
      ? {
          onEvent: (event) => {
            progressReporter.onEvent(event);
          },
        }
      : undefined);
  } catch (error) {
    await progressReporter?.remove();
    throw error;
  } finally {
    stopTyping();
  }

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
    await progressReporter?.remove();
    return true;
  }

  let finalReplySent = false;
  if (output.result || output.attachments?.length) {
    const text = formatOutbound(output.result || "", channel);
    const threadId = lastPrompt ? getReplyThreadId(chatJid, lastPrompt) : undefined;
    await deps.sendMessage(chatJid, text || "", {
      ...(threadId !== undefined ? { threadId } : {}),
      source: "agent",
      attachments: output.attachments,
    });
    finalReplySent = true;
  }

  if (finalReplySent || (!output.result && !output.attachments?.length)) {
    await progressReporter?.remove();
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
      const { messages, newTimestamp } = getRuntimeNewMessages(jids, deps.state.lastTimestamp, deps.assistantName);
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
