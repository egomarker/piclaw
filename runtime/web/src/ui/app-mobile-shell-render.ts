import { renderMainShell, type MainShellRenderOptions } from './app-main-shell-render.js';

/** Build the shared renderer input without replacing pane-only state. */
export function composeMobileShellRenderOptions(options: MainShellRenderOptions): MainShellRenderOptions {
  return {
    ...options,
    uiMode: 'mobile',
    mobileChatActive: Boolean(options.mobileChatActive),
    displayTabStripTabs: options.mobileTabStripTabs || options.tabStripTabs,
    displayTabStripActiveId: options.mobileTabStripActiveId || options.tabStripActiveId,
  };
}

/**
 * Render the Mobile shell through the shared Classic component tree.
 *
 * Mobile-specific state and layout are layered onto this entry point while
 * Classic continues to call renderMainShell directly.
 */
export function renderMobileShell(options: MainShellRenderOptions): any {
  return renderMainShell(composeMobileShellRenderOptions(options));
}
