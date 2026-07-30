import type { TabState } from '../panes/tab-store.js';

export const MOBILE_CHAT_TAB_ID = 'piclaw://chat';

export interface MobileTabState extends TabState {
  closable?: boolean;
  contextMenu?: boolean;
  surface?: 'chat' | 'pane';
}

export const MOBILE_CHAT_TAB: Readonly<MobileTabState> = Object.freeze({
  id: MOBILE_CHAT_TAB_ID,
  label: 'Chat',
  path: 'Chat',
  dirty: false,
  pinned: false,
  closable: false,
  contextMenu: false,
  surface: 'chat',
});

/**
 * Add the permanent Chat handle only when another surface is open.
 * With Chat alone there is intentionally no visible tab strip.
 */
export function composeMobileTabStripTabs(
  tabs: TabState[],
  enabled: boolean,
): MobileTabState[] | TabState[] {
  return enabled && tabs.length > 0 ? [MOBILE_CHAT_TAB, ...tabs] : tabs;
}

/**
 * Pick the tab immediately to the right of a closing pane, then the one to
 * its left. Chat is conceptually immediately left of the first pane.
 */
export function resolveMobileSurfaceAfterClose(
  tabs: TabState[],
  closingId: string,
): string {
  const index = tabs.findIndex((tab) => tab.id === closingId);
  if (index < 0) return MOBILE_CHAT_TAB_ID;
  return tabs[index + 1]?.id || tabs[index - 1]?.id || MOBILE_CHAT_TAB_ID;
}

export function isMobileChatTabId(id: string | null | undefined): boolean {
  return id === MOBILE_CHAT_TAB_ID;
}
