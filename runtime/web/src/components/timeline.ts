import { Component, flushSync, h, html, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from '../vendor/preact-htm.js';
import {
    Virtualizer,
    elementScroll,
    observeElementOffset,
    observeElementRect,
} from '@tanstack/virtual-core';
import { Post } from './post.js';
import { isAnchorScrolling } from '../ui/scroll-anchor.js';
import { getAgentAvatarUrl, getAgentName } from '../ui/agent-utils.js';

export const TIMELINE_WINDOW_SIZE = 16;
export const TIMELINE_WINDOW_THRESHOLD = 100;
export const TIMELINE_REVEAL_EVENT = 'piclaw:reveal-timeline-post';
const TIMELINE_TOUCH_OVERSCAN_VIEWPORTS = 4;
const TIMELINE_TOUCH_SCROLL_IDLE_MS = 200;
const CHAT_VIRTUAL_OVERSCAN_ROWS = 6;
const CHAT_PRELOAD_VIEWPORTS = 8;
const CHAT_HISTORY_PAGE_SIZE = 30;
const CHAT_INITIAL_END_MAX_FRAMES = 48;
const CHAT_INITIAL_END_STABLE_FRAMES = 2;
const CHAT_END_EPSILON_PX = 1;

export function isAndroidTimelinePlatform(navigatorLike = typeof navigator === 'undefined' ? null : navigator) {
    const userAgent = String(navigatorLike?.userAgent || '');
    const userAgentPlatform = String(navigatorLike?.userAgentData?.platform || '');
    return /\bAndroid\b/i.test(userAgent) || /^Android$/i.test(userAgentPlatform);
}

export function isTimelineSessionReady(chatJid, postsChatJid) {
    const requestedChatJid = String(chatJid || '').trim();
    const ownerChatJid = String(postsChatJid || '').trim();
    return !requestedChatJid || !ownerChatJid || requestedChatJid === ownerChatJid;
}

export function getTimelineDistanceFromEnd(root) {
    if (!root) return Infinity;
    return Math.max(0, root.scrollHeight - root.clientHeight - root.scrollTop);
}

export function haveSameTimelineProps(currentProps, nextProps) {
    if (currentProps === nextProps) return true;
    const currentKeys = Object.keys(currentProps || {});
    const nextKeys = Object.keys(nextProps || {});
    if (currentKeys.length !== nextKeys.length) return false;
    return currentKeys.every((key) => Object.is(currentProps[key], nextProps[key]));
}

export function getLatestTimelineWindow(postCount, windowSize = TIMELINE_WINDOW_SIZE) {
    const end = Math.max(0, postCount);
    return { start: Math.max(0, end - windowSize), end };
}

export function getTimelineWindowAroundIndex(index, postCount, windowSize = TIMELINE_WINDOW_SIZE) {
    const boundedIndex = Math.max(0, Math.min(index, Math.max(0, postCount - 1)));
    const start = Math.max(0, Math.min(boundedIndex - Math.floor(windowSize / 2), postCount - windowSize));
    return { start, end: Math.min(postCount, start + windowSize) };
}

export function estimateTimelinePostHeight(post) {
    const content = typeof post?.data?.content === 'string' ? post.data.content.length : 0;
    const mediaCount = Array.isArray(post?.data?.media_ids) ? post.data.media_ids.length : 0;
    const blockCount = Array.isArray(post?.data?.content_blocks) ? post.data.content_blocks.length : 0;
    return Math.max(72, Math.min(1200, 76 + content * 0.22 + mediaCount * 220 + blockCount * 120));
}

export function findTimelineIndexAtOffset(prefixHeights, offset) {
    if (prefixHeights.length <= 1) return 0;
    let low = 0;
    let high = prefixHeights.length - 1;
    const target = Math.max(0, offset);
    while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        if (prefixHeights[middle] <= target) low = middle;
        else high = middle - 1;
    }
    return Math.min(prefixHeights.length - 2, low);
}

/** Distance from the visual history edge (the oldest rendered content). */
export function getTimelineContentOffset(root, reverse) {
    if (!root) return 0;
    const { scrollTop = 0, scrollHeight = 0, clientHeight = 0 } = root;
    return reverse
        ? Math.max(0, scrollHeight - clientHeight + scrollTop)
        : Math.max(0, scrollTop);
}

/** Hidden/inactive timeline surfaces must not drive pagination or geometry. */
export function hasUsableTimelineViewport(root, active = true) {
    if (!active || !root || root.isConnected === false) return false;
    if (!Number.isFinite(root.clientHeight) || root.clientHeight <= 0) return false;
    if (Number.isFinite(root.clientWidth) && root.clientWidth <= 0) return false;
    const rect = root.getBoundingClientRect?.();
    if (rect && (!Number.isFinite(rect.height) || rect.height <= 0
        || !Number.isFinite(rect.width) || rect.width <= 0)) return false;
    return true;
}

/** Scroll correction that returns an element to its captured viewport offset. */
export function getAnchoredTimelineScrollTop(scrollTop, currentOffset, capturedOffset) {
    if (![scrollTop, currentOffset, capturedOffset].every(Number.isFinite)) return scrollTop;
    return scrollTop + currentOffset - capturedOffset;
}

/**
 * Resolve a virtualization window from a scroll offset and a matching prefix-height
 * model. Callers must ensure both values describe the same geometry; estimated
 * prefix heights cannot safely be mixed with a fully rendered scrollHeight.
 */
export function windowFromScrollOffset(root, prefixHeights, postCount, reverse) {
    if (!root || !Array.isArray(prefixHeights) || prefixHeights.length <= 1 || postCount <= 0) {
        return null;
    }
    const targetIndex = findTimelineIndexAtOffset(prefixHeights, getTimelineContentOffset(root, reverse));
    return getTimelineWindowAroundIndex(targetIndex, postCount);
}

/**
 * Resolve a variable-size window that covers the viewport plus one pixel-based
 * overscan region on each side. A minimum row count keeps small viewports from
 * churning while short posts naturally expand the range beyond sixteen rows.
 */
export function getTimelineWindowForViewport(prefixHeights, viewportStart, viewportHeight, postCount, overscanPx = viewportHeight) {
    if (!Array.isArray(prefixHeights) || prefixHeights.length <= 1 || postCount <= 0) {
        return { start: 0, end: Math.max(0, postCount) };
    }

    const prefixEnd = Math.min(postCount, prefixHeights.length - 1);
    const totalHeight = Math.max(0, Number(prefixHeights[prefixEnd]) || 0);
    const height = Math.max(1, Number(viewportHeight) || 0);
    const overscan = Math.max(300, Number(overscanPx) || height);
    const boundedStart = Math.max(0, Math.min(Number(viewportStart) || 0, totalHeight));
    const startOffset = Math.max(0, boundedStart - overscan);
    const endOffset = Math.min(totalHeight, boundedStart + height + overscan);

    let start = findTimelineIndexAtOffset(prefixHeights, startOffset);
    let end = Math.min(postCount, findTimelineIndexAtOffset(prefixHeights, endOffset) + 1);
    const minimumRows = Math.min(postCount, TIMELINE_WINDOW_SIZE);
    if (end - start < minimumRows) {
        const missingRows = minimumRows - (end - start);
        start = Math.max(0, start - Math.ceil(missingRows / 2));
        end = Math.min(postCount, start + minimumRows);
        start = Math.max(0, end - minimumRows);
    }
    return { start, end };
}

function getTimelineViewportWindow(root, prefixHeights, postCount, reverse) {
    if (!root) return null;
    return getTimelineWindowForViewport(
        prefixHeights,
        getTimelineContentOffset(root, reverse),
        root.clientHeight,
        postCount,
    );
}

function getTimelineAnchorWindow(root, prefixHeights, postCount, anchorIndex, anchor) {
    if (!root || !anchor || anchorIndex < 0) return null;
    const anchorTop = Number(prefixHeights[anchorIndex]) || 0;
    return getTimelineWindowForViewport(
        prefixHeights,
        anchorTop - anchor.offset,
        root.clientHeight,
        postCount,
    );
}

/**
 * Keep high-frequency agent-status/draft updates from walking every rendered post.
 * TimelineView still updates normally when timeline data or one of its callbacks changes.
 */
export class Timeline extends Component {
    shouldComponentUpdate(nextProps) {
        return !haveSameTimelineProps(this.props, nextProps);
    }

    render(props) {
        if (props.reverse !== false && isAndroidTimelinePlatform()) {
            return h(EndAnchoredTimelineView, props);
        }
        return h(TimelineView, props);
    }
}

/** Keep timeline updates from re-running unchanged mounted post component trees. */
class TimelinePost extends Component {
    shouldComponentUpdate(nextProps) {
        return !haveSameTimelineProps(this.props, nextProps);
    }

    render({ onPostClick, post, ...postProps }) {
        const onClick = onPostClick ? () => onPostClick(post) : undefined;
        return h(Post, { ...postProps, post, onClick });
    }
}

function resolveThreadInfo(displayPosts) {
    const resolveThreadRootId = (post) => {
        const raw = post?.data?.thread_id;
        if (raw === null || raw === undefined || raw === '') return null;
        const threadId = Number(raw);
        return Number.isFinite(threadId) ? threadId : null;
    };

    const threadGroups = new Map();
    for (let index = 0; index < displayPosts.length; index += 1) {
        const post = displayPosts[index];
        const postId = Number(post?.id);
        const threadRootId = resolveThreadRootId(post);
        if (threadRootId !== null) {
            const group = threadGroups.get(threadRootId) || { anchorIndex: -1, replyIndexes: [] };
            group.replyIndexes.push(index);
            threadGroups.set(threadRootId, group);
        } else if (Number.isFinite(postId)) {
            const group = threadGroups.get(postId) || { anchorIndex: -1, replyIndexes: [] };
            group.anchorIndex = index;
            threadGroups.set(postId, group);
        }
    }

    const threadSequences = new Map();
    for (const [threadId, group] of threadGroups.entries()) {
        const ordered = new Set();
        if (group.anchorIndex >= 0) ordered.add(group.anchorIndex);
        for (const index of group.replyIndexes) ordered.add(index);
        threadSequences.set(threadId, Array.from(ordered).sort((a, b) => a - b));
    }

    return displayPosts.map((post, index) => {
        const threadRootId = resolveThreadRootId(post);
        if (threadRootId === null) return { hasThreadPrev: false, hasThreadNext: false };
        const sequence = threadSequences.get(threadRootId);
        const position = sequence?.indexOf(index) ?? -1;
        return {
            hasThreadPrev: position > 0,
            hasThreadNext: position >= 0 && position < sequence.length - 1,
        };
    });
}

function buildTimelinePrefixHeights(displayPosts, measuredHeights) {
    const prefix = [0];
    for (const post of displayPosts) {
        const measured = measuredHeights.get(String(post.id));
        prefix.push(prefix[prefix.length - 1] + (measured ?? estimateTimelinePostHeight(post)));
    }
    return prefix;
}

function getTimelinePostId(element) {
    return element?.id?.startsWith('post-') ? element.id.slice(5) : '';
}

function getTimelineViewportPostElements(content) {
    return content?.querySelectorAll?.(
        ':scope > .post, :scope > .end-anchored-row > .post',
    ) || [];
}

function findTimelinePostElement(content, postId) {
    const expectedId = `post-${postId}`;
    for (const element of getTimelineViewportPostElements(content)) {
        if (element.id === expectedId) return element;
    }
    return null;
}

function measureTimelinePostHeights(content, measuredHeights, reset = false) {
    if (!content) return false;
    if (reset) measuredHeights.clear();
    let changed = false;
    for (const element of content.querySelectorAll(':scope > .post')) {
        const id = getTimelinePostId(element);
        if (!id) continue;
        const height = element.getBoundingClientRect().height;
        const previous = measuredHeights.get(id);
        if (Number.isFinite(height) && height > 0 && Math.abs((previous ?? 0) - height) > 0.5) {
            measuredHeights.set(id, height);
            changed = true;
        }
    }
    return changed;
}

function queueTimelinePostHeights(content, pendingHeights) {
    if (!content) return;
    for (const element of content.querySelectorAll(':scope > .post')) {
        const id = getTimelinePostId(element);
        if (!id) continue;
        const height = element.getBoundingClientRect().height;
        if (Number.isFinite(height) && height > 0) pendingHeights.set(id, height);
    }
}

export function captureTimelineViewportAnchor(root, content) {
    if (!root || !content) return null;
    const rootRect = root.getBoundingClientRect();
    for (const element of getTimelineViewportPostElements(content)) {
        const rect = element.getBoundingClientRect();
        if (rect.bottom <= rootRect.top || rect.top >= rootRect.bottom) continue;
        const id = getTimelinePostId(element);
        if (id) return { id, offset: rect.top - rootRect.top };
    }
    return null;
}

function restoreTimelineViewportAnchor(root, content, anchor) {
    if (!root || !content || !anchor) return false;
    const element = findTimelinePostElement(content, anchor.id);
    if (!element) return false;
    const currentOffset = element.getBoundingClientRect().top - root.getBoundingClientRect().top;
    const target = getAnchoredTimelineScrollTop(root.scrollTop, currentOffset, anchor.offset);
    if (Math.abs(target - root.scrollTop) > 0.25) root.scrollTop = target;
    return true;
}

function haveSameTimelineWindow(current, next) {
    return current.start === next.start && current.end === next.end;
}

/** Minimal Preact adapter for the framework-neutral TanStack virtualizer core. */
function usePreactVirtualizer(options) {
    const [, setRevision] = useState(0);
    const consumerOnChangeRef = useRef(options.onChange);
    consumerOnChangeRef.current = options.onChange;
    const onChange = useCallback((instance, sync) => {
        const rerender = () => setRevision((value) => value + 1);
        if (sync) flushSync(rerender);
        else rerender();
        consumerOnChangeRef.current?.(instance, sync);
    }, []);
    const resolvedOptions = { ...options, onChange };
    const [instance] = useState(() => new Virtualizer(resolvedOptions));

    // TanStack captures the visible keyed item here before a prepend changes
    // indexes, then resolves the same key in the new measurement model.
    instance.setOptions(resolvedOptions);
    useLayoutEffect(() => instance._didMount(), [instance]);
    useLayoutEffect(() => instance._willUpdate());
    return instance;
}

/**
 * Android-only main chat virtualizer. It deliberately uses normal positive scroll
 * coordinates and disables native CSS anchoring; TanStack owns keyed prepend
 * anchoring, dynamic-size corrections, and end following on this path.
 */
function EndAnchoredTimelineView({ posts, chatJid, postsChatJid, hasMore, onLoadMore, onPostClick, onHashtagClick, onMessageRef, onScrollToMessage, onFileRef, onOpenWidget, onOpenAttachmentPreview, emptyMessage, timelineRef, agents, user, onDeletePost, removingPostIds, searchQuery, active = true }) {
    const [loadingMore, setLoadingMore] = useState(false);
    const loadingMoreRef = useRef(false);
    const initialScrollPendingRef = useRef(true);
    const initialEndFrameRef = useRef(0);
    // A real Android session switch promises the newest message. Keep that
    // intent across async cache refreshes, history prepends, and measurements;
    // only an actual user scroll gesture is allowed to release it.
    const bottomIntentRef = useRef(true);
    const bottomIntentFrameRef = useRef(0);
    const timelineContentRef = useRef(null);
    const pinnedToEndRef = useRef(true);
    const activeRef = useRef(active);
    const previousActiveRef = useRef(active);
    const suspendedScrollTopRef = useRef(null);
    const suspendedAnchorRef = useRef(null);
    const suspendedCanvasSizeRef = useRef(1);
    const resumeFramesRef = useRef({ first: 0, second: 0, third: 0 });
    const restoringActiveRef = useRef(false);
    const previousViewportHeightRef = useRef(null);
    activeRef.current = active;
    const releaseBottomIntent = useCallback(() => {
        bottomIntentRef.current = false;
        initialScrollPendingRef.current = false;
        cancelAnimationFrame(initialEndFrameRef.current);
        initialEndFrameRef.current = 0;
        cancelAnimationFrame(bottomIntentFrameRef.current);
        bottomIntentFrameRef.current = 0;
        restoringActiveRef.current = false;
    }, []);
    const maintainBottomIntent = useCallback((instance) => {
        if (!activeRef.current || !bottomIntentRef.current || bottomIntentFrameRef.current) return;
        bottomIntentFrameRef.current = requestAnimationFrame(() => {
            bottomIntentFrameRef.current = 0;
            const root = timelineRef?.current;
            if (!activeRef.current || !bottomIntentRef.current
                || !hasUsableTimelineViewport(root, true)) return;
            if (getTimelineDistanceFromEnd(root) > CHAT_END_EPSILON_PX) {
                instance.scrollToEnd({ behavior: 'auto' });
            }
        });
    }, [timelineRef]);
    const observeTimelineRect = useCallback((instance, callback) => observeElementRect(instance, (rect) => {
        if (!activeRef.current) return;
        const previousHeight = previousViewportHeightRef.current;
        previousViewportHeightRef.current = rect.height;
        const viewportHeightChanged = previousHeight !== null
            && Math.abs(rect.height - previousHeight) > 0.5;
        const shouldRestoreEnd = viewportHeightChanged && pinnedToEndRef.current;
        callback(rect);

        // Status panels live below the timeline in the same flex column. When
        // one appears or expands, the timeline viewport shrinks without a user
        // scroll. Preserve bottom pinning only if it was pinned before resize.
        if (shouldRestoreEnd) instance.scrollToEnd({ behavior: 'auto' });
    }), []);
    const observeTimelineOffset = useCallback((instance, callback) => observeElementOffset(instance, (offset, isScrolling) => {
        if (activeRef.current) callback(offset, isScrolling);
    }), []);
    const sessionReady = isTimelineSessionReady(chatJid, postsChatJid);
    const displayPosts = useMemo(
        () => sessionReady && Array.isArray(posts) ? posts.slice().sort((a, b) => a.id - b.id) : [],
        [posts, sessionReady],
    );
    const activePostsRef = useRef(displayPosts);
    if (active && sessionReady) activePostsRef.current = displayPosts;
    const virtualPosts = active && sessionReady ? displayPosts : activePostsRef.current;
    const threadInfoByIndex = useMemo(() => resolveThreadInfo(virtualPosts), [virtualPosts]);
    const getItemKey = useCallback(
        (index) => virtualPosts[index]?.id ?? `missing-${index}`,
        [virtualPosts],
    );
    const estimateSize = useCallback(
        (index) => estimateTimelinePostHeight(virtualPosts[index]),
        [virtualPosts],
    );
    const virtualizer = usePreactVirtualizer({
        count: virtualPosts.length,
        getScrollElement: () => active ? timelineRef?.current || null : null,
        estimateSize,
        getItemKey,
        observeElementRect: observeTimelineRect,
        observeElementOffset: observeTimelineOffset,
        scrollToFn: elementScroll,
        overscan: CHAT_VIRTUAL_OVERSCAN_ROWS,
        anchorTo: 'end',
        followOnAppend: true,
        scrollEndThreshold: 80,
        enabled: Boolean(posts) && sessionReady,
        onChange: maintainBottomIntent,
    });

    if (!sessionReady || !posts || displayPosts.length === 0) {
        initialScrollPendingRef.current = true;
        pinnedToEndRef.current = true;
    }

    const triggerLoadMore = useCallback(async () => {
        const root = timelineRef?.current;
        if (!onLoadMore || !hasMore || loadingMoreRef.current
            || !hasUsableTimelineViewport(root, active)) return;
        loadingMoreRef.current = true;
        setLoadingMore(true);
        try {
            await onLoadMore({
                preserveScroll: false,
                preserveMode: 'top',
                pageSize: CHAT_HISTORY_PAGE_SIZE,
            });
        } finally {
            loadingMoreRef.current = false;
            setLoadingMore(false);
        }
    }, [active, hasMore, onLoadMore, timelineRef]);

    const maybePreload = useCallback((root) => {
        if (!hasUsableTimelineViewport(root, active) || !hasMore || loadingMoreRef.current) return;
        const preloadDistance = root.clientHeight * CHAT_PRELOAD_VIEWPORTS;
        if (root.scrollHeight <= root.clientHeight + 1 || root.scrollTop < preloadDistance) {
            void triggerLoadMore();
        }
    }, [active, hasMore, triggerLoadMore]);

    const handleScroll = useCallback((event) => {
        const root = event.currentTarget;
        if (!hasUsableTimelineViewport(root, active)) return;
        if (bottomIntentRef.current) {
            pinnedToEndRef.current = true;
            maintainBottomIntent(virtualizer);
        } else if (!restoringActiveRef.current && !isAnchorScrolling(root)) {
            const pinnedToEnd = getTimelineDistanceFromEnd(root) <= 2;
            pinnedToEndRef.current = pinnedToEnd;
            suspendedScrollTopRef.current = root.scrollTop;
            suspendedAnchorRef.current = pinnedToEnd
                ? null
                : captureTimelineViewportAnchor(root, timelineContentRef.current);
        }
        maybePreload(root);
    }, [active, maintainBottomIntent, maybePreload, virtualizer]);

    const handleTouchStart = useCallback((event) => {
        event.currentTarget.dataset.timelineTouchScrolling = 'true';
    }, []);

    const handleTouchMove = useCallback(() => {
        releaseBottomIntent();
    }, [releaseBottomIntent]);

    const handleWheel = useCallback(() => {
        releaseBottomIntent();
    }, [releaseBottomIntent]);

    const handleTouchEnd = useCallback((event) => {
        delete event.currentTarget.dataset.timelineTouchScrolling;
    }, []);

    useLayoutEffect(() => {
        cancelAnimationFrame(initialEndFrameRef.current);
        initialEndFrameRef.current = 0;
        if (!active || !sessionReady
            || (!initialScrollPendingRef.current && !bottomIntentRef.current)
            || displayPosts.length === 0 || !timelineRef?.current) return;

        let attempts = 0;
        let stableFrames = 0;
        let previousTotalSize = null;
        restoringActiveRef.current = true;
        pinnedToEndRef.current = true;

        const settleAtEnd = () => {
            const root = timelineRef?.current;
            if (!activeRef.current || !hasUsableTimelineViewport(root, true)) {
                restoringActiveRef.current = false;
                return;
            }

            attempts += 1;
            virtualizer.scrollToEnd({ behavior: 'auto' });
            const totalSize = virtualizer.getTotalSize();
            const totalSizeStable = Number.isFinite(previousTotalSize)
                && Math.abs(totalSize - previousTotalSize) <= 0.5;
            const reachedEnd = getTimelineDistanceFromEnd(root) <= CHAT_END_EPSILON_PX;
            stableFrames = reachedEnd && totalSizeStable ? stableFrames + 1 : 0;
            previousTotalSize = totalSize;

            if (stableFrames >= CHAT_INITIAL_END_STABLE_FRAMES
                || attempts >= CHAT_INITIAL_END_MAX_FRAMES) {
                initialEndFrameRef.current = 0;
                initialScrollPendingRef.current = false;
                pinnedToEndRef.current = true;
                restoringActiveRef.current = false;
                return;
            }
            initialEndFrameRef.current = requestAnimationFrame(settleAtEnd);
        };

        settleAtEnd();
        return () => {
            cancelAnimationFrame(initialEndFrameRef.current);
            initialEndFrameRef.current = 0;
            restoringActiveRef.current = false;
        };
    }, [active, displayPosts.length, posts, sessionReady, timelineRef, virtualizer]);

    useLayoutEffect(() => {
        const wasActive = previousActiveRef.current;
        previousActiveRef.current = active;

        if (wasActive && !active) {
            cancelAnimationFrame(resumeFramesRef.current.first);
            cancelAnimationFrame(resumeFramesRef.current.second);
            cancelAnimationFrame(resumeFramesRef.current.third);
            restoringActiveRef.current = false;
            previousViewportHeightRef.current = null;
            return;
        }
        if (!active || wasActive) return;

        const anchor = suspendedAnchorRef.current;
        const anchorIndex = anchor
            ? displayPosts.findIndex((post) => String(post.id) === anchor.id)
            : -1;
        restoringActiveRef.current = true;
        resumeFramesRef.current.first = requestAnimationFrame(() => {
            const resumedRoot = timelineRef?.current;
            if (!hasUsableTimelineViewport(resumedRoot, true)) {
                restoringActiveRef.current = false;
                return;
            }
            if (pinnedToEndRef.current) {
                virtualizer.scrollToEnd({ behavior: 'auto' });
                restoringActiveRef.current = false;
                return;
            }
            if (anchorIndex >= 0) {
                virtualizer.scrollToIndex(anchorIndex, { align: 'start', behavior: 'auto' });
            } else if (Number.isFinite(suspendedScrollTopRef.current)) {
                virtualizer.scrollToOffset(suspendedScrollTopRef.current, { behavior: 'auto' });
            }

            const restore = () => {
                if (!anchor || anchorIndex < 0) return;
                const root = timelineRef?.current;
                if (restoreTimelineViewportAnchor(root, timelineContentRef.current, anchor)) {
                    virtualizer.scrollToOffset(root.scrollTop, { behavior: 'auto' });
                }
            };
            resumeFramesRef.current.second = requestAnimationFrame(() => {
                restore();
                resumeFramesRef.current.third = requestAnimationFrame(() => {
                    restore();
                    restoringActiveRef.current = false;
                });
            });
        });
        return () => {
            cancelAnimationFrame(resumeFramesRef.current.first);
            cancelAnimationFrame(resumeFramesRef.current.second);
            cancelAnimationFrame(resumeFramesRef.current.third);
            restoringActiveRef.current = false;
        };
    }, [active, timelineRef, virtualizer]);

    useEffect(() => {
        const root = timelineRef?.current;
        if (!root) return;
        const frame = requestAnimationFrame(() => maybePreload(root));
        return () => cancelAnimationFrame(frame);
    }, [displayPosts.length, hasMore, loadingMore, maybePreload, timelineRef]);

    useEffect(() => {
        const reveal = (event) => {
            const targetId = String(event?.detail?.id ?? '');
            if (!active || !targetId) return;
            const index = displayPosts.findIndex((post) => String(post.id) === targetId);
            if (index >= 0) {
                releaseBottomIntent();
                virtualizer.scrollToIndex(index, { align: 'center' });
            }
        };
        window.addEventListener(TIMELINE_REVEAL_EVENT, reveal);
        return () => window.removeEventListener(TIMELINE_REVEAL_EVENT, reveal);
    }, [active, displayPosts, releaseBottomIntent, virtualizer]);

    useEffect(() => () => {
        cancelAnimationFrame(initialEndFrameRef.current);
        initialEndFrameRef.current = 0;
        cancelAnimationFrame(bottomIntentFrameRef.current);
        bottomIntentFrameRef.current = 0;
        const root = timelineRef?.current;
        if (root?.dataset) delete root.dataset.timelineTouchScrolling;
    }, [timelineRef]);

    if (!sessionReady || !posts) {
        return html`<div class="loading"><div class="spinner"></div></div>`;
    }

    if (displayPosts.length === 0) {
        return html`
            <div
                class="timeline normal end-anchored-timeline"
                data-timeline-scroll-model="end-anchored"
                ref=${timelineRef}
            >
                <div class="timeline-content">
                    <div style="padding: var(--spacing-xl); text-align: center; color: var(--text-secondary)">
                        ${emptyMessage || 'No messages yet. Start a conversation!'}
                    </div>
                </div>
            </div>
        `;
    }

    const virtualItems = active ? virtualizer.getVirtualItems() : [];
    const currentCanvasSize = Math.max(1, virtualizer.getTotalSize());
    if (active) suspendedCanvasSizeRef.current = currentCanvasSize;
    const canvasSize = active ? currentCanvasSize : suspendedCanvasSizeRef.current;
    return html`
        <div
            class="timeline normal end-anchored-timeline"
            data-timeline-scroll-model="end-anchored"
            ref=${timelineRef}
            onScroll=${handleScroll}
            onTouchStart=${handleTouchStart}
            onTouchMove=${handleTouchMove}
            onTouchEnd=${handleTouchEnd}
            onTouchCancel=${handleTouchEnd}
            onWheel=${handleWheel}
        >
            <div
                class="timeline-content end-anchored-canvas"
                ref=${timelineContentRef}
                style=${{ height: `${canvasSize}px` }}
            >
                ${virtualItems.map((virtualItem) => {
                    const index = virtualItem.index;
                    const post = virtualPosts[index];
                    if (!post) return null;
                    const isThreadReply = Boolean(post.data?.thread_id && post.data.thread_id !== post.id);
                    const isRemoving = removingPostIds?.has?.(post.id);
                    const threadInfo = threadInfoByIndex[index] || {};
                    return html`
                        <div
                            key=${virtualItem.key}
                            class="end-anchored-row"
                            data-index=${index}
                            ref=${virtualizer.measureElement}
                            style=${{ transform: `translateY(${virtualItem.start}px)` }}
                        >
                            <${TimelinePost}
                                post=${post}
                                isThreadReply=${isThreadReply}
                                isThreadPrev=${threadInfo.hasThreadPrev}
                                isThreadNext=${threadInfo.hasThreadNext}
                                isRemoving=${isRemoving}
                                highlightQuery=${searchQuery}
                                agentName=${getAgentName(post.data?.agent_id, agents || {})}
                                agentAvatarUrl=${getAgentAvatarUrl(post.data?.agent_id, agents || {})}
                                userName=${user?.name || user?.user_name}
                                userAvatarUrl=${user?.avatar_url || user?.avatarUrl || user?.avatar}
                                userAvatarBackground=${user?.avatar_background || user?.avatarBackground}
                                onPostClick=${onPostClick}
                                onHashtagClick=${onHashtagClick}
                                onMessageRef=${onMessageRef}
                                onScrollToMessage=${onScrollToMessage}
                                onFileRef=${onFileRef}
                                onOpenWidget=${onOpenWidget}
                                onDelete=${onDeletePost}
                                onOpenAttachmentPreview=${onOpenAttachmentPreview}
                            />
                        </div>
                    `;
                })}
            </div>
        </div>
    `;
}

/** Timeline component. */
function TimelineView({ posts, hasMore, onLoadMore, onPostClick, onHashtagClick, onMessageRef, onScrollToMessage, onFileRef, onOpenWidget, onOpenAttachmentPreview, emptyMessage, timelineRef, agents, user, onDeletePost, reverse = true, removingPostIds, searchQuery, active = true }) {
    const [loadingMore, setLoadingMore] = useState(false);
    const [windowRange, setWindowRange] = useState({ start: 0, end: 0 });
    const [windowingActive, setWindowingActive] = useState(false);
    const [heightRevision, setHeightRevision] = useState(0);
    const [touchScrollRevision, setTouchScrollRevision] = useState(0);
    const sentinelRef = useRef(null);
    const timelineContentRef = useRef(null);
    const previousPostsRef = useRef([]);
    const measuredHeightsRef = useRef(new Map());
    const loadAnchorRef = useRef(null);
    const pendingAnchorRef = useRef(null);
    const pinnedToEndRef = useRef(true);
    const previousActiveRef = useRef(active);
    const suspendedScrollTopRef = useRef(null);
    const suspendedAnchorRef = useRef(null);
    const restoringAnchorRef = useRef(false);
    const restoringActiveRef = useRef(false);
    const restoreFramesRef = useRef({ first: 0, second: 0 });
    const resumeFramesRef = useRef({ first: 0, second: 0, third: 0 });
    const scrollWindowFrameRef = useRef(0);
    const updateWindowForScrollRef = useRef(null);
    const measuredWidthRef = useRef(0);
    const touchScrollActiveRef = useRef(false);
    const touchContactRef = useRef(false);
    const touchScrollerRef = useRef(null);
    const touchScrollIdleTimerRef = useRef(0);
    const finishTouchScrollRef = useRef(null);
    const deferredHeightsRef = useRef(new Map());
    const deferredWidthResetRef = useRef(false);
    const deferredMeasuredWidthRef = useRef(0);
    const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';
    const displayPosts = useMemo(
        () => Array.isArray(posts) ? posts.slice().sort((a, b) => a.id - b.id) : [],
        [posts],
    );
    const canWindow = reverse && hasIntersectionObserver && displayPosts.length > TIMELINE_WINDOW_THRESHOLD;
    const previousPostCount = previousPostsRef.current.length;
    const shouldBootstrapWindow = canWindow && !windowingActive
        && (previousPostCount === 0
            || Math.abs(displayPosts.length - previousPostCount) > TIMELINE_WINDOW_SIZE);
    const shouldDeferWindowing = canWindow && !windowingActive && touchScrollActiveRef.current;
    // An incremental threshold crossing is deliberately two-phase: measure the
    // complete list already in the DOM, then replace omitted rows with exact
    // spacers. A large cached/initial timeline starts bounded immediately.
    const shouldWindow = canWindow && !shouldDeferWindowing
        && (windowingActive || shouldBootstrapWindow);
    const threadInfoByIndex = useMemo(() => resolveThreadInfo(displayPosts), [displayPosts]);
    const virtualHeights = useMemo(
        () => buildTimelinePrefixHeights(displayPosts, measuredHeightsRef.current),
        [displayPosts, heightRevision],
    );
    const requestedRange = shouldBootstrapWindow
        ? getLatestTimelineWindow(displayPosts.length)
        : windowRange;
    const effectiveRange = shouldWindow
        ? {
            start: Math.max(0, Math.min(requestedRange.start, displayPosts.length)),
            end: Math.max(requestedRange.start, Math.min(requestedRange.end, displayPosts.length)),
        }
        : { start: 0, end: displayPosts.length };

    const triggerLoadMore = useCallback(async () => {
        const root = timelineRef?.current;
        if (!onLoadMore || !hasMore || loadingMore
            || !hasUsableTimelineViewport(root, active)) return;
        const touchScrolling = touchScrollActiveRef.current;
        const anchor = touchScrolling
            ? null
            : captureTimelineViewportAnchor(timelineRef?.current, timelineContentRef.current);
        loadAnchorRef.current = anchor;
        setLoadingMore(true);
        try {
            await onLoadMore({ preserveScroll: !touchScrolling, preserveMode: 'top' });
        } finally {
            setLoadingMore(false);
        }
    }, [active, hasMore, loadingMore, onLoadMore, timelineRef]);

    const updateWindowForScroll = useCallback((root) => {
        if (!root || restoringAnchorRef.current || isAnchorScrolling(root) || !shouldWindow) return;
        const { clientHeight } = root;
        const contentOffset = getTimelineContentOffset(root, reverse);
        const viewportEnd = contentOffset + clientHeight;
        const rangeStartOffset = virtualHeights[effectiveRange.start] ?? 0;
        const rangeEndOffset = virtualHeights[effectiveRange.end] ?? rangeStartOffset;
        const edgeBuffer = Math.max(150, clientHeight * 0.5);
        const touchScrolling = touchScrollActiveRef.current;
        const desiredWindow = getTimelineWindowForViewport(
            virtualHeights,
            contentOffset,
            clientHeight,
            displayPosts.length,
            touchScrolling ? clientHeight * TIMELINE_TOUCH_OVERSCAN_VIEWPORTS : clientHeight,
        );
        const extraRows = Math.max(0, desiredWindow.start - effectiveRange.start)
            + Math.max(0, effectiveRange.end - desiredWindow.end);
        const canCompact = !touchScrolling
            && desiredWindow.start >= effectiveRange.start
            && desiredWindow.end <= effectiveRange.end
            && extraRows >= TIMELINE_WINDOW_SIZE;

        const mountedPosts = Array.from(timelineContentRef.current?.querySelectorAll?.(':scope > .post') || []);
        const rootRect = root.getBoundingClientRect();
        const firstRect = mountedPosts[0]?.getBoundingClientRect();
        const lastRect = mountedPosts[mountedPosts.length - 1]?.getBoundingClientRect();
        const earlierSpacerVisible = effectiveRange.start > 0
            && Boolean(firstRect && firstRect.top > rootRect.top + 1);
        const laterSpacerVisible = effectiveRange.end < displayPosts.length
            && Boolean(lastRect && lastRect.bottom < rootRect.bottom - 1);
        const needsEarlierRows = effectiveRange.start > 0
            && (contentOffset < rangeStartOffset + edgeBuffer || earlierSpacerVisible);
        const needsLaterRows = effectiveRange.end < displayPosts.length
            && (viewportEnd > rangeEndOffset - edgeBuffer || laterSpacerVisible);
        if (!needsEarlierRows && !needsLaterRows && !canCompact) return;

        let nextWindow = touchScrolling
            ? {
                start: Math.min(effectiveRange.start, desiredWindow.start),
                end: Math.max(effectiveRange.end, desiredWindow.end),
            }
            : desiredWindow;
        if (haveSameTimelineWindow(windowRange, nextWindow)
            && (earlierSpacerVisible || laterSpacerVisible)) {
            nextWindow = {
                start: earlierSpacerVisible
                    ? Math.max(0, effectiveRange.start - TIMELINE_WINDOW_SIZE)
                    : effectiveRange.start,
                end: laterSpacerVisible
                    ? Math.min(displayPosts.length, effectiveRange.end + TIMELINE_WINDOW_SIZE)
                    : effectiveRange.end,
            };
        }
        if (haveSameTimelineWindow(windowRange, nextWindow)) return;

        if (touchScrolling) {
            pendingAnchorRef.current = null;
        } else {
            const anchor = captureTimelineViewportAnchor(root, timelineContentRef.current);
            const anchorIndex = anchor
                ? displayPosts.findIndex((post) => String(post.id) === anchor.id)
                : -1;
            pendingAnchorRef.current = anchorIndex >= nextWindow.start && anchorIndex < nextWindow.end
                ? anchor
                : null;
        }
        setWindowRange(nextWindow);
    }, [displayPosts, effectiveRange.end, effectiveRange.start, reverse, shouldWindow, virtualHeights, windowRange]);

    const finishTouchScroll = useCallback(() => {
        if (!active || !touchScrollActiveRef.current || touchContactRef.current) return;
        touchScrollActiveRef.current = false;
        clearTimeout(touchScrollIdleTimerRef.current);
        touchScrollIdleTimerRef.current = 0;

        const root = touchScrollerRef.current || timelineRef?.current;
        if (root?.dataset) delete root.dataset.timelineTouchScrolling;
        touchScrollerRef.current = null;
        const content = timelineContentRef.current;
        const anchor = captureTimelineViewportAnchor(root, content);
        loadAnchorRef.current = null;

        let heightsChanged = deferredWidthResetRef.current || deferredHeightsRef.current.size > 0;
        if (deferredWidthResetRef.current) {
            measuredHeightsRef.current.clear();
            deferredWidthResetRef.current = false;
            heightsChanged = true;
        }
        for (const [id, height] of deferredHeightsRef.current.entries()) {
            const previous = measuredHeightsRef.current.get(id);
            if (Math.abs((previous ?? 0) - height) > 0.5) {
                measuredHeightsRef.current.set(id, height);
                heightsChanged = true;
            }
        }
        deferredHeightsRef.current.clear();
        if (deferredMeasuredWidthRef.current > 0) {
            measuredWidthRef.current = deferredMeasuredWidthRef.current;
            deferredMeasuredWidthRef.current = 0;
        }

        setTouchScrollRevision((value) => value + 1);
        if (!windowingActive) {
            pendingAnchorRef.current = null;
            return;
        }

        const prefix = buildTimelinePrefixHeights(displayPosts, measuredHeightsRef.current);
        const anchorIndex = anchor
            ? displayPosts.findIndex((post) => String(post.id) === anchor.id)
            : -1;
        const compactWindow = getTimelineAnchorWindow(
            root,
            prefix,
            displayPosts.length,
            anchorIndex,
            anchor,
        ) || getTimelineViewportWindow(root, prefix, displayPosts.length, reverse)
            || getLatestTimelineWindow(displayPosts.length);
        pendingAnchorRef.current = anchorIndex >= compactWindow.start && anchorIndex < compactWindow.end
            ? anchor
            : null;
        if (heightsChanged) setHeightRevision((value) => value + 1);
        setWindowRange((current) => (
            haveSameTimelineWindow(current, compactWindow) ? current : compactWindow
        ));
    }, [active, displayPosts, reverse, timelineRef, windowingActive]);

    finishTouchScrollRef.current = finishTouchScroll;
    updateWindowForScrollRef.current = updateWindowForScroll;

    const scheduleTouchScrollEnd = useCallback(() => {
        if (!touchScrollActiveRef.current) return;
        clearTimeout(touchScrollIdleTimerRef.current);
        touchScrollIdleTimerRef.current = setTimeout(() => {
            touchScrollIdleTimerRef.current = 0;
            finishTouchScrollRef.current?.();
        }, TIMELINE_TOUCH_SCROLL_IDLE_MS);
    }, []);

    const handleTouchStart = useCallback((event) => {
        const root = event.currentTarget;
        touchContactRef.current = true;
        touchScrollActiveRef.current = true;
        touchScrollerRef.current = root;
        root.dataset.timelineTouchScrolling = 'true';
        clearTimeout(touchScrollIdleTimerRef.current);
        touchScrollIdleTimerRef.current = 0;
        cancelAnimationFrame(scrollWindowFrameRef.current);
        scrollWindowFrameRef.current = 0;
        cancelAnimationFrame(restoreFramesRef.current.first);
        cancelAnimationFrame(restoreFramesRef.current.second);
        restoringAnchorRef.current = false;
        pendingAnchorRef.current = null;
        loadAnchorRef.current = null;

        if (!shouldWindow) return;
        const expandedWindow = getTimelineWindowForViewport(
            virtualHeights,
            getTimelineContentOffset(root, reverse),
            root.clientHeight,
            displayPosts.length,
            root.clientHeight * TIMELINE_TOUCH_OVERSCAN_VIEWPORTS,
        );
        setWindowRange({
            start: Math.min(effectiveRange.start, expandedWindow.start),
            end: Math.max(effectiveRange.end, expandedWindow.end),
        });
    }, [displayPosts.length, effectiveRange.end, effectiveRange.start, reverse, shouldWindow, virtualHeights]);

    const handleTouchEnd = useCallback((event) => {
        if (event?.touches?.length > 0) return;
        touchContactRef.current = false;
        scheduleTouchScrollEnd();
    }, [scheduleTouchScrollEnd]);

    const handleScroll = useCallback((event) => {
        const root = event.currentTarget || event.target;
        if (!hasUsableTimelineViewport(root, active)) return;
        const anchorScrolling = isAnchorScrolling(root);
        if (!restoringAnchorRef.current && !restoringActiveRef.current && !anchorScrolling) {
            const pinnedToEnd = reverse
                ? root.scrollTop >= -2
                : Math.max(0, root.scrollHeight - root.clientHeight - root.scrollTop) <= 2;
            pinnedToEndRef.current = pinnedToEnd;
            suspendedScrollTopRef.current = root.scrollTop;
            suspendedAnchorRef.current = pinnedToEnd
                ? null
                : captureTimelineViewportAnchor(root, timelineContentRef.current);
        }
        if (restoringAnchorRef.current || restoringActiveRef.current || anchorScrolling) return;
        const touchScrolling = touchScrollActiveRef.current;
        if (touchScrolling && !touchContactRef.current) scheduleTouchScrollEnd();
        const contentOffset = getTimelineContentOffset(root, reverse);
        const loadThreshold = touchScrolling
            ? root.clientHeight * TIMELINE_TOUCH_OVERSCAN_VIEWPORTS
            : Math.max(300, root.clientHeight);
        if (contentOffset < loadThreshold) triggerLoadMore();
        if (!shouldWindow || scrollWindowFrameRef.current) return;
        scrollWindowFrameRef.current = requestAnimationFrame(() => {
            scrollWindowFrameRef.current = 0;
            updateWindowForScrollRef.current?.(root);
        });
    }, [active, reverse, scheduleTouchScrollEnd, shouldWindow, triggerLoadMore]);

    useLayoutEffect(() => {
        const wasActive = previousActiveRef.current;
        previousActiveRef.current = active;

        if (wasActive && !active) {
            cancelAnimationFrame(scrollWindowFrameRef.current);
            scrollWindowFrameRef.current = 0;
            cancelAnimationFrame(resumeFramesRef.current.first);
            cancelAnimationFrame(resumeFramesRef.current.second);
            cancelAnimationFrame(resumeFramesRef.current.third);
            clearTimeout(touchScrollIdleTimerRef.current);
            touchScrollIdleTimerRef.current = 0;
            touchContactRef.current = false;
            touchScrollActiveRef.current = false;
            restoringActiveRef.current = false;
            loadAnchorRef.current = null;
            pendingAnchorRef.current = null;
            return;
        }
        if (!active || wasActive) return;

        const anchor = suspendedAnchorRef.current;
        if (anchor) loadAnchorRef.current = anchor;
        restoringActiveRef.current = true;
        const restore = () => {
            if (!anchor) return false;
            return restoreTimelineViewportAnchor(
                timelineRef?.current,
                timelineContentRef.current,
                anchor,
            );
        };
        resumeFramesRef.current.first = requestAnimationFrame(() => {
            const resumedRoot = timelineRef?.current;
            if (!hasUsableTimelineViewport(resumedRoot, true)) {
                restoringActiveRef.current = false;
                return;
            }
            if (pinnedToEndRef.current) {
                resumedRoot.scrollTop = reverse ? 0 : resumedRoot.scrollHeight;
                restoringActiveRef.current = false;
                return;
            }
            if (!restore() && Number.isFinite(suspendedScrollTopRef.current)) {
                resumedRoot.scrollTop = suspendedScrollTopRef.current;
            }
            resumeFramesRef.current.second = requestAnimationFrame(() => {
                restore();
                resumeFramesRef.current.third = requestAnimationFrame(() => {
                    restore();
                    restoringActiveRef.current = false;
                });
            });
        });
        return () => {
            cancelAnimationFrame(resumeFramesRef.current.first);
            cancelAnimationFrame(resumeFramesRef.current.second);
            cancelAnimationFrame(resumeFramesRef.current.third);
            restoringActiveRef.current = false;
        };
    }, [active, reverse, timelineRef]);

    useEffect(() => {
        const root = timelineRef?.current;
        if (!active || !root) return;
        const onScrollEnd = () => finishTouchScrollRef.current?.();
        root.addEventListener('scrollend', onScrollEnd, { passive: true });
        return () => root.removeEventListener('scrollend', onScrollEnd);
    }, [active, displayPosts.length, timelineRef]);

    useEffect(() => () => {
        cancelAnimationFrame(scrollWindowFrameRef.current);
        scrollWindowFrameRef.current = 0;
        clearTimeout(touchScrollIdleTimerRef.current);
        touchScrollIdleTimerRef.current = 0;
        if (touchScrollerRef.current?.dataset) {
            delete touchScrollerRef.current.dataset.timelineTouchScrolling;
        }
        touchScrollerRef.current = null;
        touchContactRef.current = false;
        touchScrollActiveRef.current = false;
    }, []);

    useLayoutEffect(() => {
        const previousPosts = previousPostsRef.current;
        previousPostsRef.current = displayPosts;

        if (!active) {
            loadAnchorRef.current = null;
            pendingAnchorRef.current = null;
            return;
        }

        if (!canWindow) {
            loadAnchorRef.current = null;
            pendingAnchorRef.current = null;
            if (windowingActive) setWindowingActive(false);
            setWindowRange((current) => {
                const fullRange = { start: 0, end: displayPosts.length };
                return haveSameTimelineWindow(current, fullRange) ? current : fullRange;
            });
            return;
        }

        if (!windowingActive) {
            if (touchScrollActiveRef.current) return;
            const root = timelineRef?.current;
            const content = timelineContentRef.current;
            measuredWidthRef.current = root?.clientWidth || 0;
            measureTimelinePostHeights(content, measuredHeightsRef.current, true);
            const measuredPrefix = buildTimelinePrefixHeights(displayPosts, measuredHeightsRef.current);
            const loadAnchor = loadAnchorRef.current;
            const capturedAnchor = loadAnchor
                && displayPosts.some((post) => String(post.id) === loadAnchor.id)
                ? loadAnchor
                : captureTimelineViewportAnchor(root, content);
            loadAnchorRef.current = null;

            const anchorIndex = capturedAnchor
                ? displayPosts.findIndex((post) => String(post.id) === capturedAnchor.id)
                : -1;
            const nextWindow = getTimelineAnchorWindow(
                root,
                measuredPrefix,
                displayPosts.length,
                anchorIndex,
                capturedAnchor,
            ) || getTimelineViewportWindow(root, measuredPrefix, displayPosts.length, reverse)
                || getLatestTimelineWindow(displayPosts.length);

            if (capturedAnchor) pendingAnchorRef.current = capturedAnchor;
            setHeightRevision((value) => value + 1);
            setWindowRange(nextWindow);
            setWindowingActive(true);
            return;
        }

        const loadAnchor = loadAnchorRef.current;
        loadAnchorRef.current = null;
        const root = timelineRef?.current;
        const currentPrefix = buildTimelinePrefixHeights(displayPosts, measuredHeightsRef.current);
        if (touchScrollActiveRef.current) {
            pendingAnchorRef.current = null;
            const touchWindow = root
                ? getTimelineWindowForViewport(
                    currentPrefix,
                    getTimelineContentOffset(root, reverse),
                    root.clientHeight,
                    displayPosts.length,
                    root.clientHeight * TIMELINE_TOUCH_OVERSCAN_VIEWPORTS,
                )
                : getLatestTimelineWindow(displayPosts.length);
            setWindowRange((current) => {
                const firstWindowId = previousPosts[current.start]?.id;
                const lastWindowId = previousPosts[Math.max(current.start, current.end - 1)]?.id;
                const preservedStart = displayPosts.findIndex((post) => post.id === firstWindowId);
                const preservedEndIndex = displayPosts.findIndex((post) => post.id === lastWindowId);
                return {
                    start: Math.max(0, Math.min(
                        preservedStart >= 0 ? preservedStart : current.start,
                        touchWindow.start,
                        displayPosts.length,
                    )),
                    end: Math.min(displayPosts.length, Math.max(
                        preservedEndIndex >= 0 ? preservedEndIndex + 1 : current.end,
                        touchWindow.end,
                    )),
                };
            });
            return;
        }
        setWindowRange((current) => {
            if (loadAnchor) {
                const anchorIndex = displayPosts.findIndex((post) => String(post.id) === loadAnchor.id);
                if (anchorIndex >= 0) {
                    pendingAnchorRef.current = loadAnchor;
                    const anchoredWindow = getTimelineAnchorWindow(
                        root,
                        currentPrefix,
                        displayPosts.length,
                        anchorIndex,
                        loadAnchor,
                    ) || getTimelineWindowAroundIndex(anchorIndex, displayPosts.length);
                    return haveSameTimelineWindow(current, anchoredWindow) ? current : anchoredWindow;
                }
            }
            if (previousPosts.length === 0 || current.end === 0) {
                return getTimelineViewportWindow(root, currentPrefix, displayPosts.length, reverse)
                    || getLatestTimelineWindow(displayPosts.length);
            }

            const wasPinnedToNewest = current.end >= previousPosts.length
                && (!reverse || (root && root.scrollTop >= -2));
            if (wasPinnedToNewest) {
                return getTimelineViewportWindow(root, currentPrefix, displayPosts.length, reverse)
                    || getLatestTimelineWindow(displayPosts.length);
            }

            const firstWindowId = previousPosts[current.start]?.id;
            const preservedStart = displayPosts.findIndex((post) => post.id === firstWindowId);
            if (preservedStart < 0) return getLatestTimelineWindow(displayPosts.length);
            const preservedLength = Math.max(TIMELINE_WINDOW_SIZE, current.end - current.start);
            const preservedWindow = {
                start: preservedStart,
                end: Math.min(displayPosts.length, preservedStart + preservedLength),
            };
            return haveSameTimelineWindow(current, preservedWindow) ? current : preservedWindow;
        });
    }, [active, canWindow, displayPosts, reverse, shouldBootstrapWindow, timelineRef, touchScrollRevision, windowingActive]);

    useLayoutEffect(() => {
        if (!active || !shouldWindow) return;
        const root = timelineRef?.current;
        const content = timelineContentRef.current;
        if (!root || !content) return;

        const existingAnchor = pendingAnchorRef.current;
        if (existingAnchor && !findTimelinePostElement(content, existingAnchor.id)) {
            pendingAnchorRef.current = null;
        }
        if (touchScrollActiveRef.current) {
            queueTimelinePostHeights(content, deferredHeightsRef.current);
        } else if (measureTimelinePostHeights(content, measuredHeightsRef.current)) {
            if (!pendingAnchorRef.current) {
                pendingAnchorRef.current = captureTimelineViewportAnchor(root, content);
            }
            setHeightRevision((value) => value + 1);
        }

        const postElements = Array.from(content.querySelectorAll(':scope > .post'));
        const firstPost = postElements[0];
        const lastPost = postElements[postElements.length - 1];
        if (firstPost && lastPost) {
            const rootRect = root.getBoundingClientRect();
            const firstRect = firstPost.getBoundingClientRect();
            const lastRect = lastPost.getBoundingClientRect();
            const needsEarlierRows = effectiveRange.start > 0 && firstRect.top > rootRect.top + 1;
            const needsLaterRows = effectiveRange.end < displayPosts.length && lastRect.bottom < rootRect.bottom - 1;
            if (needsEarlierRows || needsLaterRows) {
                if (!touchScrollActiveRef.current) {
                    const guardAnchor = captureTimelineViewportAnchor(root, content);
                    if (guardAnchor) pendingAnchorRef.current = guardAnchor;
                }
                const measuredPrefix = buildTimelinePrefixHeights(displayPosts, measuredHeightsRef.current);
                const viewportWindow = getTimelineViewportWindow(
                    root,
                    measuredPrefix,
                    displayPosts.length,
                    reverse,
                );
                const nextWindow = {
                    start: needsEarlierRows
                        ? Math.max(0, Math.min(
                            effectiveRange.start - TIMELINE_WINDOW_SIZE,
                            viewportWindow?.start ?? effectiveRange.start,
                        ))
                        : effectiveRange.start,
                    end: needsLaterRows
                        ? Math.min(displayPosts.length, Math.max(
                            effectiveRange.end + TIMELINE_WINDOW_SIZE,
                            viewportWindow?.end ?? effectiveRange.end,
                        ))
                        : effectiveRange.end,
                };
                if (!haveSameTimelineWindow(windowRange, nextWindow)) setWindowRange(nextWindow);
                return;
            }
        }

        if (touchScrollActiveRef.current) return;
        const anchor = pendingAnchorRef.current;
        if (!anchor || !findTimelinePostElement(content, anchor.id)) return;

        cancelAnimationFrame(restoreFramesRef.current.first);
        cancelAnimationFrame(restoreFramesRef.current.second);
        restoringAnchorRef.current = true;
        const restore = () => {
            if (pendingAnchorRef.current !== anchor) return false;
            return restoreTimelineViewportAnchor(root, content, anchor);
        };
        restore();
        restoreFramesRef.current.first = requestAnimationFrame(() => {
            restore();
            restoreFramesRef.current.second = requestAnimationFrame(() => {
                restore();
                if (pendingAnchorRef.current === anchor) pendingAnchorRef.current = null;
                restoringAnchorRef.current = false;
            });
        });

        return () => {
            cancelAnimationFrame(restoreFramesRef.current.first);
            cancelAnimationFrame(restoreFramesRef.current.second);
            restoringAnchorRef.current = false;
        };
    }, [active, displayPosts, effectiveRange.end, effectiveRange.start, heightRevision, reverse, shouldWindow, timelineRef, windowRange]);

    useEffect(() => {
        if (!active || !shouldWindow || typeof ResizeObserver === 'undefined') return;
        const content = timelineContentRef.current;
        if (!content) return;
        let updateFrame = 0;
        const observer = new ResizeObserver((entries) => {
            const root = timelineRef?.current;
            const measuredWidth = root?.clientWidth || 0;
            if (touchScrollActiveRef.current) {
                if (measuredWidthRef.current > 0
                    && measuredWidth > 0
                    && Math.abs(measuredWidthRef.current - measuredWidth) > 1) {
                    deferredWidthResetRef.current = true;
                }
                if (measuredWidth > 0) deferredMeasuredWidthRef.current = measuredWidth;
                for (const entry of entries) {
                    const id = getTimelinePostId(entry.target);
                    const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
                    if (id && Number.isFinite(height) && height > 0) {
                        deferredHeightsRef.current.set(id, height);
                    }
                }
                return;
            }

            let changed = false;
            if (measuredWidthRef.current > 0
                && measuredWidth > 0
                && Math.abs(measuredWidthRef.current - measuredWidth) > 1) {
                measuredHeightsRef.current.clear();
                changed = true;
            }
            if (measuredWidth > 0) measuredWidthRef.current = measuredWidth;
            for (const entry of entries) {
                const id = getTimelinePostId(entry.target);
                if (!id) continue;
                const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
                const previous = measuredHeightsRef.current.get(id);
                if (Number.isFinite(height) && height > 0 && Math.abs((previous ?? 0) - height) > 1) {
                    measuredHeightsRef.current.set(id, height);
                    changed = true;
                }
            }
            if (changed && !updateFrame) {
                updateFrame = requestAnimationFrame(() => {
                    updateFrame = 0;
                    if (touchScrollActiveRef.current) {
                        queueTimelinePostHeights(content, deferredHeightsRef.current);
                        return;
                    }
                    const root = timelineRef?.current;
                    const anchor = captureTimelineViewportAnchor(root, content);
                    if (anchor && !pendingAnchorRef.current) pendingAnchorRef.current = anchor;
                    setHeightRevision((value) => value + 1);
                });
            }
        });
        for (const post of content.querySelectorAll(':scope > .post')) observer.observe(post);
        return () => {
            observer.disconnect();
            if (updateFrame) cancelAnimationFrame(updateFrame);
        };
    }, [active, displayPosts, shouldWindow, timelineRef, windowRange.start, windowRange.end]);

    useEffect(() => {
        const reveal = (event) => {
            const targetId = String(event?.detail?.id ?? '');
            if (!active || !targetId || !shouldWindow) return;
            const index = displayPosts.findIndex((post) => String(post.id) === targetId);
            if (index >= 0) {
                pendingAnchorRef.current = null;
                const viewportHeight = timelineRef?.current?.clientHeight || 1;
                const targetTop = virtualHeights[index] ?? 0;
                const targetWindow = getTimelineWindowForViewport(
                    virtualHeights,
                    targetTop - viewportHeight / 2,
                    viewportHeight,
                    displayPosts.length,
                );
                setWindowRange((current) => touchScrollActiveRef.current
                    ? {
                        start: Math.min(current.start, targetWindow.start),
                        end: Math.max(current.end, targetWindow.end),
                    }
                    : targetWindow);
            }
        };
        window.addEventListener(TIMELINE_REVEAL_EVENT, reveal);
        return () => window.removeEventListener(TIMELINE_REVEAL_EVENT, reveal);
    }, [active, displayPosts, shouldWindow, timelineRef, virtualHeights]);

    useEffect(() => {
        if (!active || !hasIntersectionObserver) return;
        const sentinel = sentinelRef.current;
        const root = timelineRef?.current;
        if (!sentinel || !root) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) triggerLoadMore();
        }, {
            root,
            rootMargin: '300px 0px 300px 0px',
            threshold: 0,
        });
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [active, hasIntersectionObserver, hasMore, onLoadMore, timelineRef, triggerLoadMore]);

    const triggerLoadMoreRef = useRef(triggerLoadMore);
    triggerLoadMoreRef.current = triggerLoadMore;

    useEffect(() => {
        if (!active || hasIntersectionObserver || !timelineRef?.current) return;
        const root = timelineRef.current;
        if (hasUsableTimelineViewport(root, active)
            && getTimelineContentOffset(root, reverse) < Math.max(300, root.clientHeight)) {
            triggerLoadMoreRef.current?.();
        }
    }, [active, hasIntersectionObserver, posts, hasMore, reverse, timelineRef]);

    useEffect(() => {
        if (!active || !timelineRef?.current || !hasMore || loadingMore) return;
        const root = timelineRef.current;
        if (!hasUsableTimelineViewport(root, active)) return;
        if (root.scrollHeight <= root.clientHeight + 1
            || getTimelineContentOffset(root, reverse) < Math.max(300, root.clientHeight)) {
            triggerLoadMoreRef.current?.();
        }
    }, [active, posts, hasMore, loadingMore, reverse, timelineRef]);

    if (!posts) {
        return html`<div class="loading"><div class="spinner"></div></div>`;
    }

    if (displayPosts.length === 0) {
        return html`
            <div class="timeline" ref=${timelineRef}>
                <div class="timeline-content">
                    <div style="padding: var(--spacing-xl); text-align: center; color: var(--text-secondary)">
                        ${emptyMessage || 'No messages yet. Start a conversation!'}
                    </div>
                </div>
            </div>
        `;
    }

    const visiblePosts = displayPosts.slice(effectiveRange.start, effectiveRange.end);
    const topSpacerHeight = shouldWindow ? virtualHeights[effectiveRange.start] : 0;
    const bottomSpacerHeight = shouldWindow
        ? virtualHeights[displayPosts.length] - virtualHeights[effectiveRange.end]
        : 0;
    const loadMoreSentinel = html`<div class="timeline-sentinel" ref=${sentinelRef}></div>`;

    return html`
        <div
            class="timeline ${reverse ? 'reverse' : 'normal'}"
            ref=${timelineRef}
            onScroll=${handleScroll}
            onTouchStart=${handleTouchStart}
            onTouchEnd=${handleTouchEnd}
            onTouchCancel=${handleTouchEnd}
        >
            <div class="timeline-content" ref=${timelineContentRef}>
                ${reverse ? loadMoreSentinel : null}
                ${shouldWindow && topSpacerHeight > 0 ? html`<div class="timeline-virtual-spacer" style=${{ height: `${topSpacerHeight}px` }}></div>` : null}
                ${visiblePosts.map((post, visibleIndex) => {
                    const index = effectiveRange.start + visibleIndex;
                    const isThreadReply = Boolean(post.data?.thread_id && post.data.thread_id !== post.id);
                    const isRemoving = removingPostIds?.has?.(post.id);
                    const threadInfo = threadInfoByIndex[index] || {};
                    return html`
                    <${TimelinePost}
                        key=${post.id}
                        post=${post}
                        isThreadReply=${isThreadReply}
                        isThreadPrev=${threadInfo.hasThreadPrev}
                        isThreadNext=${threadInfo.hasThreadNext}
                        isRemoving=${isRemoving}
                        highlightQuery=${searchQuery}
                        agentName=${getAgentName(post.data?.agent_id, agents || {})}
                        agentAvatarUrl=${getAgentAvatarUrl(post.data?.agent_id, agents || {})}
                        userName=${user?.name || user?.user_name}
                        userAvatarUrl=${user?.avatar_url || user?.avatarUrl || user?.avatar}
                        userAvatarBackground=${user?.avatar_background || user?.avatarBackground}
                        onPostClick=${onPostClick}
                        onHashtagClick=${onHashtagClick}
                        onMessageRef=${onMessageRef}
                        onScrollToMessage=${onScrollToMessage}
                        onFileRef=${onFileRef}
                        onOpenWidget=${onOpenWidget}
                        onDelete=${onDeletePost}
                        onOpenAttachmentPreview=${onOpenAttachmentPreview}
                    />
                `})}
                ${shouldWindow && bottomSpacerHeight > 0 ? html`<div class="timeline-virtual-spacer" style=${{ height: `${bottomSpacerHeight}px` }}></div>` : null}
                ${reverse ? null : loadMoreSentinel}
            </div>
        </div>
    `;
}
