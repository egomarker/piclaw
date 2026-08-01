import { useCallback, useRef } from '../vendor/preact-htm.js';
import { useEditorState } from './use-editor-state.js';
import { usePaneRuntimeOrchestration } from './app-pane-runtime-orchestration.js';

export function resolveMainPaneSurfaceVisibility(options: {
  uiMode?: 'classic' | 'mobile';
  panePopoutMode: boolean;
  mobileChatActive: boolean;
  mobileWorkspaceActive?: boolean;
}): boolean {
  return options.panePopoutMode
    || options.uiMode !== 'mobile'
    || (!options.mobileChatActive && !options.mobileWorkspaceActive);
}

export function runMainAppZenToggle(options: {
  uiMode?: 'classic' | 'mobile';
  zenMode: boolean;
  activateChatSurface?: () => void;
  toggleZenMode: () => void;
}) {
  if (options.uiMode === 'mobile' && !options.zenMode) {
    options.activateChatSurface?.();
  }
  options.toggleZenMode();
}

export function createTabClosedFileReferenceHandler(options: {
  uiMode?: 'classic' | 'mobile';
  removeFileRefRef: { current: any };
}): ((path: string) => void) | undefined {
  if (options.uiMode === 'mobile') return undefined;
  return (path: string) => options.removeFileRefRef.current?.(path);
}

export function buildMainAppPaneCompositionResult(options: {
  removeFileRefRef: { current: any };
  editorState: Record<string, any>;
  paneRuntime: Record<string, any>;
}) {
  return {
    removeFileRefRef: options.removeFileRefRef,
    editorState: options.editorState,
    paneRuntime: options.paneRuntime,
  };
}

export function useMainAppPaneComposition(options: {
  panePopoutMode: boolean;
  panePopoutPath: string | null;
  panePopoutLabel: string | null;
  chatOnlyMode: boolean;
  uiMode?: 'classic' | 'mobile';
  mobileWorkspaceTabEnabled?: boolean;
  onMobileWorkspacePromotedToRail?: () => void;
  terminalTabPath: string;
  vncTabPrefix: string;
  getWorkspaceFile: (path: string, maxBytes: number, mode: string) => Promise<any>;
}) {
  const removeFileRefRef = useRef<any>(null);

  const editorState = useEditorState({
    onTabClosed: createTabClosedFileReferenceHandler({
      uiMode: options.uiMode,
      removeFileRefRef,
    }),
    uiMode: options.uiMode,
    mobileWorkspaceTabEnabled: options.mobileWorkspaceTabEnabled,
    onMobileWorkspacePromotedToRail: options.onMobileWorkspacePromotedToRail,
  });

  const paneRuntime = usePaneRuntimeOrchestration({
    panePopoutMode: options.panePopoutMode,
    panePopoutPath: options.panePopoutPath,
    panePopoutLabel: options.panePopoutLabel,
    chatOnlyMode: options.chatOnlyMode,
    editorOpen: editorState.editorOpen,
    paneSurfaceVisible: resolveMainPaneSurfaceVisibility({
      uiMode: options.uiMode,
      panePopoutMode: options.panePopoutMode,
      mobileChatActive: editorState.mobileChatActive,
      mobileWorkspaceActive: editorState.mobileWorkspaceActive,
    }),
    tabStripTabs: editorState.tabStripTabs,
    tabStripActiveId: editorState.tabStripActiveId,
    previewTabs: editorState.previewTabs,
    diffTabs: editorState.diffTabs,
    tabPaneOverrides: editorState.tabPaneOverrides,
    terminalTabPath: options.terminalTabPath,
    vncTabPrefix: options.vncTabPrefix,
    openEditor: editorState.openEditor,
    activateEditorTab: editorState.handleTabActivate,
    closeEditor: editorState.closeEditor,
    getWorkspaceFile: options.getWorkspaceFile,
  });

  const toggleZenMode = useCallback(() => {
    runMainAppZenToggle({
      uiMode: options.uiMode,
      zenMode: paneRuntime.zenMode,
      activateChatSurface: editorState.activateChatSurface,
      toggleZenMode: paneRuntime.toggleZenMode,
    });
  }, [editorState.activateChatSurface, options.uiMode, paneRuntime.toggleZenMode, paneRuntime.zenMode]);

  return buildMainAppPaneCompositionResult({
    removeFileRefRef,
    editorState,
    paneRuntime: options.uiMode === 'mobile'
      ? { ...paneRuntime, toggleZenMode }
      : paneRuntime,
  });
}
