import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

import {
  installStandaloneMobileViewportFix,
  readViewportHeight,
  shouldUseStandaloneMobileViewportFix,
  syncStandaloneMobileViewport,
} from '../../web/src/ui/mobile-viewport.js';

test('shouldUseStandaloneMobileViewportFix only enables for standalone mobile runtimes', () => {
  expect(shouldUseStandaloneMobileViewportFix({
    navigator: {
      standalone: true,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',
      maxTouchPoints: 5,
    },
    window: {
      matchMedia: () => ({ matches: true }),
    },
  })).toBe(true);

  expect(shouldUseStandaloneMobileViewportFix({
    navigator: {
      standalone: false,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)',
      maxTouchPoints: 0,
    },
    window: {
      matchMedia: () => ({ matches: false }),
    },
  })).toBe(false);
});

test('index bootstraps standalone app height before loading bundled CSS', () => {
  const html = readFileSync(new URL('../../web/static/index.html', import.meta.url), 'utf8');
  const bootstrapIndex = html.indexOf('iOS standalone PWA guard: set --app-height before CSS loads');
  const cssIndex = html.indexOf('rel="stylesheet" href="/static/dist/app.bundle.css');
  expect(bootstrapIndex).toBeGreaterThan(0);
  expect(cssIndex).toBeGreaterThan(bootstrapIndex);
  expect(html).toContain("document.documentElement.style.setProperty('--app-height', '100vh')");
});

test('readViewportHeight prefers visualViewport height when available', () => {
  expect(readViewportHeight({
    window: {
      visualViewport: { height: 612.4 },
      innerHeight: 900,
    },
  })).toBe(612);

  expect(readViewportHeight({
    window: {
      innerHeight: 844,
    },
  })).toBe(844);
});

test('syncStandaloneMobileViewport uses standalone 100vh instead of short visual viewport gaps when keyboard is closed', () => {
  const cssVars = new Map<string, string>();
  const documentElement = {
    style: {
      setProperty: (name: string, value: string) => cssVars.set(name, value),
    },
  };

  const height = syncStandaloneMobileViewport({
    navigator: {
      standalone: true,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',
      maxTouchPoints: 5,
    },
    window: {
      matchMedia: () => ({ matches: true }),
      visualViewport: { height: 741 },
      innerHeight: 800,
    },
    document: {
      documentElement,
    },
  });

  expect(height).toBe(800);
  expect(cssVars.get('--app-height')).toBe('100vh');
});

test('syncStandaloneMobileViewport does not persist false short standalone viewport measurements when keyboard is closed', () => {
  const cssVars = new Map<string, string>();
  const documentElement = {
    style: {
      setProperty: (name: string, value: string) => cssVars.set(name, value),
    },
  };

  const height = syncStandaloneMobileViewport({
    navigator: {
      standalone: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      maxTouchPoints: 5,
    },
    window: {
      matchMedia: () => ({ matches: true }),
      visualViewport: { height: 701.9 },
      innerHeight: 812,
    },
    document: {
      documentElement,
      activeElement: null,
    },
  });

  expect(height).toBe(812);
  expect(cssVars.get('--app-height')).toBe('100vh');
});

test('syncStandaloneMobileViewport keeps large visual viewport shrink for virtual keyboard', () => {
  const cssVars = new Map<string, string>();
  const documentElement = {
    style: {
      setProperty: (name: string, value: string) => cssVars.set(name, value),
    },
  };

  const height = syncStandaloneMobileViewport({
    navigator: {
      standalone: true,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',
      maxTouchPoints: 5,
    },
    window: {
      matchMedia: () => ({ matches: true }),
      visualViewport: { height: 430 },
      innerHeight: 800,
    },
    document: {
      documentElement,
      activeElement: { tagName: 'TEXTAREA', type: 'textarea' },
    },
  });

  expect(height).toBe(430);
  expect(cssVars.get('--app-height')).toBe('430px');
});

test('syncStandaloneMobileViewport writes app height without resetting page scroll by default', () => {
  const cssVars = new Map<string, string>();
  const windowScrolls: Array<[number, number]> = [];
  const scrollingElement = { scrollTop: 91, scrollLeft: 17 };
  const documentElement = {
    scrollTop: 33,
    scrollLeft: 8,
    style: {
      setProperty: (name: string, value: string) => cssVars.set(name, value),
    },
  };
  const body = { scrollTop: 19, scrollLeft: 7 };

  const height = syncStandaloneMobileViewport({
    navigator: {
      standalone: true,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',
      maxTouchPoints: 5,
    },
    window: {
      matchMedia: () => ({ matches: true }),
      visualViewport: { height: 701.9 },
      innerHeight: 900,
      scrollTo: (x: number, y: number) => windowScrolls.push([x, y]),
    },
    document: {
      documentElement,
      body,
      scrollingElement,
    },
  });

  expect(height).toBe(900);
  expect(cssVars.get('--app-height')).toBe('100vh');
  expect(windowScrolls).toEqual([]);
  expect(scrollingElement.scrollTop).toBe(91);
  expect(scrollingElement.scrollLeft).toBe(17);
  expect(documentElement.scrollTop).toBe(33);
  expect(documentElement.scrollLeft).toBe(8);
  expect(body.scrollTop).toBe(19);
  expect(body.scrollLeft).toBe(7);
});

test('syncStandaloneMobileViewport can reset page scroll when explicitly requested', () => {
  const cssVars = new Map<string, string>();
  const windowScrolls: Array<[number, number]> = [];
  const scrollingElement = { scrollTop: 91, scrollLeft: 17 };
  const documentElement = {
    scrollTop: 33,
    scrollLeft: 8,
    style: {
      setProperty: (name: string, value: string) => cssVars.set(name, value),
    },
  };
  const body = { scrollTop: 19, scrollLeft: 7 };

  const height = syncStandaloneMobileViewport({
    navigator: {
      standalone: true,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',
      maxTouchPoints: 5,
    },
    window: {
      matchMedia: () => ({ matches: true }),
      visualViewport: { height: 701.9 },
      innerHeight: 900,
      scrollTo: (x: number, y: number) => windowScrolls.push([x, y]),
    },
    document: {
      documentElement,
      body,
      scrollingElement,
    },
  }, { resetScroll: true });

  expect(height).toBe(900);
  expect(cssVars.get('--app-height')).toBe('100vh');
  expect(windowScrolls).toEqual([[0, 0]]);
  expect(scrollingElement.scrollTop).toBe(0);
  expect(scrollingElement.scrollLeft).toBe(0);
  expect(documentElement.scrollTop).toBe(0);
  expect(documentElement.scrollLeft).toBe(0);
  expect(body.scrollTop).toBe(0);
  expect(body.scrollLeft).toBe(0);
});

test('installStandaloneMobileViewportFix restores standalone 100vh on focusout after keyboard sizing', () => {
  const cssVars = new Map<string, string>();
  const listeners = new Map<string, Set<Function>>();
  const addEventListener = (type: string, listener: Function) => {
    const set = listeners.get(type) ?? new Set<Function>();
    set.add(listener);
    listeners.set(type, set);
  };
  const removeEventListener = (type: string, listener: Function) => {
    listeners.get(type)?.delete(listener);
  };
  const dispatch = (type: string) => {
    for (const listener of listeners.get(type) ?? []) listener();
  };
  const documentElement = {
    style: {
      setProperty: (name: string, value: string) => cssVars.set(name, value),
    },
  };
  const document = {
    documentElement,
    activeElement: { tagName: 'TEXTAREA', type: 'textarea' } as any,
    addEventListener,
    removeEventListener,
  };
  const timeoutCallbacks: Function[] = [];
  const window = {
    matchMedia: () => ({ matches: true }),
    visualViewport: { height: 430, addEventListener, removeEventListener },
    innerHeight: 800,
    addEventListener,
    removeEventListener,
    requestAnimationFrame: (callback: Function) => {
      callback();
      return 1;
    },
    cancelAnimationFrame: () => {},
    setTimeout: (callback: Function) => {
      timeoutCallbacks.push(callback);
      return timeoutCallbacks.length;
    },
    clearTimeout: () => {},
  };

  const dispose = installStandaloneMobileViewportFix({
    navigator: {
      standalone: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      maxTouchPoints: 5,
    },
    window,
    document,
  });

  expect(cssVars.get('--app-height')).toBe('430px');

  document.activeElement = null;
  dispatch('focusout');

  expect(cssVars.get('--app-height')).toBe('100vh');

  dispose();
});
