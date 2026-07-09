import { afterEach, expect, test } from 'bun:test';
import { createTempWorkspace, importFresh, setEnv } from '../helpers.js';

let restoreEnv: (() => void) | null = null;

afterEach(() => {
  restoreEnv?.();
  restoreEnv = null;
});

test('server UI state persists theme, tint, meters, and output padding in global extension KV', async () => {
  const ws = createTempWorkspace('piclaw-ui-state-');
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await importFresh<typeof import('../../src/db.js')>('../../src/db.js', import.meta.url);
  db.initDatabase();
  const uiState = await importFresh<typeof import('../../src/channels/web/ui-state.js')>('../../src/channels/web/ui-state.js', import.meta.url);

  expect(uiState.setServerUiThemeConfig({ theme: 'dracula', tint: '#bd93f9' })).toEqual({
    theme: 'dracula',
    tint: '#bd93f9',
  });
  expect(uiState.setServerUiMetersConfig({ enabled: true, collapsed: true })).toEqual({
    enabled: true,
    collapsed: true,
  });
  expect(uiState.setServerUiOutputConfig({ outputPad: 32 })).toEqual({
    outputPad: 24,
  });

  expect(db.extensionKvGet('piclaw-ui', 'theme', 'global')).toEqual({
    theme: 'dracula',
    tint: '#bd93f9',
  });
  expect(db.extensionKvGet('piclaw-ui', 'meters', 'global')).toEqual({
    enabled: true,
    collapsed: true,
  });
  expect(db.extensionKvGet('piclaw-ui', 'output-pad', 'global')).toEqual({
    outputPad: 24,
  });
  expect(uiState.getServerUiState()).toEqual({
    ui_theme: { theme: 'dracula', tint: '#bd93f9' },
    ui_meters: { enabled: true, collapsed: true },
    ui_output: { outputPad: 24 },
  });

  ws.cleanup();
});
