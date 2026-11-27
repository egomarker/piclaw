/** Event-driven caret avoidance for the compose session switcher. */
type Bounds = { left: number; right: number; top: number; bottom: number };
const CARET_GAP = 2;
const OFFSET_PROPERTY = '--compose-session-pill-offset-y';
const MIRROR_STYLES = [
  'font-family', 'font-size', 'font-weight', 'font-style', 'font-stretch', 'font-variant',
  'font-kerning', 'font-feature-settings', 'font-variation-settings', 'line-height', 'letter-spacing',
  'word-spacing', 'text-transform', 'text-align', 'text-indent', 'tab-size',
  'direction', 'unicode-bidi', 'white-space', 'word-break', 'overflow-wrap',
  'text-size-adjust', '-webkit-text-size-adjust', 'padding',
];

/** Zero returns the pill home; null yields when neither placement has room. */
export function resolveComposeSessionPillOffset(
  home: Bounds,
  caret: Bounds,
  editor: { top: number; bottom: number },
  freeTop: number,
): number | null {
  if (caret.right + CARET_GAP <= home.left || caret.left - CARET_GAP >= home.right
    || caret.bottom + CARET_GAP <= home.top || caret.top - CARET_GAP >= home.bottom) return 0;

  const height = home.bottom - home.top;
  const below = Math.max(editor.top, caret.bottom + CARET_GAP);
  if (below + height <= editor.bottom) return below - home.top;

  const above = Math.min(editor.top, caret.top) - CARET_GAP - height;
  return above >= freeTop ? above - home.top : null;
}

function createCaretMirror(doc: Document, win: Window) {
  const mirror = doc.createElement('div');
  mirror.setAttribute('aria-hidden', 'true');
  mirror.style.cssText = 'position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;contain:layout style paint;box-sizing:border-box;border:0;margin:0';
  const text = doc.createTextNode('');
  const range = doc.createRange();
  mirror.append(text);
  doc.body.append(mirror);

  let lastValue: string | undefined;
  let lastIndex = -1;
  let lastWidth = -1;
  let lastCaret: Bounds | undefined;
  return {
    measure(editor: HTMLTextAreaElement, value: string, index: number, styleChanged: boolean) {
      const width = editor.clientWidth;
      if (styleChanged || width !== lastWidth) {
        const style = win.getComputedStyle(editor);
        for (const name of MIRROR_STYLES) mirror.style.setProperty(name, style.getPropertyValue(name));
        mirror.style.width = `${width}px`;
        lastWidth = width;
        lastIndex = -1;
      }
      if (value !== lastValue) {
        // Materialize the last visual line when the draft ends in a newline.
        text.data = value.endsWith('\n') ? `${value}\u200b` : value;
        lastValue = value;
        lastIndex = -1;
      }
      if (index !== lastIndex) {
        range.setStart(text, index);
        range.collapse(true);
        const rect = range.getBoundingClientRect();
        const origin = mirror.getBoundingClientRect();
        lastCaret = rect.height > 0 ? {
          left: rect.left - origin.left,
          right: rect.right - origin.left,
          top: rect.top - origin.top,
          bottom: rect.bottom - origin.top,
        } : undefined;
        lastIndex = index;
      }
      return lastCaret;
    },
    remove: () => mirror.remove(),
  };
}

function precedingBottom(element: Element): number {
  for (let sibling = element.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
    const rect = sibling.getBoundingClientRect();
    if (rect.height > 0) return rect.bottom;
  }
  return -Infinity;
}

export function observeComposeSessionPill(editor: HTMLTextAreaElement, anchor: HTMLElement) {
  const doc = editor.ownerDocument;
  const view = doc.defaultView;
  const inputWrapper = anchor.parentElement;
  if (!view || !inputWrapper) return;
  const win = view;
  const wrapper = inputWrapper;

  let frame: number | null = null;
  let offset: number | null = 0;
  let mirror: ReturnType<typeof createCaretMirror> | undefined;
  let styleChanged = true;
  let focusEvents: AbortController | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let pointerId: number | undefined;

  function place(next: number | null) {
    if (next === offset) return;
    offset = next;
    if (next) anchor.style.setProperty(OFFSET_PROPERTY, `${next}px`);
    else anchor.style.removeProperty(OFFSET_PROPERTY);
    anchor.toggleAttribute('data-caret-yield', next === null);
  }

  function update() {
    frame = null;
    if (pointerId !== undefined) return;
    if (doc.activeElement !== editor || !editor.value) {
      mirror?.remove();
      mirror = undefined;
      place(0);
      return;
    }
    const index = editor.selectionStart;
    if (index !== editor.selectionEnd) return place(0);

    // Only the button translates. The anchor always measures its home rectangle.
    const home = anchor.getBoundingClientRect();
    const input = editor.getBoundingClientRect();
    if (!home.width || !input.width || input.top - CARET_GAP >= home.bottom || input.bottom + CARET_GAP <= home.top) return place(0);

    mirror ??= createCaretMirror(doc, win);
    const measured = mirror.measure(editor, editor.value, index, styleChanged);
    styleChanged = false;
    if (!measured) return place(0);

    const x = input.left + editor.clientLeft - editor.scrollLeft;
    const y = input.top + editor.clientTop - editor.scrollTop;
    const viewport = win.visualViewport;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportBottom = viewport ? viewportTop + viewport.height : win.innerHeight;
    const visibleEditor = { top: Math.max(input.top, viewportTop), bottom: Math.min(input.bottom, viewportBottom) };
    const caret = { left: x + measured.left, right: x + measured.right, top: y + measured.top, bottom: y + measured.bottom };
    if (caret.bottom <= visibleEditor.top || caret.top >= visibleEditor.bottom) return place(0);

    const next = resolveComposeSessionPillOffset(home, caret, visibleEditor, viewportTop);
    // Check neighboring controls only if the preferred downward position didn't fit.
    if (next !== null && next < 0 && home.top + next < Math.max(precedingBottom(editor), precedingBottom(wrapper))) {
      return place(null);
    }
    place(next);
  }

  function queue() {
    if (frame === null && pointerId === undefined) frame = win.requestAnimationFrame(update);
  }

  const refresh = () => { if (doc.activeElement === editor) queue(); };
  const invalidate = () => { styleChanged = true; refresh(); };

  function stop() {
    focusEvents?.abort();
    focusEvents = undefined;
    resizeObserver?.disconnect();
    resizeObserver = undefined;
    if (frame !== null) win.cancelAnimationFrame(frame);
    frame = null;
    mirror?.remove();
    mirror = undefined;
    if (pointerId === undefined) place(0);
  }

  function start() {
    if (!focusEvents) {
      focusEvents = new AbortController();
      const options = { signal: focusEvents.signal, passive: true };
      for (const event of ['input', 'select', 'selectionchange', 'keyup', 'click', 'scroll', 'compositionend']) {
        editor.addEventListener(event, refresh, options);
      }
      doc.addEventListener('selectionchange', refresh, options);
      doc.fonts?.addEventListener('loadingdone', invalidate, options);
      win.addEventListener('resize', invalidate, options);
      win.visualViewport?.addEventListener('resize', invalidate, options);
      win.visualViewport?.addEventListener('scroll', refresh, options);
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(invalidate);
        resizeObserver.observe(editor);
        resizeObserver.observe(anchor);
        resizeObserver.observe(wrapper);
      }
    }
    invalidate();
  }

  function unpin() {
    pointerId = undefined;
    doc.removeEventListener('pointerup', finishPointer, true);
    doc.removeEventListener('pointercancel', finishPointer, true);
    win.removeEventListener('blur', finishPointer);
  }

  function finishPointer(event: Event) {
    if ('pointerId' in event && event.pointerId !== pointerId) return;
    unpin();
    queue();
  }

  function pin(event: PointerEvent) {
    if (offset === 0 || pointerId !== undefined) return;
    // A tap may blur the editor before click. Don't move the button out from under it.
    pointerId = event.pointerId;
    doc.addEventListener('pointerup', finishPointer, true);
    doc.addEventListener('pointercancel', finishPointer, true);
    win.addEventListener('blur', finishPointer);
  }

  editor.addEventListener('focus', start);
  editor.addEventListener('blur', stop);
  anchor.addEventListener('pointerdown', pin);
  if (doc.activeElement === editor) start();

  return {
    refresh,
    dispose() {
      unpin();
      stop();
      editor.removeEventListener('focus', start);
      editor.removeEventListener('blur', stop);
      anchor.removeEventListener('pointerdown', pin);
    },
  };
}
