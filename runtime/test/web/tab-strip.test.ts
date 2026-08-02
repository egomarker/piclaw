import { afterEach, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

import {
  getStandaloneTabUrl,
  handleRovingTabKeyDown,
  hasTabContextMenu,
  hasTouchTabPressMoved,
  isPrimaryTouchTabPointer,
  isTabClosable,
  resolveRovingTabIndex,
  resolveTabFocusAfterClose,
  resolveTabKeyboardTargetId,
  shouldQueueTabFocusAfterClose,
  TOUCH_TAB_CONTEXT_MENU_DELAY_MS,
  TOUCH_TAB_CONTEXT_MENU_MOVE_TOLERANCE_PX,
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

test('Mobile long-press helpers accept only primary touch and cancel beyond the movement tolerance', () => {
  expect(TOUCH_TAB_CONTEXT_MENU_DELAY_MS).toBe(500);
  expect(TOUCH_TAB_CONTEXT_MENU_MOVE_TOLERANCE_PX).toBe(10);
  expect(isPrimaryTouchTabPointer({ pointerType: 'touch', isPrimary: true, button: 0 })).toBe(true);
  expect(isPrimaryTouchTabPointer({ pointerType: 'touch', isPrimary: false, button: 0 })).toBe(false);
  expect(isPrimaryTouchTabPointer({ pointerType: 'mouse', isPrimary: true, button: 0 })).toBe(false);
  expect(isPrimaryTouchTabPointer({ pointerType: 'touch', isPrimary: true, button: 2 })).toBe(false);
  expect(hasTouchTabPressMoved(10, 20, 16, 28)).toBe(false);
  expect(hasTouchTabPressMoved(10, 20, 17, 28)).toBe(true);
  expect(hasTouchTabPressMoved(10, 20, 13, 24, 5)).toBe(false);
  expect(hasTouchTabPressMoved(10, 20, 14, 24, 5)).toBe(true);
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

test('the optional contextual toolbar action renders immediately before Terminal Dock', () => {
  const source = readFileSync(new URL('../../web/src/components/tab-strip.ts', import.meta.url), 'utf8');
  const actionIndex = source.indexOf('${toolbarAction && html`');
  const dockIndex = source.indexOf('${onToggleDock && html`', actionIndex);
  expect(actionIndex).toBeGreaterThan(-1);
  expect(dockIndex).toBeGreaterThan(actionIndex);
  expect(source.slice(actionIndex, dockIndex)).toContain('tab-strip-toolbar-action');
});

test('getStandaloneTabUrl still resolves standalone viewer routes for non-addon files', () => {
  expect(getStandaloneTabUrl('/workspace/report.docx', { hasPopOutTab: true })).toBe(
    '/office-viewer/?url=' + encodeURIComponent('/workspace/raw?path=%2Fworkspace%2Freport.docx') + '&name=report.docx',
  );
  expect(getStandaloneTabUrl('/workspace/chart.csv', { hasPopOutTab: true })).toBe('/data-viewer/?path=%2Fworkspace%2Fchart.csv');
  expect(getStandaloneTabUrl('/workspace/manual.pdf', { hasPopOutTab: true })).toBe('/workspace/raw?path=%2Fworkspace%2Fmanual.pdf');
  expect(getStandaloneTabUrl('/workspace/image.png', { hasPopOutTab: true })).toBe('/image-viewer/?path=%2Fworkspace%2Fimage.png');
});
