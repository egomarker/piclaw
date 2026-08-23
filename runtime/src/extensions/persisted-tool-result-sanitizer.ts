import type { AgentMessage } from "@earendil-works/pi-agent-core";
import type { ExtensionFactory, SessionManager } from "@earendil-works/pi-coding-agent";

import { getSessionPersistenceConfig } from "../core/config.js";

type PersistableSessionMessage = Parameters<SessionManager["appendMessage"]>[0];
type MessageContentBlock = Record<string, unknown>;
type TransientImageBlock = {
  index: number;
  block: MessageContentBlock;
};

type TransientImageState = {
  imagesByToolCallId: Map<string, TransientImageBlock[]>;
  retainCount: number;
};

const IMAGE_SANITIZE_NOTICE_PREFIX = "[Persisted tool result sanitized: removed ";
const transientImageStates = new WeakMap<object, TransientImageState>();

function getTransientImageState(sessionManager: object): TransientImageState {
  const existing = transientImageStates.get(sessionManager);
  if (existing) return existing;

  const state: TransientImageState = {
    imagesByToolCallId: new Map(),
    retainCount: 0,
  };
  transientImageStates.set(sessionManager, state);
  return state;
}

/**
 * Keep transient tool-result images alive across multiple AgentSession.prompt()
 * calls that belong to one Piclaw-owned recovery phase.
 */
export function retainTransientToolResultImages(
  sessionManager: object | null | undefined,
): () => void {
  if (!sessionManager) return () => {};

  const state = getTransientImageState(sessionManager);
  state.retainCount += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    state.retainCount = Math.max(0, state.retainCount - 1);
    if (state.retainCount === 0) state.imagesByToolCallId.clear();
  };
}

export type PersistedToolResultSanitizeResult = {
  message: PersistableSessionMessage;
  changed: boolean;
};

function getToolResultCallId(message: unknown): string | null {
  if (!message || typeof message !== "object") return null;
  const candidate = message as { role?: unknown; toolCallId?: unknown };
  if (candidate.role !== "toolResult" || typeof candidate.toolCallId !== "string") return null;
  return candidate.toolCallId;
}

function collectTransientImageBlocks(message: unknown): TransientImageBlock[] {
  if (!message || typeof message !== "object") return [];
  const content = (message as { content?: unknown }).content;
  if (!Array.isArray(content)) return [];

  const images: TransientImageBlock[] = [];
  for (let index = 0; index < content.length; index++) {
    const block = content[index];
    if (block && typeof block === "object" && block.type === "image") {
      images.push({ index, block: block as MessageContentBlock });
    }
  }
  return images;
}

function isImageSanitizeNotice(block: unknown): boolean {
  return !!block
    && typeof block === "object"
    && (block as { type?: unknown }).type === "text"
    && typeof (block as { text?: unknown }).text === "string"
    && String((block as { text: string }).text).startsWith(IMAGE_SANITIZE_NOTICE_PREFIX);
}

function rehydrateTransientImages(message: AgentMessage, images: TransientImageBlock[]): AgentMessage {
  if (message.role !== "toolResult") return message;
  const content = Array.isArray(message.content)
    ? (message.content as unknown as MessageContentBlock[]).filter((block) => !isImageSanitizeNotice(block))
    : [];
  if (content.some((block) => block?.type === "image")) return message;

  const rehydrated = [...content];
  for (const image of images) {
    rehydrated.splice(Math.min(image.index, rehydrated.length), 0, { ...image.block });
  }
  return { ...message, content: rehydrated as unknown as typeof message.content };
}

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

/**
 * Sanitize finalized messages before AgentSession persists them while retaining
 * tool-returned images through SDK retries, queued continuations, and bounded
 * Piclaw-owned recovery prompts.
 */
export const persistedToolResultSanitizer: ExtensionFactory = (pi) => {
  pi.on("message_end", (event, ctx) => {
    const state = getTransientImageState(ctx.sessionManager);
    const toolCallId = getToolResultCallId(event.message);
    const transientImages = toolCallId ? collectTransientImageBlocks(event.message) : [];
    const result = sanitizePersistedSessionMessage(event.message as PersistableSessionMessage);
    if (result.changed && toolCallId && transientImages.length > 0) {
      state.imagesByToolCallId.set(toolCallId, transientImages);
    }
    return result.changed ? { message: result.message as AgentMessage } : undefined;
  });

  pi.on("context", (event, ctx) => {
    const state = getTransientImageState(ctx.sessionManager);
    let changed = false;
    const messages = event.messages.map((message) => {
      const toolCallId = getToolResultCallId(message);
      const transientImages = toolCallId ? state.imagesByToolCallId.get(toolCallId) : undefined;
      if (!transientImages?.length) return message;
      changed = true;
      return rehydrateTransientImages(message, transientImages);
    });
    return changed ? { messages } : undefined;
  });

  pi.on("agent_settled", (_event, ctx) => {
    const state = getTransientImageState(ctx.sessionManager);
    if (state.retainCount === 0) state.imagesByToolCallId.clear();
  });

  pi.on("session_shutdown", (_event, ctx) => {
    transientImageStates.get(ctx.sessionManager)?.imagesByToolCallId.clear();
    transientImageStates.delete(ctx.sessionManager);
  });
};
