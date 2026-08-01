import { afterEach, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

import {
  getStandaloneTabUrl,
  handleRovingTabKeyDown,
  hasTabContextMenu,
  isTabClosable,
  resolveRovingTabIndex,
  resolveTabFocusAfterClose,
  resolveTabKeyboardTargetId,
  shouldQueueTabFocusAfterClose,
} from '../../web/src/components/tab-strip.js';
import {
  registerAddonStandaloneTabUrlResolver,
  resetAddonWebRegistriesForTests,
} from '../../web/src/ui/addon-web-extensions.ts';

afterEach(() => {
  resetAddonWebRegistriesForTests();
});

test('tab capabilities can make a synthetic tab permanent and menu-free', () => {
  expect(isTabClosable({ id: 'file' })).toBe(true);
  expect(hasTabContextMenu({ id: 'file' })).toBe(true);
  expect(isTabClosable({ id: 'chat', closable: false })).toBe(false);
  expect(hasTabContextMenu({ id: 'chat', contextMenu: false })).toBe(false);
});

test('roving tab navigation wraps and supports Home and End', () => {
  const tabs = [{ id: 'chat' }, { id: 'workspace' }, { id: 'file' }];

  expect(resolveTabKeyboardTargetId(tabs, 'chat', 'ArrowLeft')).toBe('file');
  expect(resolveTabKeyboardTargetId(tabs, 'file', 'ArrowRight')).toBe('chat');
  expect(resolveTabKeyboardTargetId(tabs, 'workspace', 'Home')).toBe('chat');
  expect(resolveTabKeyboardTargetId(tabs, 'workspace', 'End')).toBe('file');
  expect(resolveTabKeyboardTargetId(tabs, 'workspace', 'PageDown')).toBeNull();
  expect(resolveRovingTabIndex(tabs, 'workspace', 'workspace')).toBe(0);
  expect(resolveRovingTabIndex(tabs, 'workspace', 'chat')).toBe(-1);
  expect(resolveRovingTabIndex(tabs, 'missing', 'chat')).toBe(0);
});

test('Mobile tab close focus waits for removal and follows the replacement active tab', () => {
  const beforeClose = [{ id: 'chat' }, { id: 'first' }, { id: 'second' }];
  const afterMiddleClose = [{ id: 'chat' }, { id: 'second' }];
  const afterFinalClose = [{ id: 'chat' }];

  expect(shouldQueueTabFocusAfterClose(true, 'first', 'first')).toBe(true);
  expect(shouldQueueTabFocusAfterClose(false, 'first', 'first')).toBe(false);
  expect(shouldQueueTabFocusAfterClose(true, 'first', 'second')).toBe(false);
  expect(resolveTabFocusAfterClose(beforeClose, 'first', 'first')).toBeNull();
  expect(resolveTabFocusAfterClose(afterMiddleClose, 'second', 'first')).toBe('second');
  expect(resolveTabFocusAfterClose(afterFinalClose, 'chat', 'second')).toBe('chat');
  expect(resolveTabFocusAfterClose(afterMiddleClose, 'missing', 'first')).toBeNull();
});

test('roving tab keyboard actions focus and activate the resolved tab', () => {
  const calls: string[] = [];
  const event = {
    key: 'ArrowRight',
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => { calls.push('prevent'); },
  };
  const handled = handleRovingTabKeyDown(event, {
    tabs: [{ id: 'chat' }, { id: 'workspace' }, { id: 'file' }],
    currentId: 'workspace',
    focusTab: (id: string) => { calls.push(`focus:${id}`); },
    onActivate: (id: string) => { calls.push(`activate:${id}`); },
  });

  expect(handled).toBe(true);
  expect(calls).toEqual(['prevent', 'focus:file', 'activate:file']);

  calls.length = 0;
  expect(handleRovingTabKeyDown({ ...event, key: 'ArrowLeft', ctrlKey: true }, {
    tabs: [{ id: 'chat' }, { id: 'workspace' }],
    currentId: 'workspace',
    focusTab: (id: string) => { calls.push(`focus:${id}`); },
    onActivate: (id: string) => { calls.push(`activate:${id}`); },
  })).toBe(false);
  expect(calls).toEqual([]);
});

test('getStandaloneTabUrl honors addon-provided standalone routes', () => {
  registerAddonStandaloneTabUrlResolver((path, { hasPopOutTab } = {}) => {
    if (!/\.example$/i.test(String(path || '')) || hasPopOutTab) return null;
    return '/example-addon/view?path=' + encodeURIComponent(path);
  });

  expect(getStandaloneTabUrl('/workspace/foo.example', { hasPopOutTab: true })).toBeNull();
  expect(getStandaloneTabUrl('/workspace/foo.example', { hasPopOutTab: false })).toBe('/example-addon/view?path=%2Fworkspace%2Ffoo.example');
});

test('terminal dock menu item is only exposed from the active tab context menu', () => {
  const source = readFileSync(new URL('../../web/src/components/tab-strip.ts', import.meta.url), 'utf8');
  expect(source).toContain("onToggleDock && contextMenu.id === activeId");
  expect(source).toContain("${dockVisible ? 'Hide terminal dock' : 'Show terminal dock'}");
});

test('getStandaloneTabUrl still resolves standalone viewer routes for non-addon files', () => {
  expect(getStandaloneTabUrl('/workspace/report.docx', { hasPopOutTab: true })).toBe(
    '/office-viewer/?url=' + encodeURIComponent('/workspace/raw?path=%2Fworkspace%2Freport.docx') + '&name=report.docx',
  );
  expect(getStandaloneTabUrl('/workspace/chart.csv', { hasPopOutTab: true })).toBe('/data-viewer/?path=%2Fworkspace%2Fchart.csv');
  expect(getStandaloneTabUrl('/workspace/manual.pdf', { hasPopOutTab: true })).toBe('/workspace/raw?path=%2Fworkspace%2Fmanual.pdf');
  expect(getStandaloneTabUrl('/workspace/image.png', { hasPopOutTab: true })).toBe('/image-viewer/?path=%2Fworkspace%2Fimage.png');
});
