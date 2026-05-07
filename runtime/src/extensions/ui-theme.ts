/**
 * ui-theme – registers /theme and /tint commands for the web UI.
 *
 * /theme <name>   → switch to a named theme
 * /tint <#hex>    → tint the default light/dark theme
 * /tint off       → clear tint and restore default light/dark
 */
import { formatThemeList, labelForTheme, normalizeTheme } from "../channels/web/theming/ui-theme-data.js";
import type { ExtensionAPI, ExtensionFactory } from "@earendil-works/pi-coding-agent";

const CLEAR_VALUES = new Set(["off", "clear", "none", "reset", "default"]);

function normalizeHex(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  const hex = raw.startsWith("#") ? raw.slice(1) : raw;
  if (!/^[0-9a-fA-F]{3}$/.test(hex) && !/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  return `#${full.toLowerCase()}`;
}

function normalizeTint(input: string): string | null {
  const hex = normalizeHex(input);
  if (hex) return hex;
  const named = input.trim().toLowerCase();
  if (!named) return null;
  if (/^[a-z]+$/.test(named)) return named;
  return null;
}

function sendThemeMessage(pi: ExtensionAPI, content: string) {
  pi.sendMessage({
    customType: "ui-theme",
    content,
    display: true,
  });
}

type WebUiThemePayload = { name: string; tint: string | null };

function setWebUiTheme(ctx: { ui: unknown }, payload: WebUiThemePayload): { success: boolean; error?: string } {
  const ui = ctx.ui as { setTheme(theme: string | { name: string; tint: string | null }): { success: boolean; error?: string } };
  return ui.setTheme(payload);
}

/** Extension factory that exposes `/theme` command and UI theme controls. */
export const uiThemeExtension: ExtensionFactory = (pi: ExtensionAPI) => {
  pi.registerCommand("theme", {
    description: "Set UI theme (usage: /theme <name>)",
    handler: async (args, ctx) => {
      if (!ctx?.hasUI) {
        sendThemeMessage(pi, "UI theme controls are only available in the web UI.");
        return;
      }

      const trimmed = (args || "").trim();
      if (!trimmed) {
        sendThemeMessage(pi, formatThemeList());
        return;
      }

      const theme = normalizeTheme(trimmed);
      if (!theme) {
        sendThemeMessage(pi, `Unknown theme: ${trimmed}. Omit the name to show available themes.`);
        return;
      }

      const result = setWebUiTheme(ctx, { name: theme, tint: null });
      if (!result?.success) {
        sendThemeMessage(pi, `Failed to set theme: ${result?.error || "unknown error"}.`);
        return;
      }

      const label = labelForTheme(theme);
      sendThemeMessage(pi, `Theme set to ${label}.`);
    },
  });

  pi.registerCommand("tint", {
    description: "Tint default theme (usage: /tint #hex or /tint off)",
    handler: async (args, ctx) => {
      if (!ctx?.hasUI) {
        sendThemeMessage(pi, "UI theme controls are only available in the web UI.");
        return;
      }

      const trimmed = (args || "").trim();
      if (!trimmed) {
        sendThemeMessage(pi, "Usage: /tint #hex (e.g. /tint #3b82f6), /tint orange, or /tint off");
        return;
      }

      const normalized = trimmed.toLowerCase();
      if (CLEAR_VALUES.has(normalized)) {
        const result = setWebUiTheme(ctx, { name: "default", tint: null });
        if (!result?.success) {
          sendThemeMessage(pi, `Failed to clear tint: ${result?.error || "unknown error"}.`);
          return;
        }
        sendThemeMessage(pi, "Tint cleared (default light/dark restored).");
        return;
      }

      const tint = normalizeTint(trimmed);
      if (!tint) {
        sendThemeMessage(pi, `Invalid tint value: ${trimmed}. Use a hex color (e.g. #3b82f6), a named color (e.g. orange), or /tint off.`);
        return;
      }

      const result = setWebUiTheme(ctx, { name: "default", tint });
      if (!result?.success) {
        sendThemeMessage(pi, `Failed to set tint: ${result?.error || "unknown error"}.`);
        return;
      }

      sendThemeMessage(pi, `Tint set to ${tint}.`);
    },
  });
};
