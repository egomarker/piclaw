import { expect, test } from 'bun:test';

import {
  RECENT_SESSION_WINDOW_MINUTES,
  formatRunningChatSessionHandle,
  resolveRecentChatSessions,
  resolveRunningChatSessions,
} from '../../web/src/components/chat-session-context-menu.js';

test('Chat context menu labels sessions with only their human-readable handles', () => {
  expect(formatRunningChatSessionHandle({
    agent_name: 'Running Other',
    chat_jid: 'web:running-other',
  })).toBe('@running-other');
  expect(formatRunningChatSessionHandle({ chat_jid: 'web:missing-handle' })).toBe('Unnamed session');
});

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

test('Session menu resolves recent inactive sessions newest-first with exact minute ages', () => {
  const now = Date.parse('2026-08-06T09:00:00.000Z');
  const active = [{ chat_jid: 'web:active', agent_name: 'active', is_active: true }];
  const recent = resolveRecentChatSessions([
    { chat_jid: 'web:older', agent_name: 'older', last_activity_at: '2026-08-06T08:16:00.000Z' },
    { chat_jid: 'web:recent', agent_name: 'recent', last_activity_at: '2026-08-06T08:57:30.000Z' },
    { chat_jid: 'web:active', agent_name: 'active', last_activity_at: '2026-08-06T08:59:00.000Z' },
    { chat_jid: 'web:stale', agent_name: 'stale', last_activity_at: '2026-08-06T08:15:00.000Z' },
    { chat_jid: 'web:archived', agent_name: 'archived', last_activity_at: '2026-08-06T08:58:00.000Z', archived_at: '2026-08-06T08:59:00.000Z' },
    { chat_jid: 'web:recent', agent_name: 'duplicate', last_activity_at: '2026-08-06T08:55:00.000Z' },
    { chat_jid: 'web:invalid', agent_name: 'invalid', last_activity_at: 'not-a-date' },
  ], active, now);

  expect(RECENT_SESSION_WINDOW_MINUTES).toBe(45);
  expect(recent.map((chat) => ({ chat_jid: chat.chat_jid, activity_minutes: chat.activity_minutes }))).toEqual([
    { chat_jid: 'web:recent', activity_minutes: 2 },
    { chat_jid: 'web:older', activity_minutes: 44 },
  ]);
});

test('Session menu returns empty lists for malformed API payloads', () => {
  expect(resolveRunningChatSessions(undefined)).toEqual([]);
  expect(resolveRunningChatSessions({ chats: [] })).toEqual([]);
  expect(resolveRunningChatSessions('not-an-array')).toEqual([]);
  expect(resolveRecentChatSessions(undefined)).toEqual([]);
  expect(resolveRecentChatSessions({ recent_chats: [] })).toEqual([]);
});
