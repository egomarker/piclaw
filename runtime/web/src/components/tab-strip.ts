/**
 * tab-strip.ts — Tab strip UI component for the pane system.
 *
 * Renders a horizontal strip of tabs with:
 * - Active tab highlight
 * - Dirty indicator (filled circle)
 * - Close button per tab (× icon, replaced by dirty dot when dirty)
 * - Middle-click to close
 * - Context menu: Close, Close Others, Close All, Pin/Unpin, Preview (markdown)
 * - Keyboard shortcuts: Ctrl+Tab (next), Ctrl+Shift+Tab (prev), Ctrl+W (close)
 */

import { html, useCallback, useEffect, useMemo, useRef, useState } from '../vendor/preact-htm.js';
import { useTranslation } from '../utils/i18n.js';
import { paneRegistry } from '../panes/index.js';
import { resolveAddonStandaloneTabUrl } from '../ui/addon-web-extensions.js';
import { canTabCompareToSaved } from '../ui/tab-compare-saved.js';
import { canTabEditSource, getTabEditSourceLabel } from '../ui/tab-source-editor.js';

/**
 * TabStrip — horizontal tab bar for open editor files.
 *
 * @param {Object} props
 * @param {(import('../panes/tab-store.js').TabState & { closable?: boolean, contextMenu?: boolean })[]} props.tabs
 * @param {string|null} props.activeId
 * @param {(id: string) => void} props.onActivate
 * @param {(id: string) => void} props.onClose
 * @param {(id: string) => void} props.onCloseOthers
 * @param {() => void} props.onCloseAll
 * @param {(id: string) => void} props.onTogglePin
 * @param {(id: string) => void} [props.onTogglePreview] - Toggle markdown preview for a tab.
 * @param {(id: string) => void} [props.onToggleDiff] - Toggle Compare to Saved diff mode for a tab.
 * @param {(id: string) => void} [props.onEditSource] - Replace a specialized editor tab with the generic source editor.
 * @param {Set<string>} [props.previewTabs] - Set of tab ids with preview open.
 * @param {Set<string>} [props.diffTabs] - Set of tab ids with Compare to Saved diff open.
 * @param {Map<string, string>} [props.paneOverrides] - Per-tab pane override ids.
 * @param {Map<string, unknown>} [props.detachedTabs] - Tabs currently detached into standalone windows.
 * @param {(id: string) => void} [props.onReattachTab] - Reattach a detached tab to the main window.
 * @param {() => void} [props.onToggleDock] - Toggle terminal dock visibility.
 * @param {boolean} [props.dockVisible] - Whether the terminal dock is currently visible.
 * @param {(id: string, label?: string) => void} [props.onPopOutTab] - Open a tab in a standalone window.
 * @param {boolean} [props.rovingFocus] - Enable one-tab-stop keyboard navigation.
 * @param {boolean} [props.restoreFocusAfterClose] - Restore focus to the replacement active tab after closing the active tab.
 * @param {string} [props.tabListId] - Stable id for the tablist.
 * @param {string} [props.tabListLabel] - Accessible name for the tablist.
 * @param {(id: string) => string} [props.getTabElementId] - Resolve a stable DOM id for a tab.
 * @param {(id: string) => string} [props.getTabPanelId] - Resolve the controlled panel DOM id for a tab.
 */
const OFFICE_EXTENSIONS = /\.(docx?|xlsx?|pptx?|odt|ods|odp|rtf)$/i;
const CSV_EXTENSIONS = /\.(csv|tsv)$/i;
const PDF_EXTENSIONS = /\.pdf$/i;
const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|bmp|ico|svg)$/i;

export function isTabClosable(tab) {
    return Boolean(tab) && tab.closable !== false;
}

export function hasTabContextMenu(tab) {
    return Boolean(tab) && tab.contextMenu !== false;
}

export function getStandaloneTabUrl(path, { hasPopOutTab = false } = {}) {
    const normalizedPath = typeof path === 'string' ? path.trim() : '';
    if (!normalizedPath) return null;
    const addonResolvedUrl = resolveAddonStandaloneTabUrl(normalizedPath, { hasPopOutTab });
    if (addonResolvedUrl) return addonResolvedUrl;
    if (OFFICE_EXTENSIONS.test(normalizedPath)) {
        const rawUrl = '/workspace/raw?path=' + encodeURIComponent(normalizedPath);
        const name = normalizedPath.split('/').pop() || 'document';
        return '/office-viewer/?url=' + encodeURIComponent(rawUrl) + '&name=' + encodeURIComponent(name);
    }
    if (CSV_EXTENSIONS.test(normalizedPath)) {
        return '/data-viewer/?path=' + encodeURIComponent(normalizedPath);
    }
    if (PDF_EXTENSIONS.test(normalizedPath)) {
        return '/workspace/raw?path=' + encodeURIComponent(normalizedPath);
    }
    if (IMAGE_EXTENSIONS.test(normalizedPath)) {
        return '/image-viewer/?path=' + encodeURIComponent(normalizedPath);
    }
    return null;
}

export function resolveTabKeyboardTargetId(tabs, currentId, key) {
    if (!Array.isArray(tabs) || tabs.length === 0) return null;
    const currentIndex = tabs.findIndex((tab) => tab.id === currentId);
    if (key === 'Home') return tabs[0]?.id || null;
    if (key === 'End') return tabs[tabs.length - 1]?.id || null;
    if (key === 'ArrowRight') {
        if (currentIndex < 0) return tabs[0]?.id || null;
        return tabs[(currentIndex + 1) % tabs.length]?.id || null;
    }
    if (key === 'ArrowLeft') {
        if (currentIndex < 0) return tabs[tabs.length - 1]?.id || null;
        return tabs[(currentIndex - 1 + tabs.length) % tabs.length]?.id || null;
    }
    return null;
}

export function resolveRovingTabIndex(tabs, activeId, tabId) {
    if (!Array.isArray(tabs) || tabs.length === 0) return -1;
    const focusableId = tabs.some((tab) => tab.id === activeId) ? activeId : tabs[0]?.id;
    return tabId === focusableId ? 0 : -1;
}

export function shouldQueueTabFocusAfterClose(enabled, activeId, closingId) {
    return enabled === true && Boolean(activeId) && closingId === activeId;
}

export function resolveTabFocusAfterClose(tabs, activeId, closedId) {
    if (!closedId || !Array.isArray(tabs) || tabs.some((tab) => tab.id === closedId)) return null;
    return tabs.some((tab) => tab.id === activeId) ? activeId : null;
}

export function handleRovingTabKeyDown(event, { tabs, currentId, focusTab, onActivate }) {
    if (event.altKey || event.ctrlKey || event.metaKey) return false;
    const activationKey = event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar';
    const targetId = activationKey
        ? tabs.find((tab) => tab.id === currentId)?.id || null
        : resolveTabKeyboardTargetId(tabs, currentId, event.key);
    if (!targetId) return false;
    event.preventDefault();
    focusTab?.(targetId);
    onActivate?.(targetId);
    return true;
}

export function TabStrip({ tabs, activeId, onActivate, onClose, onCloseOthers, onCloseAll, onTogglePin, onTogglePreview, onToggleDiff, onEditSource, previewTabs, diffTabs, paneOverrides, detachedTabs, onReattachTab, onToggleDock, dockVisible, onToggleZen, zenMode, onPopOutTab, rovingFocus = false, restoreFocusAfterClose = false, tabListId, tabListLabel, getTabElementId, getTabPanelId }) {
    const { t } = useTranslation();
    const [contextMenu, setContextMenu] = useState(null);
    const stripRef = useRef(null);
    const pendingFocusAfterCloseRef = useRef(null);

    const focusTabById = useCallback((id) => {
        if (!rovingFocus || !stripRef.current) return;
        const elementId = getTabElementId?.(id);
        const byId = elementId ? stripRef.current.ownerDocument?.getElementById(elementId) : null;
        const tabIndex = tabs.findIndex((tab) => tab.id === id);
        const target = byId && stripRef.current.contains(byId)
            ? byId
            : stripRef.current.querySelectorAll('[role="tab"]')[tabIndex];
        target?.focus?.({ preventScroll: true });
    }, [getTabElementId, rovingFocus, tabs]);

    const requestTabClose = useCallback((id) => {
        if (shouldQueueTabFocusAfterClose(rovingFocus && restoreFocusAfterClose, activeId, id)) {
            pendingFocusAfterCloseRef.current = id;
        }
        onClose?.(id);
    }, [activeId, onClose, restoreFocusAfterClose, rovingFocus]);

    useEffect(() => {
        if (!rovingFocus || !restoreFocusAfterClose) return;
        const closedId = pendingFocusAfterCloseRef.current;
        if (!closedId) return;
        if (tabs.some((tab) => tab.id === closedId)) {
            pendingFocusAfterCloseRef.current = null;
            return;
        }
        const focusTargetId = resolveTabFocusAfterClose(tabs, activeId, closedId);
        if (!focusTargetId) return;
        pendingFocusAfterCloseRef.current = null;
        focusTabById(focusTargetId);
    }, [activeId, focusTabById, restoreFocusAfterClose, rovingFocus, tabs]);

    // Close context menu on outside click or Escape
    useEffect(() => {
        if (!contextMenu) return;
        const dismiss = (e) => {
            if (e.type === 'keydown' && e.key !== 'Escape') return;
            setContextMenu(null);
        };
        document.addEventListener('click', dismiss);
        document.addEventListener('keydown', dismiss);
        return () => {
            document.removeEventListener('click', dismiss);
            document.removeEventListener('keydown', dismiss);
        };
    }, [contextMenu]);

    // Keyboard shortcuts
    useEffect(() => {
        const onKeyDown = (e) => {
            // Ctrl+Tab / Ctrl+Shift+Tab: cycle tabs
            if (e.ctrlKey && e.key === 'Tab') {
                e.preventDefault();
                if (!tabs.length) return;
                const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
                const classicTarget = e.shiftKey
                    ? tabs[(activeIndex - 1 + tabs.length) % tabs.length]
                    : tabs[(activeIndex + 1) % tabs.length];
                const targetId = rovingFocus
                    ? resolveTabKeyboardTargetId(tabs, activeId, e.shiftKey ? 'ArrowLeft' : 'ArrowRight')
                    : classicTarget?.id || null;
                if (targetId) {
                    focusTabById(targetId);
                    onActivate?.(targetId);
                }
                return;
            }
            // Ctrl+W / Cmd+W: close active tab (only when editor focused)
            if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
                // Only intercept if an editor pane is focused
                const editorPane = document.querySelector('.editor-pane');
                if (editorPane && editorPane.contains(document.activeElement)) {
                    const activeTab = tabs.find((tab) => tab.id === activeId);
                    if (isTabClosable(activeTab)) {
                        e.preventDefault();
                        requestTabClose(activeId);
                    }
                }
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [tabs, activeId, focusTabById, onActivate, requestTabClose, rovingFocus]);

    const handleTabMouseDown = useCallback((e, tab) => {
        // Skip if the press landed on the close button — let close handle it.
        if (e.target?.closest?.('.tab-close')) return;
        // Activate on press instead of waiting for click. Some embedded panes
        // and touch/pointer paths can swallow the synthetic click, but the
        // tab should still come to the front as soon as the primary press lands.
        if (e.button === 0) {
            if (rovingFocus) e.currentTarget?.focus?.({ preventScroll: true });
            onActivate?.(tab.id);
            return;
        }
        // Middle-click closes immediately so the tab never becomes active.
        if (e.button === 1 && isTabClosable(tab)) {
            e.preventDefault();
            requestTabClose(tab.id);
        }
    }, [onActivate, requestTabClose, rovingFocus]);

    const handleTabKeyDown = useCallback((event, tab) => {
        if (!rovingFocus || event.target !== event.currentTarget) return;
        handleRovingTabKeyDown(event, {
            tabs,
            currentId: tab.id,
            focusTab: focusTabById,
            onActivate,
        });
    }, [focusTabById, onActivate, rovingFocus, tabs]);

    const handleTabClick = useCallback((e, id) => {
        if (e.defaultPrevented) return;
        if (e.target?.closest?.('.tab-close')) return;
        if (e.button === 0) {
            onActivate?.(id);
        }
    }, [onActivate]);

    const handleContextMenu = useCallback((e, tab) => {
        e.preventDefault();
        if (!hasTabContextMenu(tab)) return;
        setContextMenu({ id: tab.id, x: e.clientX, y: e.clientY });
    }, []);

    const handleClosePointerDown = useCallback((e) => {
        // Keep close-button pointer presses isolated from the parent tab so the
        // tab never activates before the close click lands. Do not prevent the
        // default action here: on touch/pointer browsers that can suppress the
        // synthetic click that actually closes the tab.
        e.stopPropagation();
    }, []);

    const handleCloseClick = useCallback((e, id) => {
        e.preventDefault();
        e.stopPropagation();
        requestTabClose(id);
    }, [requestTabClose]);

    // Scroll active tab into view
    useEffect(() => {
        if (!activeId || !stripRef.current) return;
        const activeEl = stripRef.current.querySelector('.tab-item.active');
        if (activeEl) {
            activeEl.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        }
    }, [activeId]);

    const getPaneOverride = useCallback((id) => {
        if (!(paneOverrides instanceof Map)) return null;
        return paneOverrides.get(id) || null;
    }, [paneOverrides]);

    const contextMenuTab = useMemo(
        () => tabs.find((tab) => tab.id === contextMenu?.id) || null,
        [contextMenu?.id, tabs],
    );
    const contextMenuCanEditSource = useMemo(() => {
        const tabId = contextMenu?.id;
        if (!tabId) return false;
        return canTabEditSource(tabId, getPaneOverride(tabId), (context) => paneRegistry.resolve(context));
    }, [contextMenu?.id, getPaneOverride]);
    const contextMenuEditSourceLabel = useMemo(() => {
        const tabId = contextMenu?.id;
        if (!tabId) return 'Edit Source';
        return getTabEditSourceLabel(tabId, getPaneOverride(tabId), (context) => paneRegistry.resolve(context));
    }, [contextMenu?.id, getPaneOverride]);
    const isContextMenuTabDetached = useMemo(() => {
        const tabId = contextMenu?.id;
        if (!tabId || !(detachedTabs instanceof Map)) return false;
        return detachedTabs.has(tabId);
    }, [contextMenu?.id, detachedTabs]);
    const contextMenuDiffOpen = useMemo(() => {
        const tabId = contextMenu?.id;
        if (!tabId || !(diffTabs instanceof Set)) return false;
        return diffTabs.has(tabId);
    }, [contextMenu?.id, diffTabs]);
    const contextMenuCanCompareToSaved = useMemo(() => {
        const tabId = contextMenu?.id;
        if (!tabId) return false;
        const tab = tabs.find((item) => item.id === tabId) || null;
        if (!tab) return false;
        const supportsCompare = canTabCompareToSaved(tabId, getPaneOverride(tabId), (context) => paneRegistry.resolve(context));
        return supportsCompare && Boolean(tab.dirty || contextMenuDiffOpen);
    }, [contextMenu?.id, contextMenuDiffOpen, getPaneOverride, tabs]);

    if (!tabs.length) return null;

    return html`
        <div
            class="tab-strip"
            ref=${stripRef}
            role="tablist"
            id=${rovingFocus ? tabListId : undefined}
            aria-label=${rovingFocus ? tabListLabel : undefined}
            aria-orientation=${rovingFocus ? 'horizontal' : undefined}
        >
            ${tabs.map(tab => html`
                <div
                    key=${tab.id}
                    id=${rovingFocus ? getTabElementId?.(tab.id) : undefined}
                    class=${`tab-item${tab.id === activeId ? ' active' : ''}${tab.dirty ? ' dirty' : ''}${tab.pinned ? ' pinned' : ''}${isTabClosable(tab) ? '' : ' non-closable'}`}
                    role="tab"
                    aria-selected=${tab.id === activeId}
                    aria-controls=${rovingFocus ? getTabPanelId?.(tab.id) : undefined}
                    tabIndex=${rovingFocus ? resolveRovingTabIndex(tabs, activeId, tab.id) : undefined}
                    title=${tab.path}
                    onMouseDown=${(e) => handleTabMouseDown(e, tab)}
                    onClick=${(e) => handleTabClick(e, tab.id)}
                    onKeyDown=${rovingFocus ? (e) => handleTabKeyDown(e, tab) : undefined}
                    onContextMenu=${(e) => handleContextMenu(e, tab)}
                >
                    ${tab.pinned && html`
                        <span class="tab-pin-icon" aria-label=${t('tab.pinned')}>
                            <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                                <path d="M4.456.734a1.75 1.75 0 0 1 2.826.504l.613 1.327a3.1 3.1 0 0 0 2.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-2.204 2.205c-.968.968-2.623.5-2.94-.832l-.584-2.454a3.1 3.1 0 0 0-1.707-2.084l-1.327-.613a1.75 1.75 0 0 1-.504-2.826z"/>
                            </svg>
                        </span>
                    `}
                    <span class="tab-label">${tab.label}</span>
                    ${detachedTabs instanceof Map && detachedTabs.has(tab.id) && html`
                        <span class="tab-detached-badge" aria-label=${t('tab.detached')} title=${t('tab.openSeparateWindow')}>↗</span>
                    `}
                    ${isTabClosable(tab) && html`
                        <button
                            type="button"
                            class="tab-close"
                            onPointerDown=${handleClosePointerDown}
                            onMouseDown=${handleClosePointerDown}
                            onClick=${(e) => handleCloseClick(e, tab.id)}
                            title=${tab.dirty ? 'Unsaved changes' : 'Close'}
                            aria-label=${tab.dirty ? 'Unsaved changes' : `Close ${tab.label}`}
                        >
                            ${tab.dirty
                                ? html`<span class="tab-dirty-dot" aria-hidden="true"></span>`
                                : html`<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" focusable="false" style=${{ pointerEvents: 'none' }}>
                                    <line x1="4" y1="4" x2="12" y2="12" style=${{ pointerEvents: 'none' }}/>
                                    <line x1="12" y1="4" x2="4" y2="12" style=${{ pointerEvents: 'none' }}/>
                                </svg>`
                            }
                        </button>
                    `}
                </div>
            `)}
            ${onToggleDock && html`
                <div class="tab-strip-spacer"></div>
                <button
                    class=${`tab-strip-dock-toggle${dockVisible ? ' active' : ''}`}
                    onClick=${onToggleDock}
                    title=${`${dockVisible ? 'Hide' : 'Show'} terminal (Ctrl+\`)`}
                    aria-label=${`${dockVisible ? 'Hide' : 'Show'} terminal`}
                    aria-pressed=${dockVisible ? 'true' : 'false'}
                >
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="1.75" y="2.25" width="12.5" height="11.5" rx="2"/>
                        <polyline points="4.5 5.25 7 7.75 4.5 10.25"/>
                        <line x1="8.5" y1="10.25" x2="11.5" y2="10.25"/>
                    </svg>
                </button>
            `}
            ${onToggleZen && html`
                <button
                    class=${`tab-strip-zen-toggle${zenMode ? ' active' : ''}`}
                    onClick=${onToggleZen}
                    title=${`${zenMode ? 'Exit' : 'Enter'} zen mode (Ctrl+Shift+Z)`}
                    aria-label=${`${zenMode ? 'Exit' : 'Enter'} zen mode`}
                    aria-pressed=${zenMode ? 'true' : 'false'}
                >
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        ${zenMode
                            ? html`<polyline points="4 8 1.5 8 1.5 1.5 14.5 1.5 14.5 8 12 8"/><polyline points="4 8 1.5 8 1.5 14.5 14.5 14.5 14.5 8 12 8"/>`
                            : html`<polyline points="5.5 1.5 1.5 1.5 1.5 5.5"/><polyline points="10.5 1.5 14.5 1.5 14.5 5.5"/><polyline points="5.5 14.5 1.5 14.5 1.5 10.5"/><polyline points="10.5 14.5 14.5 14.5 14.5 10.5"/>`
                        }
                    </svg>
                </button>
            `}
        </div>
        ${contextMenu && html`
            <div class="tab-context-menu" style=${{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }}>
                <button onClick=${() => { requestTabClose(contextMenu.id); setContextMenu(null); }}>${t('tab.close')}</button>
                <button onClick=${() => { onCloseOthers?.(contextMenu.id); setContextMenu(null); }}>${t('tab.closeOthers')}</button>
                <button onClick=${() => { onCloseAll?.(); setContextMenu(null); }}>${t('tab.closeAll')}</button>
                <hr />
                <button onClick=${() => { onTogglePin?.(contextMenu.id); setContextMenu(null); }}>
                    ${contextMenuTab?.pinned ? 'Unpin' : 'Pin'}
                </button>
                ${onToggleDock && contextMenu.id === activeId && html`
                    <button onClick=${() => {
                        onToggleDock();
                        setContextMenu(null);
                    }}>${dockVisible ? 'Hide terminal dock' : 'Show terminal dock'}</button>
                `}
                ${contextMenuCanEditSource && onEditSource && html`
                    <button onClick=${() => {
                        onEditSource(contextMenu.id);
                        setContextMenu(null);
                    }}>${contextMenuEditSourceLabel}</button>
                `}
                ${isContextMenuTabDetached && onReattachTab && html`
                    <button onClick=${() => {
                        onReattachTab(contextMenu.id);
                        setContextMenu(null);
                    }}>${t('tab.reattach')}</button>
                `}
                ${onPopOutTab && !isContextMenuTabDetached && html`
                    <button onClick=${() => {
                        const tab = tabs.find(t => t.id === contextMenu.id);
                        onPopOutTab(contextMenu.id, tab?.label);
                        setContextMenu(null);
                    }}>${t('tab.openInWindow')}</button>
                `}
                ${contextMenuCanCompareToSaved && onToggleDiff && html`
                    <hr />
                    <button onClick=${() => {
                        onActivate?.(contextMenu.id);
                        onToggleDiff(contextMenu.id);
                        setContextMenu(null);
                    }}>${contextMenuDiffOpen ? 'Hide Diff' : 'Compare to Saved'}</button>
                `}
                ${onTogglePreview && /\.(md|mdx|markdown)$/i.test(contextMenu.id) && html`
                    <hr />
                    <button onClick=${() => { onTogglePreview(contextMenu.id); setContextMenu(null); }}>
                        ${previewTabs?.has(contextMenu.id) ? 'Hide Preview' : 'Preview'}
                    </button>
                `}
                ${(() => {
                    const standaloneUrl = getStandaloneTabUrl(contextMenu.id, {
                        hasPopOutTab: typeof onPopOutTab === 'function',
                    });
                    if (!standaloneUrl) return null;
                    return html`
                        <hr />
                        <button onClick=${() => {
                            window.open(standaloneUrl, '_blank', 'noopener');
                            setContextMenu(null);
                        }}>${t('tab.openInNewTab')}</button>
                    `;
                })()}
            </div>
        `}
    `;
}
