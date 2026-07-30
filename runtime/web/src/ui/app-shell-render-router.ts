import {
  renderBranchLoaderMode,
  renderPanePopoutMode,
  resolveAppShellRenderMode,
} from './app-pane-mode-render.js';
import { renderMainShell } from './app-main-shell-render.js';
import { renderMobileShell } from './app-mobile-shell-render.js';

interface RenderRouterOptions {
  branchLoaderMode: boolean;
  panePopoutMode: boolean;
  uiMode?: 'classic' | 'mobile';
  branchLoaderState: any;
  panePopoutOptions: Record<string, unknown>;
  mainShellOptions: Record<string, unknown>;
  renderers?: {
    renderBranchLoaderMode?: (state: any) => any;
    renderPanePopoutMode?: (options: Record<string, unknown>) => any;
    renderMainShell?: (options: Record<string, unknown>) => any;
    renderMobileShell?: (options: Record<string, unknown>) => any;
  };
}

export function renderResolvedAppShell(options: RenderRouterOptions): any {
  const {
    branchLoaderMode,
    panePopoutMode,
    uiMode = 'classic',
    branchLoaderState,
    panePopoutOptions,
    mainShellOptions,
    renderers,
  } = options;

  const mode = resolveAppShellRenderMode({
    branchLoaderMode,
    panePopoutMode,
  });

  const renderBranch = renderers?.renderBranchLoaderMode || renderBranchLoaderMode;
  const renderPopout = renderers?.renderPanePopoutMode || renderPanePopoutMode;
  const renderMain = renderers?.renderMainShell || renderMainShell;
  const renderMobile = renderers?.renderMobileShell || renderMobileShell;

  if (mode === 'branch-loader') {
    return renderBranch(branchLoaderState);
  }

  if (mode === 'pane-popout') {
    return renderPopout(panePopoutOptions);
  }

  return uiMode === 'mobile'
    ? renderMobile(mainShellOptions)
    : renderMain(mainShellOptions);
}
