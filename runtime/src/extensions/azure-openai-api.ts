/**
 * extensions/azure-openai-api.ts – Stable extension-facing API for Azure OpenAI helpers.
 *
 * Centralizes imports used by `extensions/integrations/azure-openai.ts` so the extension entrypoint
 * does not depend directly on fragile deep implementation paths.
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OPENAI_RESPONSES_SHARED_RELATIVE_PATH = join(
  "@earendil-works",
  "pi-ai",
  "dist",
  "providers",
  "openai-responses-shared.js",
);

type AsyncIterableLike<T> = AsyncIterable<T> | Iterable<T>;

type ResponsePartRecord = Record<string, unknown> & { type?: string; text?: string };
type ResponseItemRecord = Record<string, unknown> & {
  id?: string;
  type?: string;
  phase?: string | null;
  summary?: unknown[];
  content?: unknown[];
};
type ResponseEventRecord = {
  type?: string;
  item?: ResponseItemRecord | null;
  part?: ResponsePartRecord | null;
  output_index?: number;
  content_index?: number;
  summary_index?: number;
  item_id?: string;
  sequence_number?: number;
  delta?: string;
  text?: string;
};

export function resolvePiAiResponsesSharedModulePath(startDir: string = __dirname): string {
  // Walk up from startDir looking for node_modules containing the target module.
  let dir = startDir;
  for (let i = 0; i < 10; i += 1) {
    const candidate = join(dir, "node_modules", OPENAI_RESPONSES_SHARED_RELATIVE_PATH);
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fallback: when running from a bundle output dir (e.g. /workspace/tmp), the
  // walk-up may miss the project's node_modules. Check the global install path.
  const globalCandidate = join("/usr/local/lib/bun/install/global", "node_modules", OPENAI_RESPONSES_SHARED_RELATIVE_PATH);
  if (existsSync(globalCandidate)) return globalCandidate;
  throw new Error(`Unable to resolve ${OPENAI_RESPONSES_SHARED_RELATIVE_PATH} from ${startDir}`);
}

const {
  convertResponsesMessages,
  convertResponsesTools,
  processResponsesStream: upstreamProcessResponsesStream,
} = await import(pathToFileURL(resolvePiAiResponsesSharedModulePath()).href);

function cloneEvent<T>(event: T): T {
  return JSON.parse(JSON.stringify(event));
}

function adaptReasoningOutputItem(item: ResponseItemRecord | null | undefined): ResponseItemRecord | null {
  if (!item || item.type !== "reasoning") return item ?? null;
  const hasSummary = Array.isArray(item.summary) && item.summary.length > 0;
  if (hasSummary) return item;
  const content = Array.isArray(item.content) ? item.content : [];
  const reasoningParts = content.filter((part) => part && typeof part === "object" && (part as ResponsePartRecord).type === "reasoning_text") as Array<ResponsePartRecord>;
  if (reasoningParts.length === 0) return item;
  return {
    ...item,
    summary: reasoningParts.map((part) => ({
      type: "summary_text",
      text: typeof part.text === "string" ? part.text : "",
    })),
  };
}

function commentaryPartToSummaryPart(part: ResponsePartRecord | null | undefined): ResponsePartRecord {
  return {
    type: "summary_text",
    text: typeof part?.text === "string" ? part.text : "",
  };
}

function adaptCommentaryOutputItem(item: ResponseItemRecord | null | undefined): ResponseItemRecord | null {
  if (!item) return null;
  const content = Array.isArray(item.content) ? item.content : [];
  return {
    id: item.id,
    type: "reasoning",
    summary: content
      .filter((part) => part && typeof part === "object" && (part as ResponsePartRecord).type === "output_text")
      .map((part) => ({ type: "summary_text", text: typeof (part as ResponsePartRecord).text === "string" ? (part as ResponsePartRecord).text : "" })),
  };
}

async function* adaptAzureReasoningEvents(events: AsyncIterableLike<any>): AsyncGenerator<any> {
  const commentaryOutputs = new Set<number>();
  for await (const rawEvent of events as AsyncIterable<any>) {
    const event = rawEvent as ResponseEventRecord;

    if (event?.type === "response.output_item.added" && event.item?.type === "message" && event.item.phase === "commentary") {
      if (typeof event.output_index === "number") commentaryOutputs.add(event.output_index);
      yield {
        ...cloneEvent(rawEvent),
        item: {
          id: event.item.id,
          type: "reasoning",
          summary: [],
        },
      };
      continue;
    }

    if (event?.type === "response.content_part.added" && event.part?.type === "reasoning_text") {
      yield {
        ...cloneEvent(rawEvent),
        type: "response.reasoning_summary_part.added",
        part: commentaryPartToSummaryPart(event.part),
        summary_index: event.content_index ?? event.summary_index ?? 0,
      };
      continue;
    }

    if (event?.type === "response.content_part.added" && typeof event.output_index === "number" && commentaryOutputs.has(event.output_index) && event.part?.type === "output_text") {
      yield {
        ...cloneEvent(rawEvent),
        type: "response.reasoning_summary_part.added",
        part: commentaryPartToSummaryPart(event.part),
        summary_index: event.content_index ?? event.summary_index ?? 0,
      };
      continue;
    }

    if (event?.type === "response.reasoning_text.delta") {
      yield {
        ...cloneEvent(rawEvent),
        type: "response.reasoning_summary_text.delta",
        summary_index: event.content_index ?? event.summary_index ?? 0,
      };
      continue;
    }

    if (event?.type === "response.output_text.delta" && typeof event.output_index === "number" && commentaryOutputs.has(event.output_index)) {
      yield {
        ...cloneEvent(rawEvent),
        type: "response.reasoning_summary_text.delta",
        summary_index: event.content_index ?? event.summary_index ?? 0,
      };
      continue;
    }

    if (event?.type === "response.reasoning_text.done") {
      yield {
        ...cloneEvent(rawEvent),
        type: "response.reasoning_summary_part.done",
        part: {
          type: "summary_text",
          text: typeof event.text === "string" ? event.text : "",
        },
        summary_index: event.content_index ?? event.summary_index ?? 0,
      };
      continue;
    }

    if (event?.type === "response.output_text.done" && typeof event.output_index === "number" && commentaryOutputs.has(event.output_index)) {
      yield {
        ...cloneEvent(rawEvent),
        type: "response.reasoning_summary_part.done",
        part: {
          type: "summary_text",
          text: typeof event.text === "string" ? event.text : "",
        },
        summary_index: event.content_index ?? event.summary_index ?? 0,
      };
      continue;
    }

    if (event?.type === "response.output_item.done" && event.item?.type === "reasoning") {
      const adapted = cloneEvent(rawEvent);
      adapted.item = adaptReasoningOutputItem(event.item);
      yield adapted;
      continue;
    }

    if (event?.type === "response.output_item.done" && event.item?.type === "message" && event.item.phase === "commentary") {
      if (typeof event.output_index === "number") commentaryOutputs.delete(event.output_index);
      const adapted = cloneEvent(rawEvent);
      adapted.item = adaptCommentaryOutputItem(event.item);
      yield adapted;
      continue;
    }

    if (event?.type === "response.completed") {
      commentaryOutputs.clear();
    }

    yield rawEvent;
  }
}

export { applyToolCallLimit } from "../utils/azure-tool-call-limit.js";

/** Re-exported response-input conversion helper from pi-ai internals. */
export { convertResponsesMessages, convertResponsesTools };

/**
 * Wrapper around pi-ai's Responses stream parser.
 *
 * Azure/OpenAI can emit reasoning content either as `reasoning_summary_*` events,
 * as `reasoning_text` parts inside a `reasoning` output item, or as `message`
 * items with `phase: "commentary"`. pi-ai's shared parser only handles the summary
 * flavor. Adapt the other provider-native forms to the existing summary events so
 * the UI consistently receives `thinking_*` updates instead of Draft pollution.
 */
export async function processResponsesStream(...args: any[]): Promise<void> {
  const [openaiStream, ...rest] = args;
  await upstreamProcessResponsesStream(adaptAzureReasoningEvents(openaiStream), ...rest);
}

/** Input contract accepted by buildBaseOptions(). */
export interface AzureBaseOptionsInput {
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
  apiKey?: string;
  cacheRetention?: string | number;
  sessionId?: string;
  headers?: Record<string, string>;
  onPayload?: (payload: unknown) => void;
  maxRetryDelayMs?: number;
  metadata?: Record<string, unknown>;
}

/** Output contract returned by buildBaseOptions(). */
export interface AzureBaseOptions {
  temperature?: number;
  maxTokens: number;
  signal?: AbortSignal;
  apiKey?: string;
  cacheRetention?: string | number;
  sessionId?: string;
  headers?: Record<string, string>;
  onPayload?: (payload: unknown) => void;
  maxRetryDelayMs?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Build base stream options for simple stream wrappers.
 * Mirrors pi-ai's simple-options behavior without requiring extension-side deep imports.
 */
export function buildBaseOptions(
  model: { maxTokens: number },
  options: AzureBaseOptionsInput | undefined,
  apiKey: string | undefined
): AzureBaseOptions {
  return {
    temperature: options?.temperature,
    maxTokens: options?.maxTokens || Math.min(model.maxTokens, 32000),
    signal: options?.signal,
    apiKey: apiKey || options?.apiKey,
    cacheRetention: options?.cacheRetention,
    sessionId: options?.sessionId,
    headers: options?.headers,
    onPayload: options?.onPayload,
    maxRetryDelayMs: options?.maxRetryDelayMs,
    metadata: options?.metadata,
  };
}

export function resolveCacheRetention(cacheRetention: string | number | undefined): string | number {
  if (cacheRetention) {
    return cacheRetention;
  }
  if (typeof process !== "undefined" && process.env.PI_CACHE_RETENTION === "long") {
    return "long";
  }
  return "short";
}

export function resolveCacheSessionId(
  sessionId: string | undefined,
  cacheRetention: string | number | undefined,
): string | undefined {
  return resolveCacheRetention(cacheRetention) === "none" ? undefined : sessionId;
}

export function applySessionCorrelationHeaders(
  headers: Record<string, string> | undefined,
  sessionId: string | undefined,
  options?: { includeAzureClientRequestId?: boolean }
): Record<string, string> {
  const next = { ...(headers || {}) };
  if (!sessionId) return next;
  next.session_id = sessionId;
  next["x-client-request-id"] = sessionId;
  if (options?.includeAzureClientRequestId) {
    next["x-ms-client-request-id"] = sessionId;
  } else {
    delete next["x-ms-client-request-id"];
  }
  return next;
}

/** Clamp unsupported reasoning levels for providers that do not accept `xhigh`. */
export function clampReasoning(effort: string | undefined): string | undefined {
  return effort === "xhigh" ? "high" : effort;
}
