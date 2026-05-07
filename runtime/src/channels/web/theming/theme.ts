/**
 * web/theme.ts – Fallback theme provider for the web UI.
 *
 * Returns a minimal theme object when no custom theme is loaded from
 * the workspace's .pi directory. Ensures the web UI always has a
 * valid theme to work with.
 *
 * Consumers: channels/web.ts uses createFallbackTheme() during init.
 */

import type { Theme } from "@earendil-works/pi-coding-agent";

/** Return a minimal fallback Theme when no custom theme is loaded. */
export function createFallbackTheme(): Theme {
  const passthrough = (text: string) => text;
  const identity = () => passthrough;
  return {
    name: "web",
    sourcePath: undefined,
    fg: (_color: string, text: string) => text,
    bg: (_color: string, text: string) => text,
    bold: passthrough,
    italic: passthrough,
    underline: passthrough,
    inverse: passthrough,
    strikethrough: passthrough,
    getFgAnsi: (_color: string) => "",
    getBgAnsi: (_color: string) => "",
    getColorMode: () => "truecolor",
    getThinkingBorderColor: () => identity(),
    getBashModeBorderColor: () => identity(),
  } as unknown as Theme;
}
