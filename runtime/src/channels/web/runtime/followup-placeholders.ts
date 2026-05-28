/**
 * channels/web/followup-placeholders.ts – queued follow-up placeholder row ids.
 */

export interface QueuedFollowupSourceMetadata {
  source?: string;
  userId?: string;
  sessionId?: string;
  clientId?: string;
}

export interface QueuedFollowupItem {
  rowId: number;
  queuedContent: string;
  threadId?: number | null;
  queuedAt: string;
  mediaIds?: number[];
  contentBlocks?: unknown[];
  linkPreviews?: unknown[];
  screenHint?: string;
  source?: string;
  queuedBy?: QueuedFollowupSourceMetadata;
  /** Number of times materializeNextDeferredFollowup has failed for this item. */
  materializeRetries?: number;
}

/** FIFO in-memory row-id queue for deferred follow-up placeholder replacement. */
export class FollowupPlaceholderStore {
  private queuedFollowupPlaceholders = new Map<string, QueuedFollowupItem[]>();

  enqueue(
    chatJid: string,
    rowId: number,
    queuedContent: string,
    threadId?: number | null,
    queuedAt?: string,
    extras?: Pick<QueuedFollowupItem, "mediaIds" | "contentBlocks" | "linkPreviews" | "screenHint" | "source" | "queuedBy">
  ): void {
    const existing = this.queuedFollowupPlaceholders.get(chatJid) ?? [];
    existing.push({
      rowId,
      queuedContent,
      threadId: threadId ?? null,
      queuedAt: queuedAt ?? new Date().toISOString(),
      mediaIds: extras?.mediaIds ? [...extras.mediaIds] : undefined,
      contentBlocks: Array.isArray(extras?.contentBlocks) ? [...extras.contentBlocks] : undefined,
      linkPreviews: Array.isArray(extras?.linkPreviews) ? [...extras.linkPreviews] : undefined,
      screenHint: typeof extras?.screenHint === "string" && extras.screenHint.trim() ? extras.screenHint.trim() : undefined,
      source: typeof extras?.source === "string" && extras.source.trim() ? extras.source.trim() : undefined,
      queuedBy: extras?.queuedBy ? { ...extras.queuedBy } : undefined,
    });
    this.queuedFollowupPlaceholders.set(chatJid, existing);
  }

  prepend(chatJid: string, item: QueuedFollowupItem): void {
    const existing = this.queuedFollowupPlaceholders.get(chatJid) ?? [];
    existing.unshift({
      rowId: item.rowId,
      queuedContent: item.queuedContent,
      threadId: item.threadId ?? null,
      queuedAt: item.queuedAt,
      mediaIds: item.mediaIds ? [...item.mediaIds] : undefined,
      contentBlocks: Array.isArray(item.contentBlocks) ? [...item.contentBlocks] : undefined,
      linkPreviews: Array.isArray(item.linkPreviews) ? [...item.linkPreviews] : undefined,
      screenHint: typeof item.screenHint === "string" && item.screenHint.trim() ? item.screenHint.trim() : undefined,
      source: typeof item.source === "string" && item.source.trim() ? item.source.trim() : undefined,
      queuedBy: item.queuedBy ? { ...item.queuedBy } : undefined,
    });
    this.queuedFollowupPlaceholders.set(chatJid, existing);
  }

  count(chatJid: string): number {
    return this.queuedFollowupPlaceholders.get(chatJid)?.length ?? 0;
  }

  consume(chatJid: string): number | null {
    return this.consumeItem(chatJid)?.rowId ?? null;
  }

  consumeItem(chatJid: string): QueuedFollowupItem | null {
    const queue = this.queuedFollowupPlaceholders.get(chatJid);
    if (!queue || queue.length === 0) return null;
    const next = queue.shift() ?? null;
    if (!queue.length) this.queuedFollowupPlaceholders.delete(chatJid);
    return next ?? null;
  }

  peek(chatJid: string): QueuedFollowupItem[] {
    return [...(this.queuedFollowupPlaceholders.get(chatJid) ?? [])];
  }

  /** Remove a specific queued item by placeholder row id. */
  remove(chatJid: string, rowId: number): QueuedFollowupItem | null {
    const queue = this.queuedFollowupPlaceholders.get(chatJid);
    if (!queue || queue.length === 0) return null;

    const index = queue.findIndex((item) => item.rowId === rowId);
    if (index < 0) return null;

    const [removed] = queue.splice(index, 1);
    if (!queue.length) this.queuedFollowupPlaceholders.delete(chatJid);
    else this.queuedFollowupPlaceholders.set(chatJid, queue);
    return removed ?? null;
  }

  /** Remove all queued items for a chat. */
  drain(chatJid: string): QueuedFollowupItem[] {
    const items = this.queuedFollowupPlaceholders.get(chatJid) ?? [];
    this.queuedFollowupPlaceholders.delete(chatJid);
    return items;
  }
}
