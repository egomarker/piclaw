import { expect, test } from 'bun:test';

import {
  isAndroidTimelinePlatform,
  shouldDeferAndroidTimelineCommit,
  TIMELINE_TOUCH_SCROLL_IDLE_EVENT,
  waitForAndroidTimelineScrollIdle,
} from '../../web/src/ui/timeline-scroll-state.js';

const androidNavigator = {
  userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36',
};
const iosNavigator = {
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15',
};

test('Android timeline platform detection excludes iOS and desktop', () => {
  expect(isAndroidTimelinePlatform(androidNavigator)).toBe(true);
  expect(isAndroidTimelinePlatform({ userAgentData: { platform: 'Android' } })).toBe(true);
  expect(isAndroidTimelinePlatform(iosNavigator)).toBe(false);
  expect(isAndroidTimelinePlatform({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)' })).toBe(false);
});

test('Android timeline commits defer only during marked touch scrolling', () => {
  const container = { dataset: { timelineTouchScrolling: 'true' } };
  expect(shouldDeferAndroidTimelineCommit(container, androidNavigator)).toBe(true);
  expect(shouldDeferAndroidTimelineCommit(container, iosNavigator)).toBe(false);
  expect(shouldDeferAndroidTimelineCommit({ dataset: {} }, androidNavigator)).toBe(false);
});

test('Android timeline commit waits for the settled-scroll event', async () => {
  const container = new EventTarget() as EventTarget & {
    dataset: { timelineTouchScrolling?: string; timelinePageCommitPending?: string };
  };
  container.dataset = { timelineTouchScrolling: 'true' };

  let resolved = false;
  const waiting = waitForAndroidTimelineScrollIdle(container, androidNavigator).then((deferred) => {
    resolved = true;
    return deferred;
  });
  await Promise.resolve();
  expect(resolved).toBe(false);
  expect(container.dataset.timelinePageCommitPending).toBe('true');

  delete container.dataset.timelineTouchScrolling;
  container.dispatchEvent(new Event(TIMELINE_TOUCH_SCROLL_IDLE_EVENT));
  expect(await waiting).toBe(true);
  expect(container.dataset.timelinePageCommitPending).toBeUndefined();
});

test('iOS timeline commits do not wait for Android scroll idle', async () => {
  const container = new EventTarget() as EventTarget & {
    dataset: { timelineTouchScrolling?: string };
  };
  container.dataset = { timelineTouchScrolling: 'true' };
  expect(await waitForAndroidTimelineScrollIdle(container, iosNavigator)).toBe(false);
});
