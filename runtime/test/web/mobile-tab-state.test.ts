import { expect, test } from 'bun:test';

import {
  MOBILE_CHAT_TAB_ID,
  MOBILE_WORKSPACE_TAB_ID,
  composeMobileTabStripTabs,
  resolveMobileSurfaceAfterClose,
  resolveSurfaceAfterWorkspaceTabDisabled,
} from '../../web/src/ui/mobile-tab-state.js';

function tab(id: string) {
  return {
    id,
    label: id,
    path: id,
    dirty: false,
    pinned: false,
  };
}

test('Mobile keeps Chat conditional in wide mode and adds permanent Chat and Workspace tabs in narrow mode', () => {
  const empty: ReturnType<typeof tab>[] = [];
  expect(composeMobileTabStripTabs(empty, true)).toBe(empty);
  expect(composeMobileTabStripTabs(empty, true, true).map((item) => item.id)).toEqual([
    MOBILE_CHAT_TAB_ID,
    MOBILE_WORKSPACE_TAB_ID,
  ]);

  const panes = [tab('one'), tab('two')];
  const wideTabs = composeMobileTabStripTabs(panes, true);
  expect(wideTabs.map((item) => item.id)).toEqual([MOBILE_CHAT_TAB_ID, 'one', 'two']);

  const narrowTabs = composeMobileTabStripTabs(panes, true, true);
  expect(narrowTabs.map((item) => item.id)).toEqual([
    MOBILE_CHAT_TAB_ID,
    MOBILE_WORKSPACE_TAB_ID,
    'one',
    'two',
  ]);
  expect(narrowTabs.slice(0, 2)).toEqual([
    expect.objectContaining({ label: 'Chat', closable: false, contextMenu: false }),
    expect.objectContaining({ label: 'Workspace', closable: false, contextMenu: false }),
  ]);
  expect(composeMobileTabStripTabs(panes, false, true)).toBe(panes);
});

test('Mobile close selection follows pane order and falls back to the adjacent permanent surface', () => {
  const panes = [tab('one'), tab('two'), tab('three')];
  expect(resolveMobileSurfaceAfterClose(panes, 'one', true)).toBe('two');
  expect(resolveMobileSurfaceAfterClose(panes, 'two', true)).toBe('three');
  expect(resolveMobileSurfaceAfterClose(panes, 'three', true)).toBe('two');
  expect(resolveMobileSurfaceAfterClose([tab('only')], 'only', true)).toBe(MOBILE_WORKSPACE_TAB_ID);
  expect(resolveMobileSurfaceAfterClose([tab('only')], 'only', false)).toBe(MOBILE_CHAT_TAB_ID);
});

test('rotating an active Workspace tab into wide mode restores the last valid primary surface and opens the rail', () => {
  const panes = [tab('one'), tab('two')];
  expect(resolveSurfaceAfterWorkspaceTabDisabled(MOBILE_WORKSPACE_TAB_ID, 'two', panes)).toEqual({
    surfaceId: 'two',
    openWorkspaceRail: true,
  });
  expect(resolveSurfaceAfterWorkspaceTabDisabled(MOBILE_WORKSPACE_TAB_ID, 'missing', panes)).toEqual({
    surfaceId: 'one',
    openWorkspaceRail: true,
  });
  expect(resolveSurfaceAfterWorkspaceTabDisabled(MOBILE_WORKSPACE_TAB_ID, MOBILE_CHAT_TAB_ID, panes)).toEqual({
    surfaceId: MOBILE_CHAT_TAB_ID,
    openWorkspaceRail: true,
  });
  expect(resolveSurfaceAfterWorkspaceTabDisabled('one', MOBILE_CHAT_TAB_ID, panes)).toEqual({
    surfaceId: 'one',
    openWorkspaceRail: false,
  });
});
