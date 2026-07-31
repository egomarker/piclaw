import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const appCss = readFileSync(join(import.meta.dir, '../../web/src/styles/app.css'), 'utf8');
const classicEditorCss = readFileSync(join(import.meta.dir, '../../web/static/classic/css/editor.css'), 'utf8');
const classicWorkspaceCss = readFileSync(join(import.meta.dir, '../../web/static/classic/css/workspace.css'), 'utf8');
const mobileCss = readFileSync(join(import.meta.dir, '../../web/static/mobile/css/mobile-interface.css'), 'utf8');

test('authenticated styles load the isolated Mobile layout last', () => {
  expect(appCss.trimEnd().endsWith('@import "../../static/mobile/css/mobile-interface.css";')).toBe(true);
  expect(mobileCss).not.toMatch(/^\.app-shell(?!\.mobile-interface)/m);
});

test('Mobile gives collapsed-explorer Chat the full content track', () => {
  expect(classicEditorCss).toContain('.app-shell.workspace-collapsed:not(.editor-open):not(.chat-only):not(.pane-popout)');
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface\.workspace-collapsed:not\(\.editor-open\):not\(\.chat-only\):not\(\.pane-popout\) > \.container \{[^}]*width: 100%;[^}]*justify-self: stretch;/s);
});

test('Mobile keeps Chat typography stable while pane tabs remain open', () => {
  expect(classicWorkspaceCss).toMatch(/\.app-shell\.editor-open > \.container \.post-content \{\s*font-size: inherit;/);
  expect(classicWorkspaceCss).toMatch(/\.app-shell\.editor-open > \.container \.agent-status \{\s*font-size: inherit;/);
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface\.editor-open > \.container \.post-content \{\s*font-size: var\(--chat-content-font-size\);/);
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface\.editor-open > \.container \.agent-status \{\s*font-size: var\(--font-size-sm\);/);
});

test('Mobile hides Chat chrome without suppressing global dialogs and widgets', () => {
  expect(classicEditorCss).toMatch(/\.chat-surface-main,\s*\n\.chat-surface-footer \{\s*\n\s*display: contents;/);
  expect(mobileCss).toContain('.app-shell.mobile-interface.mobile-pane-active > .container > .chat-surface-main');
  expect(mobileCss).toContain('> :not(.chat-surface-main):not(.chat-surface-footer)');
  expect(mobileCss).toContain('pointer-events: auto');
});

test('Mobile CSS overlays continuously mounted Chat, Workspace, pane, preview, and dock rows', () => {
  expect(mobileCss).toContain('grid-template-rows: auto minmax(0, 1fr) auto auto auto auto');
  expect(mobileCss).toContain('.app-shell.mobile-interface.mobile-pane-active > .container');
  expect(mobileCss).toContain('.app-shell.mobile-interface.mobile-workspace-active > .container');
  expect(mobileCss).toContain('.app-shell.mobile-interface.mobile-chat-active > .editor-pane-container > .editor-pane-host');
  expect(mobileCss).toContain('.app-shell.mobile-interface.mobile-workspace-active > .editor-pane-container > .editor-pane-host');
  expect(mobileCss).toContain('> .editor-pane-container > .dock-panel');
  expect(mobileCss).toContain('grid-row: 6');
});

test('Mobile uses a full Workspace tab surface except at desktop-width landscape', () => {
  expect(mobileCss).toContain('@media (max-width: 1023.98px), (orientation: portrait)');
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface\.mobile-workspace-active > \.workspace-sidebar \{[^}]*display: flex;[^}]*grid-row: 2;[^}]*width: 100%;/s);
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface > \.workspace-sidebar \{\s*display: none;/);
});

test('Mobile applies the standalone bottom inset to every grid surface without double-insetting Chat', () => {
  expect(classicEditorCss).toMatch(/html\[data-iphone-standalone-compose-inset="1"\] \.container \{\s*padding-bottom: var\(--iphone-standalone-compose-safe-area-bottom, 0px\);/);
  expect(mobileCss).toMatch(/html\[data-iphone-standalone-compose-inset="1"\] \.app-shell\.mobile-interface \{\s*padding-bottom: var\(--iphone-standalone-compose-safe-area-bottom, 0px\);/);
  expect(mobileCss).toMatch(/html\[data-iphone-standalone-compose-inset="1"\] \.app-shell\.mobile-interface > \.container \{\s*padding-bottom: 0;/);
});

test('Mobile Zen is Chat-only and the phone strip reserves the menu hit target', () => {
  expect(mobileCss).toContain('.app-shell.mobile-interface.zen-mode > .container');
  expect(mobileCss).toContain('display: flex !important');
  expect(mobileCss).toContain('.app-shell.mobile-interface.zen-mode > .editor-pane-container > .tab-strip');
  expect(mobileCss).toContain('padding-left: max(44px');
});
