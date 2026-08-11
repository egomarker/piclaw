import { html } from '../vendor/preact-htm.js';
import { ComposeBox } from '../components/compose-box.js';
import { OobePanel } from '../components/oobe-panel.js';
import { BtwPanel } from '../components/btw-panel.js';
import { FloatingWidgetPane } from '../components/floating-widget-pane.js';
import { AttachmentPreviewModal } from '../components/attachment-preview-modal.js';
import { SettingsDialogLoader } from '../components/settings-dialog-loader.js';
import { TimelineQuickActions } from '../components/timeline-quick-actions.js';
import { TimelineMenu } from '../components/timeline-menu.js';
import { AgentRequestModal, AgentStatus } from '../components/status.js';
import { Timeline } from '../components/timeline.js';
import { ActiveSessionsIndicator } from '../components/active-sessions-indicator.js';
import { WorkspaceExplorer } from '../components/workspace-explorer.js';
import { TabStrip } from '../components/tab-strip.js';
import { MarkdownPreview } from '../components/markdown-preview.js';
import { SystemMetersHud } from '../components/system-meters-hud.js';
import {
  MOBILE_CHAT_PANEL_ID,
  MOBILE_CHAT_TAB_ELEMENT_ID,
  MOBILE_CHAT_TAB_ID,
  MOBILE_PANE_PANEL_ID,
  MOBILE_SURFACE_TABLIST_ID,
  MOBILE_WORKSPACE_PANEL_ID,
  MOBILE_WORKSPACE_TAB_ELEMENT_ID,
  getMobileSurfacePanelId,
  getMobileSurfaceTabElementId,
  resolveMobileAttachToChatAction,
  toggleMobileDocumentChatAttachment,
} from './mobile-tab-state.js';

export interface MainShellRenderOptions {
  [key: string]: any;
}

export function buildMainShellClassName(options: {
  workspaceOpen: boolean;
  editorOpen: boolean;
  chatOnlyMode: boolean;
  zenMode: boolean;
  uiMode?: 'classic' | 'mobile';
  mobileChatActive?: boolean;
  mobileWorkspaceActive?: boolean;
}): string {
  const {
    workspaceOpen,
    editorOpen,
    chatOnlyMode,
    zenMode,
    uiMode = 'classic',
    mobileChatActive = false,
    mobileWorkspaceActive = false,
  } = options;
  const mobileSurfaceClass = uiMode === 'mobile'
    ? ` mobile-interface ${mobileWorkspaceActive ? 'mobile-workspace-active' : mobileChatActive ? 'mobile-chat-active' : 'mobile-pane-active'}`
    : '';
  return `app-shell${workspaceOpen ? '' : ' workspace-collapsed'}${editorOpen ? ' editor-open' : ''}${chatOnlyMode ? ' chat-only' : ''}${zenMode ? ' zen-mode' : ''}${mobileSurfaceClass}`;
}

export function extractPostedUserMessageId(response: unknown): number | null {
  const rawId = (response as any)?.user_message?.id ?? (response as any)?.row_id;
  if (rawId === null || rawId === undefined || rawId === '') return null;
  const id = Number(rawId);
  return Number.isFinite(id) ? id : null;
}

export function scrollToPostedTimelineMessage(options: {
  id: string | number;
  scrollToBottom?: () => void;
  getElementById?: (id: string) => HTMLElement | null;
  scheduleRaf?: (callback: () => void) => void;
  scheduleTimeout?: (callback: () => void, delayMs: number) => void;
  requestReveal?: (id: string | number) => void;
  maxAttempts?: number;
}): void {
  const {
    id,
    scrollToBottom,
    getElementById = (value) => document.getElementById(value),
    scheduleRaf = (callback) => requestAnimationFrame(callback),
    scheduleTimeout = (callback, delayMs) => { setTimeout(callback, delayMs); },
    requestReveal = (value) => {
      if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
        window.dispatchEvent(new CustomEvent('piclaw:reveal-timeline-post', { detail: { id: value } }));
      }
    },
    maxAttempts = 12,
  } = options;

  const highlight = (el: HTMLElement) => {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('post-highlight');
    scheduleTimeout(() => el.classList.remove('post-highlight'), 2000);
  };

  const tryScroll = (attemptsRemaining: number) => {
    const element = getElementById(`post-${id}`);
    if (element) {
      highlight(element);
      return;
    }
    if (attemptsRemaining <= 0) {
      scrollToBottom?.();
      return;
    }
    scheduleRaf(() => {
      scheduleTimeout(() => tryScroll(attemptsRemaining - 1), 40);
    });
  };

  requestReveal(id);
  tryScroll(maxAttempts);
}

export function handleComposePost(options: {
  response?: unknown;
  viewStateRef: { current: Record<string, unknown> | null | undefined };
  scrollToBottom: () => void;
  scrollPostedMessage?: (id: string | number) => void;
}): void {
  const {
    response,
    viewStateRef,
    scrollToBottom,
    scrollPostedMessage = (id) => scrollToPostedTimelineMessage({ id, scrollToBottom }),
  } = options;

  const { searchQuery: sq, searchOpen: so } = viewStateRef.current || {};
  if (sq || so) return;

  const postedMessageId = extractPostedUserMessageId(response);
  if (postedMessageId) {
    scrollPostedMessage(postedMessageId);
    return;
  }

  scrollToBottom();
}

export function renderMainShell(options: MainShellRenderOptions): any {
  const {
    appShellRef,
    workspaceOpen,
    editorOpen,
    chatOnlyMode,
    zenMode,
    uiMode = 'classic',
    mobileChatActive = false,
    mobileWorkspaceActive = false,
    mobileWorkspaceTabEnabled = false,
    isRenameBranchFormOpen,
    closeRenameCurrentBranchForm,
    handleRenameCurrentBranch,
    renameBranchNameDraft,
    renameBranchNameInputRef,
    setRenameBranchNameDraft,
    renameBranchDraftState,
    isRenamingBranch,
    addFileRef,
    addFolderRef,
    openEditor,
    openTerminalTab,
    openVncTab,
    hasDockPanes,
    toggleDock,
    dockVisible,
    handleSplitterMouseDown,
    handleSplitterTouchStart,
    showEditorPaneContainer,
    tabStripTabs,
    tabStripActiveId,
    displayTabStripTabs = tabStripTabs,
    displayTabStripActiveId = tabStripActiveId,
    handleTabActivate,
    handleTabClose,
    handleTabCloseOthers,
    handleTabCloseAll,
    handleTabTogglePin,
    handleTabTogglePreview,
    handleTabToggleDiff,
    handleTabEditSource,
    handleReattachPane,
    previewTabs,
    diffTabs,
    tabPaneOverrides,
    toggleZenMode,
    handlePopOutPane,
    isWebAppMode,
    editorContainerRef,
    editorInstanceRef,
    detachedTabs,
    activeDetachedTab,
    detachedDockPane,
    handleDockSplitterMouseDown,
    handleDockSplitterTouchStart,
    TERMINAL_TAB_PATH,
    dockContainerRef,
    handleEditorSplitterMouseDown,
    handleEditorSplitterTouchStart,
    searchQuery,
    isIOSDevice,
    currentBranchRecord,
    currentChatJid,
    currentChatBranches,
    handleBranchPickerChange,
    formatBranchPickerLabel,
    openRenameCurrentBranchForm,
    handlePruneCurrentBranch,
    handlePurgeArchivedBranch,
    currentHashtag,
    handleBackToTimeline,
    activeSearchScopeLabel,
    oobePanelState,
    composePrefillRequest,
    requestComposePrefill,
    handleOobeSetupProvider,
    handleOobeShowModelPicker,
    handleOobeOpenWorkspace,
    handleDismissProviderMissingOobe,
    handleCompleteProviderReadyOobe,
    posts,
    isMainTimelineView,
    hasMore,
    loadMore,
    timelineRef,
    handleHashtagClick,
    addMessageRef,
    scrollToMessage,
    openFileFromPill,
    openTimelineFileFromPill,
    handleDeletePost,
    handleOpenFloatingWidget,
    agents,
    userProfile,
    removingPostIds,
    agentStatus,
    isCompactionStatus,
    agentDraft,
    agentPlan,
    agentThought,
    pendingRequest,
    intentToast,
    currentTurnId,
    steerQueued,
    handlePanelToggle,
    btwSession,
    closeBtwPanel,
    handleBtwRetry,
    handleBtwInject,
    floatingWidget,
    handleCloseFloatingWidget,
    handleFloatingWidgetEvent,
    attachmentPreview,
    setAttachmentPreview,
    extensionStatusPanels,
    pendingExtensionPanelActions,
    handleExtensionPanelAction,
    searchOpen,
    followupQueueItems,
    handleInjectQueuedFollowup,
    handleRemoveQueuedFollowup,
    handleMoveQueuedFollowup,
    viewStateRef,
    loadPosts,
    scrollToBottom,
    searchScope,
    handleSearch,
    handleSearchScopeChange,
    setSearchScope,
    enterSearchMode,
    exitSearchMode,
    fileRefs,
    removeFileRef,
    clearFileRefs,
    setFileRefsFromCompose,
    folderRefs,
    removeFolderRef,
    clearFolderRefs,
    setFolderRefsFromCompose,
    messageRefs,
    removeMessageRef,
    clearMessageRefs,
    setMessageRefsFromCompose,
    handleCreateSessionFromCompose,
    handleCreateRootSessionFromCompose,
    handleRestoreBranch,
    attachActiveEditorFile,
    followupQueueCount,
    handleBtwIntercept,
    handleMessageResponse,
    handleComposeSubmitError,
    isComposeBoxAgentActive,
    activeChatAgents,
    getActiveChatAgents,
    connectionStatus,
    stateAccessFailed,
    activeModel,
    agentModelsPayload,
    activeModelUsage,
    activeThinkingLevel,
    supportsThinking,
    contextUsage,
    extensionWorkingState,
    notificationsEnabled,
    notificationPermission,
    handleToggleNotifications,
    setActiveModel,
    applyModelState,
    setPendingRequest,
    pendingRequestRef,
    toggleWorkspace,
  } = options;

  const workspaceTabMode = uiMode === 'mobile' && mobileWorkspaceTabEnabled && !chatOnlyMode;
  const workspaceRailOpen = workspaceTabMode ? false : workspaceOpen;
  const workspaceVisible = workspaceTabMode ? mobileWorkspaceActive : workspaceRailOpen;
  const showPaneContainer = showEditorPaneContainer || workspaceTabMode;
  const showTabStrip = editorOpen || workspaceTabMode;
  const mobileTabAccessibilityEnabled = uiMode === 'mobile' && showPaneContainer && showTabStrip;
  const mobileChatSurfaceInactive = mobileTabAccessibilityEnabled && !mobileChatActive;
  const mobileWorkspacePanelEnabled = mobileTabAccessibilityEnabled && workspaceTabMode;
  const mobileWorkspaceSurfaceInactive = mobileWorkspacePanelEnabled && !mobileWorkspaceActive;
  const mobilePaneSurfaceInactive = mobileTabAccessibilityEnabled && (mobileChatActive || mobileWorkspaceActive);
  const mobileTimelineActive = uiMode === 'mobile'
    && (chatOnlyMode || mobileChatActive || (!editorOpen && !mobileWorkspaceActive));
  const mobileTerminalDockControlEnabled = uiMode === 'mobile' && hasDockPanes && !chatOnlyMode;
  const mobilePaneLabelledBy = mobileTabAccessibilityEnabled && tabStripActiveId
    ? getMobileSurfaceTabElementId(tabStripActiveId)
    : undefined;
  const mobileAttachToChatState = uiMode === 'mobile' && !chatOnlyMode
    ? resolveMobileAttachToChatAction({
      tabs: tabStripTabs,
      activeId: displayTabStripActiveId,
      fileRefs,
      detachedTabs,
    })
    : null;
  const mobileAttachToChatAction = mobileAttachToChatState && mobileAttachToChatState.kind !== 'hidden'
    ? {
      testId: 'mobile-attach-to-chat',
      className: 'tab-strip-attach-to-chat',
      title: mobileAttachToChatState.title || 'Attach selected document to Chat',
      ariaLabel: mobileAttachToChatState.ariaLabel || 'Attach selected document to Chat',
      disabled: mobileAttachToChatState.disabled,
      pressed: mobileAttachToChatState.pressed,
      onClick: (mobileAttachToChatState.kind === 'available' || mobileAttachToChatState.kind === 'attached')
        && mobileAttachToChatState.path
        ? () => toggleMobileDocumentChatAttachment({
          path: mobileAttachToChatState.path || '',
          attached: mobileAttachToChatState.kind === 'attached',
          addFileRef,
          removeFileRef,
        })
        : undefined,
      icon: html`
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M3.25 1.75h5l3.5 3.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5v-9.5a1.5 1.5 0 0 1 1.5-1.5z"/>
          <path d="M8.25 1.75v3.5h3.5"/>
          ${mobileAttachToChatState.pressed
            ? html`<polyline points="4.75 9 6.5 10.75 9.75 7.25"/>`
            : html`<path d="M5 9h4.5M7.25 6.75v4.5"/>`}
        </svg>
      `,
    }
    : undefined;

  const handleComposeFocus = () => {
    if (isIOSDevice()) return;
    scrollToBottom();
  };

  return html`
    <div class=${buildMainShellClassName({ workspaceOpen: workspaceRailOpen, editorOpen, chatOnlyMode, zenMode, uiMode, mobileChatActive, mobileWorkspaceActive })} ref=${appShellRef}>
      ${uiMode === 'mobile'
        ? html`
          <div class="mobile-top-right-hud">
            <${ActiveSessionsIndicator}
              chats=${activeChatAgents}
              surfaceActive=${mobileTimelineActive}
              loadActiveChats=${getActiveChatAgents}
              currentChatJid=${currentChatJid}
              onSwitchChat=${handleBranchPickerChange}
            />
            <${SystemMetersHud} mode="overlay" />
          </div>
        `
        : html`<${SystemMetersHud} mode="overlay" />`}
      ${isRenameBranchFormOpen && html`
        <div class="rename-branch-overlay" onPointerDown=${(event: any) => {
          if (event.target === event.currentTarget) {
            closeRenameCurrentBranchForm();
          }
        }}>
          <form
            class="rename-branch-panel"
            onSubmit=${(event: any) => {
              event.preventDefault();
              void handleRenameCurrentBranch(renameBranchNameDraft);
            }}
          >
            <div class="rename-branch-title">Rename session</div>
            <input
              ref=${renameBranchNameInputRef}
              value=${renameBranchNameDraft}
              onInput=${(event: any) => {
                const next = event.currentTarget?.value ?? '';
                setRenameBranchNameDraft(String(next));
              }}
              onKeyDown=${(event: any) => {
                if (event.key === 'Escape') {
                  event.preventDefault();
                  closeRenameCurrentBranchForm();
                }
              }}
              autocomplete="off"
              placeholder="Session handle (letters, numbers, - and _ only)"
            />
            <div class=${`rename-branch-help ${renameBranchDraftState.kind || 'info'}`}>
              ${renameBranchDraftState.message}
            </div>
            <div class="rename-branch-actions">
              <button type="submit" class="compose-model-popup-btn primary" disabled=${isRenamingBranch || !renameBranchDraftState.canSubmit}>
                ${isRenamingBranch ? 'Renaming…' : 'Save'}
              </button>
              <button
                type="button"
                class="compose-model-popup-btn"
                onClick=${closeRenameCurrentBranchForm}
                disabled=${isRenamingBranch}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      `}
      ${!chatOnlyMode && html`
        <${WorkspaceExplorer}
          onFileSelect=${workspaceTabMode ? undefined : addFileRef}
          onFolderSelect=${addFolderRef}
          visible=${workspaceVisible}
          active=${workspaceVisible || (!workspaceTabMode && editorOpen)}
          onOpenEditor=${openEditor}
          onOpenTerminalTab=${openTerminalTab}
          showTerminalHeaderAction=${!workspaceTabMode}
          onOpenVncTab=${openVncTab}
          surfaceId=${mobileWorkspacePanelEnabled ? MOBILE_WORKSPACE_PANEL_ID : undefined}
          surfaceRole=${mobileWorkspacePanelEnabled ? 'tabpanel' : undefined}
          surfaceLabelledBy=${mobileWorkspacePanelEnabled ? MOBILE_WORKSPACE_TAB_ELEMENT_ID : undefined}
          surfaceAriaHidden=${mobileWorkspaceSurfaceInactive ? 'true' : undefined}
          surfaceInert=${mobileWorkspaceSurfaceInactive || undefined}
          mobileInterface=${uiMode === 'mobile' || undefined}
        />
        ${!workspaceTabMode && html`
          <button
            class=${`workspace-toggle-tab${workspaceOpen ? ' open' : ' closed'}`}
            onClick=${toggleWorkspace}
            title=${workspaceOpen ? 'Hide workspace' : 'Show workspace'}
            aria-label=${workspaceOpen ? 'Hide workspace' : 'Show workspace'}
          >
            <svg class="workspace-toggle-tab-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 3 11 8 6 13" />
            </svg>
          </button>
          <div
            class="workspace-splitter"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize Workspace"
            title="Drag to resize Workspace"
            onMouseDown=${handleSplitterMouseDown}
            onTouchStart=${handleSplitterTouchStart}
          >
            <span class="workspace-splitter-touch-target" aria-hidden="true"></span>
          </div>
        `}
      `}
      ${showPaneContainer && html`
        <div class="editor-pane-container">
          ${zenMode && html`<div class="zen-hover-zone"></div>`}
          ${showTabStrip && html`
            <${TabStrip}
              tabs=${displayTabStripTabs}
              activeId=${displayTabStripActiveId}
              onActivate=${handleTabActivate}
              onClose=${handleTabClose}
              onCloseOthers=${handleTabCloseOthers}
              onCloseAll=${handleTabCloseAll}
              onTogglePin=${handleTabTogglePin}
              onTogglePreview=${handleTabTogglePreview}
              onToggleDiff=${handleTabToggleDiff}
              onEditSource=${handleTabEditSource}
              previewTabs=${previewTabs}
              diffTabs=${diffTabs}
              paneOverrides=${tabPaneOverrides}
              detachedTabs=${detachedTabs}
              onReattachTab=${handleReattachPane}
              toolbarAction=${mobileAttachToChatAction}
              onToggleDock=${hasDockPanes ? toggleDock : undefined}
              dockVisible=${hasDockPanes && dockVisible}
              onToggleZen=${toggleZenMode}
              zenMode=${zenMode}
              onPopOutTab=${isWebAppMode ? undefined : handlePopOutPane}
              rovingFocus=${mobileTabAccessibilityEnabled || undefined}
              restoreFocusAfterClose=${mobileTabAccessibilityEnabled || undefined}
              touchContextMenu=${mobileTabAccessibilityEnabled || undefined}
              tabListId=${mobileTabAccessibilityEnabled ? MOBILE_SURFACE_TABLIST_ID : undefined}
              tabListLabel=${mobileTabAccessibilityEnabled ? 'Open surfaces' : undefined}
              getTabElementId=${mobileTabAccessibilityEnabled ? getMobileSurfaceTabElementId : undefined}
              getTabPanelId=${mobileTabAccessibilityEnabled ? getMobileSurfacePanelId : undefined}
            />
          `}
          ${editorOpen && activeDetachedTab && html`
            <div
              class="editor-pane-host editor-pane-detached-host"
              id=${mobileTabAccessibilityEnabled ? MOBILE_PANE_PANEL_ID : undefined}
              role=${mobileTabAccessibilityEnabled ? 'tabpanel' : undefined}
              aria-labelledby=${mobilePaneLabelledBy}
              aria-hidden=${mobilePaneSurfaceInactive ? 'true' : undefined}
              inert=${mobilePaneSurfaceInactive || undefined}
            >
              <div class="editor-empty-state">
                <div class="editor-empty-state-title">${activeDetachedTab.label || activeDetachedTab.panePath || 'Detached pane'}</div>
                <div class="editor-empty-state-body">This pane is detached into another window.</div>
                <div class="editor-empty-state-actions">
                  <button class="editor-empty-state-button" onClick=${() => handleReattachPane(activeDetachedTab.panePath)}>Reattach here</button>
                </div>
              </div>
            </div>
          `}
          ${editorOpen && !activeDetachedTab && html`
            <div
              class="editor-pane-host"
              ref=${editorContainerRef}
              id=${mobileTabAccessibilityEnabled ? MOBILE_PANE_PANEL_ID : undefined}
              role=${mobileTabAccessibilityEnabled ? 'tabpanel' : undefined}
              aria-labelledby=${mobilePaneLabelledBy}
              aria-hidden=${mobilePaneSurfaceInactive ? 'true' : undefined}
              inert=${mobilePaneSurfaceInactive || undefined}
            ></div>
          `}
          ${editorOpen && !activeDetachedTab && tabStripActiveId && previewTabs.has(tabStripActiveId) && html`
            <${MarkdownPreview}
              getContent=${() => editorInstanceRef.current?.getContent?.()}
              subscribeContentChange=${(cb) => editorInstanceRef.current?.onContentChange?.(cb)}
              path=${tabStripActiveId}
              onClose=${() => handleTabTogglePreview(tabStripActiveId)}
              surfaceInactive=${mobilePaneSurfaceInactive}
            />
          `}
          ${hasDockPanes && dockVisible && html`<div class="dock-splitter" onMouseDown=${handleDockSplitterMouseDown} onTouchStart=${handleDockSplitterTouchStart}></div>`}
          ${hasDockPanes && html`<div class=${`dock-panel${dockVisible ? '' : ' hidden'}${editorOpen ? '' : ' standalone'}`}>
            <div class="dock-panel-header">
              <span class="dock-panel-title">Terminal</span>
              <div class="dock-panel-actions">
                ${!isWebAppMode && !detachedDockPane && html`
                  <button class="dock-panel-action" onClick=${() => handlePopOutPane(TERMINAL_TAB_PATH, 'Terminal')} title="Open terminal in window" aria-label="Open terminal in window">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2.25" y="2.25" width="8.5" height="8.5" rx="1.5"/>
                      <path d="M8.5 2.25h5.25v5.25"/>
                      <path d="M13.75 2.25 7.75 8.25"/>
                    </svg>
                  </button>
                `}
                ${detachedDockPane && html`
                  <button class="dock-panel-action" onClick=${() => handleReattachPane(TERMINAL_TAB_PATH)} title="Reattach terminal" aria-label="Reattach terminal">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.5"/>
                      <path d="M5.25 8h5.5"/>
                      <path d="M8 5.25v5.5"/>
                    </svg>
                  </button>
                `}
                <button class="dock-panel-close" onClick=${toggleDock} title="Hide terminal (Ctrl+\`)" aria-label="Hide terminal">
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                    <line x1="4" y1="4" x2="12" y2="12"/>
                    <line x1="12" y1="4" x2="4" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
            ${detachedDockPane
              ? html`
                <div class="dock-panel-body dock-panel-body-detached">
                  <div class="editor-empty-state">
                    <div class="editor-empty-state-title">Terminal detached</div>
                    <div class="editor-empty-state-body">The terminal is open in another window.</div>
                    <div class="editor-empty-state-actions">
                      <button class="editor-empty-state-button" onClick=${() => handleReattachPane(TERMINAL_TAB_PATH)}>Reattach here</button>
                    </div>
                  </div>
                </div>
              `
              : html`<div class="dock-panel-body" ref=${dockContainerRef}></div>`}
          </div>`}
        </div>
        <div class="editor-splitter" onMouseDown=${handleEditorSplitterMouseDown} onTouchStart=${handleEditorSplitterTouchStart}></div>
      `}
      <${TimelineMenu}
        workspaceOpen=${workspaceRailOpen}
        workspaceVisible=${workspaceVisible}
        showWorkspaceToggle=${!workspaceTabMode}
        toggleWorkspace=${toggleWorkspace}
        chatOnlyMode=${chatOnlyMode}
        openEditor=${openEditor}
        onOpenTerminalTab=${openTerminalTab}
        onOpenVncTab=${openVncTab}
      />
      <${TimelineQuickActions}
        activeChatAgents=${activeChatAgents}
        currentChatJid=${currentChatJid}
        workspaceOpen=${workspaceRailOpen}
        showWorkspaceToggle=${!workspaceTabMode}
        chatOnlyMode=${chatOnlyMode}
        onSwitchChat=${handleBranchPickerChange}
        onToggleWorkspace=${toggleWorkspace}
        onOpenTerminalTab=${openTerminalTab}
        onOpenVncTab=${openVncTab}
        onPrefillCompose=${requestComposePrefill}
      />
      <div class="container">
        <div
          class="chat-surface-main"
          id=${mobileTabAccessibilityEnabled ? MOBILE_CHAT_PANEL_ID : undefined}
          role=${mobileTabAccessibilityEnabled ? 'tabpanel' : undefined}
          aria-labelledby=${mobileTabAccessibilityEnabled ? MOBILE_CHAT_TAB_ELEMENT_ID : undefined}
          aria-hidden=${mobileChatSurfaceInactive ? 'true' : undefined}
          inert=${mobileChatSurfaceInactive || undefined}
        >
          ${searchQuery && isIOSDevice() && html`<div class="search-results-spacer"></div>`}
        ${(currentHashtag || searchQuery) && html`
          <div class="hashtag-header">
            <button class="back-btn" onClick=${handleBackToTimeline}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <span>${currentHashtag ? `#${currentHashtag}` : `Search: ${searchQuery} · ${activeSearchScopeLabel}`}</span>
          </div>
        `}
        ${oobePanelState?.kind && oobePanelState.kind !== 'hidden' && html`
          <${OobePanel}
            kind=${oobePanelState.kind}
            onSetupProvider=${handleOobeSetupProvider}
            onShowModelPicker=${handleOobeShowModelPicker}
            onOpenWorkspace=${handleOobeOpenWorkspace}
            onDismiss=${oobePanelState.kind === 'provider-missing' ? handleDismissProviderMissingOobe : handleCompleteProviderReadyOobe}
          />
        `}
        <${Timeline}
          posts=${posts}
          hasMore=${isMainTimelineView ? hasMore : false}
          onLoadMore=${isMainTimelineView ? loadMore : undefined}
          timelineRef=${timelineRef}
          onHashtagClick=${handleHashtagClick}
          onMessageRef=${addMessageRef}
          onScrollToMessage=${scrollToMessage}
          onFileRef=${openTimelineFileFromPill || openFileFromPill}
          onPostClick=${undefined}
          onDeletePost=${handleDeletePost}
          onOpenWidget=${handleOpenFloatingWidget}
          onOpenAttachmentPreview=${setAttachmentPreview}
          emptyMessage=${currentHashtag ? `No posts with #${currentHashtag}` : searchQuery ? `No results for "${searchQuery}"` : undefined}
          agents=${agents}
          user=${userProfile}
          reverse=${isMainTimelineView}
          removingPostIds=${removingPostIds}
          searchQuery=${searchQuery}
        />
        <${AgentStatus}
          status=${isCompactionStatus(agentStatus) ? null : agentStatus}
          draft=${agentDraft}
          plan=${agentPlan}
          thought=${agentThought}
          pendingRequest=${pendingRequest}
          intent=${intentToast}
          turnId=${currentTurnId}
          steerQueued=${steerQueued}
          onPanelToggle=${handlePanelToggle}
          showExtensionPanels=${false}
        />
          <${BtwPanel}
            session=${btwSession}
            onClose=${closeBtwPanel}
            onRetry=${handleBtwRetry}
            onInject=${handleBtwInject}
          />
        </div>
        <${FloatingWidgetPane}
          widget=${floatingWidget}
          onClose=${handleCloseFloatingWidget}
          onWidgetEvent=${handleFloatingWidgetEvent}
        />
        ${attachmentPreview && html`
          <${AttachmentPreviewModal}
            mediaId=${attachmentPreview.mediaId}
            info=${attachmentPreview.info}
            onClose=${() => setAttachmentPreview(null)}
          />
        `}
        <${SettingsDialogLoader} />
        <div
          class="chat-surface-footer"
          aria-labelledby=${mobileTabAccessibilityEnabled ? MOBILE_CHAT_TAB_ELEMENT_ID : undefined}
          aria-hidden=${mobileChatSurfaceInactive ? 'true' : undefined}
          inert=${mobileChatSurfaceInactive || undefined}
        >
          <${AgentStatus}
            extensionPanels=${Array.from(extensionStatusPanels.values())}
          pendingPanelActions=${pendingExtensionPanelActions}
          onExtensionPanelAction=${handleExtensionPanelAction}
          turnId=${currentTurnId}
          steerQueued=${steerQueued}
          onPanelToggle=${handlePanelToggle}
          showCorePanels=${false}
        />
        <${ComposeBox}
          onPost=${(response) => {
            handleComposePost({
              response,
              viewStateRef,
              scrollToBottom,
            });
          }}
          onFocus=${handleComposeFocus}
          searchMode=${searchOpen}
          searchScope=${searchScope}
          onSearch=${handleSearch}
          onSearchScopeChange=${handleSearchScopeChange || setSearchScope}
          onEnterSearch=${enterSearchMode}
          onExitSearch=${exitSearchMode}
          fileRefs=${fileRefs}
          onRemoveFileRef=${removeFileRef}
          onClearFileRefs=${clearFileRefs}
          onSetFileRefs=${setFileRefsFromCompose}
          folderRefs=${folderRefs}
          onRemoveFolderRef=${removeFolderRef}
          onClearFolderRefs=${clearFolderRefs}
          onSetFolderRefs=${setFolderRefsFromCompose}
          messageRefs=${messageRefs}
          onRemoveMessageRef=${removeMessageRef}
          onClearMessageRefs=${clearMessageRefs}
          onSetMessageRefs=${setMessageRefsFromCompose}
          onSwitchChat=${handleBranchPickerChange}
          onRenameSession=${handleRenameCurrentBranch}
          isRenameSessionInProgress=${isRenamingBranch}
          onCreateSession=${handleCreateSessionFromCompose}
          onCreateRootSession=${handleCreateRootSessionFromCompose}
          onDeleteSession=${handlePruneCurrentBranch}
          onPurgeArchivedSession=${handlePurgeArchivedBranch}
          onRestoreSession=${handleRestoreBranch}
          activeEditorPath=${chatOnlyMode || uiMode === 'mobile' ? null : tabStripActiveId}
          onAttachEditorFile=${chatOnlyMode || uiMode === 'mobile' ? undefined : attachActiveEditorFile}
          onOpenFilePill=${openFileFromPill}
          followupQueueCount=${followupQueueCount}
          followupQueueItems=${followupQueueItems}
          onInjectQueuedFollowup=${handleInjectQueuedFollowup}
          onRemoveQueuedFollowup=${handleRemoveQueuedFollowup}
          onMoveQueuedFollowup=${handleMoveQueuedFollowup}
          onSubmitIntercept=${handleBtwIntercept}
          onMessageResponse=${handleMessageResponse}
          onSubmitError=${handleComposeSubmitError}
          isAgentActive=${isComposeBoxAgentActive}
          activeChatAgents=${activeChatAgents}
          currentChatJid=${currentChatJid}
          connectionStatus=${connectionStatus}
          stateAccessFailed=${stateAccessFailed}
          activeModel=${activeModel}
          agentModelsPayload=${agentModelsPayload}
          modelUsage=${activeModelUsage}
          thinkingLevel=${activeThinkingLevel}
          supportsThinking=${supportsThinking}
          contextUsage=${contextUsage}
          notificationsEnabled=${notificationsEnabled}
          notificationPermission=${notificationPermission}
          onToggleNotifications=${handleToggleNotifications}
          terminalDockAvailable=${mobileTerminalDockControlEnabled}
          terminalDockVisible=${mobileTerminalDockControlEnabled ? dockVisible : undefined}
          onToggleTerminalDock=${mobileTerminalDockControlEnabled ? toggleDock : undefined}
          onModelChange=${setActiveModel}
          onModelStateChange=${applyModelState}
          statusNotice=${isCompactionStatus(agentStatus) ? agentStatus : null}
            extensionWorkingState=${extensionWorkingState}
            prefillRequest=${composePrefillRequest}
          />
        </div>
        <${AgentRequestModal}
          request=${pendingRequest}
          onRespond=${() => {
            setPendingRequest(null);
            pendingRequestRef.current = null;
          }}
        />
      </div>
    </div>
  `;
}
