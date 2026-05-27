import { expect, test } from 'bun:test';

import { isIOSDevice, supportsBottomTerminalDock } from '../../web/src/ui/app-helpers.js';

test('isIOSDevice detects iPhone and iPadOS desktop-class user agents', () => {
  expect(isIOSDevice({
    navigator: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      platform: 'iPhone',
      maxTouchPoints: 0,
    },
  })).toBe(true);

  expect(isIOSDevice({
    navigator: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    },
  })).toBe(true);

  expect(isIOSDevice({
    navigator: {
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel Tablet)',
      platform: 'Linux armv8l',
      maxTouchPoints: 5,
    },
  })).toBe(false);

  expect(isIOSDevice({
    navigator: {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      platform: 'Linux x86_64',
      maxTouchPoints: 0,
    },
  })).toBe(false);
});

test('supportsBottomTerminalDock disables iOS/iPadOS and keeps Android and desktop enabled', () => {
  expect(supportsBottomTerminalDock({
    navigator: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      platform: 'iPhone',
      maxTouchPoints: 0,
    },
  })).toBe(false);

  expect(supportsBottomTerminalDock({
    navigator: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    },
  })).toBe(false);

  expect(supportsBottomTerminalDock({
    navigator: {
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel Tablet)',
      platform: 'Linux armv8l',
      maxTouchPoints: 5,
    },
  })).toBe(true);

  expect(supportsBottomTerminalDock({
    navigator: {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      platform: 'Linux x86_64',
      maxTouchPoints: 0,
    },
  })).toBe(true);
});
