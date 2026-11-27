import { useCallback, useLayoutEffect, useRef, useState } from '../vendor/preact-htm.js';
import { getTimeline, setPostPinned, type PostPinUpdate } from '../api.js';
import { dedupePosts } from './timeline-utils.js';

const PAGE_SIZE = 30;

type PinnedPage = { chatJid: string; posts: any[]; hasMore: boolean; failed?: boolean };
type LoadMoreOptions = { preserveScroll?: boolean };

/** A separate cursor and snapshot: filtered pages must never enter the live timeline cache. */
export function usePinnedTimeline(options: {
  chatJid: string;
  available: boolean;
  reloadLatest: () => Promise<void>;
  preserveTimelineScrollTop: (mutate: () => void) => void;
  applyPinToTimeline: (update: PostPinUpdate) => void;
}) {
  const { chatJid, available, reloadLatest, preserveTimelineScrollTop, applyPinToTimeline } = options;
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [page, setPage] = useState<PinnedPage | null>(null);
  const active = available && selectedChat === chatJid;
  const activeChatRef = useRef<string | null>(null);
  activeChatRef.current = active ? chatJid : null;
  const pageRef = useRef<PinnedPage | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const pendingWrites = useRef(new Map<string, { receivedEvent: boolean }>());
  const applyPinRef = useRef(applyPinToTimeline);
  applyPinRef.current = applyPinToTimeline;

  const publish = useCallback((next: PinnedPage | null) => {
    pageRef.current = next;
    setPage(next);
  }, []);

  const fetchPage = useCallback(async (targetChat: string, append = false, preserveScroll = true) => {
    if (activeChatRef.current !== targetChat) return;
    const previous = pageRef.current?.chatJid === targetChat ? pageRef.current : null;
    if (append && (requestRef.current || !previous?.hasMore || !previous.posts.length)) return;
    requestRef.current?.abort();
    const request = new AbortController();
    requestRef.current = request;
    let before = append ? previous?.posts[0]?.id : null;
    let posts = append ? previous?.posts || [] : [];
    let hasMore = false;
    // Refresh the already-loaded prefix after a pin/deletion/reconnect. This
    // keeps paging correct when an older pin appears or a cursor row vanishes.
    let remaining = append ? PAGE_SIZE : Math.max(PAGE_SIZE, previous?.posts.length || 0);
    try {
      do {
        const result = await getTimeline(Math.min(remaining, 100), before, targetChat, {
          pinnedOnly: true, signal: request.signal,
        });
        if (request.signal.aborted || activeChatRef.current !== targetChat) return;
        const rows = Array.isArray(result?.posts) ? result.posts : [];
        const nextBefore = rows[0]?.id;
        hasMore = Boolean(result?.has_more) && Number.isSafeInteger(nextBefore)
          && (!before || nextBefore < before);
        posts = dedupePosts([...rows, ...posts]);
        remaining -= rows.length;
        before = nextBefore;
      } while (hasMore && remaining > 0);
      const next = { chatJid: targetChat, posts, hasMore };
      if (previous && preserveScroll) preserveTimelineScrollTop(() => publish(next));
      else publish(next);
    } catch (error) {
      if (request.signal.aborted || activeChatRef.current !== targetChat) return;
      console.warn('Failed to load pinned messages:', error);
      if (!previous || previous.failed) publish({ chatJid: targetChat, posts: [], hasMore: false, failed: true });
    } finally {
      if (requestRef.current === request) requestRef.current = null;
    }
  }, [preserveTimelineScrollTop, publish]);

  useLayoutEffect(() => {
    if (!active) {
      if (selectedChat !== null) setSelectedChat(null);
      return;
    }
    void fetchPage(chatJid);
    return () => {
      requestRef.current?.abort();
      requestRef.current = null;
      publish(null);
    };
  }, [active, chatJid, fetchPage, publish, selectedChat]);

  const toggle = useCallback(() => {
    if (!available) return;
    if (activeChatRef.current === chatJid) {
      activeChatRef.current = null;
      requestRef.current?.abort();
      setSelectedChat(null);
      void reloadLatest().catch((error) => console.warn('Failed to reload timeline:', error));
    } else {
      activeChatRef.current = chatJid;
      setSelectedChat(chatJid);
    }
  }, [available, chatJid, reloadLatest]);

  const loadMore = useCallback((loadOptions?: LoadMoreOptions) => {
    if (activeChatRef.current) return fetchPage(activeChatRef.current, true, loadOptions?.preserveScroll !== false);
  }, [fetchPage]);

  const applyPin = useCallback((update: PostPinUpdate) => {
    applyPinRef.current(update);
    if (activeChatRef.current !== update.chat_jid) return;
    const current = pageRef.current;
    if (!update.pinned && current?.chatJid === update.chat_jid && current.posts.some((post) => post.id === update.id)) {
      preserveTimelineScrollTop(() => publish({ ...current, posts: current.posts.filter((post) => post.id !== update.id) }));
    }
    void fetchPage(update.chat_jid);
  }, [fetchPage, preserveTimelineScrollTop, publish]);

  const handleEvent = useCallback((eventType: string, data: any) => {
    if (eventType === 'post_pin_updated') {
      if (typeof data?.chat_jid !== 'string' || !Number.isSafeInteger(data.id) || typeof data.pinned !== 'boolean') return;
      const pending = pendingWrites.current.get(`${data.chat_jid}:${data.id}`);
      if (pending) pending.receivedEvent = true;
      applyPin(data);
      return;
    }
    const targetChat = activeChatRef.current;
    if (!targetChat) return;
    if (eventType === 'connected') void fetchPage(targetChat);
    if (data?.chat_jid !== targetChat) return;
    const current = pageRef.current;
    if (eventType === 'interaction_deleted' && Array.isArray(data.ids)) {
      if (current?.chatJid === targetChat) {
        const deleted = new Set(data.ids);
        const posts = current.posts.filter((post) => !deleted.has(post.id));
        if (posts.length !== current.posts.length) preserveTimelineScrollTop(() => publish({ ...current, posts }));
      }
      void fetchPage(targetChat);
    } else if (eventType === 'interaction_updated' && current?.posts.some((post) => post.id === data.id)) {
      void fetchPage(targetChat);
    }
  }, [applyPin, fetchPage, preserveTimelineScrollTop, publish]);

  const setPinned = useCallback(async (post: { id: number; chat_jid: string }, pinned: boolean) => {
    const owner = post.chat_jid;
    const key = `${owner}:${post.id}`;
    if (pendingWrites.current.has(key)) return;
    const pending = { receivedEvent: false };
    pendingWrites.current.set(key, pending);
    try {
      const update = await setPostPinned(post.id, owner, pinned);
      // The stream can already have delivered this and subsequent changes.
      if (!pending.receivedEvent) applyPin(update);
    } finally {
      pendingWrites.current.delete(key);
    }
  }, [applyPin]);

  const current = active && page?.chatJid === chatJid ? page : null;
  return { active, toggle, loadMore, handleEvent, setPinned, page: current };
}
