# iOS PWA Viewport & Safe Area Reference

> Last updated: 2026-04-15
> Applies to: iOS 17.x–18.x, iOS 26, Safari/WebKit, standalone PWA mode
> Validated on: iPhone 15 Pro and iPad Pro running iOS 26.x

This document captures every failure mode, attempted fix, and the final confirmed solution for the iOS standalone PWA viewport height bug. It exists to prevent regressions. **Read this before changing any layout CSS, viewport meta tags, or mobile-viewport JS.**

---

## Table of Contents

- [1. Background: How iOS Standalone Mode Differs from Safari](#1-background)
- [2. The Core Bug: Viewport Units Lie on Cold Start](#2-the-core-bug)
- [3. Why It Self-Corrects Sometimes](#3-why-it-self-corrects)
- [4. The Confirmed Fix](#4-the-confirmed-fix)
- [5. Required Meta Tags](#5-required-meta-tags)
- [6. Safe Area Handling](#6-safe-area-handling)
- [7. Keyboard Behavior](#7-keyboard-behavior)
- [8. Failed Approaches (Do Not Retry)](#8-failed-approaches)
- [9. env() Reliability Issues](#9-env-reliability)
- [10. display-mode: standalone Media Query Caveat](#10-display-mode-caveat)
- [11. The Complete File Map](#11-file-map)
- [12. Testing Checklist](#12-testing-checklist)
- [13. References](#13-references)

---

<a name="1-background"></a>
## 1. Background: How iOS Standalone Mode Differs from Safari

When a user taps "Add to Home Screen" in Safari and the page has `<meta name="apple-mobile-web-app-capable" content="yes">`, iOS creates a standalone web app. This differs from Safari in several critical ways:

| Aspect | Safari browser | Standalone PWA |
|---|---|---|
| URL bar / toolbar | Present, can show/hide | **None** |
| Status bar | Managed by Safari | Controlled by `apple-mobile-web-app-status-bar-style` meta tag |
| `navigator.standalone` | `false` | `true` |
| Viewport height units | Respond to URL bar show/hide | Should equal full screen, but **don't** on cold start |
| `env(safe-area-inset-top)` | ~8px (Safari chrome handles the notch) | ~59px (raw hardware inset, Dynamic Island) |
| `env(safe-area-inset-bottom)` | ~8px (Safari chrome handles home indicator) | ~34px (raw hardware inset) |
| `@media (display-mode: standalone)` | Does not match | **Unreliable** — may not match even when visually standalone (see §10) |
| Storage / cookies | Shared with Safari | Separate partition per PWA |
| Service worker cache | Shared with Safari | Separate per PWA |
| WKWebView instance | Safari's shared process | Separate WKWebView per PWA |

The separate WKWebView instance is key: each PWA has its own viewport state. An old PWA may have gone through a viewport recalculation during a previous session, while a newly installed PWA starts fresh with incorrect viewport values.

---

<a name="2-the-core-bug"></a>
## 2. The Core Bug: Viewport Units Lie on Cold Start

### What happens

On a **fresh launch** of a standalone PWA (especially after first install, force-quit, or device restart), WebKit reports viewport height values that are **shorter than the actual screen** by exactly `env(safe-area-inset-top)`.

### Measured values

**iPhone 14 Pro (screen: 393×852 CSS pixels, iOS 18.x, standalone mode, portrait):**

| API / Unit | Cold start value | True screen height | Delta | Lies? |
|---|---|---|---|---|
| `screen.height` | 852px | 852px | 0 | ✅ No |
| `screen.width` | 393px | 393px | 0 | ✅ No |
| `100vh` | 852px | 852px | 0 | ✅ No |
| `100lvh` | 852px | 852px | 0 | ✅ No |
| `100dvh` | 793px | 852px | **-59px** | ❌ **Yes** |
| `100svh` | 793px | 852px | **-59px** | ❌ **Yes** |
| `-webkit-fill-available` | 793px | 852px | **-59px** | ❌ **Yes** |
| `window.innerHeight` | 793px | 852px | **-59px** | ❌ **Yes** |
| `visualViewport.height` | 793px | 852px | **-59px** | ❌ **Yes** |

**iPhone 12 Pro (screen: 390×844 CSS pixels):**

| API / Unit | Cold start value | True screen height | Delta |
|---|---|---|---|
| `100dvh` | 797px | 844px | -47px |
| `100svh` | 797px | 844px | -47px |
| `100lvh` | 844px | 844px | 0 |
| `100vh` | 844px | 844px | 0 |

The delta equals `env(safe-area-inset-top)` — the Dynamic Island / status bar / notch area. WebKit subtracts this from the "dynamic" and "small" viewport units but **not** from `vh` or `lvh`.

### Why `100vh` is correct in standalone

In regular Safari, `100vh` equals the "large viewport" — it includes the area behind the URL bar, making it taller than the visible area. This is the classic mobile `100vh` bug that `100dvh` was designed to fix.

In standalone mode, **there is no URL bar**. The "large viewport" equals the full screen. So:

- `100vh` = `100lvh` = full screen height = **correct**
- `100dvh` = `100svh` = full screen minus safe-area-inset-top = **incorrect**

The `100dvh` unit, which was the "fix" for the `100vh` bug, **introduces a new bug** in standalone mode by incorrectly subtracting the safe area that shouldn't be subtracted.

### Visual effect

The layout is ~59px shorter than the screen. A visible gap appears at the **bottom** of the screen between the last UI element (compose box) and the physical screen edge. The gap is filled with whatever is behind the body (typically the html background or system background).

---

<a name="3-why-it-self-corrects"></a>
## 3. Why It Self-Corrects Sometimes

iOS has an undocumented "docking" behavior for standalone web apps:

1. **Initial state**: viewport units report the incorrect (too-short) values.
2. **Trigger event**: any of the following forces iOS to recalculate the viewport:
   - User scrolls the page (if scrolling is possible)
   - Device rotates portrait → landscape → portrait
   - App is backgrounded and foregrounded
   - Content overflows the viewport (even by 1px)
   - User drags the page downward (the page "docks" into position)
3. **Recalculated state**: all viewport units snap to the correct full-screen values. iOS caches this for the PWA instance.
4. **Persistence**: the corrected state survives reopens of the same PWA instance. It does **not** transfer to new installs.

This explains the confusing behavior where:
- An old PWA installed weeks ago works perfectly (it went through recalculation during normal use)
- A newly installed PWA from the same server has the bottom gap
- The same code produces different results on the same device

The recalculation is accompanied by a visible animation where the page "slides" into its correct position. This animation cannot be suppressed via CSS transitions.

---

<a name="4-the-confirmed-fix"></a>
## 4. The Confirmed Fix

### Strategy: `100dvh` default with `100vh` override in standalone

The fix uses two layers:

#### Layer 1: CSS default (browser mode)

```css
/* base.css */
html {
    --app-height: 100dvh;
}

/* All layout panes use the variable with 100dvh fallback */
.container        { height: var(--app-height, 100dvh); }
.workspace-sidebar { height: var(--app-height, 100dvh); }
.editor-pane-container { height: var(--app-height, 100dvh); }
```

`100dvh` is correct for Safari browser mode — it matches the visible viewport and responds to URL bar changes.

#### Layer 2: JS override (standalone mode)

```javascript
// mobile-viewport.ts — installStandaloneMobileViewportFix()
// Runs once on init, only when isStandaloneWebAppMode() && isMobileBrowserMode()
doc.documentElement.style.setProperty('--app-height', '100vh');
```

In standalone mode, this overrides `--app-height` to `100vh`, which equals the full screen height from cold start. The `100dvh` fallback in CSS is never reached because the JS sets the variable first.

#### Why this works

| Mode | `--app-height` resolves to | Height value | Correct? |
|---|---|---|---|
| Safari browser | `100dvh` (CSS default) | Visible viewport minus URL bar | ✅ |
| Standalone PWA | `100vh` (JS override) | Full screen | ✅ |
| Desktop browser | `100dvh` (CSS default) | Viewport height | ✅ |

#### Why not just use `100vh` everywhere?

In Safari browser mode, `100vh` includes the area behind the URL bar, making the layout taller than the visible area. This causes the compose box to be hidden behind the toolbar and the page to shift when the URL bar shows/hides. `100dvh` was specifically designed to fix this.

The standalone/browser split lets us use the correct unit for each context.

---

<a name="5-required-meta-tags"></a>
## 5. Required Meta Tags

```html
<meta name="viewport"
      content="width=device-width, initial-scale=1.0,
               maximum-scale=1.0, user-scalable=no,
               viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

### `viewport-fit=cover` (critical)

Without this, `env(safe-area-inset-*)` returns `0px` on all edges and Safari letterboxes the content with blank bars. This single attribute enables the entire safe-area system for web content.

### `apple-mobile-web-app-capable="yes"` (critical)

Enables standalone mode. Without this, "Add to Home Screen" creates a Safari bookmark, not a standalone app. The `navigator.standalone` property is only `true` when this is set.

### `apple-mobile-web-app-status-bar-style="black-translucent"` (critical)

Controls how the status bar area is handled in standalone mode:

| Value | Behavior | Top safe area | Our choice |
|---|---|---|---|
| `default` | Opaque white/grey status bar. Content starts below it. | System-managed | ❌ |
| `black` | Opaque black status bar. Content starts below it. | System-managed | ❌ |
| `black-translucent` | Transparent status bar. Content extends behind it. | **App must handle via `padding-top: env(safe-area-inset-top)`** | ✅ |

We use `black-translucent` because:
1. It gives full edge-to-edge control
2. The app can match the status bar area to the theme background
3. It's required by `viewport-fit=cover` to get correct safe-area values
4. Using `default` with `viewport-fit=cover` can cause the viewport to extend behind the status bar while the status bar is opaque, hiding content

**Important**: this meta tag is read at PWA **install time** and cached. Changing it on the server does not affect existing installs. Users must delete and re-add the PWA to pick up changes.

### `text-size-adjust: 100%` / `-webkit-text-size-adjust: 100%`

Set on `html` in CSS. Prevents iOS from auto-enlarging fonts when rotating to landscape. Without this, text becomes larger in landscape and doesn't shrink back in portrait on some devices.

### `maximum-scale=1.0, user-scalable=no`

Prevents pinch-to-zoom which interferes with the fixed layout. Some iOS versions ignore `user-scalable=no` but `maximum-scale=1.0` is respected.

---

<a name="6-safe-area-handling"></a>
## 6. Safe Area Handling

With `black-translucent` and `viewport-fit=cover`, the page extends edge-to-edge. Safe areas are the app's responsibility.

### Top (Dynamic Island / status bar)

```css
.container {
    padding-top: env(safe-area-inset-top, 0px);
}
```

This keeps interactive content below the Dynamic Island / status bar while allowing the container background to paint behind it. The `0px` fallback ensures no effect on devices without a notch or in browser mode where the browser handles it.

### Bottom (home indicator)

**No special handling needed.** With `100vh` in standalone mode, the layout reaches the bottom of the screen. The home indicator overlay is transparent and the system handles tap-through. Adding `padding-bottom: env(safe-area-inset-bottom)` would push the compose box up unnecessarily.

### Left / Right (landscape rotation)

Currently not handled. If landscape support is added, use:

```css
.container {
    padding-left: env(safe-area-inset-left, 0px);
    padding-right: env(safe-area-inset-right, 0px);
}
```

---

<a name="7-keyboard-behavior"></a>
## 7. Keyboard Behavior

### Browser mode (Safari)

iOS Safari natively scrolls the visual viewport to keep the focused input visible above the keyboard. The body stays `position: fixed; inset: 0`. No JS intervention needed. `100dvh` does NOT resize when the keyboard opens — the keyboard simply overlays the page and Safari scrolls the visual viewport.

### Standalone PWA mode

The mobile viewport JS (`syncStandaloneMobileViewport`) syncs `--app-height` from `visualViewport.height` on resize events. When the keyboard opens:

1. `visualViewport.height` shrinks to the area above the keyboard
2. The JS updates `--app-height` to the smaller value
3. The container shrinks to fit above the keyboard
4. The compose box stays visible

When the keyboard closes:

1. `visualViewport.height` returns to the lying value (793px) or the corrected value (852px)
2. The JS updates `--app-height` — but since we set it to `100vh` initially, and the JS reads from `visualViewport.height`, subsequent syncs may reset it to the incorrect pixel value
3. **This is acceptable** because by the time the user has opened the keyboard, the viewport recalculation has likely already been triggered (keyboard open/close is a viewport geometry change)

### Body positioning and keyboard scroll prevention

```css
body {
    position: fixed;
    inset: 0;
    overflow: hidden;
    overscroll-behavior: none;
}
```

`position: fixed` is critical. Without it, iOS pushes the entire page upward when the keyboard opens, creating a broken layout where the compose box is at the top of the screen with a huge gap between it and the keyboard (see failed approach §8).

---

<a name="8-failed-approaches"></a>
## 8. Failed Approaches (Do Not Retry)

Each of these was attempted during the 2026-04-14 debugging session and failed for specific reasons.

### ❌ 8.1: `height: 100%` on html/body

```css
html, body { height: 100%; }
```

**Why it fails**: With `viewport-fit=cover` + `black-translucent`, percentage-based height calculation does not account for the area behind the status bar. Safari silently falls back to the default (non-cover) layout. The page looks correct in CSS but the layout collapses and content never extends behind the notch/Dynamic Island. Confirmed by the iPhone game guide gist.

### ❌ 8.2: `calc(100dvh + 1px)` overflow trick

```css
html, body { height: calc(100dvh + 1px); }
```

**What it does**: The 1px overflow triggers iOS to recalculate the viewport to the true screen height. After recalculation, `100dvh` = 852px and body = 853px (1px invisible overshoot).

**Why it fails**: The recalculation animation (page "slides" into position) fires on **every keyboard close**, not just on first load. The user sees the page animate downward each time they dismiss the keyboard. There is no way to suppress this animation. Moving the `+1px` to an inline `<style>` in `<head>` (to trigger before first paint) does not help — the animation still occurs on keyboard close.

**Variant attempted**: Apply `+1px` once via JS, then remove after 1.5 seconds. This causes a visible animate-down followed by a jump back up. Even worse.

### ❌ 8.3: `screen.height` via JS on `--app-height`

```javascript
document.documentElement.style.setProperty('--app-height', screen.height + 'px');
```

**Why it fails (with position: fixed)**: The body has `position: fixed; inset: 0`. Fixed elements are constrained to the viewport (their containing block). Even though `--app-height` is set to 852px on the container, the body is only 793px (the lying viewport). The container tries to be 852px but is clipped by the body.

**Why it fails (without position: fixed)**: Removing `position: fixed` from the body allows `screen.height` to work, but the keyboard pushes the entire page upward on focus (see §8.6).

### ❌ 8.4: Negative `bottom` on fixed body

```css
body {
    position: fixed;
    top: 0; left: 0; right: 0;
    bottom: calc(-1 * env(safe-area-inset-top, 0px));
}
```

**Theory**: Extend the fixed body past the lying viewport by the amount it's short.

**Why it fails**: iOS does not render fixed elements beyond the viewport boundary, even with `viewport-fit=cover`. The negative bottom is ignored or clipped. No visible change.

### ❌ 8.5: `env(safe-area-inset-bottom)` padding on compose box

```css
.compose-box {
    padding-bottom: max(2px, env(safe-area-inset-bottom, 2px));
}
```

**Why it fails**:
1. `env(safe-area-inset-bottom)` can return `0px` in standalone mode after navigation or reopen (confirmed by multiple sources including Next.js discussion #81264 and Apple Forums #699415).
2. Even when non-zero, this only adds **internal padding** to the compose box. It doesn't extend the layout to the screen edge. The gap is between the body boundary and the screen edge, not inside the compose box.

### ❌ 8.6: Removing `position: fixed` from body

```css
body {
    /* no position: fixed */
    height: var(--app-height, 100dvh);
    overflow: hidden;
}
```

**Why it fails**: When the user taps the compose box textarea, iOS Safari scrolls the document to bring the focused element into view. Without `position: fixed`, the body scrolls upward. The compose box ends up at the top of the screen with a huge black gap between it and the keyboard. All chat messages disappear off-screen.

### ❌ 8.7: `status-bar-style="default"` to avoid safe-area complications

**Theory**: With `default`, the system handles the status bar and the page starts below it. No safe-area padding needed.

**Why it fails**: The bottom gap persists regardless of status bar style. The viewport lie is not caused by `black-translucent` — it's a WebKit bug that affects all standalone apps with `viewport-fit=cover`. And with `default`, the top safe zone is gone (the system status bar takes over but the viewport still includes that area with `viewport-fit=cover`, so content is hidden behind the opaque status bar).

### ❌ 8.8: CSS custom properties for safe area with JS readout

```css
html {
    --safe-area-top: env(safe-area-inset-top);
    --safe-area-bottom: env(safe-area-inset-bottom);
}
```

```javascript
const value = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-top');
```

**Why it fails**: `getComputedStyle` on a custom property containing `env()` may return the **literal string** `env(safe-area-inset-top)` rather than the resolved pixel value (WebKit bug #274773). A DOM probe element with `padding-bottom: env(...)` and `offsetHeight` readout is more reliable but adds complexity.

---

<a name="9-env-reliability"></a>
## 9. `env()` Reliability Issues

The CSS `env()` function for safe area insets has several known issues on iOS:

1. **Delayed initialization** (WebKit bug #191872): On cold start, `env(safe-area-inset-*)` values may return `0px` for the first few hundred milliseconds. A probe element can return correct values after a reflow, but timing is unpredictable.

2. **Stale values after navigation** (Next.js discussion #81264): In standalone mode, `env(safe-area-inset-bottom)` can reset to `0px` after client-side navigation. Only a full page reload restores the correct values.

3. **CSS custom property bridge unreliable** (WebKit bug #274773): Reading `env()` values through CSS custom properties via `getComputedStyle` may return the literal expression instead of the resolved value.

4. **Workaround for JS readout**: Create a temporary DOM element, apply `padding-bottom: env(safe-area-inset-bottom, 0px)`, force a reflow with `offsetHeight`, read the computed `paddingBottom`, then remove the element:

```javascript
function measureSafeAreaInset(property) {
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;top:0;left:0;width:0;
        height:env(${property}, 0px);visibility:hidden;pointer-events:none`;
    document.body.appendChild(el);
    const value = el.offsetHeight;
    el.remove();
    return value;
}
```

This is not currently used in our code but is documented here for reference.

---

<a name="10-display-mode-caveat"></a>
## 10. `display-mode: standalone` Media Query Caveat

```css
@media all and (display-mode: standalone) {
    /* This may NOT match on iOS! */
}
```

When a page is added to the iOS home screen via `apple-mobile-web-app-capable`, the CSS media query `(display-mode: standalone)` **does not reliably match**. It may report as `browser` despite the page visually running in standalone mode (no Safari chrome, different viewport).

This is why our fix uses JavaScript (`navigator.standalone` and `matchMedia` check in `shouldUseStandaloneMobileViewportFix`) rather than a CSS media query. The JS check uses:

```javascript
navigator.standalone === true ||
window.matchMedia('(display-mode: standalone)').matches
```

`navigator.standalone` is the authoritative check for iOS. The `matchMedia` fallback covers Android PWAs.

**Do not** rely solely on `@media (display-mode: standalone)` for iOS-critical layout overrides.

---

<a name="11-file-map"></a>
## 11. The Complete File Map

| File | Role | Key properties |
|---|---|---|
| `runtime/web/static/index.html` | Meta tags | `viewport-fit=cover`, `apple-mobile-web-app-capable`, `status-bar-style=black-translucent` |
| `runtime/web/static/css/base.css` | Root layout | `--app-height: 100dvh`, `body { position: fixed; inset: 0 }`, `text-size-adjust: 100%` |
| `runtime/web/static/css/editor.css` | Container & editor pane | `.container { height: var(--app-height, 100dvh); padding-top: env(safe-area-inset-top) }`, `.editor-pane-container { height: var(--app-height, 100dvh) }` |
| `runtime/web/static/css/workspace.css` | Workspace sidebar | `.workspace-sidebar { height: var(--app-height, 100dvh) }` |
| `runtime/web/static/css/agent.css` | Agent panel | `max-height: calc(var(--app-height, 100dvh) - 32px)` |
| `runtime/web/static/css/chat.css` | Compose box | `.compose-box { padding: var(--spacing-sm) var(--spacing-md) 2px }` |
| `runtime/web/src/ui/mobile-viewport.ts` | Standalone viewport fix | Sets `--app-height: 100vh` on init; syncs from `visualViewport.height` on resize |
| `runtime/test/web/mobile-viewport.test.ts` | Tests | Covers `shouldUseStandaloneMobileViewportFix`, `readViewportHeight`, `syncStandaloneMobileViewport` |
| `runtime/web/static/manifest.json` | PWA manifest | `display: standalone`, `display_override: [window-controls-overlay]` |

### Dependency chain

```
index.html (meta tags)
  → base.css (--app-height: 100dvh, body fixed)
    → editor.css / workspace.css / agent.css (use --app-height with 100dvh fallback)
      → mobile-viewport.ts (overrides --app-height to 100vh in standalone)
```

**Critical invariant**: The CSS fallback (`100dvh`) must be correct for browser mode. The JS override (`100vh`) must be correct for standalone mode. If either is wrong, one mode breaks.

---

<a name="12-testing-checklist"></a>
## 12. Testing Checklist

After any change to layout CSS, meta tags, or mobile-viewport.ts:

### iPhone PWA (standalone)

- [ ] Delete existing PWA from home screen
- [ ] Re-add via Safari → Share → Add to Home Screen
- [ ] Launch immediately — **no bottom gap** on cold start
- [ ] Tap compose box — keyboard appears, compose box visible above keyboard
- [ ] Dismiss keyboard — no animation, no jump, layout returns to full screen
- [ ] Rotate to landscape and back — no gap, no font size change
- [ ] Background the app and return — no gap
- [ ] Force-quit and relaunch — no gap on cold start

### iPad PWA (standalone)

- [ ] Same checklist as iPhone
- [ ] Test both portrait and landscape

### iPhone Safari (browser)

- [ ] Open in Safari — no layout overflow, compose box visible
- [ ] Tap compose box — keyboard appears, input stays visible
- [ ] URL bar shows/hides on scroll — layout adjusts smoothly
- [ ] No horizontal scrolling

### iPad Safari (browser)

- [ ] Open in Safari — full layout visible
- [ ] Tap compose box — page does NOT scroll up, keyboard doesn't obscure input
- [ ] Rotate — layout adjusts, font size stable

### Desktop browser

- [ ] Layout fills viewport, no overflow
- [ ] Resize window — layout adjusts

---

<a name="13-references"></a>
## 13. References

### WebKit bugs (open)

1. **[#254868](https://bugs.webkit.org/show_bug.cgi?id=254868)** — Incorrect height values when `viewport-fit=cover` is set for installed web apps. `100svh`, `-webkit-fill-available`, `visualViewport.height` all report wrong values. **Workaround confirmed: use `vh` in standalone.** Still open as of iOS 18.3.1 (comment from 2025-04-02).
2. **[#292603](https://bugs.webkit.org/show_bug.cgi?id=292603)** — Safari on iOS adds bottom offset to viewport. Root scrollable area extends by home-indicator inset. Reproduced on iOS 18.1 simulator (2025-05-08).
3. **[#259770](https://bugs.webkit.org/show_bug.cgi?id=259770)** — `interactive-widget=resizes-content` viewport meta property unimplemented in WebKit. Chrome has it since v108. WebKit has no opt-in for viewport-resize-on-keyboard.
4. **[#237961](https://bugs.webkit.org/show_bug.cgi?id=237961)** — Standalone with `viewport-fit=cover` causes overscroll issues, breaks `position: fixed` and `-webkit-fill-available`.
5. **[#191872](https://bugs.webkit.org/show_bug.cgi?id=191872)** — `env(safe-area-inset-*)` values delayed on WKWebView initialization. Values may be 0 for the first few hundred ms.
6. **[#274773](https://bugs.webkit.org/show_bug.cgi?id=274773)** — CSS custom property bridge for `env()` returns stale or zero values via `getComputedStyle`.
7. **[#217754](https://bugs.webkit.org/show_bug.cgi?id=217754)** — `safe-area-inset-bottom` doesn't update when keyboard is visible.

### Stack Overflow

8. **[#79902310](https://stackoverflow.com/questions/79902310)** — "iOS PWA: White gap below bottom navigation bar, 100dvh doesn't fill full screen with viewport-fit=cover." Documents the exact symptom. No accepted answer as of 2026-04.
9. **[#78669293](https://stackoverflow.com/questions/78669293)** — "iOS Safari PWA: Inconsistent viewport size." Confirmed workaround: `100lvh` in standalone via `@media (display-mode: standalone)`. Notes that `100dvh` = `100svh` = 797px on initial load but expands to 844px after scroll.
10. **[#56724159](https://stackoverflow.com/questions/56724159)** — "PWA iOS annoying 20px gap on landscape." Same class of viewport-lie bug in landscape orientation.

### Apple Developer Forums

11. **[#803987](https://developer.apple.com/forums/thread/803987)** — "New iOS Safari CSS Issue with DVH & VH." `100dvh` no longer covers full screen after iOS update. Switching to `100vh` fixes it.
12. **[#735055](https://developer.apple.com/forums/thread/735055)** — `window.innerHeight` is incorrect in standalone PWA.
13. **[#744327](https://developer.apple.com/forums/thread/744327)** — `position: fixed` bottom breaks after several hours of mixed use in iOS 17 PWA.
14. **[#798014](https://developer.apple.com/forums/thread/798014)** — Change to safe-area logic causing black gap in landscape PWA.
15. **[#699415](https://developer.apple.com/forums/thread/699415)** — `env(safe-area-inset-*)` always 0px in certain conditions.

### GitHub issues & docs

16. **[gueridon/ios-standalone-viewport.md](https://github.com/spm1001/gueridon/blob/main/docs/ios-standalone-viewport.md)** — Most comprehensive first-party investigation. Measured all viewport units on iPhone 14 Pro. Documents the "docking" recalculation behavior, `calc(100dvh + 1px)` trick, feedback loop with `calc(100dvh + env())`, and final body-scroll approach.
17. **[boolinator/ios-pwa-bottom-bar-fix.md](https://github.com/korovatron/boolinator/blob/main/ios-pwa-bottom-bar-fix.md)** — Documents the intermittent bottom bar, the `visualViewport.height + safe-area-inset-top` JS compensation pattern, and staggered retry timings (50/150/300/500/800/1200ms).
18. **[iPhone game guide gist](https://gist.github.com/fozzedout/5e77925381991a9570151550992baf14)** — Authoritative guide to fullscreen PWA games on iPhone. Key findings: `100vh` is the ONLY unit that works from cold start; `height: 100%` breaks `viewport-fit=cover`; `100dvh` isn't initialized until viewport is "exercised". Includes DOM probe technique for reading `env()` values.
19. **[Latitudes-Dev/shuvcode#244](https://github.com/Latitudes-Dev/shuvcode/issues/244)** — Fix iOS PWA safe area handling for Dynamic Island and bottom home indicator. Documents the same top/bottom gap symptoms.
20. **[Next.js discussion #81264](https://github.com/vercel/next.js/discussions/81264)** — `env(safe-area-inset-bottom)` becomes 0px after `<Link>` navigation in standalone PWA. Confirms env() unreliability in standalone.

### Articles & guides

21. **[dev.to: Make Your PWAs Look Handsome on iOS](https://dev.to/karmasakshi/make-your-pwas-look-handsome-on-ios-1o08)** — `viewport-fit=cover` + `black-translucent` for edge-to-edge. Apple limits viewport by default in standalone.
22. **[dev.to: Avoid notches in your PWA with just CSS](https://dev.to/marionauta/avoid-notches-in-your-pwa-with-just-css-al7)** — `env(safe-area-inset-*)` patterns with fallback values.
23. **[frontend.fyi: Finally a fix for 100vh](https://www.frontend.fyi/tutorials/finally-a-fix-for-100vh-on-mobile)** — Historical context for `dvh`/`svh`/`lvh` units. Does not cover the standalone regression.
24. **[Medium: Fix 100vh Mobile Layout Issues](https://medium.com/@TusharKanjariya/why-100vh-breaks-on-mobile-and-what-to-use-instead-a4e65cb2797f)** — Recommends `dvh` as the fix for `vh`. Correct for browser mode, incorrect for standalone.
25. **[LinkedIn: Stop Using 100vh on Mobile](https://www.linkedin.com/pulse/stop-using-100vh-mobile-heres-what-use-instead-joodi--xxscf)** — Same recommendation (dvh over vh). Correct for browser, not standalone.

---

## Changelog

| Date | Commit | Change |
|---|---|---|
| 2026-04-15 | `078054c6` | Final fix: `100dvh` default, `100vh` override in standalone JS |
| 2026-04-15 | `ca7d3db2` | Replaced all `100dvh` with `100vh` (too aggressive — broke browser mode) |
| 2026-04-15 | `3f0fca88` | Tried `calc(100dvh + 1px)` (caused animation on keyboard close) |
| 2026-04-14 | `e94fb1f8` | Added `black-translucent` (needed but insufficient alone) |
| 2026-04-14 | Multiple | Eight failed approaches attempted and documented above |
