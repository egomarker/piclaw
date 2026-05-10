
import { isMobileBrowserMode, isStandaloneWebAppMode } from './chat-window.js';

export function shouldUseStandaloneMobileViewportFix(runtime = {}) {
  return isStandaloneWebAppMode(runtime) && isMobileBrowserMode(runtime);
}

function isTextEntryFocused(doc: any): boolean {
  const active = doc?.activeElement;
  if (!active) return false;
  const tagName = String(active.tagName || active.nodeName || '').toLowerCase();
  if (tagName === 'textarea' || tagName === 'select') return true;
  if (tagName === 'input') {
    const type = String(active.type || 'text').toLowerCase();
    return !['button', 'checkbox', 'color', 'file', 'hidden', 'image', 'radio', 'range', 'reset', 'submit'].includes(type);
  }
  if (active.isContentEditable === true) return true;
  if (typeof active.closest === 'function') {
    try {
      return Boolean(active.closest('[contenteditable="true"], [contenteditable="plaintext-only"]'));
    } catch (error) {
      console.debug('[mobile-viewport] Ignoring activeElement.closest failure during keyboard detection.', error);
    }
  }
  return false;
}

export function readViewportHeight(runtime = {}, options = {}) {
  const win = runtime.window ?? (typeof window !== 'undefined' ? window : null);
  const viewportHeight = Number(win?.visualViewport?.height || 0);
  const innerHeight = Number(win?.innerHeight || 0);
  const hasViewportHeight = Number.isFinite(viewportHeight) && viewportHeight > 0;
  const hasInnerHeight = Number.isFinite(innerHeight) && innerHeight > 0;

  if (hasViewportHeight) {
    if (options.keyboardActive === true) {
      const viewportOffsetTop = Number(win?.visualViewport?.offsetTop || 0);
      const keyboardHeight = viewportHeight + Math.max(0, Number.isFinite(viewportOffsetTop) ? viewportOffsetTop : 0);
      return Math.round(keyboardHeight);
    }
    if (options.ignoreStandaloneChromeGap === true && hasInnerHeight && innerHeight > viewportHeight) {
      return Math.round(innerHeight);
    }
    return Math.round(viewportHeight);
  }
  if (hasInnerHeight) {
    return Math.round(innerHeight);
  }
  return null;
}

function readCurrentScreenHeight(win: any): number | null {
  const screenWidth = Number(win?.screen?.width || 0);
  const screenHeight = Number(win?.screen?.height || 0);
  if (!Number.isFinite(screenWidth) || !Number.isFinite(screenHeight) || screenWidth <= 0 || screenHeight <= 0) {
    return null;
  }

  const innerWidth = Number(win?.innerWidth || 0);
  const innerHeight = Number(win?.innerHeight || 0);
  const isLandscape = Number.isFinite(innerWidth) && Number.isFinite(innerHeight) && innerWidth > innerHeight;
  return Math.round(isLandscape ? Math.min(screenWidth, screenHeight) : Math.max(screenWidth, screenHeight));
}

function isVirtualKeyboardLikelyVisible(win: any): boolean {
  const viewportHeight = Number(win?.visualViewport?.height || 0);
  if (!Number.isFinite(viewportHeight) || viewportHeight <= 0) return false;

  const viewportOffsetTop = Number(win?.visualViewport?.offsetTop || 0);
  const measuredViewportHeight = viewportHeight + Math.max(0, Number.isFinite(viewportOffsetTop) ? viewportOffsetTop : 0);
  const screenHeight = readCurrentScreenHeight(win);
  if (screenHeight && screenHeight > 0) {
    // iOS standalone can keep focus on the textarea after the keyboard is hidden,
    // while visualViewport/innerHeight are still the cold-start short values
    // (screen height minus the top safe area). Treat that as "keyboard closed".
    // A real software keyboard is a much larger shrink than the ~59px PWA chrome lie.
    const keyboardThreshold = Math.max(120, Math.round(screenHeight * 0.16));
    return measuredViewportHeight < screenHeight - keyboardThreshold;
  }

  const innerHeight = Number(win?.innerHeight || 0);
  if (Number.isFinite(innerHeight) && innerHeight > 0) {
    return measuredViewportHeight < innerHeight - 80;
  }
  return false;
}

export function syncStandaloneMobileViewport(runtime = {}, options = {}) {
  if (!shouldUseStandaloneMobileViewportFix(runtime)) {
    return null;
  }

  const win = runtime.window ?? (typeof window !== 'undefined' ? window : null);
  const doc = runtime.document ?? (typeof document !== 'undefined' ? document : null);
  if (!win || !doc?.documentElement) {
    return null;
  }

  const textEntryFocused = isTextEntryFocused(doc);
  const keyboardActive = textEntryFocused && isVirtualKeyboardLikelyVisible(win);
  const height = readViewportHeight({ window: win }, { ignoreStandaloneChromeGap: true, keyboardActive });
  if (keyboardActive) {
    if (height && height > 0) {
      doc.documentElement.style.setProperty('--app-height', `${height}px`);
    }
  } else {
    // In iOS standalone, both visualViewport.height and innerHeight can briefly
    // under-report after app resume or keyboard dismissal. Do not persist that
    // false short measurement into the app shell; use standalone 100vh while the
    // keyboard is closed so the compose box remains flush with the viewport.
    doc.documentElement.style.setProperty('--app-height', '100vh');
  }

  // Do not force the page back to the top during normal viewport sync.
  // On mobile, virtual keyboard / caret movement triggers visualViewport
  // resize+scroll events while typing. Resetting scroll here causes the
  // chat to jump on every keystroke. Keep scroll resets opt-in for any
  // future call sites that explicitly need a top reset.
  if (options.resetScroll === true) {
    try {
      if (typeof win.scrollTo === 'function') {
        win.scrollTo(0, 0);
      }
    } catch (error) {
      console.debug('[mobile-viewport] Ignoring scrollTo failure during standalone viewport reset.', error);
    }

    try {
      if (doc.scrollingElement) {
        doc.scrollingElement.scrollTop = 0;
        doc.scrollingElement.scrollLeft = 0;
      }
      if (doc.documentElement) {
        doc.documentElement.scrollTop = 0;
        doc.documentElement.scrollLeft = 0;
      }
      if (doc.body) {
        doc.body.scrollTop = 0;
        doc.body.scrollLeft = 0;
      }
    } catch (error) {
      console.debug('[mobile-viewport] Ignoring DOM scroll reset failure during standalone viewport sync.', error);
    }
  }

  return height;
}

export function installStandaloneMobileViewportFix(runtime = {}) {
  if (!shouldUseStandaloneMobileViewportFix(runtime)) {
    return () => {};
  }

  const win = runtime.window ?? (typeof window !== 'undefined' ? window : null);
  const doc = runtime.document ?? (typeof document !== 'undefined' ? document : null);
  if (!win || !doc) {
    return () => {};
  }

  // Keep this paired with the pre-CSS bootstrap in static/index.html.
  // 100dvh is correct for browser chrome, but iOS standalone PWAs can
  // cold-start it ~safe-area-top too short, leaving a bottom gap below compose.
  // Standalone mode has no URL bar, so 100vh is the stable full-screen unit.
  // See docs/PWA.md before changing this path.
  doc.documentElement?.style?.setProperty?.('--app-height', '100vh');

  let rafId = 0;
  const timers = new Set();

  const clearScheduled = () => {
    if (rafId) {
      win.cancelAnimationFrame?.(rafId);
      rafId = 0;
    }
    for (const timer of timers) {
      win.clearTimeout?.(timer);
    }
    timers.clear();
  };

  const runSync = () => {
    rafId = 0;
    syncStandaloneMobileViewport({ window: win, document: doc });
  };

  const scheduleSync = () => {
    if (rafId) {
      win.cancelAnimationFrame?.(rafId);
    }
    rafId = win.requestAnimationFrame?.(runSync) ?? 0;
  };

  const scheduleSettledSync = () => {
    scheduleSync();
    for (const delay of [80, 220, 420]) {
      const timer = win.setTimeout?.(() => {
        timers.delete(timer);
        scheduleSync();
      }, delay);
      if (timer != null) {
        timers.add(timer);
      }
    }
  };

  const handleVisibility = () => {
    if (doc.visibilityState && doc.visibilityState !== 'visible') return;
    scheduleSettledSync();
  };

  const viewport = win.visualViewport;
  scheduleSettledSync();
  win.addEventListener('focus', scheduleSettledSync);
  win.addEventListener('pageshow', scheduleSettledSync);
  win.addEventListener('resize', scheduleSettledSync);
  win.addEventListener('orientationchange', scheduleSettledSync);
  doc.addEventListener('visibilitychange', handleVisibility);
  doc.addEventListener('focusin', scheduleSettledSync, true);
  doc.addEventListener('focusout', scheduleSettledSync, true);
  viewport?.addEventListener?.('resize', scheduleSettledSync);
  viewport?.addEventListener?.('scroll', scheduleSettledSync);

  return () => {
    clearScheduled();
    win.removeEventListener('focus', scheduleSettledSync);
    win.removeEventListener('pageshow', scheduleSettledSync);
    win.removeEventListener('resize', scheduleSettledSync);
    win.removeEventListener('orientationchange', scheduleSettledSync);
    doc.removeEventListener('visibilitychange', handleVisibility);
    doc.removeEventListener('focusin', scheduleSettledSync, true);
    doc.removeEventListener('focusout', scheduleSettledSync, true);
    viewport?.removeEventListener?.('resize', scheduleSettledSync);
    viewport?.removeEventListener?.('scroll', scheduleSettledSync);
  };
}
