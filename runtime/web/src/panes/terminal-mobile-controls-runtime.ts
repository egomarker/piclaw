export type TerminalModifierMode = "ctrl" | "alt" | null;

export type TerminalMobileControlId =
  | "escape"
  | "alt"
  | "home"
  | "arrow-up"
  | "end"
  | "page-up"
  | "tab"
  | "ctrl"
  | "arrow-left"
  | "arrow-down"
  | "arrow-right"
  | "page-down";

export interface TerminalMobileControlDefinition {
  id: TerminalMobileControlId;
  label: string;
  ariaLabel: string;
  input?: string;
  modifier?: Exclude<TerminalModifierMode, null>;
}

/** Matches ttyd-go2's two-row terminal toolbar exactly. */
export const TERMINAL_MOBILE_CONTROLS: readonly TerminalMobileControlDefinition[] = Object.freeze([
  { id: "escape", label: "Esc", ariaLabel: "Escape", input: "\x1b" },
  { id: "alt", label: "Alt", ariaLabel: "Latch Alt for the next character", modifier: "alt" },
  { id: "home", label: "Home", ariaLabel: "Home", input: "\x1b[H" },
  { id: "arrow-up", label: "↑", ariaLabel: "Arrow up", input: "\x1b[A" },
  { id: "end", label: "End", ariaLabel: "End", input: "\x1b[F" },
  { id: "page-up", label: "PgUp", ariaLabel: "Page up", input: "\x1b[5~" },
  { id: "tab", label: "Tab", ariaLabel: "Tab", input: "\t" },
  { id: "ctrl", label: "Ctrl", ariaLabel: "Latch Control for the next character", modifier: "ctrl" },
  { id: "arrow-left", label: "←", ariaLabel: "Arrow left", input: "\x1b[D" },
  { id: "arrow-down", label: "↓", ariaLabel: "Arrow down", input: "\x1b[B" },
  { id: "arrow-right", label: "→", ariaLabel: "Arrow right", input: "\x1b[C" },
  { id: "page-down", label: "PgDn", ariaLabel: "Page down", input: "\x1b[6~" },
]);

function matchesTerminalMedia(runtimeWindow: Window | null, query: string): boolean {
  if (!runtimeWindow || typeof runtimeWindow.matchMedia !== "function") return false;
  try {
    return Boolean(runtimeWindow.matchMedia(query)?.matches);
  } catch {
    return false;
  }
}

/**
 * Show the touch toolbar when browser/device signals identify a mobile or
 * touch-capable environment. JavaScript owns this decision so Android cannot
 * be hidden by conflicting hover/fine-pointer media-query results.
 */
export function shouldShowTerminalMobileControls(
  runtimeWindow: Window | null = typeof window === "undefined" ? null : window,
): boolean {
  const runtimeNavigator = runtimeWindow?.navigator
    ?? (typeof navigator === "undefined" ? null : navigator);
  if (!runtimeWindow && !runtimeNavigator) return false;

  const navigatorWithHints = runtimeNavigator as (Navigator & {
    standalone?: boolean;
    userAgentData?: { mobile?: boolean };
  }) | null;
  const userAgent = String(navigatorWithHints?.userAgent || "");
  const maxTouchPoints = Number(navigatorWithHints?.maxTouchPoints || 0);
  const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(userAgent);
  const coarsePointer = matchesTerminalMedia(runtimeWindow, "(pointer: coarse)")
    || matchesTerminalMedia(runtimeWindow, "(any-pointer: coarse)");
  const standaloneDisplay = navigatorWithHints?.standalone === true
    || matchesTerminalMedia(runtimeWindow, "(display-mode: standalone)")
    || matchesTerminalMedia(runtimeWindow, "(display-mode: fullscreen)")
    || matchesTerminalMedia(runtimeWindow, "(display-mode: minimal-ui)");

  return navigatorWithHints?.userAgentData?.mobile === true
    || mobileUserAgent
    || maxTouchPoints > 1
    || coarsePointer
    || (standaloneDisplay && maxTouchPoints > 0);
}

export function isAndroidLikeTerminalPlatform(
  runtimeNavigator: Pick<Navigator, "userAgent"> | null | undefined = typeof navigator === "undefined" ? null : navigator,
): boolean {
  return /Android/i.test(String(runtimeNavigator?.userAgent || ""));
}

export function toggleTerminalModifier(
  current: TerminalModifierMode,
  requested: Exclude<TerminalModifierMode, null>,
): TerminalModifierMode {
  return current === requested ? null : requested;
}

export function encodeTerminalCtrlKey(value: string): string | null {
  if (!value || value.length !== 1) return null;

  const uppercaseCode = value.toUpperCase().charCodeAt(0);
  if (uppercaseCode >= 65 && uppercaseCode <= 90) {
    return String.fromCharCode(uppercaseCode - 64);
  }

  if (value === " ") return "\0";
  if (value === "[") return "\x1b";
  if (value === "\\") return "\x1c";
  if (value === "]") return "\x1d";
  if (value === "^") return "\x1e";
  if (value === "_") return "\x1f";
  return null;
}

export function encodeTerminalAltKey(value: string): string | null {
  return value && value.length === 1 ? `\x1b${value}` : null;
}

export function inferTerminalCtrlShift(
  value: string,
  shiftKey = false,
  runtimeNavigator: Pick<Navigator, "userAgent"> | null | undefined = typeof navigator === "undefined" ? null : navigator,
): boolean {
  if (shiftKey) return true;
  if (!isAndroidLikeTerminalPlatform(runtimeNavigator) || !value || value.length !== 1) return false;

  const lower = value.toLowerCase();
  const upper = value.toUpperCase();
  return lower !== upper && value === upper;
}

export type TerminalModifierAction =
  | { kind: "input"; data: string }
  | { kind: "copy" }
  | { kind: "paste" }
  | { kind: "none" };

export function resolveTerminalModifierAction(
  mode: Exclude<TerminalModifierMode, null>,
  value: string,
  options: {
    shiftKey?: boolean;
    runtimeNavigator?: Pick<Navigator, "userAgent"> | null;
  } = {},
): TerminalModifierAction {
  if (!value || value.length !== 1) return { kind: "none" };

  if (mode === "alt") {
    const data = encodeTerminalAltKey(value);
    return data === null ? { kind: "none" } : { kind: "input", data };
  }

  const shifted = inferTerminalCtrlShift(value, Boolean(options.shiftKey), options.runtimeNavigator);
  if (shifted) {
    const normalized = value.toLowerCase();
    if (normalized === "c") return { kind: "copy" };
    if (normalized === "v") return { kind: "paste" };
  }

  const data = encodeTerminalCtrlKey(value);
  return data === null ? { kind: "none" } : { kind: "input", data };
}
