import { html, useCallback, useEffect, useMemo, useRef, useState } from '../vendor/preact-htm.js';
import { ChatSessionContextMenu, resolveRunningChatSessions } from './chat-session-context-menu.js';

export const ACTIVE_SESSIONS_AUTO_COLLAPSE_MS = 10_000;
export const ACTIVE_SESSIONS_INDICATOR_PANEL_ID = 'piclaw-active-sessions-panel';

export function resolveActiveSessionsIndicatorState(chats: unknown, surfaceActive = true): {
  count: number;
  visible: boolean;
} {
  const count = resolveRunningChatSessions(chats).length;
  return {
    count,
    visible: Boolean(surfaceActive && count > 0),
  };
}

export function ActiveSessionsIndicator({
  chats,
  surfaceActive = true,
  loadActiveChats,
  currentChatJid,
  onSwitchChat,
}: {
  chats?: unknown;
  surfaceActive?: boolean;
  loadActiveChats?: () => Promise<{ chats?: unknown[] } | unknown[]>;
  currentChatJid?: string | null;
  onSwitchChat?: (chatJid: string) => void;
}) {
  const { count, visible } = useMemo(
    () => resolveActiveSessionsIndicatorState(chats, surfaceActive),
    [chats, surfaceActive],
  );
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const autoCollapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFrequentInteractionAtRef = useRef(0);

  const clearAutoCollapseTimer = useCallback(() => {
    if (autoCollapseTimerRef.current === null) return;
    clearTimeout(autoCollapseTimerRef.current);
    autoCollapseTimerRef.current = null;
  }, []);

  const collapse = useCallback((restoreFocus = false) => {
    clearAutoCollapseTimer();
    setOpen(false);
    if (restoreFocus) {
      queueMicrotask(() => triggerRef.current?.focus?.({ preventScroll: true }));
    }
  }, [clearAutoCollapseTimer]);

  const restartAutoCollapseTimer = useCallback(() => {
    clearAutoCollapseTimer();
    if (!open) return;
    autoCollapseTimerRef.current = setTimeout(() => {
      autoCollapseTimerRef.current = null;
      collapse(true);
    }, ACTIVE_SESSIONS_AUTO_COLLAPSE_MS);
  }, [clearAutoCollapseTimer, collapse, open]);

  useEffect(() => {
    if (!open) {
      clearAutoCollapseTimer();
      return undefined;
    }
    restartAutoCollapseTimer();
    return clearAutoCollapseTimer;
  }, [clearAutoCollapseTimer, open, restartAutoCollapseTimer]);

  useEffect(() => {
    if (!visible && open) collapse(false);
  }, [collapse, open, visible]);

  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    const Observer = panel?.ownerDocument?.defaultView?.MutationObserver;
    if (!panel || !Observer) return undefined;

    const focusFirstAction = () => {
      const firstAction = panel.querySelector<HTMLButtonElement>('button:not(:disabled)');
      if (!firstAction) return false;
      firstAction.focus({ preventScroll: true });
      return true;
    };
    if (focusFirstAction()) return undefined;

    const observer = new Observer(() => {
      if (focusFirstAction()) observer.disconnect();
    });
    observer.observe(panel, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const root = rootRef.current;
    const ownerDocument = root?.ownerDocument;
    if (!root || !ownerDocument) return undefined;

    const handleOutsidePointer = (event: PointerEvent) => {
      if (root.contains(event.target as Node)) return;
      collapse(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      collapse(true);
    };

    ownerDocument.addEventListener('pointerdown', handleOutsidePointer, true);
    ownerDocument.addEventListener('keydown', handleEscape);
    return () => {
      ownerDocument.removeEventListener('pointerdown', handleOutsidePointer, true);
      ownerDocument.removeEventListener('keydown', handleEscape);
    };
  }, [collapse, open]);

  const noteInteraction = useCallback(() => {
    if (open) restartAutoCollapseTimer();
  }, [open, restartAutoCollapseTimer]);

  const noteFrequentInteraction = useCallback(() => {
    if (!open) return;
    const now = Date.now();
    if (now - lastFrequentInteractionAtRef.current < 250) return;
    lastFrequentInteractionAtRef.current = now;
    restartAutoCollapseTimer();
  }, [open, restartAutoCollapseTimer]);

  const countLabel = `${count} active ${count === 1 ? 'session' : 'sessions'}`;
  const className = [
    'tab-context-menu',
    'custom-tab-context-menu',
    'active-sessions-indicator',
    visible ? 'is-visible' : '',
    open ? 'is-open' : '',
  ].filter(Boolean).join(' ');

  return html`
    <div
      ref=${rootRef}
      class=${className}
      data-testid="active-sessions-indicator"
      data-active-session-count=${count}
      aria-hidden=${visible ? undefined : 'true'}
      onPointerDown=${noteInteraction}
      onPointerMove=${noteFrequentInteraction}
      onWheel=${noteFrequentInteraction}
      onKeyDown=${noteInteraction}
      onFocusIn=${noteInteraction}
    >
      <button
        ref=${triggerRef}
        type="button"
        class="active-sessions-indicator-trigger"
        data-testid="active-sessions-indicator-trigger"
        title=${countLabel}
        aria-label=${`${countLabel}. Show running sessions.`}
        aria-haspopup="menu"
        aria-expanded=${open ? 'true' : 'false'}
        aria-controls=${ACTIVE_SESSIONS_INDICATOR_PANEL_ID}
        tabIndex=${visible && !open ? 0 : -1}
        onClick=${() => setOpen(true)}
      >
        <span class="active-sessions-indicator-count" aria-hidden="true">${count}</span>
      </button>
      <div
        ref=${panelRef}
        id=${ACTIVE_SESSIONS_INDICATOR_PANEL_ID}
        class="active-sessions-indicator-panel"
        data-testid="active-sessions-indicator-panel"
        aria-hidden=${open ? undefined : 'true'}
        inert=${open ? undefined : true}
      >
        ${open && html`
          <${ChatSessionContextMenu}
            loadActiveChats=${loadActiveChats}
            currentChatJid=${currentChatJid}
            onSwitchChat=${onSwitchChat}
            onClose=${() => collapse(false)}
          />
        `}
      </div>
    </div>
  `;
}
