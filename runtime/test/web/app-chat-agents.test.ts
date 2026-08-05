import { expect, test } from 'bun:test';

import {
  applyActiveChatActivityChange,
  mergeActiveAndBranchChats,
  normalizeActiveChatRows,
  normalizeCurrentRootBranchRows,
} from '../../web/src/ui/app-chat-agents.js';

test('normalizeActiveChatRows keeps only rows with non-empty chat and agent handles', () => {
  const valid = { chat_jid: 'chat:1', agent_name: '@alpha', extra: true };
  const rows = [
    valid,
    { chat_jid: 'chat:2', agent_name: '   ' },
    { chat_jid: '   ', agent_name: '@beta' },
    { chat_jid: 42, agent_name: '@gamma' },
    null,
  ];

  const normalized = normalizeActiveChatRows(rows);
  expect(normalized).toEqual([valid]);
  expect(normalized[0]).toBe(valid);
});

test('normalizeCurrentRootBranchRows only requires string payload fields', () => {
  const withEmptyHandle = { chat_jid: 'chat:1', agent_name: '' };
  const withHandle = { chat_jid: 'chat:2', agent_name: '@beta' };

  expect(
    normalizeCurrentRootBranchRows([
      withEmptyHandle,
      withHandle,
      { chat_jid: 'chat:3', agent_name: null },
      { chat_jid: null, agent_name: '@gamma' },
    ]),
  ).toEqual([withEmptyHandle, withHandle]);
});

test('applyActiveChatActivityChange updates existing rows and adds newly active chats without fetching', () => {
  const rows = [
    { chat_jid: 'chat:current', agent_name: '@current', is_active: false },
    { chat_jid: 'chat:background', agent_name: '@background', is_active: false, branchOnly: true },
  ];

  const started = applyActiveChatActivityChange(rows, {
    changed_chat_jid: 'chat:background',
    active: true,
    chat: {
      chat_jid: 'chat:background',
      agent_name: '@background',
      is_active: true,
      activity_status: 'streaming',
    },
  }, 'chat:current');

  expect(started.map((chat) => chat.chat_jid)).toEqual(['chat:current', 'chat:background']);
  expect(started[1]).toMatchObject({
    is_active: true,
    activity_status: 'streaming',
    branchOnly: true,
  });

  const added = applyActiveChatActivityChange(started, {
    changed_chat_jid: 'chat:new',
    active: true,
    chat: { chat_jid: 'chat:new', agent_name: '@new', is_active: true },
  }, 'chat:current');
  expect(added.map((chat) => chat.chat_jid)).toEqual(['chat:current', 'chat:background', 'chat:new']);

  const stopped = applyActiveChatActivityChange(added, {
    changed_chat_jid: 'chat:background',
    active: false,
    chat: { chat_jid: 'chat:background', agent_name: '@background', is_active: false, activity_status: 'idle' },
  }, 'chat:current');
  expect(stopped.find((chat) => chat.chat_jid === 'chat:background')).toMatchObject({
    is_active: false,
    activity_status: 'idle',
    branchOnly: true,
  });
});

test('mergeActiveAndBranchChats returns active list unchanged when no branch rows are present', () => {
  const active = [{ chat_jid: 'chat:1', agent_name: '@alpha' }];
  expect(mergeActiveAndBranchChats(active, [], 'chat:1')).toBe(active);
  expect(mergeActiveAndBranchChats(active, null, 'chat:1')).toBe(active);
});

test('mergeActiveAndBranchChats overlays active rows, preserves fallback is_active, and sorts by current/archived/activity/recency', () => {
  const active = [
    { chat_jid: 'chat:a', agent_name: '@active-a', is_active: true, provider: 'active-provider' },
    { chat_jid: 'chat:b', agent_name: '@active-b', is_active: null, source: 'active' },
    { chat_jid: 'chat:d', agent_name: '@active-d', is_active: false, source: 'active-false' },
  ];
  const branch = [
    { chat_jid: 'chat:d', agent_name: '@branch-d', is_active: true, archived_at: null, updated_at: '2026-01-04T00:00:00Z' },
    { chat_jid: 'chat:b', agent_name: '@branch-b', is_active: true, archived_at: null, updated_at: '2026-01-02T00:00:00Z' },
    { chat_jid: 'chat:c', agent_name: '@branch-c', is_active: false, archived_at: '2026-01-05T00:00:00Z', updated_at: '2026-01-05T00:00:00Z' },
    { chat_jid: 'chat:a', agent_name: '@branch-a', is_active: false, archived_at: null, updated_at: '2026-01-03T00:00:00Z', branchOnly: true },
  ];

  const merged = mergeActiveAndBranchChats(active, branch, 'chat:c');

  expect(merged.map((chat) => chat.chat_jid)).toEqual(['chat:c', 'chat:a', 'chat:b', 'chat:d']);
  expect(merged[1]).toMatchObject({
    chat_jid: 'chat:a',
    agent_name: '@active-a',
    branchOnly: true,
    provider: 'active-provider',
    is_active: true,
    updated_at: '2026-01-03T00:00:00Z',
  });
  expect(merged[2]).toMatchObject({
    chat_jid: 'chat:b',
    agent_name: '@active-b',
    source: 'active',
    is_active: true,
    updated_at: '2026-01-02T00:00:00Z',
  });
  expect(merged[3]).toMatchObject({
    chat_jid: 'chat:d',
    agent_name: '@active-d',
    source: 'active-false',
    is_active: false,
    updated_at: '2026-01-04T00:00:00Z',
  });
  expect(merged[0]).toBe(branch[2]);
});
