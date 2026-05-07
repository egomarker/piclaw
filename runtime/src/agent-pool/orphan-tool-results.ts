/**
 * agent-pool/orphan-tool-results.ts – Prunes stale tool-result messages from session state.
 *
 * When historical toolResult entries no longer have matching assistant toolCall
 * blocks, downstream provider payloads can bloat or reference invalid tool-call IDs.
 * This helper removes orphaned tool results defensively before a new prompt run
 * and before manual session compaction.
 */

import type { AgentSession } from "@earendil-works/pi-coding-agent";
import { createLogger } from "../utils/logger.js";

interface AgentContentBlock {
  type?: unknown;
  id?: unknown;
  toolCallId?: unknown;
  toolUseId?: unknown;
  tool_use_id?: unknown;
}

interface AgentMessageRecord {
  role?: unknown;
  content?: unknown;
  toolCallId?: unknown;
  toolUseId?: unknown;
  tool_use_id?: unknown;
}

interface SessionWithInternalAgent {
  agent?: {
    state?: {
      messages?: AgentMessageRecord[];
    };
    replaceMessages?: (messages: AgentMessageRecord[]) => void;
  };
}

const log = createLogger("agent-pool.orphan-tool-results");

function getToolCallId(value: { id?: unknown; toolCallId?: unknown; toolUseId?: unknown; tool_use_id?: unknown }): string | null {
  if (typeof value.id === "string" && value.id.trim()) return value.id;
  if (typeof value.toolCallId === "string" && value.toolCallId.trim()) return value.toolCallId;
  if (typeof value.toolUseId === "string" && value.toolUseId.trim()) return value.toolUseId;
  if (typeof value.tool_use_id === "string" && value.tool_use_id.trim()) return value.tool_use_id;
  return null;
}

function isToolCallBlock(block: AgentContentBlock): boolean {
  return block.type === "toolCall"
    || block.type === "toolUse"
    || block.type === "tool_call"
    || block.type === "tool_use";
}

function isToolResultBlock(block: AgentContentBlock): boolean {
  return block.type === "toolResult" || block.type === "tool_result";
}

function isToolResultMessage(message: AgentMessageRecord): boolean {
  return message.role === "toolResult" || message.role === "tool_result";
}

/** Remove toolResult entries that no longer correspond to assistant tool calls. */
export function pruneOrphanToolResults(session: AgentSession, chatJid: string): number {
  const internalSession = session as unknown as SessionWithInternalAgent;
  const messages = internalSession.agent?.state?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return 0;

  const toolCallIds = new Set<string>();
  for (const msg of messages) {
    if (!Array.isArray(msg?.content)) continue;
    for (const block of msg.content) {
      const contentBlock = block as AgentContentBlock;
      if (!contentBlock || typeof contentBlock !== "object") continue;
      if (!isToolCallBlock(contentBlock)) continue;
      const id = getToolCallId(contentBlock);
      if (id) toolCallIds.add(id);
    }
  }

  let prunedCount = 0;
  const pruned = messages.flatMap((msg) => {
    if (!msg || typeof msg !== "object") return [msg];

    if (isToolResultMessage(msg)) {
      const id = getToolCallId(msg);
      if (id && toolCallIds.has(id)) return [msg];
      prunedCount += 1;
      return [];
    }

    if (!Array.isArray(msg.content)) return [msg];

    let contentChanged = false;
    const filteredContent = msg.content.filter((block) => {
      const contentBlock = block as AgentContentBlock;
      if (!contentBlock || typeof contentBlock !== "object") return true;
      if (!isToolResultBlock(contentBlock)) return true;
      const id = getToolCallId(contentBlock);
      if (id && toolCallIds.has(id)) return true;
      contentChanged = true;
      prunedCount += 1;
      return false;
    });

    if (!contentChanged) return [msg];
    return [{ ...msg, content: filteredContent }];
  });

  if (prunedCount === 0) return 0;

  try {
    internalSession.agent?.replaceMessages?.(pruned);
    log.warn("Pruned orphan tool results from session state", {
      operation: "orphan_tool_results.prune",
      chatJid,
      prunedCount,
    });
    return prunedCount;
  } catch (error) {
    log.warn("Failed to prune orphan tool results from session state", {
      operation: "orphan_tool_results.prune",
      chatJid,
      prunedCount,
      err: error,
    });
    return 0;
  }
}
