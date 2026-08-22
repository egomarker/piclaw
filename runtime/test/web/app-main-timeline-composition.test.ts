import { expect, test } from 'bun:test';

import {
  deriveVisibleTimelinePosts,
  resolveTimelinePostsChatJid,
  syncScrollToBottomRef,
} from '../../web/src/ui/app-main-timeline-composition.js';

test('deriveVisibleTimelinePosts delegates queued-post filtering and preserves filtered results', () => {
  const rawPosts = [{ id: 1 }, { id: 2 }];
  const result = deriveVisibleTimelinePosts({
    rawPosts,
    followupQueueItems: [{ row_id: 9 }],
    filterQueuedPosts: (posts) => posts?.filter((post) => post.id === 2) || [],
  });

  expect(result).toEqual([{ id: 2 }]);
});

test('timeline post ownership changes only when the post snapshot changes', () => {
  const sessionAPosts = [{ id: 1 }];
  const sessionBPosts = [{ id: 2 }];
  const ownerRef = { current: null };

  expect(resolveTimelinePostsChatJid({
    ownerRef,
    rawPosts: sessionAPosts,
    currentChatJid: 'web:a',
  })).toBe('web:a');
  expect(resolveTimelinePostsChatJid({
    ownerRef,
    rawPosts: sessionAPosts,
    currentChatJid: 'web:b',
  })).toBe('web:a');
  expect(resolveTimelinePostsChatJid({
    ownerRef,
    rawPosts: sessionBPosts,
    currentChatJid: 'web:b',
  })).toBe('web:b');
});

test('syncScrollToBottomRef stores the latest scroll handler for recovery callbacks', () => {
  const scrollToBottomRef = { current: null };
  const scrollToBottom = () => {};

  syncScrollToBottomRef({
    scrollToBottomRef,
    scrollToBottom,
  });

  expect(scrollToBottomRef.current).toBe(scrollToBottom);
});
