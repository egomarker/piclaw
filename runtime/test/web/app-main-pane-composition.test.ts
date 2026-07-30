import { expect, mock, test } from 'bun:test';

import {
  buildMainAppPaneCompositionResult,
  runMainAppZenToggle,
} from '../../web/src/ui/app-main-pane-composition.js';

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
