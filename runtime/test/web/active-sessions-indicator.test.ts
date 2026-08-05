import { expect, test } from 'bun:test';

import {
  ACTIVE_SESSIONS_AUTO_COLLAPSE_MS,
  resolveActiveSessionsIndicatorState,
} from '../../web/src/components/active-sessions-indicator.js';

test('active sessions indicator counts the current running session and other running sessions', () => {
  const current = {
    chat_jid: 'web:default',
    agent_name: 'default',
    is_active: true,
  };
  const other = {
    chat_jid: 'web:other',
    agent_name: 'other',
    is_active: true,
  };

  expect(resolveActiveSessionsIndicatorState([
    current,
    other,
    { chat_jid: 'web:idle', agent_name: 'idle', is_active: false },
    { chat_jid: 'web:archived', agent_name: 'archived', is_active: true, archived_at: '2026-08-05T00:00:00Z' },
  ])).toEqual({ count: 2, visible: true });
});

test('active sessions indicator stays hidden off the timeline or without running sessions', () => {
  const running = [{ chat_jid: 'web:default', agent_name: 'default', is_active: true }];

  expect(resolveActiveSessionsIndicatorState(running, false)).toEqual({ count: 1, visible: false });
  expect(resolveActiveSessionsIndicatorState([], true)).toEqual({ count: 0, visible: false });
});

test('active sessions panel collapses five seconds after its last interaction', () => {
  expect(ACTIVE_SESSIONS_AUTO_COLLAPSE_MS).toBe(5_000);
});
