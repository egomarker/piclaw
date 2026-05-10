import { expect, test } from 'bun:test';

import { getStandaloneTabUrl } from '../../web/src/components/tab-strip.js';
import { paneRegistry } from '../../web/src/panes/pane-registry.js';
import { TERMINAL_TAB_PATH, terminalTabPaneExtension } from '../../web/src/panes/terminal-pane.js';
// videoViewerPaneExtension → @rcarmo/piclaw-addon-web-viewer
// mindmapPaneExtension moved to @rcarmo/piclaw-addon-mindmap — removed from core contract test

const GENERIC_POPOUT_ONLY_CASES = [
  {
    path: TERMINAL_TAB_PATH,
    expectedPaneId: 'terminal-tab',
    description: 'terminal tabs stay on the shared pane-popout path',
  },
] as const;

for (const extension of [terminalTabPaneExtension]) {
  paneRegistry.register(extension);
}

test('generic-popout-only panes resolve explicit pane contracts', () => {
  const resolved = GENERIC_POPOUT_ONLY_CASES.map((entry) => ({
    path: entry.path,
    description: entry.description,
    paneId: paneRegistry.resolve({ path: entry.path, mode: 'edit' })?.id ?? null,
    standaloneUrl: getStandaloneTabUrl(entry.path, { hasPopOutTab: true }),
  }));

  expect(resolved).toEqual([
    {
      path: 'piclaw://terminal',
      description: 'terminal tabs stay on the shared pane-popout path',
      paneId: 'terminal-tab',
      standaloneUrl: null,
    },
  ]);
});
