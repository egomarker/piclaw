import { renderMainShell, type MainShellRenderOptions } from './app-main-shell-render.js';

/**
 * Render the Mobile shell through the shared Classic component tree.
 *
 * Mobile-specific state and layout are layered onto this entry point while
 * Classic continues to call renderMainShell directly.
 */
export function renderMobileShell(options: MainShellRenderOptions): any {
  return renderMainShell({
    ...options,
    uiMode: 'mobile',
  });
}
