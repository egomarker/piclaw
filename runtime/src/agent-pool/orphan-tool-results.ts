/**
 * agent-pool/orphan-tool-results.ts – Omits stale tool results from canonical model context.
 *
 * When historical toolResult entries no longer have matching assistant toolCall
 * blocks, downstream provider payloads can bloat or reference invalid tool-call IDs.
 * This helper removes orphaned tool results defensively before a new prompt run
 * and before manual session compaction.
 */

import type { AgentSession, ContextEditEntry } from "@earendil-works/pi-coding-agent";
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
 * Repair finalized context at an idle boundary through its canonical owner.
 * Append-only, branch-local edits survive refresh/reload without changing raw
 * messages, UI history, or SessionManager's private indexes. Never edit during
 * a run, retry or compaction: a caller may be joining work already in progress.
 */
export function pruneOrphanToolResults(session: AgentSession, chatJid: string): number {
  const manager = session.sessionManager;
  if (session.isIdle === false || session.isStreaming || session.isCompacting || session.isRetrying) return 0;
  if (!manager || typeof manager.buildSessionProjection !== "function"
    || typeof manager.appendContextEdit !== "function" || typeof session.refreshContext !== "function") return 0;

  let prunedCount = 0;
  let appendedCount = 0;
  try {
    const projection = manager.buildSessionProjection();
    const toolCallIds = collectToolCallIds(projection.messages);
    const edits: Array<{ targetId: string; replacement: ContextEditEntry["replacement"]; count: number }> = [];
    for (const entry of projection.entries) {
      const result = pruneMessageArray(entry.messages, toolCallIds);
      if (result.prunedCount === 0) continue;
      // Editable SDK entries own exactly one message. Do not guess provenance
      // for a synthesized contribution or silently edit unrelated raw content.
      if (entry.messages.length !== 1 || result.messages.length > 1
        || (entry.sourceEntry.type !== "message" && entry.sourceEntry.type !== "custom_message")) {
        throw new Error(`Cannot map orphan tool results to editable session entry ${entry.sourceEntry.id}`);
      }
      const keptMessage = result.messages[0];
      edits.push({
        targetId: entry.sourceEntry.id,
        // The filter only removes blocks from SDK-projected content; retain all
        // other content verbatim. The public append API validates the target.
        replacement: keptMessage
          ? { content: keptMessage.content as NonNullable<ContextEditEntry["replacement"]>["content"] }
          : null,
        count: result.prunedCount,
      });
    }
    if (edits.length === 0) return 0;

    for (const edit of edits) {
      manager.appendContextEdit(edit.targetId, edit.replacement);
      appendedCount += 1;
      prunedCount += edit.count;
    }
    session.refreshContext();
    log.warn("Pruned orphan tool results from canonical model context", {
      operation: "orphan_tool_results.prune",
      chatJid,
      prunedCount,
      appendedCount,
    });
    return prunedCount;
  } catch (error) {
    // An append can fail after earlier edits succeeded. Keep those canonical
    // edits and synchronize live context; a later call retries the remainder.
    if (appendedCount > 0) {
      try {
        session.refreshContext();
      } catch (refreshError) {
        log.warn("Failed to refresh partially repaired canonical context", {
          operation: "orphan_tool_results.refresh_failed", chatJid, err: refreshError,
        });
      }
    }
    log.warn("Failed to finish canonical orphan tool-result repair", {
      operation: "orphan_tool_results.prune",
      chatJid,
      prunedCount,
      appendedCount,
      err: error,
    });
    return 0;
  }
}
