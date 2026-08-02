import { expect, test } from 'bun:test';

import { resolveRunningChatSessions } from '../../web/src/components/chat-session-context-menu.js';

test('Chat context menu keeps only distinct sessions that are currently active', () => {
  const active = {
    chat_jid: 'web:running',
    agent_name: 'running',
    is_active: true,
    activity_label: 'Running shell',
  };
  const current = {
    chat_jid: 'web:default',
    agent_name: 'default',
    is_active: true,
    activity_label: 'Working',
  };

  expect(resolveRunningChatSessions([
    { chat_jid: 'web:idle-resident', agent_name: 'idle', is_active: false },
    active,
    { ...active, agent_name: 'duplicate' },
    { chat_jid: 'web:archived', agent_name: 'archived', is_active: true, archived_at: '2026-08-03T00:00:00Z' },
    { chat_jid: 'web:truthy', agent_name: 'truthy', is_active: 1 },
    { chat_jid: '', agent_name: 'missing', is_active: true },
    current,
  ])).toEqual([active, current]);
});

test('Chat context menu returns an empty list for malformed API payloads', () => {
  expect(resolveRunningChatSessions(undefined)).toEqual([]);
  expect(resolveRunningChatSessions({ chats: [] })).toEqual([]);
  expect(resolveRunningChatSessions('not-an-array')).toEqual([]);
});
