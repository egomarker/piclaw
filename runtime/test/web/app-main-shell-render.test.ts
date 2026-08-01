import { expect, mock, test } from 'bun:test';

import { ComposeBox, QueuedFollowupStack } from '../../web/src/components/compose-box.js';
import { MarkdownPreview } from '../../web/src/components/markdown-preview.js';
import { TabStrip } from '../../web/src/components/tab-strip.js';
import { TimelineMenu } from '../../web/src/components/timeline-menu.js';
import { TimelineQuickActions } from '../../web/src/components/timeline-quick-actions.js';
import { WorkspaceExplorer } from '../../web/src/components/workspace-explorer.js';
import {
  buildMainShellClassName,
  extractPostedUserMessageId,
  handleComposePost,
  renderMainShell,
  scrollToPostedTimelineMessage,
} from '../../web/src/ui/app-main-shell-render.js';
import { composeMobileShellRenderOptions } from '../../web/src/ui/app-mobile-shell-render.js';
import {
  MOBILE_CHAT_PANEL_ID,
  MOBILE_CHAT_TAB_ELEMENT_ID,
  MOBILE_CHAT_TAB_ID,
  MOBILE_PANE_PANEL_ID,
  MOBILE_SURFACE_TABLIST_ID,
  MOBILE_WORKSPACE_PANEL_ID,
  MOBILE_WORKSPACE_TAB_ELEMENT_ID,
  MOBILE_WORKSPACE_TAB_ID,
  getMobileSurfacePanelId,
  getMobileSurfaceTabElementId,
} from '../../web/src/ui/mobile-tab-state.js';

test('Mobile maps unified display tabs without replacing pane runtime tabs', () => {
  const paneTabs = [{ id: 'file' }];
  const displayTabs = [{ id: 'piclaw://chat' }, ...paneTabs];
  const options = composeMobileShellRenderOptions({
    tabStripTabs: paneTabs,
    tabStripActiveId: 'file',
    mobileTabStripTabs: displayTabs,
    mobileTabStripActiveId: 'piclaw://chat',
    mobileChatActive: true,
    mobileWorkspaceActive: false,
    mobileWorkspaceTabEnabled: true,
  });

  expect(options.tabStripTabs).toBe(paneTabs);
  expect(options.tabStripActiveId).toBe('file');
  expect(options.displayTabStripTabs).toBe(displayTabs);
  expect(options.displayTabStripActiveId).toBe('piclaw://chat');
  expect(options.uiMode).toBe('mobile');
  expect(options.mobileWorkspaceTabEnabled).toBe(true);
});

test('buildMainShellClassName composes workspace/editor/chat/zen modifiers', () => {
  expect(buildMainShellClassName({
    workspaceOpen: true,
    editorOpen: false,
    chatOnlyMode: false,
    zenMode: false,
  })).toBe('app-shell');

  expect(buildMainShellClassName({
    workspaceOpen: false,
    editorOpen: true,
    chatOnlyMode: true,
    zenMode: true,
  })).toBe('app-shell workspace-collapsed editor-open chat-only zen-mode');

  expect(buildMainShellClassName({
    workspaceOpen: true,
    editorOpen: true,
    chatOnlyMode: false,
    zenMode: false,
    uiMode: 'mobile',
  })).toBe('app-shell editor-open mobile-interface mobile-pane-active');

  expect(buildMainShellClassName({
    workspaceOpen: true,
    editorOpen: true,
    chatOnlyMode: false,
    zenMode: false,
    uiMode: 'mobile',
    mobileChatActive: true,
  })).toBe('app-shell editor-open mobile-interface mobile-chat-active');

  expect(buildMainShellClassName({
    workspaceOpen: false,
    editorOpen: false,
    chatOnlyMode: false,
    zenMode: false,
    uiMode: 'mobile',
    mobileWorkspaceActive: true,
  })).toBe('app-shell workspace-collapsed mobile-interface mobile-workspace-active');
});

test('extractPostedUserMessageId prefers user_message.id and falls back to row_id', () => {
  expect(extractPostedUserMessageId({ user_message: { id: 42 }, row_id: 7 })).toBe(42);
  expect(extractPostedUserMessageId({ row_id: 7 })).toBe(7);
  expect(extractPostedUserMessageId({})).toBeNull();
});

test('handleComposePost scrolls to the posted user message without reloading the timeline', () => {
  const scrollToBottom = mock(() => {});
  const scrollPostedMessage = mock(() => {});

  handleComposePost({
    response: { user_message: { id: 99 } },
    viewStateRef: { current: { searchQuery: null, searchOpen: false } },
    scrollToBottom,
    scrollPostedMessage,
  });

  expect(scrollPostedMessage).toHaveBeenCalledWith(99);
  expect(scrollToBottom).not.toHaveBeenCalled();
});

test('handleComposePost falls back to scrolling to the bottom when there is no posted row id', () => {
  const scrollToBottom = mock(() => {});
  const scrollPostedMessage = mock(() => {});

  handleComposePost({
    response: { command: { type: 'model' } },
    viewStateRef: { current: { searchQuery: null, searchOpen: false } },
    scrollToBottom,
    scrollPostedMessage,
  });

  expect(scrollToBottom).toHaveBeenCalledTimes(1);
  expect(scrollPostedMessage).not.toHaveBeenCalled();
});

function walkVNodes(node: any, visit: (entry: any) => void) {
  if (!node) return;
  if (Array.isArray(node)) {
    for (const child of node) walkVNodes(child, visit);
    return;
  }
  if (typeof node !== 'object') return;
  if (!('type' in node) || !('props' in node)) return;

  visit(node);
  walkVNodes((node as any).props?.children, visit);
}

function createMainShellRenderOptions(overrides: Record<string, unknown> = {}) {
  const noop = () => {};
  return {
    appShellRef: { current: null },
    workspaceOpen: false,
    editorOpen: false,
    chatOnlyMode: true,
    zenMode: false,
    isRenameBranchFormOpen: false,
    closeRenameCurrentBranchForm: noop,
    handleRenameCurrentBranch: noop,
    renameBranchNameDraft: '',
    renameBranchNameInputRef: { current: null },
    setRenameBranchNameDraft: noop,
    renameBranchDraftState: { kind: 'info', message: '', canSubmit: false },
    isRenamingBranch: false,
    addFileRef: noop,
    addFolderRef: noop,
    openEditor: noop,
    openTerminalTab: noop,
    openVncTab: noop,
    hasDockPanes: false,
    toggleDock: noop,
    dockVisible: false,
    handleSplitterMouseDown: noop,
    handleSplitterTouchStart: noop,
    showEditorPaneContainer: false,
    tabStripTabs: [],
    tabStripActiveId: null,
    handleTabActivate: noop,
    handleTabClose: noop,
    handleTabCloseOthers: noop,
    handleTabCloseAll: noop,
    handleTabTogglePin: noop,
    handleTabTogglePreview: noop,
    handleTabToggleDiff: noop,
    handleTabEditSource: noop,
    handleReattachPane: noop,
    previewTabs: new Set(),
    diffTabs: new Set(),
    tabPaneOverrides: new Map(),
    toggleZenMode: noop,
    handlePopOutPane: noop,
    isWebAppMode: false,
    editorContainerRef: { current: null },
    editorInstanceRef: { current: null },
    detachedTabs: [],
    activeDetachedTab: null,
    detachedDockPane: null,
    handleDockSplitterMouseDown: noop,
    handleDockSplitterTouchStart: noop,
    TERMINAL_TAB_PATH: 'terminal',
    dockContainerRef: { current: null },
    handleEditorSplitterMouseDown: noop,
    handleEditorSplitterTouchStart: noop,
    searchQuery: null,
    isIOSDevice: () => false,
    currentBranchRecord: null,
    currentChatJid: 'web:default',
    currentChatBranches: [],
    handleBranchPickerChange: noop,
    formatBranchPickerLabel: () => '',
    openRenameCurrentBranchForm: noop,
    handlePruneCurrentBranch: noop,
    handlePurgeArchivedBranch: noop,
    currentHashtag: null,
    handleBackToTimeline: noop,
    activeSearchScopeLabel: 'Current chat',
    oobePanelState: null,
    composePrefillRequest: null,
    requestComposePrefill: noop,
    handleOobeSetupProvider: noop,
    handleOobeShowModelPicker: noop,
    handleOobeOpenWorkspace: noop,
    handleDismissProviderMissingOobe: noop,
    handleCompleteProviderReadyOobe: noop,
    posts: [],
    isMainTimelineView: true,
    hasMore: false,
    loadMore: noop,
    timelineRef: { current: null },
    handleHashtagClick: noop,
    addMessageRef: noop,
    scrollToMessage: noop,
    openFileFromPill: noop,
    openTimelineFileFromPill: noop,
    handleDeletePost: noop,
    handleOpenFloatingWidget: noop,
    agents: [],
    userProfile: null,
    removingPostIds: new Set(),
    agentStatus: null,
    isCompactionStatus: () => false,
    agentDraft: null,
    agentPlan: null,
    agentThought: null,
    pendingRequest: null,
    intentToast: null,
    currentTurnId: null,
    steerQueued: null,
    handlePanelToggle: noop,
    btwSession: null,
    closeBtwPanel: noop,
    handleBtwRetry: noop,
    handleBtwInject: noop,
    floatingWidget: null,
    handleCloseFloatingWidget: noop,
    handleFloatingWidgetEvent: noop,
    attachmentPreview: null,
    setAttachmentPreview: noop,
    extensionStatusPanels: new Map(),
    pendingExtensionPanelActions: new Set(),
    handleExtensionPanelAction: noop,
    searchOpen: false,
    followupQueueItems: [],
    handleInjectQueuedFollowup: noop,
    handleRemoveQueuedFollowup: noop,
    handleMoveQueuedFollowup: noop,
    viewStateRef: { current: null },
    loadPosts: noop,
    scrollToBottom: noop,
    searchScope: 'current',
    handleSearch: noop,
    handleSearchScopeChange: noop,
    setSearchScope: noop,
    enterSearchMode: noop,
    exitSearchMode: noop,
    fileRefs: [],
    removeFileRef: noop,
    clearFileRefs: noop,
    setFileRefsFromCompose: noop,
    folderRefs: [],
    removeFolderRef: noop,
    clearFolderRefs: noop,
    setFolderRefsFromCompose: noop,
    messageRefs: [],
    removeMessageRef: noop,
    clearMessageRefs: noop,
    setMessageRefsFromCompose: noop,
    handleCreateSessionFromCompose: noop,
    handleCreateRootSessionFromCompose: noop,
    handleRestoreBranch: noop,
    attachActiveEditorFile: noop,
    followupQueueCount: 0,
    handleBtwIntercept: noop,
    handleMessageResponse: noop,
    handleComposeSubmitError: noop,
    isComposeBoxAgentActive: false,
    activeChatAgents: [],
    connectionStatus: 'connected',
    stateAccessFailed: false,
    activeModel: null,
    agentModelsPayload: null,
    activeModelUsage: null,
    activeThinkingLevel: null,
    supportsThinking: false,
    contextUsage: null,
    extensionWorkingState: null,
    notificationsEnabled: false,
    notificationPermission: 'default',
    handleToggleNotifications: noop,
    setActiveModel: noop,
    applyModelState: noop,
    setPendingRequest: noop,
    pendingRequestRef: { current: null },
    toggleWorkspace: noop,
    ...overrides,
  };
}

test('renderMainShell groups Chat chrome separately from global overlays', () => {
  const tree = renderMainShell(createMainShellRenderOptions());
  const classes = new Set<string>();
  walkVNodes(tree, (node) => {
    if (typeof node.props?.class === 'string') classes.add(node.props.class);
  });

  expect(classes.has('chat-surface-main')).toBe(true);
  expect(classes.has('chat-surface-footer')).toBe(true);
});

test('compact Mobile renders Workspace as a permanent surface without rail controls', () => {
  const displayTabs = [
    { id: 'piclaw://chat', label: 'Chat', path: 'Chat' },
    { id: 'piclaw://workspace', label: 'Workspace', path: 'Workspace' },
  ];
  const tree = renderMainShell(createMainShellRenderOptions({
    chatOnlyMode: false,
    workspaceOpen: true,
    uiMode: 'mobile',
    mobileWorkspaceTabEnabled: true,
    mobileWorkspaceActive: true,
    mobileChatActive: false,
    displayTabStripTabs: displayTabs,
    displayTabStripActiveId: 'piclaw://workspace',
  }));

  let explorerVNode: any = null;
  let tabStripVNode: any = null;
  let menuVNode: any = null;
  let quickActionsVNode: any = null;
  const classes = new Set<string>();
  walkVNodes(tree, (node) => {
    if (node.type === WorkspaceExplorer) explorerVNode = node;
    if (node.type === TabStrip) tabStripVNode = node;
    if (node.type === TimelineMenu) menuVNode = node;
    if (node.type === TimelineQuickActions) quickActionsVNode = node;
    if (typeof node.props?.class === 'string') classes.add(node.props.class);
  });

  expect(explorerVNode?.props.visible).toBe(true);
  expect(explorerVNode?.props.active).toBe(true);
  expect(tabStripVNode?.props.tabs).toBe(displayTabs);
  expect(tabStripVNode?.props.activeId).toBe('piclaw://workspace');
  expect(menuVNode?.props.showWorkspaceToggle).toBe(false);
  expect(menuVNode?.props.workspaceVisible).toBe(true);
  expect(quickActionsVNode?.props.showWorkspaceToggle).toBe(false);
  expect(classes.has('app-shell workspace-collapsed mobile-interface mobile-workspace-active')).toBe(true);
  expect([...classes].some((value) => value.startsWith('workspace-toggle-tab'))).toBe(false);
  expect(classes.has('workspace-splitter')).toBe(false);
});

test('Mobile connects roving tabs to active and inert surface panels', () => {
  const paneTab = { id: 'notes/file.md', label: 'file.md', path: 'notes/file.md' };
  const displayTabs = [
    { id: MOBILE_CHAT_TAB_ID, label: 'Chat', path: 'Chat' },
    { id: MOBILE_WORKSPACE_TAB_ID, label: 'Workspace', path: 'Workspace' },
    paneTab,
  ];
  const tree = renderMainShell(createMainShellRenderOptions({
    chatOnlyMode: false,
    workspaceOpen: true,
    editorOpen: true,
    showEditorPaneContainer: true,
    uiMode: 'mobile',
    mobileWorkspaceTabEnabled: true,
    mobileWorkspaceActive: true,
    mobileChatActive: false,
    tabStripTabs: [paneTab],
    tabStripActiveId: paneTab.id,
    displayTabStripTabs: displayTabs,
    displayTabStripActiveId: MOBILE_WORKSPACE_TAB_ID,
    previewTabs: new Set([paneTab.id]),
  }));

  let tabStripVNode: any = null;
  let explorerVNode: any = null;
  let previewVNode: any = null;
  let chatMainVNode: any = null;
  let chatFooterVNode: any = null;
  let paneHostVNode: any = null;
  walkVNodes(tree, (node) => {
    if (node.type === TabStrip) tabStripVNode = node;
    if (node.type === WorkspaceExplorer) explorerVNode = node;
    if (node.type === MarkdownPreview) previewVNode = node;
    if (node.props?.class === 'chat-surface-main') chatMainVNode = node;
    if (node.props?.class === 'chat-surface-footer') chatFooterVNode = node;
    if (node.props?.class === 'editor-pane-host') paneHostVNode = node;
  });

  expect(tabStripVNode?.props.rovingFocus).toBe(true);
  expect(tabStripVNode?.props.restoreFocusAfterClose).toBe(true);
  expect(tabStripVNode?.props.tabListId).toBe(MOBILE_SURFACE_TABLIST_ID);
  expect(tabStripVNode?.props.getTabElementId).toBe(getMobileSurfaceTabElementId);
  expect(tabStripVNode?.props.getTabPanelId).toBe(getMobileSurfacePanelId);
  expect(explorerVNode?.props).toEqual(expect.objectContaining({
    surfaceId: MOBILE_WORKSPACE_PANEL_ID,
    surfaceRole: 'tabpanel',
    surfaceLabelledBy: MOBILE_WORKSPACE_TAB_ELEMENT_ID,
  }));
  expect(explorerVNode?.props.surfaceAriaHidden).toBeUndefined();
  expect(explorerVNode?.props.surfaceInert).toBeUndefined();
  expect(chatMainVNode?.props).toEqual(expect.objectContaining({
    id: MOBILE_CHAT_PANEL_ID,
    role: 'tabpanel',
    'aria-labelledby': MOBILE_CHAT_TAB_ELEMENT_ID,
    'aria-hidden': 'true',
    inert: true,
  }));
  expect(chatFooterVNode?.props['aria-hidden']).toBe('true');
  expect(chatFooterVNode?.props.inert).toBe(true);
  expect(paneHostVNode?.props).toEqual(expect.objectContaining({
    id: MOBILE_PANE_PANEL_ID,
    role: 'tabpanel',
    'aria-labelledby': getMobileSurfaceTabElementId(paneTab.id),
    'aria-hidden': 'true',
    inert: true,
  }));
  expect(previewVNode?.props.surfaceInactive).toBe(true);
});

test('Mobile pane activation hides Chat and compact Workspace while exposing the pane panel', () => {
  const paneTab = { id: 'notes/file.md', label: 'file.md', path: 'notes/file.md' };
  const tree = renderMainShell(createMainShellRenderOptions({
    chatOnlyMode: false,
    workspaceOpen: true,
    editorOpen: true,
    showEditorPaneContainer: true,
    uiMode: 'mobile',
    mobileWorkspaceTabEnabled: true,
    mobileWorkspaceActive: false,
    mobileChatActive: false,
    tabStripTabs: [paneTab],
    tabStripActiveId: paneTab.id,
    displayTabStripTabs: [
      { id: MOBILE_CHAT_TAB_ID, label: 'Chat', path: 'Chat' },
      { id: MOBILE_WORKSPACE_TAB_ID, label: 'Workspace', path: 'Workspace' },
      paneTab,
    ],
    displayTabStripActiveId: paneTab.id,
  }));

  let explorerVNode: any = null;
  let chatMainVNode: any = null;
  let paneHostVNode: any = null;
  walkVNodes(tree, (node) => {
    if (node.type === WorkspaceExplorer) explorerVNode = node;
    if (node.props?.class === 'chat-surface-main') chatMainVNode = node;
    if (node.props?.class === 'editor-pane-host') paneHostVNode = node;
  });

  expect(explorerVNode?.props.surfaceAriaHidden).toBe('true');
  expect(explorerVNode?.props.surfaceInert).toBe(true);
  expect(chatMainVNode?.props['aria-hidden']).toBe('true');
  expect(chatMainVNode?.props.inert).toBe(true);
  expect(paneHostVNode?.props['aria-hidden']).toBeUndefined();
  expect(paneHostVNode?.props.inert).toBeUndefined();
  expect(paneHostVNode?.props['aria-labelledby']).toBe(getMobileSurfaceTabElementId(paneTab.id));
});

test('Classic shell does not opt into Mobile tab or panel accessibility behavior', () => {
  const paneTab = { id: 'notes/file.md', label: 'file.md', path: 'notes/file.md' };
  const tree = renderMainShell(createMainShellRenderOptions({
    chatOnlyMode: false,
    workspaceOpen: true,
    editorOpen: true,
    showEditorPaneContainer: true,
    tabStripTabs: [paneTab],
    tabStripActiveId: paneTab.id,
  }));

  let tabStripVNode: any = null;
  let explorerVNode: any = null;
  let chatMainVNode: any = null;
  let paneHostVNode: any = null;
  walkVNodes(tree, (node) => {
    if (node.type === TabStrip) tabStripVNode = node;
    if (node.type === WorkspaceExplorer) explorerVNode = node;
    if (node.props?.class === 'chat-surface-main') chatMainVNode = node;
    if (node.props?.class === 'editor-pane-host') paneHostVNode = node;
  });

  expect(tabStripVNode?.props.rovingFocus).toBeUndefined();
  expect(tabStripVNode?.props.restoreFocusAfterClose).toBeUndefined();
  expect(tabStripVNode?.props.tabListId).toBeUndefined();
  expect(explorerVNode?.props.surfaceRole).toBeUndefined();
  expect(explorerVNode?.props.surfaceInert).toBeUndefined();
  expect(chatMainVNode?.props.role).toBeUndefined();
  expect(chatMainVNode?.props['aria-hidden']).toBeUndefined();
  expect(chatMainVNode?.props.inert).toBeUndefined();
  expect(paneHostVNode?.props.role).toBeUndefined();
  expect(paneHostVNode?.props['aria-hidden']).toBeUndefined();
  expect(paneHostVNode?.props.inert).toBeUndefined();
});

test('only Mobile moves selected-document attachment from ComposeBox to the tab toolbar', () => {
  const documentTab = {
    id: 'notes/plan.md',
    path: 'notes/plan.md',
    label: 'plan.md',
    dirty: false,
    pinned: false,
  };
  const addFileRef = mock(() => {});
  const handleTabActivate = mock(() => {});
  const attachActiveEditorFile = mock(() => {});
  const findControls = (overrides: Record<string, unknown>) => {
    const tree = renderMainShell(createMainShellRenderOptions({
      chatOnlyMode: false,
      editorOpen: true,
      showEditorPaneContainer: true,
      tabStripTabs: [documentTab],
      tabStripActiveId: documentTab.id,
      displayTabStripTabs: [documentTab],
      displayTabStripActiveId: documentTab.id,
      addFileRef,
      handleTabActivate,
      attachActiveEditorFile,
      ...overrides,
    }));
    let composeVNode: any = null;
    let tabStripVNode: any = null;
    walkVNodes(tree, (node) => {
      if (node.type === ComposeBox) composeVNode = node;
      if (node.type === TabStrip) tabStripVNode = node;
    });
    return { composeVNode, tabStripVNode };
  };

  const mobile = findControls({ uiMode: 'mobile' });
  expect(mobile.composeVNode?.props.activeEditorPath).toBeNull();
  expect(mobile.composeVNode?.props.onAttachEditorFile).toBeUndefined();
  expect(mobile.tabStripVNode?.props.toolbarAction).toEqual(expect.objectContaining({
    testId: 'mobile-attach-to-chat',
    className: 'tab-strip-attach-to-chat',
    title: 'Attach plan.md to Chat',
    disabled: false,
    pressed: false,
  }));
  mobile.tabStripVNode.props.toolbarAction.onClick();
  expect(addFileRef).toHaveBeenCalledWith('notes/plan.md');
  expect(handleTabActivate).toHaveBeenCalledWith(MOBILE_CHAT_TAB_ID);

  const classic = findControls({ uiMode: 'classic' });
  expect(classic.composeVNode?.props.activeEditorPath).toBe(documentTab.id);
  expect(classic.composeVNode?.props.onAttachEditorFile).toBe(attachActiveEditorFile);
  expect(classic.tabStripVNode?.props.toolbarAction).toBeUndefined();
});

test('Mobile tab toolbar does not offer document attachment from Chat or synthetic panes', () => {
  const assertHidden = (tab: any, activeId: string) => {
    const tree = renderMainShell(createMainShellRenderOptions({
      chatOnlyMode: false,
      editorOpen: true,
      showEditorPaneContainer: true,
      uiMode: 'mobile',
      tabStripTabs: tab ? [tab] : [],
      tabStripActiveId: tab?.id || null,
      displayTabStripTabs: tab ? [tab] : [],
      displayTabStripActiveId: activeId,
    }));
    let tabStripVNode: any = null;
    walkVNodes(tree, (node) => {
      if (node.type === TabStrip) tabStripVNode = node;
    });
    expect(tabStripVNode?.props.toolbarAction).toBeUndefined();
  };

  assertHidden({ id: 'notes/plan.md', path: 'notes/plan.md', label: 'plan.md', dirty: false }, MOBILE_CHAT_TAB_ID);
  assertHidden({ id: 'piclaw://terminal', path: 'piclaw://terminal', label: 'Terminal', dirty: false }, 'piclaw://terminal');
});

test('only Mobile exposes the terminal dock control in ComposeBox', () => {
  const toggleDock = mock(() => {});
  const findComposeVNode = (overrides: Record<string, unknown>) => {
    const tree = renderMainShell(createMainShellRenderOptions({
      chatOnlyMode: false,
      hasDockPanes: true,
      dockVisible: true,
      toggleDock,
      ...overrides,
    }));
    let composeVNode: any = null;
    walkVNodes(tree, (node) => {
      if (node.type === ComposeBox) composeVNode = node;
    });
    return composeVNode;
  };

  const mobileCompose = findComposeVNode({ uiMode: 'mobile' });
  expect(mobileCompose?.props.terminalDockAvailable).toBe(true);
  expect(mobileCompose?.props.terminalDockVisible).toBe(true);
  expect(mobileCompose?.props.onToggleTerminalDock).toBe(toggleDock);

  const classicCompose = findComposeVNode({ uiMode: 'classic' });
  expect(classicCompose?.props.terminalDockAvailable).toBe(false);
  expect(classicCompose?.props.terminalDockVisible).toBeUndefined();
  expect(classicCompose?.props.onToggleTerminalDock).toBeUndefined();

  const chatOnlyMobileCompose = findComposeVNode({ uiMode: 'mobile', chatOnlyMode: true });
  expect(chatOnlyMobileCompose?.props.terminalDockAvailable).toBe(false);
  expect(chatOnlyMobileCompose?.props.onToggleTerminalDock).toBeUndefined();
});

test('renderMainShell passes queue controls to ComposeBox and does not render a top-level queue stack', () => {
  const followupQueueItems = [{ row_id: 7, content: 'queued item' }];
  const handleRemoveQueuedFollowup = mock(() => {});

  const tree = renderMainShell(createMainShellRenderOptions({
    followupQueueItems,
    handleRemoveQueuedFollowup,
  }));

  let composeVNode: any = null;
  let topLevelQueueStackCount = 0;

  walkVNodes(tree, (node) => {
    if (node.type === ComposeBox) composeVNode = node;
    if (node.type === QueuedFollowupStack) topLevelQueueStackCount += 1;
  });

  expect(composeVNode).toBeTruthy();
  expect(composeVNode.props.followupQueueItems).toBe(followupQueueItems);
  expect(composeVNode.props.onRemoveQueuedFollowup).toBe(handleRemoveQueuedFollowup);
  expect(composeVNode.props.showQueueStack).toBeUndefined();
  expect(topLevelQueueStackCount).toBe(0);
});

test('handleComposePost does nothing while search is active', () => {
  const scrollToBottom = mock(() => {});
  const scrollPostedMessage = mock(() => {});

  handleComposePost({
    response: { user_message: { id: 99 } },
    viewStateRef: { current: { searchQuery: 'foo', searchOpen: true } },
    scrollToBottom,
    scrollPostedMessage,
  });

  expect(scrollToBottom).not.toHaveBeenCalled();
  expect(scrollPostedMessage).not.toHaveBeenCalled();
});

test('scrollToPostedTimelineMessage waits for the existing row and highlights it without reloading', () => {
  const element = {
    scrollIntoView: mock(() => {}),
    classList: {
      add: mock(() => {}),
      remove: mock(() => {}),
    },
  } as any;
  let lookups = 0;
  const getElementById = mock((id: string) => {
    lookups += 1;
    if (id !== 'post-77') return null;
    return lookups >= 3 ? element : null;
  });
  const rafQueue: Array<() => void> = [];
  const timeoutQueue: Array<() => void> = [];
  const scrollToBottom = mock(() => {});

  scrollToPostedTimelineMessage({
    id: 77,
    scrollToBottom,
    getElementById,
    scheduleRaf: (callback) => { rafQueue.push(callback); },
    scheduleTimeout: (callback, delayMs) => {
      if (delayMs === 2000) {
        callback();
        return;
      }
      timeoutQueue.push(callback);
    },
    maxAttempts: 4,
  });

  while (rafQueue.length > 0 || timeoutQueue.length > 0) {
    const raf = rafQueue.shift();
    if (raf) raf();
    const timeout = timeoutQueue.shift();
    if (timeout) timeout();
  }

  expect(getElementById).toHaveBeenCalled();
  expect(element.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
  expect(element.classList.add).toHaveBeenCalledWith('post-highlight');
  expect(element.classList.remove).toHaveBeenCalledWith('post-highlight');
  expect(scrollToBottom).not.toHaveBeenCalled();
});
