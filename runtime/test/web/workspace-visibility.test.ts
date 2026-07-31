import { afterEach, describe, expect, test } from 'bun:test';

import {
  DESKTOP_WORKSPACE_OPEN_STORAGE_KEY,
  LEGACY_WORKSPACE_OPEN_STORAGE_KEY,
  NARROW_WORKSPACE_OPEN_STORAGE_KEY,
  persistWorkspaceOpenPreference,
  readStoredWorkspaceOpenPreference,
  resolveWorkspaceLayoutBucket,
  resolveWorkspaceOpenAfterLayoutChange,
} from '../../web/src/ui/workspace-visibility.js';

const originalWindow = (globalThis as any).window;

function createRuntime(options: {
  matchesDesktop?: boolean;
  width?: number;
  height?: number;
  storage?: Record<string, string>;
} = {}) {
  const storage = new Map(Object.entries(options.storage || {}));
  return {
    localStorage: {
      getItem: (key: string) => storage.has(key) ? storage.get(key) ?? null : null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
    },
    matchMedia: () => ({
      matches: options.matchesDesktop ?? (
        Number(options.width) >= 1024 && Number(options.width) > Number(options.height)
      ),
    }),
    __storage: storage,
  } as any;
}

afterEach(() => {
  (globalThis as any).window = originalWindow;
});

describe('workspace visibility preferences', () => {
  test('resolves layout buckets from the desktop landscape media query', () => {
    expect(resolveWorkspaceLayoutBucket(createRuntime({ matchesDesktop: true }))).toBe('desktop');
    expect(resolveWorkspaceLayoutBucket(createRuntime({ matchesDesktop: false }))).toBe('narrow');
    expect(resolveWorkspaceLayoutBucket(null)).toBe('desktop');
  });

  test('uses the compact Workspace tab for the required portrait matrix and the rail for desktop landscape', () => {
    const viewports = [
      { width: 768, height: 1024, expected: 'narrow' },
      { width: 1024, height: 1366, expected: 'narrow' },
      { width: 1200, height: 1600, expected: 'narrow' },
      { width: 1024, height: 800, expected: 'desktop' },
      { width: 1440, height: 900, expected: 'desktop' },
    ] as const;

    for (const viewport of viewports) {
      expect(resolveWorkspaceLayoutBucket(createRuntime(viewport))).toBe(viewport.expected);
    }
  });

  test('persists workspace visibility separately for desktop and narrow layouts', () => {
    const desktopRuntime = createRuntime({ matchesDesktop: true });
    const narrowRuntime = createRuntime({ matchesDesktop: false });

    persistWorkspaceOpenPreference(true, { runtime: desktopRuntime, bucket: 'desktop' });
    persistWorkspaceOpenPreference(false, { runtime: narrowRuntime, bucket: 'narrow' });

    expect(desktopRuntime.__storage.get(DESKTOP_WORKSPACE_OPEN_STORAGE_KEY)).toBe('true');
    expect(narrowRuntime.__storage.get(NARROW_WORKSPACE_OPEN_STORAGE_KEY)).toBe('false');
  });

  test('desktop initial load can inherit the legacy preference, but narrow stays collapsed by default', () => {
    const desktopRuntime = createRuntime({
      matchesDesktop: true,
      storage: { [LEGACY_WORKSPACE_OPEN_STORAGE_KEY]: 'true' },
    });
    const narrowRuntime = createRuntime({
      matchesDesktop: false,
      storage: { [LEGACY_WORKSPACE_OPEN_STORAGE_KEY]: 'true' },
    });

    expect(readStoredWorkspaceOpenPreference({
      runtime: desktopRuntime,
      allowLegacyFallback: true,
      defaultValue: false,
    })).toBe(true);

    expect(readStoredWorkspaceOpenPreference({
      runtime: narrowRuntime,
      allowLegacyFallback: true,
      defaultValue: false,
    })).toBe(false);
  });

  test('layout transitions collapse narrow and restore the saved desktop rail preference', () => {
    const runtime = createRuntime({
      matchesDesktop: false,
      storage: {
        [DESKTOP_WORKSPACE_OPEN_STORAGE_KEY]: 'true',
        [NARROW_WORKSPACE_OPEN_STORAGE_KEY]: 'false',
      },
    });

    expect(resolveWorkspaceOpenAfterLayoutChange({
      previousBucket: 'desktop',
      nextBucket: 'narrow',
      currentValue: true,
      runtime,
    })).toBe(false);
    expect(resolveWorkspaceOpenAfterLayoutChange({
      previousBucket: 'narrow',
      nextBucket: 'desktop',
      currentValue: false,
      restoreDesktopPreference: true,
      runtime,
    })).toBe(true);
    expect(resolveWorkspaceOpenAfterLayoutChange({
      previousBucket: 'narrow',
      nextBucket: 'desktop',
      currentValue: false,
      restoreDesktopPreference: false,
      runtime,
    })).toBe(false);
    expect(resolveWorkspaceOpenAfterLayoutChange({
      previousBucket: 'desktop',
      nextBucket: 'desktop',
      currentValue: false,
      runtime,
    })).toBe(false);
  });

  test('layout-specific keys override legacy values and stay isolated across layouts', () => {
    const runtime = createRuntime({
      matchesDesktop: false,
      storage: {
        [LEGACY_WORKSPACE_OPEN_STORAGE_KEY]: 'true',
        [DESKTOP_WORKSPACE_OPEN_STORAGE_KEY]: 'true',
        [NARROW_WORKSPACE_OPEN_STORAGE_KEY]: 'false',
      },
    });

    expect(readStoredWorkspaceOpenPreference({
      runtime,
      bucket: 'desktop',
      allowLegacyFallback: true,
      defaultValue: false,
    })).toBe(true);

    expect(readStoredWorkspaceOpenPreference({
      runtime,
      bucket: 'narrow',
      allowLegacyFallback: true,
      defaultValue: false,
    })).toBe(false);
  });
});
