import type { AgentMessage } from "@earendil-works/pi-agent-core";
import type { ExtensionFactory, SessionManager } from "@earendil-works/pi-coding-agent";

import { getSessionPersistenceConfig } from "../core/config.js";

type PersistableSessionMessage = Parameters<SessionManager["appendMessage"]>[0];

export type PersistedToolResultSanitizeResult = {
  message: PersistableSessionMessage;
  changed: boolean;
};

function formatBytes(bytes: number): string {
  if (!(bytes > 0)) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const digits = value >= 10 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[unitIndex]}`;
}

function truncatePreview(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const head = text.slice(0, Math.max(0, maxChars - 120));
  const omitted = text.length - head.length;
  return `${head}\n\n[... omitted ${omitted} chars for persisted session size ...]`;
}

export function sanitizePersistedSessionMessage(message: PersistableSessionMessage): PersistedToolResultSanitizeResult {
  if (!message || typeof message !== "object" || (message as { role?: unknown }).role !== "toolResult") {
    return { message, changed: false };
  }

  const config = getSessionPersistenceConfig();
  const toolResultMessage = message as unknown as { content?: unknown; toolName?: string };
  const baseMessage = message as unknown as Record<string, unknown>;
  const serializedSize = Buffer.byteLength(JSON.stringify(message));
  const originalContent = Array.isArray(toolResultMessage.content)
    ? ([...toolResultMessage.content] as Array<Record<string, unknown> | null | undefined>)
    : null;

  let changed = false;
  let removedImageBlocks = 0;
  let removedImageBytes = 0;
  let previewText = "";
  const sanitizedContent: Array<Record<string, unknown>> = [];

  if (originalContent) {
    for (const block of originalContent) {
      if (!block || typeof block !== "object") continue;
      if (block.type === "image") {
        removedImageBlocks += 1;
        if (typeof block.data === "string") removedImageBytes += block.data.length;
        changed = true;
        continue;
      }
      if (!previewText && block.type === "text" && typeof block.text === "string") previewText = block.text;
      sanitizedContent.push(block);
    }
  }

  if (removedImageBlocks > 0) {
    const mimeTypes = originalContent
      ?.filter((block): block is Record<string, unknown> => !!block && typeof block === "object")
      .filter((block) => block.type === "image" && typeof block.mimeType === "string")
      .map((block) => String(block.mimeType)) ?? [];
    sanitizedContent.push({
      type: "text",
      text: `[Persisted tool result sanitized: removed ${removedImageBlocks} inline image block${removedImageBlocks === 1 ? "" : "s"}${mimeTypes.length ? ` (${Array.from(new Set(mimeTypes)).join(", ")})` : ""} totalling ~${formatBytes(removedImageBytes)}.]`,
    });
  }

  let sanitizedMessage: PersistableSessionMessage = changed
    ? ({ ...baseMessage, content: sanitizedContent } as unknown as PersistableSessionMessage)
    : message;

  const sanitizedSize = Buffer.byteLength(JSON.stringify(sanitizedMessage));
  if (sanitizedSize > config.toolResultMaxPersistBytes) {
    const fallbackPreview = truncatePreview(
      previewText || `Tool result for ${toolResultMessage.toolName || "tool"}.`,
      config.toolResultPreviewChars,
    );
    sanitizedMessage = {
      ...baseMessage,
      content: [{
        type: "text",
        text: `${fallbackPreview}\n\n[Persisted tool result truncated from ${formatBytes(serializedSize)} to stay within the ${formatBytes(config.toolResultMaxPersistBytes)} session-entry budget.]`,
      }],
    } as unknown as PersistableSessionMessage;
    changed = true;
  }

  return { message: sanitizedMessage, changed };
}

/** Sanitize finalized messages before AgentSession persists them. */
export const persistedToolResultSanitizer: ExtensionFactory = (pi) => {
  pi.on("message_end", (event) => {
    const result = sanitizePersistedSessionMessage(event.message as PersistableSessionMessage);
    return result.changed ? { message: result.message as AgentMessage } : undefined;
  });
};
