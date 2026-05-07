import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { buildFloatingWidgetBackdropClassName, buildFloatingWidgetPaneClassName } from '../../web/src/components/floating-widget-pane.ts';

const overlaysCss = readFileSync(path.join(import.meta.dir, '../../web/static/css/overlays.css'), 'utf8');

test('floating widget overlay includes a narrow-layout breakpoint', () => {
  expect(overlaysCss).toContain('@media (max-width: 820px)');
  expect(overlaysCss).toContain('.floating-widget-backdrop');
  expect(overlaysCss).toContain('.floating-widget-pane');
  expect(overlaysCss).toContain('.floating-widget-header');
  expect(overlaysCss).toContain('.floating-widget-close');
  expect(overlaysCss).toContain('.floating-widget-backdrop.maximized');
  expect(overlaysCss).toContain('.floating-widget-pane.maximized');
});

test('floating widget pane exposes maximized overlay classes', () => {
  expect(buildFloatingWidgetBackdropClassName(false)).toBe('floating-widget-backdrop');
  expect(buildFloatingWidgetBackdropClassName(true)).toBe('floating-widget-backdrop maximized');
  expect(buildFloatingWidgetPaneClassName(false)).toBe('floating-widget-pane');
  expect(buildFloatingWidgetPaneClassName(true)).toBe('floating-widget-pane maximized');
});
