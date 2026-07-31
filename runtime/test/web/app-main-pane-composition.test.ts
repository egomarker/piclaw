import { expect, mock, test } from 'bun:test';

import {
  buildMainAppPaneCompositionResult,
  resolveMainPaneSurfaceVisibility,
  runMainAppZenToggle,
} from '../../web/src/ui/app-main-pane-composition.js';

test('Mobile exposes the pane surface only when a pane or popout is active', () => {
  expect(resolveMainPaneSurfaceVisibility({
    uiMode: 'mobile',
    panePopoutMode: false,
    mobileChatActive: true,
  })).toBe(false);
  expect(resolveMainPaneSurfaceVisibility({
    uiMode: 'mobile',
    panePopoutMode: false,
    mobileChatActive: false,
  })).toBe(true);
  expect(resolveMainPaneSurfaceVisibility({
    uiMode: 'mobile',
    panePopoutMode: false,
    mobileChatActive: false,
    mobileWorkspaceActive: true,
  })).toBe(false);
  expect(resolveMainPaneSurfaceVisibility({
    uiMode: 'mobile',
    panePopoutMode: true,
    mobileChatActive: true,
    mobileWorkspaceActive: true,
  })).toBe(true);
  expect(resolveMainPaneSurfaceVisibility({
    uiMode: 'classic',
    panePopoutMode: false,
    mobileChatActive: true,
  })).toBe(true);
});

test('Mobile Zen switches to Chat on entry and leaves Chat selected on exit', () => {
  const calls: string[] = [];
  const activateChatSurface = mock(() => { calls.push('chat'); });
  const toggleZenMode = mock(() => { calls.push('toggle'); });

  runMainAppZenToggle({
    uiMode: 'mobile',
    zenMode: false,
    activateChatSurface,
    toggleZenMode,
  });
  expect(calls).toEqual(['chat', 'toggle']);

  calls.length = 0;
  runMainAppZenToggle({
    uiMode: 'mobile',
    zenMode: true,
    activateChatSurface,
    toggleZenMode,
  });
  expect(calls).toEqual(['toggle']);
});

test('Classic Zen does not alter the active surface', () => {
  const activateChatSurface = mock(() => {});
  const toggleZenMode = mock(() => {});
  runMainAppZenToggle({
    uiMode: 'classic',
    zenMode: false,
    activateChatSurface,
    toggleZenMode,
  });
  expect(activateChatSurface).not.toHaveBeenCalled();
  expect(toggleZenMode).toHaveBeenCalledTimes(1);
});

test('buildMainAppPaneCompositionResult preserves grouped editor/pane composition outputs', () => {
  const removeFileRefRef = { current: null };
  const editorState = { openEditor: () => {}, handleTabClose: () => {} };
  const paneRuntime = { openTerminalTab: () => {}, dockVisible: true };

  const result = buildMainAppPaneCompositionResult({
    removeFileRefRef,
    editorState,
    paneRuntime,
  });

  expect(result.removeFileRefRef).toBe(removeFileRefRef);
  expect(result.editorState).toBe(editorState);
  expect(result.paneRuntime).toBe(paneRuntime);
});
