import type { TabState } from '../panes/tab-store.js';

export const MOBILE_CHAT_TAB_ID = 'piclaw://chat';
export const MOBILE_WORKSPACE_TAB_ID = 'piclaw://workspace';

export const MOBILE_SURFACE_TABLIST_ID = 'piclaw-mobile-surface-tablist';
export const MOBILE_CHAT_TAB_ELEMENT_ID = 'piclaw-mobile-surface-tab-chat';
export const MOBILE_WORKSPACE_TAB_ELEMENT_ID = 'piclaw-mobile-surface-tab-workspace';
export const MOBILE_CHAT_PANEL_ID = 'piclaw-mobile-surface-panel-chat';
export const MOBILE_WORKSPACE_PANEL_ID = 'piclaw-mobile-surface-panel-workspace';
export const MOBILE_PANE_PANEL_ID = 'piclaw-mobile-surface-panel-pane';

function encodeMobilePaneTabId(id: string): string {
  const encoded = Array.from(id, (character) => {
    if (/^[A-Za-z0-9]$/.test(character)) return character;
    return `_${character.codePointAt(0)?.toString(16) || '0'}_`;
  }).join('');
  return encoded || 'empty';
}

/** Stable DOM id for a Mobile surface tab, including arbitrary pane paths. */
export function getMobileSurfaceTabElementId(id: string): string {
  if (id === MOBILE_CHAT_TAB_ID) return MOBILE_CHAT_TAB_ELEMENT_ID;
  if (id === MOBILE_WORKSPACE_TAB_ID) return MOBILE_WORKSPACE_TAB_ELEMENT_ID;
  return `piclaw-mobile-surface-tab-pane-${encodeMobilePaneTabId(String(id || ''))}`;
}

/** Mobile reuses one pane host while switching among file and terminal tabs. */
export function getMobileSurfacePanelId(id: string): string {
  if (id === MOBILE_CHAT_TAB_ID) return MOBILE_CHAT_PANEL_ID;
  if (id === MOBILE_WORKSPACE_TAB_ID) return MOBILE_WORKSPACE_PANEL_ID;
  return MOBILE_PANE_PANEL_ID;
}

export interface MobileTabState extends TabState {
  closable?: boolean;
  contextMenu?: boolean;
  surface?: 'chat' | 'workspace' | 'pane';
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

export const MOBILE_WORKSPACE_TAB: Readonly<MobileTabState> = Object.freeze({
  id: MOBILE_WORKSPACE_TAB_ID,
  label: 'Workspace',
  path: 'Workspace',
  dirty: false,
  pinned: false,
  closable: false,
  contextMenu: false,
  surface: 'workspace',
});

/**
 * Narrow Mobile always exposes Chat and Workspace. Wide Mobile keeps the
 * original behavior: Chat joins the strip only while pane tabs are open.
 */
export function composeMobileTabStripTabs(
  tabs: TabState[],
  enabled: boolean,
  workspaceTabEnabled = false,
): MobileTabState[] | TabState[] {
  if (!enabled) return tabs;
  if (workspaceTabEnabled) return [MOBILE_CHAT_TAB, MOBILE_WORKSPACE_TAB, ...tabs];
  return tabs.length > 0 ? [MOBILE_CHAT_TAB, ...tabs] : tabs;
}

/**
 * Pick the tab immediately to the right of a closing pane, then the one to
 * its left. In narrow Mobile, Workspace is immediately left of the first
 * pane; in wide Mobile, Chat remains the final fallback.
 */
export function resolveMobileSurfaceAfterClose(
  tabs: TabState[],
  closingId: string,
  workspaceTabEnabled = false,
): string {
  const index = tabs.findIndex((tab) => tab.id === closingId);
  if (index < 0) return workspaceTabEnabled ? MOBILE_WORKSPACE_TAB_ID : MOBILE_CHAT_TAB_ID;
  return tabs[index + 1]?.id
    || tabs[index - 1]?.id
    || (workspaceTabEnabled ? MOBILE_WORKSPACE_TAB_ID : MOBILE_CHAT_TAB_ID);
}

/** Restore a valid Chat/pane surface when a compact Workspace tab becomes a rail. */
export function resolveSurfaceAfterWorkspaceTabDisabled(
  activeSurfaceId: string | null | undefined,
  lastPrimarySurfaceId: string | null | undefined,
  tabs: TabState[],
): { surfaceId: string; openWorkspaceRail: boolean } {
  if (!isMobileWorkspaceTabId(activeSurfaceId)) {
    return {
      surfaceId: activeSurfaceId || tabs.find((tab) => tab.id)?.id || MOBILE_CHAT_TAB_ID,
      openWorkspaceRail: false,
    };
  }

  const paneIds = new Set(tabs.map((tab) => tab.id));
  const surfaceId = isMobileChatTabId(lastPrimarySurfaceId) || paneIds.has(String(lastPrimarySurfaceId || ''))
    ? String(lastPrimarySurfaceId)
    : tabs.find((tab) => tab.id)?.id || MOBILE_CHAT_TAB_ID;
  return { surfaceId, openWorkspaceRail: true };
}

export function isMobileChatTabId(id: string | null | undefined): boolean {
  return id === MOBILE_CHAT_TAB_ID;
}

export function isMobileWorkspaceTabId(id: string | null | undefined): boolean {
  return id === MOBILE_WORKSPACE_TAB_ID;
}

export function isMobilePermanentTabId(id: string | null | undefined): boolean {
  return isMobileChatTabId(id) || isMobileWorkspaceTabId(id);
}
