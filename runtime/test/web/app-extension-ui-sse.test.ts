import { expect, test } from 'bun:test';

import {
  applyExtensionUiWorkingState,
  resolveExtensionUiContextUsage,
  resolveExtensionUiToast,
  resolveExtensionUiWorkingIndicator,
  resolveStatusPanelEventChatJid,
  resolveStatusPanelWidgetEventContext,
} from '../../web/src/ui/app-extension-ui-sse.js';

test('resolveStatusPanelEventChatJid prefers payload chat id and falls back to current chat', () => {
  expect(resolveStatusPanelEventChatJid({ chat_jid: ' chat:2 ' }, 'chat:1')).toBe('chat:2');
  expect(resolveStatusPanelEventChatJid({ chat_jid: '   ' }, 'chat:1')).toBe('chat:1');
  expect(resolveStatusPanelEventChatJid({}, 'chat:1')).toBe('chat:1');
});

test('resolveStatusPanelWidgetEventContext classifies status-panel widget events', () => {
  expect(resolveStatusPanelWidgetEventContext('extension_ui_widget', {
    key: 'panel:1',
    options: { surface: 'status-panel' },
    chat_jid: 'chat:2',
  }, 'chat:1')).toEqual({
    isStatusPanelWidgetEvent: true,
    eventChatJid: 'chat:2',
    panelKey: 'panel:1',
  });

  expect(resolveStatusPanelWidgetEventContext('extension_ui_status', {
    key: 'panel:2',
    options: { surface: 'status-panel' },
  }, 'chat:1')).toEqual({
    isStatusPanelWidgetEvent: false,
    eventChatJid: 'chat:1',
    panelKey: 'panel:2',
  });
});

test('resolveExtensionUiContextUsage parses smart-compaction context estimates', () => {
  expect(resolveExtensionUiContextUsage('extension_ui_status', {
    key: 'context_usage',
    text: JSON.stringify({
      tokens: 42000,
      contextWindow: 128000,
      percent: 32.8125,
      estimated: true,
      source: 'smart_compaction',
      phase: 'generating_summary',
    }),
  })).toEqual({
    tokens: 42000,
    contextWindow: 128000,
    percent: 32.8125,
    estimated: true,
    source: 'smart_compaction',
    phase: 'generating_summary',
  });

  expect(resolveExtensionUiContextUsage('extension_ui_status', { key: 'other', text: '{}' })).toBeNull();
  expect(resolveExtensionUiContextUsage('extension_ui_status', { key: 'context_usage', text: '{nope' })).toBeNull();
  expect(resolveExtensionUiContextUsage('extension_ui_working', { key: 'context_usage', text: '{}' })).toBeNull();
});

test('resolveExtensionUiToast maps notify and error events to expected toast payloads', () => {
  expect(resolveExtensionUiToast('extension_ui_notify', { message: 'Saved', type: 'success' })).toEqual({
    title: 'Saved',
    detail: null,
    kind: 'success',
  });
  expect(resolveExtensionUiToast('extension_ui_notify', { message: 'Heads up', type: '' })).toEqual({
    title: 'Heads up',
    detail: null,
    kind: 'info',
  });
  expect(resolveExtensionUiToast('extension_ui_error', { error: 'Boom' })).toEqual({
    title: 'Extension UI error',
    detail: 'Boom',
    kind: 'error',
    durationMs: 5000,
  });
});

test('resolveExtensionUiToast returns null for unrelated or malformed payloads', () => {
  expect(resolveExtensionUiToast('extension_ui_status', { message: 'ignored' })).toBeNull();
  expect(resolveExtensionUiToast('extension_ui_notify', { message: 123 })).toBeNull();
  expect(resolveExtensionUiToast(null, null)).toBeNull();
});

test('resolveExtensionUiWorkingIndicator maps default, hidden, and custom indicators', () => {
  expect(resolveExtensionUiWorkingIndicator('extension_ui_working_indicator', {})).toEqual({
    mode: 'default',
    frames: [],
    intervalMs: null,
  });

  expect(resolveExtensionUiWorkingIndicator('extension_ui_working_indicator', { frames: [], interval_ms: 80 })).toEqual({
    mode: 'hidden',
    frames: [],
    intervalMs: 80,
  });

  expect(resolveExtensionUiWorkingIndicator('extension_ui_working_indicator', { frames: ['⠋', '⠙'], intervalMs: 120 })).toEqual({
    mode: 'custom',
    frames: ['⠋', '⠙'],
    intervalMs: 120,
  });

  expect(resolveExtensionUiWorkingIndicator('extension_ui_working_indicator', {
    frames: ['<svg><circle /></svg>', '⠋', '<span>busy</span>', '·'],
    intervalMs: 120,
  })).toEqual({
    mode: 'custom',
    frames: ['⠋', '·'],
    intervalMs: 120,
  });

  expect(resolveExtensionUiWorkingIndicator('extension_ui_working_indicator', { frames: ['<svg><circle /></svg>'], intervalMs: 120 })).toEqual({
    mode: 'hidden',
    frames: [],
    intervalMs: 120,
  });

  expect(resolveExtensionUiWorkingIndicator('extension_ui_status', { frames: ['x'] })).toBeUndefined();
});

test('applyExtensionUiWorkingState merges working messages and indicator updates', () => {
  const empty = { message: null, indicator: null, visible: true };

  expect(applyExtensionUiWorkingState(empty, 'extension_ui_working', { message: 'Compacting context…' })).toEqual({
    message: 'Compacting context…',
    indicator: null,
    visible: true,
  });

  expect(applyExtensionUiWorkingState({
    message: 'Compacting context…',
    indicator: null,
    visible: true,
  }, 'extension_ui_working_indicator', { frames: ['⠋', '⠙'], interval_ms: 90 })).toEqual({
    message: 'Compacting context…',
    indicator: {
      mode: 'custom',
      frames: ['⠋', '⠙'],
      intervalMs: 90,
    },
    visible: true,
  });

  expect(applyExtensionUiWorkingState({
    message: 'Compacting context…',
    indicator: {
      mode: 'custom',
      frames: ['⠋'],
      intervalMs: 100,
    },
    visible: true,
  }, 'extension_ui_working', {})).toEqual({
    message: null,
    indicator: {
      mode: 'custom',
      frames: ['⠋'],
      intervalMs: 100,
    },
    visible: true,
  });

  expect(applyExtensionUiWorkingState(empty, 'extension_ui_notify', { message: 'ignore me' })).toBeUndefined();
});

test('resolveExtensionUiWorkingIndicator returns default for missing frames', () => {
  // No payload at all → default
  expect(resolveExtensionUiWorkingIndicator('extension_ui_working_indicator', null)).toEqual({
    mode: 'default',
    frames: [],
    intervalMs: null,
  });
  // Payload with no frames key → default
  expect(resolveExtensionUiWorkingIndicator('extension_ui_working_indicator', { interval_ms: 90 })).toEqual({
    mode: 'default',
    frames: [],
    intervalMs: null,
  });
});

test('resolveExtensionUiWorkingIndicator returns undefined for unrelated events', () => {
  expect(resolveExtensionUiWorkingIndicator('extension_ui_working', { message: 'hi' })).toBeUndefined();
  expect(resolveExtensionUiWorkingIndicator('agent_response', {})).toBeUndefined();
});

// ---------------------------------------------------------------------------
// Lifecycle reset tests (Path A acceptance criteria)
// ---------------------------------------------------------------------------

test('applyExtensionUiWorkingState clears working state on turn end (done)', () => {
  // Simulate state that has been set by an extension
  const active = {
    message: 'Compacting context…',
    indicator: { mode: 'custom' as const, frames: ['⠋', '⠙'], intervalMs: 90 },
    visible: true,
  };

  // done/error status events are NOT extension_ui_* events — they go through
  // the agent status path and call setExtensionWorkingState({message:null,indicator:null})
  // directly. Verify applyExtensionUiWorkingState returns undefined (no-op)
  // for those events so it doesn't accidentally interfere.
  expect(applyExtensionUiWorkingState(active, 'agent_status', { type: 'done' })).toBeUndefined();
  expect(applyExtensionUiWorkingState(active, 'agent_status', { type: 'error' })).toBeUndefined();
});

test('applyExtensionUiWorkingState does not handle non-extension-ui events', () => {
  const active = {
    message: 'Working…',
    indicator: { mode: 'default' as const, frames: [], intervalMs: null },
    visible: true,
  };
  // These events should return undefined — state is cleared elsewhere
  const nonUiEvents = [
    'agent_response', 'agent_status', 'connected', 'interaction_updated',
    'interaction_deleted', 'timeline_post',
  ] as const;

  for (const eventType of nonUiEvents) {
    expect(applyExtensionUiWorkingState(active, eventType, {})).toBeUndefined();
  }
});

test('extension_ui_status updates working text for standard extension progress', () => {
  // setStatus() fires extension_ui_status — for standard Pi extensions this is
  // often the only progress text paired with a working indicator, so it must
  // replace the generic Working… fallback in the compose working row.
  const state = { message: null, indicator: { mode: 'custom' as const, frames: ['⠋'], intervalMs: 90 }, visible: true };
  expect(applyExtensionUiWorkingState(state, 'extension_ui_status', { key: 'ssh-core', text: 'SSH connecting…' })).toEqual({
    message: 'SSH connecting…',
    indicator: { mode: 'custom', frames: ['⠋'], intervalMs: 90 },
    visible: true,
  });
});

test('extension_ui_status keeps structured context usage out of working text', () => {
  const state = { message: null, indicator: { mode: 'custom' as const, frames: ['⠋'], intervalMs: 90 }, visible: true };
  expect(applyExtensionUiWorkingState(state, 'extension_ui_status', { key: 'context_usage', text: '{"percent":42}' })).toBeUndefined();
});

// ---------------------------------------------------------------------------
// setWorkingVisible tests (Pass B — 0.70.3+ API)
// ---------------------------------------------------------------------------

test('applyExtensionUiWorkingState handles extension_ui_working_visible', () => {
  const visible = { message: 'Working…', indicator: null, visible: true };

  // Hide
  const hidden = applyExtensionUiWorkingState(visible, 'extension_ui_working_visible', { visible: false });
  expect(hidden).toEqual({ message: 'Working…', indicator: null, visible: false });

  // Show again
  const shown = applyExtensionUiWorkingState(hidden!, 'extension_ui_working_visible', { visible: true });
  expect(shown).toEqual({ message: 'Working…', indicator: null, visible: true });

  // No-op when already hidden
  expect(applyExtensionUiWorkingState(hidden!, 'extension_ui_working_visible', { visible: false })).toBeUndefined();

  // No-op when already visible
  expect(applyExtensionUiWorkingState(visible, 'extension_ui_working_visible', { visible: true })).toBeUndefined();
});

test('applyExtensionUiWorkingState preserves visible through message and indicator updates', () => {
  const hiddenState = { message: null, indicator: null, visible: false };

  // Message update preserves visible: false
  const withMessage = applyExtensionUiWorkingState(hiddenState, 'extension_ui_working', { message: 'Compacting…' });
  expect(withMessage).toEqual({ message: 'Compacting…', indicator: null, visible: false });

  // Indicator update preserves visible: false
  const withIndicator = applyExtensionUiWorkingState(hiddenState, 'extension_ui_working_indicator', { frames: ['●'] });
  expect(withIndicator?.visible).toBe(false);
});
