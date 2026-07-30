import { describe, expect, test } from 'bun:test';

import { RetainedPaneCache } from '../../web/src/panes/retained-pane-cache.js';

function createHost() {
  const attributes = new Map<string, string>();
  let removed = false;
  return {
    host: {
      hidden: false,
      setAttribute(name: string, value: string) {
        attributes.set(name, value);
      },
      removeAttribute(name: string) {
        attributes.delete(name);
      },
      remove() {
        removed = true;
      },
    } as unknown as HTMLElement,
    attribute: (name: string) => attributes.get(name),
    removed: () => removed,
  };
}

function createEntry(path: string, extensionId = 'retained') {
  const host = createHost();
  let disposeCount = 0;
  const instance = {
    getContent: () => undefined,
    isDirty: () => false,
    focus: () => {},
    dispose: () => {
      disposeCount += 1;
    },
  };
  return {
    entry: { path, extensionId, host: host.host, instance },
    host,
    disposeCount: () => disposeCount,
  };
}

describe('RetainedPaneCache', () => {
  test('hides inactive panes without disposing them during tab switches', () => {
    const cache = new RetainedPaneCache();
    const first = createEntry('first');
    const second = createEntry('second');
    cache.set(first.entry);
    cache.set(second.entry);

    cache.activate('first');
    expect(first.host.host.hidden).toBe(false);
    expect(first.host.attribute('aria-hidden')).toBeUndefined();
    expect(second.host.host.hidden).toBe(true);
    expect(second.host.attribute('aria-hidden')).toBe('true');

    cache.activate('second');
    expect(first.host.host.hidden).toBe(true);
    expect(second.host.host.hidden).toBe(false);
    expect(first.disposeCount()).toBe(0);
    expect(second.disposeCount()).toBe(0);
  });

  test('prunes and disposes panes only when their tabs close', () => {
    const cache = new RetainedPaneCache();
    const open = createEntry('open');
    const closed = createEntry('closed');
    cache.set(open.entry);
    cache.set(closed.entry);

    cache.prune(new Set(['open']));

    expect(cache.size).toBe(1);
    expect(open.disposeCount()).toBe(0);
    expect(open.host.removed()).toBe(false);
    expect(closed.disposeCount()).toBe(1);
    expect(closed.host.removed()).toBe(true);
  });

  test('replaces an incompatible cached extension for the same tab', () => {
    const cache = new RetainedPaneCache();
    const entry = createEntry('pane', 'first-extension');
    cache.set(entry.entry);

    expect(cache.get('pane', 'second-extension')).toBeNull();
    expect(cache.size).toBe(0);
    expect(entry.disposeCount()).toBe(1);
    expect(entry.host.removed()).toBe(true);
  });

  test('releases a live-transferred pane without disposing it', () => {
    const cache = new RetainedPaneCache();
    const entry = createEntry('pane');
    cache.set(entry.entry);

    expect(cache.release('pane', entry.entry.instance)).toBe(entry.entry);
    expect(cache.size).toBe(0);
    expect(entry.disposeCount()).toBe(0);
    expect(entry.host.removed()).toBe(false);
  });

  test('disposes every retained pane during app teardown', () => {
    const cache = new RetainedPaneCache();
    const first = createEntry('first');
    const second = createEntry('second');
    cache.set(first.entry);
    cache.set(second.entry);

    cache.disposeAll();

    expect(cache.size).toBe(0);
    expect(first.disposeCount()).toBe(1);
    expect(second.disposeCount()).toBe(1);
    expect(first.host.removed()).toBe(true);
    expect(second.host.removed()).toBe(true);
  });
});
