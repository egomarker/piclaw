import { useMemo, useRef } from '../vendor/preact-htm.js';
import { useTimeline } from './use-timeline.js';
import { useTimelineScrollOrchestration } from './app-timeline-scroll-orchestration.js';

type RefBox<T> = { current: T };

export function deriveVisibleTimelinePosts(options: {
  rawPosts: any[] | null;
  followupQueueItems: any[];
  filterQueuedPosts: (posts: any[] | null) => any[];
}) {
  const {
    rawPosts,
    filterQueuedPosts,
  } = options;

  return filterQueuedPosts(rawPosts);
}

export function syncScrollToBottomRef(options: {
  scrollToBottomRef: RefBox<(() => void) | null>;
  scrollToBottom: () => void;
}) {
  options.scrollToBottomRef.current = options.scrollToBottom;
}

export function resolveTimelinePostsChatJid(options: {
  ownerRef: RefBox<{ posts: any[] | null; chatJid: string } | null>;
  rawPosts: any[] | null;
  currentChatJid: string;
}): string {
  const { ownerRef, rawPosts, currentChatJid } = options;
  if (!ownerRef.current || !Object.is(ownerRef.current.posts, rawPosts)) {
    ownerRef.current = { posts: rawPosts, chatJid: currentChatJid };
  }
  return ownerRef.current.chatJid;
}

export function useMainAppTimelineComposition(options: {
  timelineRef: RefBox<any>;
  viewStateRef: RefBox<any>;
  followupQueueRowIdsRef: RefBox<Set<string | number>>;
  currentChatJid: string;
  currentHashtag: string | null;
  searchQuery: string | null;
  followupQueueItems: any[];
}) {
  const {
    timelineRef,
    viewStateRef,
    followupQueueRowIdsRef,
    currentChatJid,
    currentHashtag,
    searchQuery,
    followupQueueItems,
  } = options;

  const scrollToBottomRef = useRef<(() => void) | null>(null);
  const postsOwnerRef = useRef<{ posts: any[] | null; chatJid: string } | null>(null);
  const {
    scrollToBottom,
    preserveTimelineScroll,
    preserveTimelineScrollTop,
    filterQueuedPosts,
  } = useTimelineScrollOrchestration({
    timelineRef,
    viewStateRef,
    followupQueueRowIdsRef,
  });
  syncScrollToBottomRef({
    scrollToBottomRef,
    scrollToBottom,
  });

  const {
    posts: rawPosts,
    setPosts,
    hasMore,
    setHasMore,
    hasMoreRef,
    loadPosts,
    refreshTimeline,
    loadMore,
    loadMoreRef,
  } = useTimeline({
    preserveTimelineScroll,
    preserveTimelineScrollTop,
    chatJid: currentChatJid,
    currentHashtag,
    searchQuery,
  });

  const postsChatJid = resolveTimelinePostsChatJid({
    ownerRef: postsOwnerRef,
    rawPosts,
    currentChatJid,
  });
  const posts = useMemo(() => deriveVisibleTimelinePosts({
    rawPosts,
    followupQueueItems,
    filterQueuedPosts,
  }), [filterQueuedPosts, followupQueueItems, rawPosts]);

  return {
    scrollToBottomRef,
    scrollToBottom,
    preserveTimelineScroll,
    preserveTimelineScrollTop,
    rawPosts,
    postsChatJid,
    setPosts,
    hasMore,
    setHasMore,
    hasMoreRef,
    loadPosts,
    refreshTimeline,
    loadMore,
    loadMoreRef,
    posts,
  };
}
