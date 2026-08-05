import { expect, test } from 'bun:test';

import {
  MOBILE_CHAT_PANEL_ID,
  MOBILE_CHAT_TAB_ELEMENT_ID,
  MOBILE_CHAT_TAB_ID,
  MOBILE_PANE_PANEL_ID,
  MOBILE_WORKSPACE_PANEL_ID,
  MOBILE_WORKSPACE_TAB_ELEMENT_ID,
  MOBILE_WORKSPACE_TAB_ID,
  composeMobileTabStripTabs,
  getMobileSurfacePanelId,
  getMobileSurfaceTabElementId,
  resolveMobileAttachToChatAction,
  resolveMobileSurfaceAfterClose,
  resolveSurfaceAfterWorkspaceTabDisabled,
  toggleMobileDocumentChatAttachment,
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

test('Mobile surface accessibility ids are stable and connect tabs to their panel type', () => {
  const panePath = '/workspace/Notes/a b.md';
  const paneTabId = getMobileSurfaceTabElementId(panePath);

  expect(getMobileSurfaceTabElementId(MOBILE_CHAT_TAB_ID)).toBe(MOBILE_CHAT_TAB_ELEMENT_ID);
  expect(getMobileSurfaceTabElementId(MOBILE_WORKSPACE_TAB_ID)).toBe(MOBILE_WORKSPACE_TAB_ELEMENT_ID);
  expect(paneTabId).toBe(getMobileSurfaceTabElementId(panePath));
  expect(paneTabId).toMatch(/^piclaw-mobile-surface-tab-pane-[A-Za-z0-9_]+$/);
  expect(paneTabId).not.toBe(getMobileSurfaceTabElementId('/workspace/Notes/a_b.md'));
  expect(getMobileSurfacePanelId(MOBILE_CHAT_TAB_ID)).toBe(MOBILE_CHAT_PANEL_ID);
  expect(getMobileSurfacePanelId(MOBILE_WORKSPACE_TAB_ID)).toBe(MOBILE_WORKSPACE_PANEL_ID);
  expect(getMobileSurfacePanelId(panePath)).toBe(MOBILE_PANE_PANEL_ID);
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

test('Mobile exposes Attach to Chat only for the selected workspace document', () => {
  const documentTab = {
    ...tab('notes/plan.md'),
    label: 'plan.md',
  };

  expect(resolveMobileAttachToChatAction({
    tabs: [documentTab],
    activeId: documentTab.id,
    fileRefs: [],
  })).toEqual({
    kind: 'available',
    path: 'notes/plan.md',
    label: 'plan.md',
    title: 'Attach plan.md to Chat',
    ariaLabel: 'Attach plan.md to Chat',
    disabled: false,
    pressed: false,
  });

  expect(resolveMobileAttachToChatAction({
    tabs: [{ ...documentTab, dirty: true }],
    activeId: documentTab.id,
    fileRefs: [],
  })).toEqual(expect.objectContaining({
    kind: 'dirty',
    title: 'Save plan.md before attaching to Chat',
    disabled: true,
    pressed: false,
  }));

  expect(resolveMobileAttachToChatAction({
    tabs: [{ ...documentTab, dirty: true }],
    activeId: documentTab.id,
    fileRefs: ['notes/plan.md'],
  })).toEqual(expect.objectContaining({
    kind: 'attached',
    title: 'Detach plan.md from Chat',
    ariaLabel: 'Detach plan.md from Chat',
    disabled: false,
    pressed: true,
  }));
});

test('Mobile hides Attach to Chat for permanent, synthetic, missing, and detached tabs', () => {
  const documentTab = tab('notes/plan.md');
  const hiddenCases = [
    { tabs: [documentTab], activeId: MOBILE_CHAT_TAB_ID },
    { tabs: [documentTab], activeId: MOBILE_WORKSPACE_TAB_ID },
    { tabs: [tab('piclaw://terminal')], activeId: 'piclaw://terminal' },
    { tabs: [tab('piclaw://vnc')], activeId: 'piclaw://vnc' },
    { tabs: [tab('/outside/workspace.md')], activeId: '/outside/workspace.md' },
    { tabs: [documentTab], activeId: 'missing.md' },
    { tabs: [documentTab], activeId: documentTab.id, detachedTabs: new Map([[documentTab.id, {}]]) },
  ];

  for (const options of hiddenCases) {
    expect(resolveMobileAttachToChatAction(options)).toEqual(expect.objectContaining({
      kind: 'hidden',
      path: null,
    }));
  }
});

test('Mobile toggles the selected document attachment without changing surfaces', () => {
  const calls: string[] = [];
  const callbacks = {
    addFileRef: (path: string) => { calls.push(`attach:${path}`); },
    removeFileRef: (path: string) => { calls.push(`detach:${path}`); },
  };

  expect(toggleMobileDocumentChatAttachment({
    path: 'notes/plan.md',
    attached: false,
    ...callbacks,
  })).toBe(true);
  expect(calls).toEqual(['attach:notes/plan.md']);

  calls.length = 0;
  expect(toggleMobileDocumentChatAttachment({
    path: 'notes/plan.md',
    attached: true,
    ...callbacks,
  })).toBe(true);
  expect(calls).toEqual(['detach:notes/plan.md']);

  calls.length = 0;
  expect(toggleMobileDocumentChatAttachment({
    path: 'piclaw://terminal',
    attached: false,
    ...callbacks,
  })).toBe(false);
  expect(calls).toEqual([]);
});
