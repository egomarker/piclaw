import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const appCss = readFileSync(join(import.meta.dir, '../../web/src/styles/app.css'), 'utf8');
const classicEditorCss = readFileSync(join(import.meta.dir, '../../web/static/classic/css/editor.css'), 'utf8');
const classicWorkspaceCss = readFileSync(join(import.meta.dir, '../../web/static/classic/css/workspace.css'), 'utf8');
const mobileCss = readFileSync(join(import.meta.dir, '../../web/static/mobile/css/mobile-interface.css'), 'utf8');
const visualEditorCss = readFileSync(join(import.meta.dir, '../../web/static/visual/css/editor.css'), 'utf8');
const visualWorkspaceCss = readFileSync(join(import.meta.dir, '../../web/static/visual/css/workspace.css'), 'utf8');

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

test('Mobile keeps reply avatars compact while pane tabs are open', () => {
  const replySelector = '.app-shell.mobile-interface.editor-open > .container .post.thread-reply .post-avatar';
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface\.editor-open > \.container \.post\.thread-reply \.post-avatar \{[^}]*width: 28px;[^}]*height: 28px;[^}]*min-width: 28px;[^}]*min-height: 28px;[^}]*flex: 0 0 28px;[^}]*font-size: 0\.65rem;/s);
  expect(mobileCss.indexOf(replySelector)).toBeGreaterThan(mobileCss.indexOf('@media (min-width: 1024px)'));
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

test('Only Mobile differentiates comfortable Workspace tab and explorer rail sizing', () => {
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface > \.workspace-sidebar\[data-workspace-scale="comfortable"\] \{\s*--workspace-row-height: 30px;\s*--workspace-tree-font-size: 14px;/);
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface\.mobile-workspace-active > \.workspace-sidebar\[data-workspace-scale="comfortable"\] \{\s*--workspace-row-height: 44px;\s*--workspace-tree-font-size: 16px;/);
  expect(classicWorkspaceCss).toMatch(/\.workspace-sidebar\[data-workspace-scale="comfortable"\] \{[^}]*--workspace-tree-font-size: 13px;[^}]*--workspace-row-height: 28px;/s);
  expect(visualWorkspaceCss).toMatch(/\.workspace-sidebar\[data-workspace-scale="comfortable"\] \{[^}]*--workspace-tree-font-size: 13px;[^}]*--workspace-row-height: 28px;/s);
  expect(classicWorkspaceCss).not.toContain('--workspace-row-height: 44px');
  expect(visualWorkspaceCss).not.toContain('--workspace-row-height: 44px');
  expect(classicWorkspaceCss).not.toMatch(/--workspace-tree-font-size: (?:14|16)px/);
  expect(visualWorkspaceCss).not.toMatch(/--workspace-tree-font-size: (?:14|16)px/);
});

test('Mobile uses a full Workspace tab surface and insets tree content without moving its scrollbar', () => {
  expect(mobileCss).toContain('@media (max-width: 1023.98px), (orientation: portrait)');
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface\.mobile-workspace-active > \.workspace-sidebar \{[^}]*display: flex;[^}]*grid-row: 2;[^}]*width: 100%;/s);
  expect(mobileCss).not.toMatch(/\.app-shell\.mobile-interface\.mobile-workspace-active > \.workspace-sidebar \{[^}]*margin-(?:top|right):/s);
  expect(classicWorkspaceCss).toMatch(/\.workspace-tree \{[^}]*overflow: auto;/s);
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface\.mobile-workspace-active > \.workspace-sidebar > \.workspace-tree \{\s*padding-right: 16px;/);
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface > \.workspace-sidebar \{\s*display: none;/);
});

test('Mobile compose terminal control mirrors the active terminal tab-strip state', () => {
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface \.compose-terminal-dock-toggle\.active \{\s*color: var\(--accent-color\);/);
});

test('Attach to Chat toolbar states remain scoped to Mobile', () => {
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface \.tab-strip-attach-to-chat\.active \{\s*color: var\(--accent-color\);/);
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface \.tab-strip-attach-to-chat:disabled \{[^}]*cursor: default;[^}]*opacity: 0\.58;/s);
  expect(classicEditorCss).not.toContain('tab-strip-attach-to-chat');
});

test('Chat session context-menu sizing and touch targets remain scoped to Mobile', () => {
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface \.tab-context-menu\.custom-tab-context-menu \{[^}]*width: min\(340px, calc\(100vw - 16px\)\);[^}]*max-height: min\(420px, calc\(100vh - 16px\)\);[^}]*overflow-y: auto;/s);
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface \.chat-session-menu-item \{[^}]*display: flex;[^}]*min-height: 44px;/s);
  expect(classicEditorCss).not.toContain('chat-session-menu');
  expect(visualEditorCss).not.toContain('chat-session-menu');
});

test('Mobile suppresses native tab callouts without changing Classic or Visual tabs', () => {
  expect(mobileCss).toMatch(/\.app-shell\.mobile-interface \.tab-item \{\s*-webkit-touch-callout: none;/);
  expect(classicEditorCss).not.toContain('-webkit-touch-callout');
  expect(visualEditorCss).not.toContain('-webkit-touch-callout');
});

test('Mobile reveals enlarged tab close targets only for coarse touch-only input', () => {
  const hiddenCloseRule = /\.tab-close \{[^}]*width: 22px;[^}]*height: 22px;[^}]*min-width: 22px;[^}]*min-height: 22px;[^}]*opacity: 0;[^}]*pointer-events: none;/s;
  expect(classicEditorCss).toMatch(hiddenCloseRule);
  expect(visualEditorCss).toMatch(hiddenCloseRule);
  expect(mobileCss).toMatch(/@media \(pointer: coarse\) and \(not \(any-pointer: fine\)\) \{\s*\.app-shell\.mobile-interface \.tab-close \{[^}]*width: 30px;[^}]*height: 30px;[^}]*min-width: 30px;[^}]*min-height: 30px;[^}]*opacity: 1;[^}]*pointer-events: auto;/s);
  expect(mobileCss).not.toMatch(/\.tab-close > svg[^}]*width:/s);
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
