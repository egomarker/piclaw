import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function cssRuleBody(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  return match?.[1] || '';
}

test('editor caret is accent-colored and visibly wider than the default CodeMirror cursor', () => {
  const editorCss = readFileSync(join(import.meta.dir, '../../web/static/classic/css/editor.css'), 'utf8');
  const content = cssRuleBody(editorCss, '.editor-codemirror .cm-content');
  const cursor = cssRuleBody(editorCss, '.editor-codemirror .cm-cursor,\n.editor-codemirror .cm-dropCursor');

  expect(content).toContain('caret-color: var(--accent-color);');
  expect(cursor).toContain('border-left: 2px solid var(--accent-color) !important;');
  expect(cursor).toContain('margin-left: -1px;');
  expect(cursor).toContain('box-shadow:');
  expect(cursor).toContain('color-mix(in srgb, var(--accent-color) 55%, transparent)');
});
