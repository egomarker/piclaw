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

interface SessionWithAgentState {
  agent?: {
    state?: {
      messages?: AgentMessageRecord[];
    };
  };
}

const log = createLogger("agent-pool.orphan-tool-results");

function getToolCallIds(value: { id?: unknown; toolCallId?: unknown; toolUseId?: unknown; tool_use_id?: unknown }): string[] {
  const ids: string[] = [];
  for (const key of ["id", "toolCallId", "toolUseId", "tool_use_id"] as const) {
    const raw = value[key];
    if (typeof raw !== "string") continue;
    const id = raw.trim();
    if (!id) continue;
    ids.push(id);
    const baseId = id.split("|", 1)[0]?.trim();
    if (baseId && baseId !== id) ids.push(baseId);
  }
  return ids;
}

function hasKnownToolCallId(value: { id?: unknown; toolCallId?: unknown; toolUseId?: unknown; tool_use_id?: unknown }, toolCallIds: Set<string>): boolean {
  return getToolCallIds(value).some((id) => toolCallIds.has(id));
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

function collectToolCallIds(messages: readonly AgentMessageRecord[]): Set<string> {
  const toolCallIds = new Set<string>();
  for (const message of messages) {
    if (!Array.isArray(message?.content)) continue;
    for (const block of message.content) {
      const contentBlock = block as AgentContentBlock;
      if (!contentBlock || typeof contentBlock !== "object" || !isToolCallBlock(contentBlock)) continue;
      for (const id of getToolCallIds(contentBlock)) toolCallIds.add(id);
    }
  }
  return toolCallIds;
}

function pruneMessageArray(messages: readonly AgentMessageRecord[], toolCallIds: Set<string>): { messages: AgentMessageRecord[]; prunedCount: number } {
  let prunedCount = 0;
  const pruned = messages.flatMap((msg) => {
    if (!msg || typeof msg !== "object") return [msg];

    if (isToolResultMessage(msg)) {
      if (hasKnownToolCallId(msg, toolCallIds)) return [msg];
      prunedCount += 1;
      return [];
    }

    if (!Array.isArray(msg.content)) return [msg];

    let contentChanged = false;
    const filteredContent = msg.content.filter((block) => {
      const contentBlock = block as AgentContentBlock;
      if (!contentBlock || typeof contentBlock !== "object") return true;
      if (!isToolResultBlock(contentBlock)) return true;
      if (hasKnownToolCallId(contentBlock, toolCallIds)) return true;
      contentChanged = true;
      prunedCount += 1;
      return false;
    });

    if (!contentChanged) return [msg];
    return [{ ...msg, content: filteredContent }];
  });
  return { messages: pruned, prunedCount };
}

/**
 * Remove tool results that no longer correspond to assistant tool calls from
 * the live prompt state. Persisted JSONL remains append-only and is repaired
 * only before a SessionManager opens, never through its private indexes.
 */
export function pruneOrphanToolResults(session: AgentSession, chatJid: string): number {
  const internalSession = session as unknown as SessionWithAgentState;
  const messages = internalSession.agent?.state?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return 0;

  const result = pruneMessageArray(messages, collectToolCallIds(messages));
  if (result.prunedCount === 0) return 0;

  try {
    internalSession.agent!.state!.messages = result.messages;
    log.warn("Pruned orphan tool results from live agent state", {
      operation: "orphan_tool_results.prune",
      chatJid,
      prunedCount: result.prunedCount,
    });
    return result.prunedCount;
  } catch (error) {
    log.warn("Failed to prune orphan tool results from live agent state", {
      operation: "orphan_tool_results.prune",
      chatJid,
      prunedCount: result.prunedCount,
      err: error,
    });
    return 0;
  }
}
