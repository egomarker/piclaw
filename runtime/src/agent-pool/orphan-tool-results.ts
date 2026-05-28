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

interface SessionFileEntryRecord {
  type?: unknown;
  id?: unknown;
  parentId?: unknown;
  message?: AgentMessageRecord;
  [key: string]: unknown;
}

interface SessionWithInternalAgent {
  agent?: {
    state?: {
      messages?: AgentMessageRecord[];
    };
    replaceMessages?: (messages: AgentMessageRecord[]) => void;
  };
  sessionManager?: {
    fileEntries?: SessionFileEntryRecord[];
    byId?: Map<string, SessionFileEntryRecord>;
    _rewriteFile?: () => void;
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

function collectToolCallIds(messages: readonly AgentMessageRecord[], fileEntries: readonly SessionFileEntryRecord[]): Set<string> {
  const toolCallIds = new Set<string>();
  const scanMessage = (msg: AgentMessageRecord | undefined) => {
    if (!Array.isArray(msg?.content)) return;
    for (const block of msg.content) {
      const contentBlock = block as AgentContentBlock;
      if (!contentBlock || typeof contentBlock !== "object") continue;
      if (!isToolCallBlock(contentBlock)) continue;
      for (const id of getToolCallIds(contentBlock)) toolCallIds.add(id);
    }
  };
  for (const msg of messages) scanMessage(msg);
  for (const entry of fileEntries) {
    if (entry?.type === "message") scanMessage(entry.message);
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

function pruneSessionFileEntries(fileEntries: SessionFileEntryRecord[], byId: Map<string, SessionFileEntryRecord> | undefined, toolCallIds: Set<string>): number {
  let prunedCount = 0;
  for (let index = 0; index < fileEntries.length; index += 1) {
    const entry = fileEntries[index];
    if (!entry || entry.type !== "message") continue;
    const message = entry.message;
    if (!message || typeof message !== "object") continue;

    if (isToolResultMessage(message)) {
      if (hasKnownToolCallId(message, toolCallIds)) continue;
      const tombstone: SessionFileEntryRecord = { type: "pruned", id: entry.id, parentId: entry.parentId ?? null };
      fileEntries[index] = tombstone;
      if (typeof entry.id === "string") byId?.set(entry.id, tombstone);
      prunedCount += 1;
      continue;
    }

    if (!Array.isArray(message.content)) continue;
    let contentChanged = false;
    const filteredContent = message.content.filter((block) => {
      const contentBlock = block as AgentContentBlock;
      if (!contentBlock || typeof contentBlock !== "object") return true;
      if (!isToolResultBlock(contentBlock)) return true;
      if (hasKnownToolCallId(contentBlock, toolCallIds)) return true;
      contentChanged = true;
      prunedCount += 1;
      return false;
    });
    if (!contentChanged) continue;
    const nextEntry: SessionFileEntryRecord = { ...entry, message: { ...message, content: filteredContent } };
    fileEntries[index] = nextEntry;
    if (typeof entry.id === "string") byId?.set(entry.id, nextEntry);
  }
  return prunedCount;
}

/** Remove toolResult entries that no longer correspond to assistant tool calls. */
export function pruneOrphanToolResults(session: AgentSession, chatJid: string): number {
  const internalSession = session as unknown as SessionWithInternalAgent;
  const messages = internalSession.agent?.state?.messages;
  const fileEntries = internalSession.sessionManager?.fileEntries;
  const hasMessages = Array.isArray(messages) && messages.length > 0;
  const hasFileEntries = Array.isArray(fileEntries) && fileEntries.length > 0;
  if (!hasMessages && !hasFileEntries) return 0;

  const toolCallIds = collectToolCallIds(hasMessages ? messages : [], hasFileEntries ? fileEntries : []);
  let prunedCount = 0;
  let prunedMessages: AgentMessageRecord[] | null = null;

  if (hasMessages) {
    const result = pruneMessageArray(messages, toolCallIds);
    prunedMessages = result.messages;
    prunedCount += result.prunedCount;
  }

  if (hasFileEntries) {
    prunedCount += pruneSessionFileEntries(fileEntries, internalSession.sessionManager?.byId, toolCallIds);
  }

  if (prunedCount === 0) return 0;

  try {
    if (prunedMessages) internalSession.agent?.replaceMessages?.(prunedMessages);
    if (hasFileEntries) internalSession.sessionManager?._rewriteFile?.();
    log.warn("Pruned orphan tool results from session state", {
      operation: "orphan_tool_results.prune",
      chatJid,
      prunedCount,
      prunedAgentMessages: hasMessages ? true : undefined,
      prunedSessionFileEntries: hasFileEntries ? true : undefined,
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
