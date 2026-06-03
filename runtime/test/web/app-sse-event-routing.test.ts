import { expect, test } from 'bun:test';

import {
  isNoisyAgentSseEvent,
  resolveSseEventRoutingContext,
} from '../../web/src/ui/app-sse-event-routing.js';

test('resolveSseEventRoutingContext trims event chat ids and matches current chat events', () => {
  expect(resolveSseEventRoutingContext('agent_status', { chat_jid: '  chat:active  ', turn_id: 'turn:1' }, 'chat:active')).toEqual({
    turnId: 'turn:1',
    eventChatJid: 'chat:active',
    isGlobalUiEvent: false,
    isCurrentChatEvent: true,
  });

  expect(resolveSseEventRoutingContext('generated_widget_open', { chat_jid: ' chat:active ', turn_id: 'turn:widget' }, 'chat:active')).toEqual({
    turnId: 'turn:widget',
    eventChatJid: 'chat:active',
    isGlobalUiEvent: false,
    isCurrentChatEvent: true,
  });

  expect(resolveSseEventRoutingContext('agent_status', { chat_jid: 'chat:other' }, 'chat:active')).toEqual({
    turnId: undefined,
    eventChatJid: 'chat:other',
    isGlobalUiEvent: false,
    isCurrentChatEvent: false,
  });

  expect(resolveSseEventRoutingContext('generated_widget_open', { chat_jid: 'chat:other' }, 'chat:active')).toEqual({
    turnId: undefined,
    eventChatJid: 'chat:other',
    isGlobalUiEvent: false,
    isCurrentChatEvent: false,
  });
});

test('resolveSseEventRoutingContext treats connected/workspace/profile events without chat ids as global', () => {
  expect(resolveSseEventRoutingContext('connected', {}, 'chat:active')).toEqual({
    turnId: undefined,
    eventChatJid: null,
    isGlobalUiEvent: true,
    isCurrentChatEvent: true,
  });

  expect(resolveSseEventRoutingContext('workspace_update', { chat_jid: '   ' }, 'chat:active')).toEqual({
    turnId: undefined,
    eventChatJid: null,
    isGlobalUiEvent: true,
    isCurrentChatEvent: true,
  });

  expect(resolveSseEventRoutingContext('profile_update', {}, 'chat:active')).toEqual({
    turnId: undefined,
    eventChatJid: null,
    isGlobalUiEvent: true,
    isCurrentChatEvent: true,
  });

  expect(resolveSseEventRoutingContext('agent_status', {}, 'chat:active')).toEqual({
    turnId: undefined,
    eventChatJid: null,
    isGlobalUiEvent: false,
    isCurrentChatEvent: false,
  });
});

test('isNoisyAgentSseEvent identifies high-frequency draft/thought events only', () => {
  expect(isNoisyAgentSseEvent('agent_draft_delta')).toBe(true);
  expect(isNoisyAgentSseEvent('agent_thought_delta')).toBe(true);
  expect(isNoisyAgentSseEvent('agent_draft')).toBe(true);
  expect(isNoisyAgentSseEvent('agent_thought')).toBe(true);

  expect(isNoisyAgentSseEvent('agent_status')).toBe(false);
  expect(isNoisyAgentSseEvent('workspace_update')).toBe(false);
  expect(isNoisyAgentSseEvent(null)).toBe(false);
});
