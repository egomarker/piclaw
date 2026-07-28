/**
 * db/web-content.ts – Content length clamping for the web UI timeline.
 *
 * Very large message content (e.g. pasted log files, huge tool outputs) can
 * slow down the web timeline. This module decides whether content should be
 * truncated or previewed before being sent to the browser.
 *
 * The thresholds are configured under domains.web, with legacy environment
 * aliases retained through 3.0.0.
 *
 * Consumers:
 *   - db/messages.ts calls clampWebContent() inside buildInteraction() so
 *     every InteractionRow returned to the web channel is size-safe.
 *   - channels/web/message-store.ts uses shouldPreviewWebContent() and
 *     getWebPreviewMaxChars() for streaming draft preview decisions.
 */

import { getWebContentConfig } from "../core/config.js";
import type { InteractionContentMeta } from "./types.js";

/** Regex to detect inline SVG content which should never be previewed/truncated. */
const SVG_HINT = /data:image\/svg\+xml|<svg[\s>]/i;

/** Check if content contains SVG markup that should be kept intact. */
export function isSvgContent(content: string): boolean {
  return SVG_HINT.test(content);
}

/**
 * Determine whether content exceeds the preview threshold and is therefore
 * a candidate for preview truncation (SVG content is exempt).
 */
export function shouldPreviewWebContent(content: string): boolean {
  if (!content) return false;
  if (content.length <= getWebContentConfig().previewChars) return false;
  if (isSvgContent(content)) return false;
  return true;
}

/** Return the current preview character limit. */
export function getWebPreviewMaxChars(): number {
  return getWebContentConfig().previewChars;
}

/**
 * Clamp content for safe delivery to the web timeline:
 *   1. If content exceeds the hard cap → return empty content + truncated meta.
 *   2. If content exceeds the preview threshold → return a prefix + preview meta.
 *   3. Otherwise → return content unchanged (no meta).
 *
 * The returned `meta` (if present) tells the web UI that the content was
 * shortened and includes the original length for display purposes.
 */
export function clampWebContent(content: string): { content: string; meta?: InteractionContentMeta } {
  const safeContent = typeof content === "string" ? content : String(content ?? "");
  const length = safeContent.length;

  // Hard truncation – content is too large to store even as a preview.
  const limits = getWebContentConfig();
  if (length > limits.maxChars) {
    return {
      content: "",
      meta: {
        truncated: true,
        original_length: length,
        max_length: limits.maxChars,
      },
    };
  }

  // Soft preview – show a prefix and let the UI offer "show more".
  if (shouldPreviewWebContent(safeContent)) {
    const preview = safeContent.slice(0, limits.previewChars).trimEnd();
    return {
      content: preview,
      meta: {
        truncated: true,
        preview: true,
        original_length: length,
        max_length: limits.previewChars,
      },
    };
  }

  return { content: safeContent };
}
