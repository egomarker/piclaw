import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function cssRuleBody(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  return match?.[1] || '';
}

test('post highlights inherit foreground color so dark-mode text remains readable', () => {
  const overlaysCss = readFileSync(join(import.meta.dir, '../../web/static/classic/css/overlays.css'), 'utf8');
  const highlight = cssRuleBody(overlaysCss, 'mark.post-highlight');

  expect(highlight).toContain('color: inherit;');
  expect(highlight).toContain('border-radius: 2px;');
  expect(highlight).toContain('padding: 0 1px;');
});
