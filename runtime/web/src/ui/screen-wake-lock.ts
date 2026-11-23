/**
 * screen-wake-lock.ts – Keep the display awake for installed PWA sessions.
 *
 * Installed web apps hide the browser chrome, so an idle iPad/Android tablet
 * dims and locks the screen while piclaw is still streaming or waiting on a
 * turn. The Screen Wake Lock API asks the OS to keep the display on; the
 * request is best-effort (battery saver and OS policy win) and iOS only grants
 * it from a user gesture, so the lock is armed on the first interaction and
 * re-acquired whenever the app returns to the foreground.
 */

import { isStandaloneWebAppMode } from './chat-window.js';

export interface WakeLockSentinelLike {
  released?: boolean;
  release?: () => Promise<void>;
  addEventListener?: (type: string, listener: () => void) => void;
}

export interface ScreenWakeLockRuntime {
  navigator?: { wakeLock?: { request?: (type: 'screen') => Promise<WakeLockSentinelLike> } } | null;
  document?: {
    visibilityState?: string;
    addEventListener?: (type: string, listener: () => void, options?: { once?: boolean; passive?: boolean }) => void;
    removeEventListener?: (type: string, listener: () => void) => void;
  } | null;
  isStandalone?: () => boolean;
}

function resolveNavigator(runtime: ScreenWakeLockRuntime = {}) {
  return runtime.navigator ?? (typeof navigator !== 'undefined' ? navigator : null);
}

function resolveDocument(runtime: ScreenWakeLockRuntime = {}) {
  return runtime.document ?? (typeof document !== 'undefined' ? document : null);
}

/** Whether the runtime exposes the Screen Wake Lock API at all. */
export function isScreenWakeLockSupported(runtime: ScreenWakeLockRuntime = {}): boolean {
  const nav = resolveNavigator(runtime);
  return Boolean(nav?.wakeLock && typeof nav.wakeLock.request === 'function');
}

export interface ScreenWakeLockController {
  readonly supported: boolean;
  isActive(): boolean;
  enable(): Promise<boolean>;
  disable(): Promise<void>;
  dispose(): Promise<void>;
}

/**
 * Reference-counted wake lock that survives background/foreground cycles.
 *
 * The controller only re-acquires a lock the caller explicitly enabled, so a
 * browser-released lock (tab hidden, screen off) does not resurrect itself
 * against the user's wishes.
 */
export function createScreenWakeLockController(runtime: ScreenWakeLockRuntime = {}): ScreenWakeLockController {
  const nav = resolveNavigator(runtime);
  const doc = resolveDocument(runtime);
  let sentinel: WakeLockSentinelLike | null = null;
  let wanted = false;
  let pending: Promise<boolean> | null = null;

  const clearSentinel = () => {
    sentinel = null;
  };

  const handleVisibilityChange = () => {
    if (!wanted) return;
    if (doc?.visibilityState && doc.visibilityState !== 'visible') return;
    void enable();
  };

  const enable = async (): Promise<boolean> => {
    if (!isScreenWakeLockSupported(runtime)) return false;
    wanted = true;
    if (sentinel && sentinel.released !== true) return true;
    if (pending) return await pending;

    pending = (async () => {
      try {
        const next = await nav!.wakeLock!.request!('screen');
        sentinel = next;
        next.addEventListener?.('release', clearSentinel);
        return true;
      } catch {
        sentinel = null;
        return false;
      } finally {
        pending = null;
      }
    })();
    return await pending;
  };

  const disable = async (): Promise<void> => {
    wanted = false;
    const current = sentinel;
    sentinel = null;
    if (!current) return;
    try {
      await current.release?.();
    } catch {
      // Releasing a lock the browser already dropped is not an error.
    }
  };

  doc?.addEventListener?.('visibilitychange', handleVisibilityChange);

  return {
    supported: isScreenWakeLockSupported(runtime),
    isActive: () => Boolean(sentinel && sentinel.released !== true),
    enable,
    disable,
    dispose: async () => {
      doc?.removeEventListener?.('visibilitychange', handleVisibilityChange);
      await disable();
    },
  };
}

/**
 * Arm a wake lock for an installed web app session.
 *
 * No-op outside standalone mode and when the API is unavailable. The first
 * pointer/keyboard interaction arms the lock because iOS refuses wake-lock
 * requests without user activation. Returns a disposer.
 */
export function installPwaScreenWakeLock(runtime: ScreenWakeLockRuntime = {}): () => void {
  const isStandalone = runtime.isStandalone ?? (() => isStandaloneWebAppMode());
  if (!isStandalone()) return () => {};
  if (!isScreenWakeLockSupported(runtime)) return () => {};

  const doc = resolveDocument(runtime);
  const controller = createScreenWakeLockController(runtime);
  const arm = () => {
    void controller.enable();
  };

  doc?.addEventListener?.('pointerdown', arm, { once: true, passive: true });
  doc?.addEventListener?.('keydown', arm, { once: true });

  return () => {
    doc?.removeEventListener?.('pointerdown', arm);
    doc?.removeEventListener?.('keydown', arm);
    void controller.dispose();
  };
}
