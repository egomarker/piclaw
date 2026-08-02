import { describe, expect, test } from "bun:test";

import {
  encodeTerminalAltKey,
  encodeTerminalCtrlKey,
  inferTerminalCtrlShift,
  isAndroidLikeTerminalPlatform,
  resolveTerminalModifierAction,
  shouldShowTerminalMobileControls,
  TERMINAL_MOBILE_CONTROLS,
  toggleTerminalModifier,
} from "../../web/src/panes/terminal-mobile-controls-runtime.js";

const desktopNavigator = { userAgent: "Mozilla/5.0 (X11; Linux x86_64) Chrome/140 Safari/537.36" } as Navigator;
const androidNavigator = { userAgent: "Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/140 Mobile Safari/537.36" } as Navigator;

describe("terminal mobile toolbar contract", () => {
  test("matches ttyd-go2's exact two-row control order and sequences", () => {
    expect(TERMINAL_MOBILE_CONTROLS.map(({ id, label, input, modifier }) => ({ id, label, input, modifier }))).toEqual([
      { id: "escape", label: "Esc", input: "\x1b", modifier: undefined },
      { id: "alt", label: "Alt", input: undefined, modifier: "alt" },
      { id: "home", label: "Home", input: "\x1b[H", modifier: undefined },
      { id: "arrow-up", label: "↑", input: "\x1b[A", modifier: undefined },
      { id: "end", label: "End", input: "\x1b[F", modifier: undefined },
      { id: "page-up", label: "PgUp", input: "\x1b[5~", modifier: undefined },
      { id: "tab", label: "Tab", input: "\t", modifier: undefined },
      { id: "ctrl", label: "Ctrl", input: undefined, modifier: "ctrl" },
      { id: "arrow-left", label: "←", input: "\x1b[D", modifier: undefined },
      { id: "arrow-down", label: "↓", input: "\x1b[B", modifier: undefined },
      { id: "arrow-right", label: "→", input: "\x1b[C", modifier: undefined },
      { id: "page-down", label: "PgDn", input: "\x1b[6~", modifier: undefined },
    ]);
  });

  test("preserves ttyd-go2's unconditional toolbar display policy", () => {
    expect(shouldShowTerminalMobileControls(null)).toBe(true);
    expect(shouldShowTerminalMobileControls({ navigator: desktopNavigator } as Window)).toBe(true);
    expect(shouldShowTerminalMobileControls({ navigator: androidNavigator } as Window)).toBe(true);
  });
});

describe("terminal modifier encoding", () => {
  test("encodes letters and supported punctuation as control bytes", () => {
    expect(encodeTerminalCtrlKey("a")).toBe("\x01");
    expect(encodeTerminalCtrlKey("Z")).toBe("\x1a");
    expect(encodeTerminalCtrlKey(" ")).toBe("\0");
    expect(encodeTerminalCtrlKey("[")).toBe("\x1b");
    expect(encodeTerminalCtrlKey("\\")).toBe("\x1c");
    expect(encodeTerminalCtrlKey("]")).toBe("\x1d");
    expect(encodeTerminalCtrlKey("^")).toBe("\x1e");
    expect(encodeTerminalCtrlKey("_")).toBe("\x1f");
  });

  test("rejects unsupported or multi-character control input", () => {
    expect(encodeTerminalCtrlKey("1")).toBeNull();
    expect(encodeTerminalCtrlKey("ab")).toBeNull();
    expect(encodeTerminalCtrlKey("")).toBeNull();
  });

  test("prefixes one Alt character with Escape", () => {
    expect(encodeTerminalAltKey("x")).toBe("\x1bx");
    expect(encodeTerminalAltKey("ab")).toBeNull();
  });

  test("toggles modifiers and keeps Ctrl and Alt mutually exclusive", () => {
    expect(toggleTerminalModifier(null, "ctrl")).toBe("ctrl");
    expect(toggleTerminalModifier("ctrl", "ctrl")).toBeNull();
    expect(toggleTerminalModifier("ctrl", "alt")).toBe("alt");
    expect(toggleTerminalModifier("alt", "ctrl")).toBe("ctrl");
  });
});

describe("terminal modifier actions", () => {
  test("distinguishes Ctrl+C from Ctrl+Shift+C", () => {
    expect(resolveTerminalModifierAction("ctrl", "c", { runtimeNavigator: desktopNavigator })).toEqual({
      kind: "input",
      data: "\x03",
    });
    expect(resolveTerminalModifierAction("ctrl", "C", { shiftKey: true, runtimeNavigator: desktopNavigator })).toEqual({
      kind: "copy",
    });
  });

  test("distinguishes Ctrl+V from Ctrl+Shift+V", () => {
    expect(resolveTerminalModifierAction("ctrl", "v", { runtimeNavigator: desktopNavigator })).toEqual({
      kind: "input",
      data: "\x16",
    });
    expect(resolveTerminalModifierAction("ctrl", "V", { shiftKey: true, runtimeNavigator: desktopNavigator })).toEqual({
      kind: "paste",
    });
  });

  test("infers Android virtual-keyboard Shift from uppercase input", () => {
    expect(isAndroidLikeTerminalPlatform(androidNavigator)).toBe(true);
    expect(isAndroidLikeTerminalPlatform(desktopNavigator)).toBe(false);
    expect(inferTerminalCtrlShift("C", false, androidNavigator)).toBe(true);
    expect(inferTerminalCtrlShift("c", false, androidNavigator)).toBe(false);
    expect(inferTerminalCtrlShift("C", false, desktopNavigator)).toBe(false);
    expect(resolveTerminalModifierAction("ctrl", "C", { runtimeNavigator: androidNavigator })).toEqual({ kind: "copy" });
    expect(resolveTerminalModifierAction("ctrl", "V", { runtimeNavigator: androidNavigator })).toEqual({ kind: "paste" });
  });

  test("returns Alt input and consumes unsupported Ctrl characters as no-op actions", () => {
    expect(resolveTerminalModifierAction("alt", "q")).toEqual({ kind: "input", data: "\x1bq" });
    expect(resolveTerminalModifierAction("ctrl", "1")).toEqual({ kind: "none" });
    expect(resolveTerminalModifierAction("ctrl", "ab")).toEqual({ kind: "none" });
  });
});
