
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
      // When the software keyboard is visible, visualViewport.height already
      // represents the usable space above it. Do not add offsetTop here.
      // Inflating the measurement leaves the compose box partly under the
      // keyboard on iOS. The PWA doc says to sync from visualViewport.height.
      return Math.round(viewportHeight);
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

  const innerHeight = Number(win?.innerHeight || 0);
  if (Number.isFinite(innerHeight) && innerHeight > 0) {
    // Primary signal: while the keyboard is open, visualViewport.height becomes
    // materially smaller than innerHeight. This is more reliable than screen-
    // based thresholds on iPad/tablet layouts and avoids treating the cold-start
    // standalone chrome gap as a keyboard.
    if (viewportHeight < innerHeight - 20) return true;
  }

  const screenHeight = readCurrentScreenHeight(win);
  if (screenHeight && screenHeight > 0) {
    // Fallback: ignore the small cold-start standalone lie (~safe-area-top), but
    // treat larger shrinks as an active keyboard.
    const keyboardThreshold = Math.max(120, Math.round(screenHeight * 0.16));
    return viewportHeight < screenHeight - keyboardThreshold;
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

  // On iOS standalone without a fixed root, the visual viewport can scroll
  // when the keyboard opens. Aggressively reset scroll on focus events to
  // counteract this. The --app-height sync handles resizing the shell.
  const resetScroll = () => {
    try {
      if (typeof win.scrollTo === 'function') win.scrollTo(0, 0);
      if (doc.scrollingElement) { doc.scrollingElement.scrollTop = 0; doc.scrollingElement.scrollLeft = 0; }
      if (doc.documentElement) { doc.documentElement.scrollTop = 0; doc.documentElement.scrollLeft = 0; }
      if (doc.body) { doc.body.scrollTop = 0; doc.body.scrollLeft = 0; }
    } catch (e) {
      console.debug('[mobile-viewport] Ignoring scroll reset failure.', e);
    }
  };

  const handleFocusIn = () => {
    resetScroll();
    scheduleSettledSync();
    // iOS may scroll the visual viewport after focusin with a slight delay.
    // Fire additional resets to counteract.
    for (const delay of [16, 50, 100, 200]) {
      const t = win.setTimeout?.(() => { timers.delete(t); resetScroll(); }, delay);
      if (t != null) timers.add(t);
    }
  };

  const handleFocusOut = () => {
    resetScroll();
    scheduleSettledSync();
    for (const delay of [16, 50, 100]) {
      const t = win.setTimeout?.(() => { timers.delete(t); resetScroll(); }, delay);
      if (t != null) timers.add(t);
    }
  };

  const viewport = win.visualViewport;
  scheduleSettledSync();
  win.addEventListener('focus', scheduleSettledSync);
  win.addEventListener('pageshow', scheduleSettledSync);
  win.addEventListener('resize', scheduleSettledSync);
  win.addEventListener('orientationchange', scheduleSettledSync);
  doc.addEventListener('visibilitychange', handleVisibility);
  doc.addEventListener('focusin', handleFocusIn, true);
  doc.addEventListener('focusout', handleFocusOut, true);
  viewport?.addEventListener?.('resize', scheduleSettledSync);
  viewport?.addEventListener?.('scroll', resetScroll);

  return () => {
    clearScheduled();
    win.removeEventListener('focus', scheduleSettledSync);
    win.removeEventListener('pageshow', scheduleSettledSync);
    win.removeEventListener('resize', scheduleSettledSync);
    win.removeEventListener('orientationchange', scheduleSettledSync);
    doc.removeEventListener('visibilitychange', handleVisibility);
    doc.removeEventListener('focusin', handleFocusIn, true);
    doc.removeEventListener('focusout', handleFocusOut, true);
    viewport?.removeEventListener?.('resize', scheduleSettledSync);
    viewport?.removeEventListener?.('scroll', resetScroll);
  };
}
