import { expect, test } from 'bun:test';

import {
  EDITOR_FILE_REFERENCE_REQUEST_EVENT,
  buildEditorFileReferenceRequestDetail,
  dispatchEditorFileReferenceRequest,
  getEditorFileReferencePathFromEvent,
  normalizeEditorFileReferencePath,
} from '../../web/src/ui/editor-file-reference.js';

test('editor file reference paths are normalized for compose refs', () => {
  expect(normalizeEditorFileReferencePath(' /notes/today.md ')).toBe('notes/today.md');
  expect(normalizeEditorFileReferencePath('\\notes\\today.md')).toBe('notes/today.md');
  expect(normalizeEditorFileReferencePath(null)).toBe('');
  expect(buildEditorFileReferenceRequestDetail('/notes/today.md')).toEqual({
    path: 'notes/today.md',
    source: 'editor-footer',
  });
  expect(buildEditorFileReferenceRequestDetail('   ')).toBeNull();
});

test('editor file reference event payloads expose normalized paths', () => {
  expect(getEditorFileReferencePathFromEvent({ detail: { path: '/notes/today.md' } })).toBe('notes/today.md');
  expect(getEditorFileReferencePathFromEvent({ detail: { path: '' } })).toBe('');
  expect(getEditorFileReferencePathFromEvent(null)).toBe('');
});

test('dispatchEditorFileReferenceRequest broadcasts to current window and opener', () => {
  class FakeCustomEvent extends Event {
    detail: unknown;
    constructor(type: string, init?: { detail?: unknown }) {
      super(type);
      this.detail = init?.detail;
    }
  }
  const currentEvents: Array<{ type: string; detail: unknown }> = [];
  const openerEvents: Array<{ type: string; detail: unknown }> = [];
  const opener = {
    CustomEvent: FakeCustomEvent,
    dispatchEvent: (event: Event & { detail?: unknown }) => {
      openerEvents.push({ type: event.type, detail: event.detail });
      return true;
    },
  };
  const runtimeWindow = {
    CustomEvent: FakeCustomEvent,
    opener,
    dispatchEvent: (event: Event & { detail?: unknown }) => {
      currentEvents.push({ type: event.type, detail: event.detail });
      return true;
    },
  };

  expect(dispatchEditorFileReferenceRequest('/notes/today.md', runtimeWindow)).toBe(true);
  const expected = {
    type: EDITOR_FILE_REFERENCE_REQUEST_EVENT,
    detail: { path: 'notes/today.md', source: 'editor-footer' },
  };
  expect(currentEvents).toEqual([expected]);
  expect(openerEvents).toEqual([expected]);
});

test('dispatchEditorFileReferenceRequest rejects empty paths', () => {
  class FakeCustomEvent extends Event {}
  const events: Event[] = [];
  const runtimeWindow = {
    CustomEvent: FakeCustomEvent,
    dispatchEvent: (event: Event) => {
      events.push(event);
      return true;
    },
  };

  expect(dispatchEditorFileReferenceRequest('   ', runtimeWindow)).toBe(false);
  expect(events).toEqual([]);
});
