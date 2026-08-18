import { Component, h, html, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from '../vendor/preact-htm.js';
import { Post } from './post.js';
import { isAnchorScrolling } from '../ui/scroll-anchor.js';
import { getAgentAvatarUrl, getAgentName } from '../ui/agent-utils.js';

export const TIMELINE_WINDOW_SIZE = 16;
export const TIMELINE_WINDOW_THRESHOLD = 100;
export const TIMELINE_REVEAL_EVENT = 'piclaw:reveal-timeline-post';
const TIMELINE_TOUCH_OVERSCAN_VIEWPORTS = 4;
const TIMELINE_ANDROID_IDLE_OVERSCAN_VIEWPORTS = 4;
const TIMELINE_TOUCH_SCROLL_IDLE_MS = 200;
const TIMELINE_ANDROID_SCROLL_IDLE_MS = 500;
const TIMELINE_POST_SCROLL_LOAD_DELAY_MS = 50;

/** Android browser and installed-PWA gate; Android PWAs retain the Android platform. */
export function isAndroidTimelinePlatform(navigatorLike: any = typeof navigator === 'undefined' ? null : navigator) {
    const platform = String(navigatorLike?.userAgentData?.platform || '').trim();
    const userAgent = String(navigatorLike?.userAgent || '');
    return /^android$/i.test(platform) || /android/i.test(userAgent);
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

function getTimelineViewportWindow(root, prefixHeights, postCount, reverse, overscanPx = root?.clientHeight) {
    if (!root) return null;
    return getTimelineWindowForViewport(
        prefixHeights,
        getTimelineContentOffset(root, reverse),
        root.clientHeight,
        postCount,
        overscanPx,
    );
}

function getTimelineAnchorWindow(root, prefixHeights, postCount, anchorIndex, anchor, overscanPx = root?.clientHeight) {
    if (!root || !anchor || anchorIndex < 0) return null;
    const anchorTop = Number(prefixHeights[anchorIndex]) || 0;
    return getTimelineWindowForViewport(
        prefixHeights,
        anchorTop - anchor.offset,
        root.clientHeight,
        postCount,
        overscanPx,
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

function findTimelinePostElement(content, postId) {
    const expectedId = `post-${postId}`;
    for (const element of content?.querySelectorAll?.(':scope > .post') || []) {
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

function captureTimelineViewportAnchor(root, content) {
    if (!root || !content) return null;
    const rootRect = root.getBoundingClientRect();
    for (const element of content.querySelectorAll(':scope > .post')) {
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

/** Timeline component. */
function TimelineView({ posts, hasMore, onLoadMore, onPostClick, onHashtagClick, onMessageRef, onScrollToMessage, onFileRef, onOpenWidget, onOpenAttachmentPreview, emptyMessage, timelineRef, agents, user, onDeletePost, reverse = true, removingPostIds, searchQuery }) {
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
    const restoringAnchorRef = useRef(false);
    const restoreFramesRef = useRef({ first: 0, second: 0 });
    const scrollWindowFrameRef = useRef(0);
    const updateWindowForScrollRef = useRef(null);
    const triggerLoadMoreRef = useRef(null);
    const measuredWidthRef = useRef(0);
    const touchScrollActiveRef = useRef(false);
    const touchContactRef = useRef(false);
    const touchScrollerRef = useRef(null);
    const touchScrollIdleTimerRef = useRef(0);
    const finishTouchScrollRef = useRef(null);
    const deferredHeightsRef = useRef(new Map());
    const deferredWidthResetRef = useRef(false);
    const deferredMeasuredWidthRef = useRef(0);
    const androidPlatformRef = useRef(isAndroidTimelinePlatform());
    const androidTouchGeometryFrozenRef = useRef(false);
    const androidTouchPostsSnapshotRef = useRef(null);
    const latestSortedPostsRef = useRef([]);
    const pendingAndroidLoadRef = useRef(false);
    const androidLoadTimerRef = useRef(0);
    const androidAnchorRootRef = useRef(null);
    const androidPreviousOverflowAnchorRef = useRef('');
    const androidAnchorReleaseFramesRef = useRef({ first: 0, second: 0, third: 0 });
    const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';
    const sortedPosts = useMemo(
        () => Array.isArray(posts) ? posts.slice().sort((a, b) => a.id - b.id) : [],
        [posts],
    );
    latestSortedPostsRef.current = sortedPosts;
    const frozenPosts = androidTouchPostsSnapshotRef.current;
    const frozenNewestId = frozenPosts?.[frozenPosts.length - 1]?.id;
    const frozenViewStillCurrent = frozenNewestId !== undefined
        && sortedPosts.some((post) => post.id === frozenNewestId);
    const displayPosts = androidTouchGeometryFrozenRef.current
        && frozenPosts
        && frozenViewStillCurrent
        ? frozenPosts
        : sortedPosts;
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

    // Android freezes its rendered window for a complete gesture, so render the
    // existing four-viewport touch cushion before contact instead of on touchstart.
    const getIdleOverscanPx = useCallback((root) => {
        if (!root) return 0;
        return androidPlatformRef.current
            ? root.clientHeight * TIMELINE_ANDROID_IDLE_OVERSCAN_VIEWPORTS
            : root.clientHeight;
    }, []);

    const cancelAndroidAnchorRelease = useCallback(() => {
        cancelAnimationFrame(androidAnchorReleaseFramesRef.current.first);
        cancelAnimationFrame(androidAnchorReleaseFramesRef.current.second);
        cancelAnimationFrame(androidAnchorReleaseFramesRef.current.third);
        androidAnchorReleaseFramesRef.current = { first: 0, second: 0, third: 0 };
    }, []);

    const restoreAndroidAnchorPolicy = useCallback((root = androidAnchorRootRef.current) => {
        cancelAndroidAnchorRelease();
        if (!root || root.dataset?.timelineAndroidAnchorReconcile !== 'true') return;
        root.style.overflowAnchor = androidPreviousOverflowAnchorRef.current;
        delete root.dataset.timelineAndroidAnchorReconcile;
        if (androidAnchorRootRef.current === root) androidAnchorRootRef.current = null;
        androidPreviousOverflowAnchorRef.current = '';
    }, [cancelAndroidAnchorRelease]);

    // Virtual-spacer reconciliation is not an ordinary prepend. On Android,
    // temporarily leave it to the measured post anchor instead of letting Blink
    // and the JS restore independently adjust the reverse scroller.
    const beginAndroidAnchorReconcile = useCallback((root) => {
        if (!androidPlatformRef.current || !root) return;
        if (androidAnchorRootRef.current && androidAnchorRootRef.current !== root) {
            restoreAndroidAnchorPolicy(androidAnchorRootRef.current);
        }
        cancelAndroidAnchorRelease();
        if (root.dataset?.timelineAndroidAnchorReconcile !== 'true') {
            androidPreviousOverflowAnchorRef.current = root.style.overflowAnchor || '';
        }
        androidAnchorRootRef.current = root;
        root.dataset.timelineAndroidAnchorReconcile = 'true';
        root.style.overflowAnchor = 'none';
    }, [cancelAndroidAnchorRelease, restoreAndroidAnchorPolicy]);

    const scheduleAndroidAnchorRelease = useCallback((root) => {
        if (!androidPlatformRef.current || !root) return;
        cancelAndroidAnchorRelease();
        androidAnchorReleaseFramesRef.current.first = requestAnimationFrame(() => {
            androidAnchorReleaseFramesRef.current.first = 0;
            androidAnchorReleaseFramesRef.current.second = requestAnimationFrame(() => {
                androidAnchorReleaseFramesRef.current.second = 0;
                androidAnchorReleaseFramesRef.current.third = requestAnimationFrame(() => {
                    androidAnchorReleaseFramesRef.current.third = 0;
                    restoreAndroidAnchorPolicy(root);
                });
            });
        });
    }, [cancelAndroidAnchorRelease, restoreAndroidAnchorPolicy]);

    const triggerLoadMore = useCallback(async (force = false) => {
        const touchScrolling = touchScrollActiveRef.current;
        if (!force && androidPlatformRef.current && touchScrolling) {
            if (onLoadMore && hasMore) pendingAndroidLoadRef.current = true;
            return;
        }
        if (!onLoadMore || !hasMore || loadingMore) return;
        pendingAndroidLoadRef.current = false;
        const root = timelineRef?.current;
        const anchor = touchScrolling
            ? null
            : captureTimelineViewportAnchor(root, timelineContentRef.current);
        loadAnchorRef.current = anchor;
        if (androidPlatformRef.current) beginAndroidAnchorReconcile(root);
        setLoadingMore(true);
        try {
            await onLoadMore({
                preserveScroll: androidPlatformRef.current || !touchScrolling,
                preserveMode: 'top',
            });
        } finally {
            setLoadingMore(false);
            if (androidPlatformRef.current) scheduleAndroidAnchorRelease(root);
        }
    }, [beginAndroidAnchorReconcile, hasMore, loadingMore, onLoadMore, scheduleAndroidAnchorRelease, timelineRef]);

    const updateWindowForScroll = useCallback((root) => {
        if (!root || restoringAnchorRef.current || isAnchorScrolling(root) || !shouldWindow) return;
        if (androidPlatformRef.current
            && touchScrollActiveRef.current
            && androidTouchGeometryFrozenRef.current) return;
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
            touchScrolling
                ? clientHeight * TIMELINE_TOUCH_OVERSCAN_VIEWPORTS
                : getIdleOverscanPx(root),
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
    }, [displayPosts, effectiveRange.end, effectiveRange.start, getIdleOverscanPx, reverse, shouldWindow, virtualHeights, windowRange]);

    const finishTouchScroll = useCallback(() => {
        if (!touchScrollActiveRef.current || touchContactRef.current) return;
        touchScrollActiveRef.current = false;
        clearTimeout(touchScrollIdleTimerRef.current);
        touchScrollIdleTimerRef.current = 0;

        const root = touchScrollerRef.current || timelineRef?.current;
        const androidFrozenGeometry = androidPlatformRef.current
            && androidTouchGeometryFrozenRef.current;
        if (androidFrozenGeometry) beginAndroidAnchorReconcile(root);
        androidTouchGeometryFrozenRef.current = false;
        androidTouchPostsSnapshotRef.current = null;
        if (root?.dataset) {
            delete root.dataset.timelineTouchScrolling;
            delete root.dataset.timelineAndroidTouchScrolling;
        }
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

        const loadAfterScroll = androidPlatformRef.current && pendingAndroidLoadRef.current;
        pendingAndroidLoadRef.current = false;
        const schedulePendingLoad = () => {
            if (!loadAfterScroll || loadingMore) return;
            clearTimeout(androidLoadTimerRef.current);
            androidLoadTimerRef.current = setTimeout(() => {
                androidLoadTimerRef.current = 0;
                triggerLoadMoreRef.current?.(true);
            }, TIMELINE_POST_SCROLL_LOAD_DELAY_MS);
        };

        setTouchScrollRevision((value) => value + 1);
        if (!windowingActive) {
            pendingAnchorRef.current = androidFrozenGeometry ? anchor : null;
            if (androidFrozenGeometry) scheduleAndroidAnchorRelease(root);
            schedulePendingLoad();
            return;
        }

        const postsForReconcile = androidFrozenGeometry
            ? latestSortedPostsRef.current
            : displayPosts;
        const prefix = buildTimelinePrefixHeights(postsForReconcile, measuredHeightsRef.current);
        const anchorIndex = anchor
            ? postsForReconcile.findIndex((post) => String(post.id) === anchor.id)
            : -1;
        const idleOverscanPx = getIdleOverscanPx(root);
        const compactWindow = getTimelineAnchorWindow(
            root,
            prefix,
            postsForReconcile.length,
            anchorIndex,
            anchor,
            idleOverscanPx,
        ) || getTimelineViewportWindow(
            root,
            prefix,
            postsForReconcile.length,
            reverse,
            idleOverscanPx,
        ) || getLatestTimelineWindow(postsForReconcile.length);
        pendingAnchorRef.current = anchorIndex >= compactWindow.start && anchorIndex < compactWindow.end
            ? anchor
            : null;
        if (heightsChanged) setHeightRevision((value) => value + 1);
        setWindowRange((current) => (
            haveSameTimelineWindow(current, compactWindow) ? current : compactWindow
        ));
        if (androidFrozenGeometry) scheduleAndroidAnchorRelease(root);
        schedulePendingLoad();
    }, [beginAndroidAnchorReconcile, displayPosts, getIdleOverscanPx, loadingMore, reverse, scheduleAndroidAnchorRelease, timelineRef, windowingActive]);

    finishTouchScrollRef.current = finishTouchScroll;
    updateWindowForScrollRef.current = updateWindowForScroll;
    triggerLoadMoreRef.current = triggerLoadMore;

    const scheduleTouchScrollEnd = useCallback(() => {
        if (!touchScrollActiveRef.current) return;
        clearTimeout(touchScrollIdleTimerRef.current);
        const delay = androidPlatformRef.current
            ? TIMELINE_ANDROID_SCROLL_IDLE_MS
            : TIMELINE_TOUCH_SCROLL_IDLE_MS;
        touchScrollIdleTimerRef.current = setTimeout(() => {
            touchScrollIdleTimerRef.current = 0;
            finishTouchScrollRef.current?.();
        }, delay);
    }, []);

    const handleTouchStart = useCallback((event) => {
        const root = event.currentTarget;
        touchContactRef.current = true;
        touchScrollActiveRef.current = true;
        touchScrollerRef.current = root;
        root.dataset.timelineTouchScrolling = 'true';
        if (androidPlatformRef.current) {
            // Fetches may finish while momentum is active, but their post lists and
            // virtual ranges remain visually frozen until the settled reconciliation.
            androidTouchGeometryFrozenRef.current = true;
            androidTouchPostsSnapshotRef.current = displayPosts;
            root.dataset.timelineAndroidTouchScrolling = 'true';
            clearTimeout(androidLoadTimerRef.current);
            androidLoadTimerRef.current = 0;
        }
        clearTimeout(touchScrollIdleTimerRef.current);
        touchScrollIdleTimerRef.current = 0;
        cancelAnimationFrame(scrollWindowFrameRef.current);
        scrollWindowFrameRef.current = 0;
        cancelAnimationFrame(restoreFramesRef.current.first);
        cancelAnimationFrame(restoreFramesRef.current.second);
        restoringAnchorRef.current = false;
        pendingAnchorRef.current = null;
        loadAnchorRef.current = null;

        if (!shouldWindow || androidPlatformRef.current) return;
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
    }, [displayPosts, effectiveRange.end, effectiveRange.start, reverse, shouldWindow, virtualHeights]);

    const handleTouchEnd = useCallback((event) => {
        if (event?.touches?.length > 0) return;
        touchContactRef.current = false;
        scheduleTouchScrollEnd();
    }, [scheduleTouchScrollEnd]);

    const handleScroll = useCallback((event) => {
        if (restoringAnchorRef.current || isAnchorScrolling(event.target)) return;
        const root = event.target;
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
    }, [reverse, scheduleTouchScrollEnd, shouldWindow, triggerLoadMore]);

    useEffect(() => {
        const root = timelineRef?.current;
        if (!root) return;
        const onScrollEnd = () => finishTouchScrollRef.current?.();
        root.addEventListener('scrollend', onScrollEnd, { passive: true });
        return () => root.removeEventListener('scrollend', onScrollEnd);
    }, [displayPosts.length, timelineRef]);

    useEffect(() => () => {
        cancelAnimationFrame(scrollWindowFrameRef.current);
        scrollWindowFrameRef.current = 0;
        clearTimeout(touchScrollIdleTimerRef.current);
        touchScrollIdleTimerRef.current = 0;
        clearTimeout(androidLoadTimerRef.current);
        androidLoadTimerRef.current = 0;
        pendingAndroidLoadRef.current = false;
        androidTouchGeometryFrozenRef.current = false;
        androidTouchPostsSnapshotRef.current = null;
        if (touchScrollerRef.current?.dataset) {
            delete touchScrollerRef.current.dataset.timelineTouchScrolling;
            delete touchScrollerRef.current.dataset.timelineAndroidTouchScrolling;
        }
        restoreAndroidAnchorPolicy();
        touchScrollerRef.current = null;
        touchContactRef.current = false;
        touchScrollActiveRef.current = false;
    }, [restoreAndroidAnchorPolicy]);

    useLayoutEffect(() => {
        const previousPosts = previousPostsRef.current;
        previousPostsRef.current = displayPosts;

        if (!canWindow) {
            loadAnchorRef.current = null;
            const keepAndroidAnchor = androidPlatformRef.current
                && timelineRef?.current?.dataset?.timelineAndroidAnchorReconcile === 'true';
            if (!keepAndroidAnchor) pendingAnchorRef.current = null;
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
            const idleOverscanPx = getIdleOverscanPx(root);
            const nextWindow = getTimelineAnchorWindow(
                root,
                measuredPrefix,
                displayPosts.length,
                anchorIndex,
                capturedAnchor,
                idleOverscanPx,
            ) || getTimelineViewportWindow(
                root,
                measuredPrefix,
                displayPosts.length,
                reverse,
                idleOverscanPx,
            ) || getLatestTimelineWindow(displayPosts.length);

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
            if (androidPlatformRef.current && androidTouchGeometryFrozenRef.current) return;
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
                        getIdleOverscanPx(root),
                    ) || getTimelineWindowAroundIndex(anchorIndex, displayPosts.length);
                    return haveSameTimelineWindow(current, anchoredWindow) ? current : anchoredWindow;
                }
            }
            if (previousPosts.length === 0 || current.end === 0) {
                return getTimelineViewportWindow(
                    root,
                    currentPrefix,
                    displayPosts.length,
                    reverse,
                    getIdleOverscanPx(root),
                ) || getLatestTimelineWindow(displayPosts.length);
            }

            const wasPinnedToNewest = current.end >= previousPosts.length
                && (!reverse || (root && root.scrollTop >= -2));
            if (wasPinnedToNewest) {
                return getTimelineViewportWindow(
                    root,
                    currentPrefix,
                    displayPosts.length,
                    reverse,
                    getIdleOverscanPx(root),
                ) || getLatestTimelineWindow(displayPosts.length);
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
    }, [canWindow, displayPosts, getIdleOverscanPx, reverse, shouldBootstrapWindow, timelineRef, touchScrollRevision, windowingActive]);

    useLayoutEffect(() => {
        const root = timelineRef?.current;
        const content = timelineContentRef.current;
        if (!root || !content) return;

        if (!shouldWindow) {
            const androidAnchor = androidPlatformRef.current
                ? pendingAnchorRef.current
                : null;
            if (!androidAnchor || !findTimelinePostElement(content, androidAnchor.id)) return;

            cancelAnimationFrame(restoreFramesRef.current.first);
            cancelAnimationFrame(restoreFramesRef.current.second);
            restoringAnchorRef.current = true;
            const restore = () => {
                if (pendingAnchorRef.current !== androidAnchor) return false;
                return restoreTimelineViewportAnchor(root, content, androidAnchor);
            };
            restore();
            restoreFramesRef.current.first = requestAnimationFrame(() => {
                restore();
                restoreFramesRef.current.second = requestAnimationFrame(() => {
                    restore();
                    if (pendingAnchorRef.current === androidAnchor) pendingAnchorRef.current = null;
                    restoringAnchorRef.current = false;
                });
            });

            return () => {
                cancelAnimationFrame(restoreFramesRef.current.first);
                cancelAnimationFrame(restoreFramesRef.current.second);
                restoringAnchorRef.current = false;
            };
        }

        const existingAnchor = pendingAnchorRef.current;
        if (existingAnchor && !findTimelinePostElement(content, existingAnchor.id)) {
            pendingAnchorRef.current = null;
        }
        if (touchScrollActiveRef.current) {
            queueTimelinePostHeights(content, deferredHeightsRef.current);
            if (androidPlatformRef.current && androidTouchGeometryFrozenRef.current) return;
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
                    getIdleOverscanPx(root),
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
    }, [displayPosts, effectiveRange.end, effectiveRange.start, getIdleOverscanPx, heightRevision, reverse, shouldWindow, timelineRef, windowRange]);

    useEffect(() => {
        if (!shouldWindow || typeof ResizeObserver === 'undefined') return;
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
    }, [displayPosts, shouldWindow, timelineRef, windowRange.start, windowRange.end]);

    useEffect(() => {
        const reveal = (event) => {
            const targetId = String(event?.detail?.id ?? '');
            if (!targetId || !shouldWindow) return;
            const index = displayPosts.findIndex((post) => String(post.id) === targetId);
            if (index >= 0) {
                if (androidPlatformRef.current
                    && touchScrollActiveRef.current
                    && androidTouchGeometryFrozenRef.current) return;
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
    }, [displayPosts, shouldWindow, timelineRef, virtualHeights]);

    useEffect(() => {
        if (!hasIntersectionObserver) return;
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
    }, [hasIntersectionObserver, hasMore, onLoadMore, timelineRef, triggerLoadMore]);

    useEffect(() => {
        if (hasIntersectionObserver || !timelineRef?.current) return;
        const root = timelineRef.current;
        if (getTimelineContentOffset(root, reverse) < Math.max(300, root.clientHeight)) {
            triggerLoadMoreRef.current?.();
        }
    }, [hasIntersectionObserver, posts, hasMore, reverse, timelineRef]);

    useEffect(() => {
        if (!timelineRef?.current || !hasMore || loadingMore) return;
        const root = timelineRef.current;
        if (root.scrollHeight <= root.clientHeight + 1
            || getTimelineContentOffset(root, reverse) < Math.max(300, root.clientHeight)) {
            triggerLoadMoreRef.current?.();
        }
    }, [posts, hasMore, loadingMore, reverse, timelineRef]);

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
