import { expect, test } from 'bun:test';
import {
  captureTimelineViewportAnchor,
  estimateTimelinePostHeight,
  findTimelineIndexAtOffset,
  getAnchoredTimelineScrollTop,
  getLatestTimelineWindow,
  getTimelineContentOffset,
  getTimelineDistanceFromEnd,
  getTimelineWindowAroundIndex,
  hasUsableTimelineViewport,
  haveSameTimelineProps,
  isAndroidTimelinePlatform,
  isTimelineSessionReady,
  windowFromScrollOffset,
} from '../../web/src/components/timeline.js';

test('TanStack timeline is restricted to Android user agents', () => {
  expect(isAndroidTimelinePlatform({
    userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36',
  })).toBe(true);
  expect(isAndroidTimelinePlatform({
    userAgent: 'Mozilla/5.0',
    userAgentData: { platform: 'Android' },
  })).toBe(true);
  expect(isAndroidTimelinePlatform({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36',
  })).toBe(false);
  expect(isAndroidTimelinePlatform({
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/140 Mobile/15E148 Safari/604.1',
  })).toBe(false);
  expect(isAndroidTimelinePlatform({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',
  })).toBe(false);
});

test('Android timeline waits for posts owned by the selected session', () => {
  expect(isTimelineSessionReady('web:b', 'web:a')).toBe(false);
  expect(isTimelineSessionReady('web:b', 'web:b')).toBe(true);
  expect(isTimelineSessionReady('web:b', null)).toBe(true);
});

test('timeline distance from end uses positive scroll coordinates', () => {
  expect(getTimelineDistanceFromEnd({ scrollHeight: 2000, clientHeight: 600, scrollTop: 1400 })).toBe(0);
  expect(getTimelineDistanceFromEnd({ scrollHeight: 2000, clientHeight: 600, scrollTop: 1350 })).toBe(50);
  expect(getTimelineDistanceFromEnd(null)).toBe(Infinity);
});

test('timeline render boundary ignores parent updates when timeline props retain identity', () => {
  const posts = [{ id: 1 }];
  const onLoadMore = () => {};
  const current = { posts, hasMore: true, onLoadMore, searchQuery: null };
  const next = { posts, hasMore: true, onLoadMore, searchQuery: null };

  expect(haveSameTimelineProps(current, next)).toBe(true);
});

test('timeline render boundary updates for changed timeline data or callbacks', () => {
  const posts = [{ id: 1 }];
  const onLoadMore = () => {};
  const current = { posts, hasMore: true, onLoadMore };

  expect(haveSameTimelineProps(current, { ...current, posts: [...posts] })).toBe(false);
  expect(haveSameTimelineProps(current, { ...current, hasMore: false })).toBe(false);
  expect(haveSameTimelineProps(current, { ...current, onLoadMore: () => {} })).toBe(false);
  expect(haveSameTimelineProps(current, { ...current, searchQuery: null })).toBe(false);
});

test('timeline window stays bounded at the newest posts', () => {
  expect(getLatestTimelineWindow(1000)).toEqual({ start: 984, end: 1000 });
  expect(getLatestTimelineWindow(20)).toEqual({ start: 4, end: 20 });
});

test('timeline reveal window centers historical posts without exceeding bounds', () => {
  expect(getTimelineWindowAroundIndex(500, 1000)).toEqual({ start: 492, end: 508 });
  expect(getTimelineWindowAroundIndex(2, 1000)).toEqual({ start: 0, end: 16 });
  expect(getTimelineWindowAroundIndex(999, 1000)).toEqual({ start: 984, end: 1000 });
});

test('timeline offset lookup resolves scroll jumps into omitted history', () => {
  expect(findTimelineIndexAtOffset([0, 100, 250, 400], 0)).toBe(0);
  expect(findTimelineIndexAtOffset([0, 100, 250, 400], 249)).toBe(1);
  expect(findTimelineIndexAtOffset([0, 100, 250, 400], 400)).toBe(2);
});

test('timeline height estimate is bounded and accounts for rich content', () => {
  expect(estimateTimelinePostHeight({ data: { content: '' } })).toBe(76);
  expect(estimateTimelinePostHeight({ data: { content: 'x'.repeat(100), media_ids: [1] } })).toBe(318);
  expect(estimateTimelinePostHeight({ data: { content: 'x'.repeat(10000) } })).toBe(1200);
});

test('windowFromScrollOffset returns null without a scroller, heights, or posts', () => {
  const root = { scrollTop: 0, scrollHeight: 0, clientHeight: 0 };
  expect(windowFromScrollOffset(null, [0, 100], 10, true)).toBe(null);
  expect(windowFromScrollOffset(root, [0], 10, true)).toBe(null);
  expect(windowFromScrollOffset(root, [0, 100], 0, true)).toBe(null);
});

test('windowFromScrollOffset seeds the newest window when pinned at the bottom (reverse)', () => {
  // 120 posts, 100px each: prefix sums 0..12000.
  const prefix = Array.from({ length: 121 }, (_v, i) => i * 100);
  const root = { scrollTop: 0, scrollHeight: 12000, clientHeight: 600 };
  expect(windowFromScrollOffset(root, prefix, 120, true)).toEqual({ start: 104, end: 120 });
});

test('windowFromScrollOffset keeps a history-scrolled view on OLD posts instead of snapping to newest', () => {
  const prefix = Array.from({ length: 121 }, (_v, i) => i * 100);
  // Reverse convention: scrollTop = 0 at the visual bottom (newest); negative going up.
  // A user who has scrolled deep into history must seed a window around old posts.
  const root = { scrollTop: -10000, scrollHeight: 12000, clientHeight: 600 };
  const seeded = windowFromScrollOffset(root, prefix, 120, true);
  expect(seeded).toEqual({ start: 6, end: 22 });
  expect(seeded.end).toBeLessThan(120);
});

test('windowFromScrollOffset maps scrollTop directly in normal (non-reverse) mode', () => {
  const prefix = Array.from({ length: 121 }, (_v, i) => i * 100);
  const root = { scrollTop: 1400, scrollHeight: 12000, clientHeight: 600 };
  expect(windowFromScrollOffset(root, prefix, 120, false)).toEqual({ start: 6, end: 22 });
});

test('reverse timeline content offset reaches zero at the history edge', () => {
  const root = { scrollTop: -11400, scrollHeight: 12000, clientHeight: 600 };
  expect(getTimelineContentOffset(root, true)).toBe(0);
  expect(getTimelineContentOffset({ ...root, scrollTop: 0 }, true)).toBe(11400);
  expect(getTimelineContentOffset({ ...root, scrollTop: -10000 }, true)).toBe(1400);
});

test('timeline content offset uses positive scrollTop in normal mode', () => {
  expect(getTimelineContentOffset({ scrollTop: 900, scrollHeight: 12000, clientHeight: 600 }, false)).toBe(900);
  expect(getTimelineContentOffset(null, false)).toBe(0);
});

test('timeline viewport rejects inactive, disconnected, and zero-sized surfaces', () => {
  const visible = {
    clientHeight: 600,
    clientWidth: 800,
    isConnected: true,
    getBoundingClientRect: () => ({ width: 800, height: 600 }),
  };

  expect(hasUsableTimelineViewport(visible, true)).toBe(true);
  expect(hasUsableTimelineViewport(visible, false)).toBe(false);
  expect(hasUsableTimelineViewport({ ...visible, isConnected: false }, true)).toBe(false);
  expect(hasUsableTimelineViewport({ ...visible, clientHeight: 0 }, true)).toBe(false);
  expect(hasUsableTimelineViewport({
    ...visible,
    getBoundingClientRect: () => ({ width: 0, height: 0 }),
  }, true)).toBe(false);
});

test('timeline anchor capture supports TanStack rows nested inside the canvas', () => {
  let queriedSelector = '';
  const post = {
    id: 'post-42',
    getBoundingClientRect: () => ({ top: 125, bottom: 225 }),
  };
  const content = {
    querySelectorAll: (selector: string) => {
      queriedSelector = selector;
      return [post];
    },
  };
  const root = {
    getBoundingClientRect: () => ({ top: 100, bottom: 500 }),
  };

  expect(captureTimelineViewportAnchor(root, content)).toEqual({ id: '42', offset: 25 });
  expect(queriedSelector).toContain('.end-anchored-row > .post');
});

test('timeline anchor correction restores the captured viewport offset', () => {
  expect(getAnchoredTimelineScrollTop(-5000, 225, 100)).toBe(-4875);
  expect(getAnchoredTimelineScrollTop(5000, 225, 100)).toBe(5125);
  expect(getAnchoredTimelineScrollTop(-5000, Number.NaN, 100)).toBe(-5000);
});
