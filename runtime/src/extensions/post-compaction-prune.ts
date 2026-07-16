/**
 * post-compaction-prune.ts – Prune superseded active-branch entries from memory.
 *
 * Session JSONL remains authoritative on disk. In memory, only entries on the
 * newly compacted active branch may be tombstoned, and any ancestor required by
 * an alternate branch must remain intact. This preserves branch reconstruction
 * while releasing history that the new compaction entry fully supersedes.
 */
import type { ExtensionFactory } from "@earendil-works/pi-coding-agent";
import { createLogger } from "../utils/logger.js";

const log = createLogger("post-compaction-prune");

interface MinimalEntry {
  type: string;
  id: string;
  parentId?: string | null;
  [key: string]: unknown;
}

interface PrunableSessionManager {
  fileEntries: MinimalEntry[];
  byId: Map<string, MinimalEntry>;
  getBranch?: () => MinimalEntry[];
}

function collectAlternateBranchAncestorIds(
  fileEntries: MinimalEntry[],
  byId: Map<string, MinimalEntry>,
  activeBranchIds: Set<string>,
): Set<string> {
  const required = new Set<string>();
  for (const entry of fileEntries) {
    if (!entry?.id || activeBranchIds.has(entry.id)) continue;
    let current: MinimalEntry | undefined = entry;
    const visited = new Set<string>();
    while (current?.id && !visited.has(current.id)) {
      visited.add(current.id);
      required.add(current.id);
      const parentId: string | null | undefined = current.parentId;
      current = typeof parentId === "string" && parentId ? byId.get(parentId) : undefined;
    }
  }
  return required;
}

/**
 * Replace only superseded active-path entries with lightweight tombstones.
 * Returns zero when the runtime cannot expose an authoritative active branch;
 * unsafe global file-order pruning is never used as a fallback.
 */
export function pruneCompactedSessionEntries(
  sessionManager: PrunableSessionManager,
  firstKeptEntryId: string,
): number {
  const { fileEntries, byId } = sessionManager;
  if (!Array.isArray(fileEntries) || !(byId instanceof Map) || typeof sessionManager.getBranch !== "function") return 0;

  const activeBranch = sessionManager.getBranch();
  if (!Array.isArray(activeBranch) || activeBranch.length === 0) return 0;
  const firstKeptBranchIndex = activeBranch.findIndex((entry) => entry?.id === firstKeptEntryId);
  if (firstKeptBranchIndex <= 0) return 0;

  const activeBranchIds = new Set(activeBranch.map((entry) => entry?.id).filter((id): id is string => !!id));
  const requiredByAlternateBranch = collectAlternateBranchAncestorIds(fileEntries, byId, activeBranchIds);
  const pruneIds = new Set(
    activeBranch
      .slice(0, firstKeptBranchIndex)
      .filter((entry) => entry?.type !== "header" && entry?.type !== "pruned")
      .map((entry) => entry.id)
      .filter((id) => !requiredByAlternateBranch.has(id)),
  );
  if (pruneIds.size === 0) return 0;

  let prunedCount = 0;
  for (let index = 0; index < fileEntries.length; index += 1) {
    const entry = fileEntries[index];
    if (!entry?.id || !pruneIds.has(entry.id)) continue;
    const tombstone: MinimalEntry = {
      type: "pruned",
      id: entry.id,
      parentId: entry.parentId ?? null,
    };
    fileEntries[index] = tombstone;
    byId.set(entry.id, tombstone);
    prunedCount += 1;
  }
  return prunedCount;
}

export const postCompactionPrune: ExtensionFactory = (pi) => {
  pi.on("session_compact", async (event, ctx) => {
    const { compactionEntry } = event;
    if (!compactionEntry?.firstKeptEntryId) return;

    // ctx.sessionManager is readonly in the extension contract, but the runtime
    // instance owns the in-memory indexes that this memory-only optimization
    // updates. Disk JSONL is deliberately untouched.
    const sessionManager = ctx.sessionManager as unknown as PrunableSessionManager;
    const prunedCount = pruneCompactedSessionEntries(
      sessionManager,
      compactionEntry.firstKeptEntryId,
    );

    if (prunedCount > 0) {
      log.info("Pruned superseded active-branch entries from session memory", {
        operation: "post_compaction_prune",
        prunedCount,
        firstKeptEntryId: compactionEntry.firstKeptEntryId,
        totalEntries: sessionManager.fileEntries.length,
      });
    }
  });
};
