import { expect, test } from 'bun:test';

import {
  WAKE_LOCK_PREFERENCE_EVENT,
  WAKE_LOCK_STORAGE_KEY,
  createScreenWakeLockController,
  installPwaScreenWakeLock,
  isScreenWakeLockSupported,
  readStoredWakeLockEnabled,
  setStoredWakeLockEnabled,
} from '../../web/src/ui/screen-wake-lock.ts';

function sentinelStub(overrides: Record<string, unknown> = {}) {
  return {
    released: false,
    release: async () => {},
    addEventListener: () => {},
    ...overrides,
  };
}

function documentStub() {
  const listeners = new Map<string, Set<(...args: any[]) => void>>();
  return {
    visibilityState: 'visible',
    addEventListener(type: string, listener: (...args: any[]) => void) {
      const set = listeners.get(type) ?? new Set();
      set.add(listener);
      listeners.set(type, set);
    },
    removeEventListener(type: string, listener: (...args: any[]) => void) {
      listeners.get(type)?.delete(listener);
    },
    emit(type: string) {
      for (const listener of [...(listeners.get(type) ?? [])]) listener();
    },
    listenerCount(type: string) {
      return listeners.get(type)?.size ?? 0;
    },
    setVisibility(state: string) {
      this.visibilityState = state;
    },
  };
}

function storageStub(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

function eventsStub() {
  const listeners = new Map<string, Set<(event: any) => void>>();
  return {
    addEventListener(type: string, listener: (event: any) => void) {
      const set = listeners.get(type) ?? new Set();
      set.add(listener);
      listeners.set(type, set);
    },
    removeEventListener(type: string, listener: (event: any) => void) {
      listeners.get(type)?.delete(listener);
    },
    dispatchEvent(event: any) {
      for (const listener of [...(listeners.get(event.type) ?? [])]) listener(event);
    },
    listenerCount(type: string) {
      return listeners.get(type)?.size ?? 0;
    },
  };
}

test('wake lock support requires navigator.wakeLock.request', () => {
  expect(isScreenWakeLockSupported({ navigator: {} })).toBe(false);
  expect(isScreenWakeLockSupported({ navigator: { wakeLock: {} } })).toBe(false);
  expect(isScreenWakeLockSupported({ navigator: { wakeLock: { request: async () => sentinelStub() } } })).toBe(true);
});

test('wake lock preference defaults to off and round-trips through storage', () => {
  const storage = storageStub();
  const events = eventsStub();
  const dispatched: any[] = [];
  const runtime = {
    storage,
    events: {
      ...events,
      dispatchEvent: (event: any) => {
        dispatched.push(event);
        events.dispatchEvent(event);
      },
    },
    createEvent: (detail: { enabled: boolean }) => ({ type: WAKE_LOCK_PREFERENCE_EVENT, detail }),
  };

  expect(readStoredWakeLockEnabled(runtime)).toBe(false);

  setStoredWakeLockEnabled(true, runtime);
  expect(storage.getItem(WAKE_LOCK_STORAGE_KEY)).toBe('true');
  expect(readStoredWakeLockEnabled(runtime)).toBe(true);
  expect(dispatched.at(-1)?.detail).toEqual({ enabled: true });

  setStoredWakeLockEnabled(false, runtime);
  expect(readStoredWakeLockEnabled(runtime)).toBe(false);
  expect(dispatched.at(-1)?.detail).toEqual({ enabled: false });
});

test('wake lock controller requests a screen lock once and releases it', async () => {
  let requests = 0;
  const sentinel = sentinelStub();
  const doc = documentStub();
  const controller = createScreenWakeLockController({
    document: doc,
    navigator: { wakeLock: { request: async () => { requests += 1; return sentinel; } } },
  });

  expect(controller.supported).toBe(true);
  expect(await controller.enable()).toBe(true);
  expect(await controller.enable()).toBe(true);
  expect(requests).toBe(1);
  expect(controller.isActive()).toBe(true);

  await controller.disable();
  expect(controller.isActive()).toBe(false);
  await controller.dispose();
});

test('wake lock controller re-acquires on visibilitychange only while enabled', async () => {
  let requests = 0;
  let last: any = null;
  const doc = documentStub();
  const controller = createScreenWakeLockController({
    document: doc,
    navigator: { wakeLock: { request: async () => { requests += 1; last = sentinelStub(); return last; } } },
  });

  doc.emit('visibilitychange');
  expect(requests).toBe(0);

  await controller.enable();
  expect(requests).toBe(1);

  // Simulate the browser dropping the lock when the app is hidden.
  last.released = true;
  doc.setVisibility('hidden');
  doc.emit('visibilitychange');
  expect(requests).toBe(1);

  doc.setVisibility('visible');
  doc.emit('visibilitychange');
  await Promise.resolve();
  await Promise.resolve();
  expect(requests).toBe(2);

  await controller.disable();
  doc.setVisibility('visible');
  doc.emit('visibilitychange');
  await Promise.resolve();
  expect(requests).toBe(2);

  await controller.dispose();
  expect(doc.listenerCount('visibilitychange')).toBe(0);
});

test('wake lock failures are reported, not thrown', async () => {
  const controller = createScreenWakeLockController({
    document: documentStub(),
    navigator: { wakeLock: { request: async () => { throw new Error('denied'); } } },
  });

  expect(await controller.enable()).toBe(false);
  expect(controller.isActive()).toBe(false);
  await controller.dispose();
});

test('installPwaScreenWakeLock is inert outside standalone mode', async () => {
  let requests = 0;
  const doc = documentStub();
  const dispose = installPwaScreenWakeLock({
    document: doc,
    isStandalone: () => false,
    navigator: { wakeLock: { request: async () => { requests += 1; return sentinelStub(); } } },
  });

  doc.emit('pointerdown');
  expect(requests).toBe(0);
  dispose();
});

test('installPwaScreenWakeLock stays idle when the preference is off', async () => {
  let requests = 0;
  const doc = documentStub();
  const events = eventsStub();
  const dispose = installPwaScreenWakeLock({
    document: doc,
    events,
    isStandalone: () => true,
    readEnabled: () => false,
    navigator: { wakeLock: { request: async () => { requests += 1; return sentinelStub(); } } },
  });

  doc.emit('pointerdown');
  await Promise.resolve();
  expect(requests).toBe(0);
  dispose();
});

test('installPwaScreenWakeLock arms on the first interaction when enabled', async () => {
  let requests = 0;
  const doc = documentStub();
  const events = eventsStub();
  const dispose = installPwaScreenWakeLock({
    document: doc,
    events,
    isStandalone: () => true,
    readEnabled: () => true,
    navigator: { wakeLock: { request: async () => { requests += 1; return sentinelStub(); } } },
  });

  doc.emit('pointerdown');
  await Promise.resolve();
  await Promise.resolve();
  expect(requests).toBe(1);

  dispose();
  expect(doc.listenerCount('pointerdown')).toBe(0);
});

test('installPwaScreenWakeLock follows live preference changes', async () => {
  let requests = 0;
  let releases = 0;
  let enabled = false;
  const doc = documentStub();
  const events = eventsStub();
  const dispose = installPwaScreenWakeLock({
    document: doc,
    events,
    isStandalone: () => true,
    readEnabled: () => enabled,
    navigator: {
      wakeLock: {
        request: async () => {
          requests += 1;
          return sentinelStub({ release: async () => { releases += 1; } });
        },
      },
    },
  });

  doc.emit('pointerdown');
  await Promise.resolve();
  expect(requests).toBe(0);

  enabled = true;
  events.dispatchEvent({ type: WAKE_LOCK_PREFERENCE_EVENT, detail: { enabled: true } });
  await Promise.resolve();
  await Promise.resolve();
  expect(requests).toBe(1);

  enabled = false;
  events.dispatchEvent({ type: WAKE_LOCK_PREFERENCE_EVENT, detail: { enabled: false } });
  await Promise.resolve();
  await Promise.resolve();
  expect(releases).toBe(1);

  dispose();
  expect(events.listenerCount(WAKE_LOCK_PREFERENCE_EVENT)).toBe(0);
});
