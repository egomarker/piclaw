import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function cssRuleBody(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  return match?.[1] || '';
}

function zIndexFor(css: string, selector: string): number {
  const body = cssRuleBody(css, selector);
  const match = body.match(/z-index:\s*(-?\d+)/);
  return match ? Number(match[1]) : Number.NaN;
}

test('settings overlay stays above workspace/editor chrome and transient menus', () => {
  const settingsCss = readFileSync(join(import.meta.dir, '../../web/static/css/settings.css'), 'utf8');
  const editorCss = readFileSync(join(import.meta.dir, '../../web/static/css/editor.css'), 'utf8');
  const workspaceCss = readFileSync(join(import.meta.dir, '../../web/static/css/workspace.css'), 'utf8');

  const settingsPortalZ = zIndexFor(settingsCss, '.settings-portal');
  const settingsBackdropZ = zIndexFor(settingsCss, '.settings-dialog-backdrop');
  const settingsLoaderZ = zIndexFor(settingsCss, '.settings-dialog-backdrop-loader');
  const editorTabMenuZ = zIndexFor(editorCss, '.tab-context-menu');
  const workspaceDragGhostZ = zIndexFor(workspaceCss, '.workspace-drag-ghost');

  expect(settingsPortalZ).toBeGreaterThan(editorTabMenuZ);
  expect(settingsPortalZ).toBeGreaterThan(workspaceDragGhostZ);
  expect(settingsBackdropZ).toBe(settingsPortalZ);
  expect(settingsBackdropZ).toBeGreaterThan(editorTabMenuZ);
  expect(settingsBackdropZ).toBeGreaterThan(workspaceDragGhostZ);
  expect(settingsLoaderZ).toBe(settingsPortalZ - 1);
});

test('settings status bar is height-capped so long add-on errors cannot cover the dialog', () => {
  const settingsCss = readFileSync(join(import.meta.dir, '../../web/static/css/settings.css'), 'utf8');
  const body = cssRuleBody(settingsCss, '.settings-status-bar');

  expect(body).toContain('max-height: min(18vh, 160px);');
  expect(body).toContain('overflow: auto;');
  expect(body).toContain('overflow-wrap: anywhere;');
});

test('add-on busy indicator sticks to the visible add-on list viewport', () => {
  const settingsCss = readFileSync(join(import.meta.dir, '../../web/static/css/settings.css'), 'utf8');
  const overlay = cssRuleBody(settingsCss, '.settings-addon-panel-overlay');
  const card = cssRuleBody(settingsCss, '.settings-addon-panel-overlay-card');
  const source = readFileSync(join(import.meta.dir, '../../web/src/components/settings/addons.ts'), 'utf8');

  expect(overlay).toContain('position: sticky;');
  expect(overlay).toContain('top: 50%;');
  expect(overlay).toContain('height: 0;');
  expect(card).toContain('transform: translateY(-50%);');
  expect(source.indexOf('<div class="settings-addon-list">')).toBeLessThan(source.indexOf('class="settings-addon-panel-overlay"'));
});
