import { expect, test } from 'bun:test';

import {
  isTimelineRequestCurrent,
  mergeFreshTimelinePosts,
} from '../../web/src/ui/use-timeline.js';

test('mergeFreshTimelinePosts prepends fresh rows while keeping older cached rows around', () => {
  expect(mergeFreshTimelinePosts(
    [{ id: 9 }, { id: 8 }, { id: 7 }, { id: 6 }],
    [{ id: 10 }, { id: 9 }, { id: 8 }],
  )).toEqual([{ id: 10 }, { id: 9 }, { id: 8 }, { id: 7 }, { id: 6 }]);
});

test('mergeFreshTimelinePosts falls back to the fresh payload when no current rows exist', () => {
  expect(mergeFreshTimelinePosts(null, [{ id: 2 }, { id: 1 }])).toEqual([{ id: 2 }, { id: 1 }]);
});

test('mergeFreshTimelinePosts keeps the current rows when the fresh payload is malformed', () => {
  expect(mergeFreshTimelinePosts([{ id: 2 }, { id: 1 }], null)).toEqual([{ id: 2 }, { id: 1 }]);
});

test('timeline refresh ignores a snapshot started before a realtime final response mutation', () => {
  expect(isTimelineRequestCurrent({
    requestId: 4,
    currentRequestId: 4,
    mutationVersion: 10,
    currentMutationVersion: 11,
    chatToken: 2,
    currentChatToken: 2,
  })).toBe(false);
});

test('timeline refresh ignores an older response when a newer refresh is in flight', () => {
  expect(isTimelineRequestCurrent({
    requestId: 4,
    currentRequestId: 5,
    mutationVersion: 10,
    currentMutationVersion: 10,
    chatToken: 2,
    currentChatToken: 2,
  })).toBe(false);
});

test('timeline refresh accepts the latest response when chat and mutation state are unchanged', () => {
  expect(isTimelineRequestCurrent({
    requestId: 5,
    currentRequestId: 5,
    mutationVersion: 10,
    currentMutationVersion: 10,
    chatToken: 2,
    currentChatToken: 2,
  })).toBe(true);
});
