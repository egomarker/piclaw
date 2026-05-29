/**
 * Streaming-aware LLM completion for smart-compaction.
 *
 * Replaces direct `completeSimple` calls with a streaming approach that:
 * 1. Accepts an optional `StreamFn` for proxy/custom provider routing
 * 2. Reports streaming progress (generated tokens) via callback
 * 3. Falls back to standard `streamSimple` when no custom fn is provided
 *
 * This mirrors the upstream pi-coding-agent 0.75.0 fix (#4484) that routes
 * compaction summary calls through custom agent stream functions.
 */

import { streamSimple } from "@earendil-works/pi-ai";
import type { AssistantMessage, SimpleStreamOptions } from "@earendil-works/pi-ai";

/**
 * A stream function compatible with the upstream StreamFn type.
 * Accepts the same arguments as `streamSimple` and returns an async iterable
 * that yields AssistantMessageEvent objects with a `.result()` promise.
 */
export type CompactionStream = {
  result(): Promise<AssistantMessage>;
  [Symbol.asyncIterator](): AsyncIterator<any>;
};

export type CompactionStreamFn = (
  model: any,
  context: { systemPrompt?: string; messages: any[] },
  options?: SimpleStreamOptions,
) => CompactionStream | Promise<CompactionStream>;

export interface StreamCompleteOptions {
  model: any;
  systemPrompt: string;
  userPrompt: string;
  maxTokens: number;
  signal: AbortSignal;
  apiKey?: string;
  headers?: Record<string, string>;
  reasoning?: "minimal" | "low" | "medium" | "high";
  /** Custom stream function for proxy-routed providers. Falls back to streamSimple. */
  streamFn?: CompactionStreamFn;
  /** Called periodically with the number of text characters generated so far. */
  onProgress?: (generatedChars: number) => void;
  /** Interval in ms between progress reports (default: 500ms). */
  progressIntervalMs?: number;
}

/**
 * Complete an LLM request using streaming, collecting the response and
 * optionally reporting progress. Uses the provided `streamFn` for custom
 * provider routing, falling back to the standard `streamSimple`.
 */
export async function streamComplete(opts: StreamCompleteOptions): Promise<AssistantMessage> {
  const {
    model, systemPrompt, userPrompt, maxTokens, signal,
    apiKey, headers, reasoning, streamFn, onProgress,
    progressIntervalMs = 500,
  } = opts;

  const context = {
    systemPrompt,
    messages: [{ role: "user" as const, content: [{ type: "text" as const, text: userPrompt }], timestamp: Date.now() }],
  };

  const streamOptions: SimpleStreamOptions = reasoning
    ? { maxTokens, signal, apiKey, headers, reasoning }
    : { maxTokens, signal, apiKey, headers };

  // Use custom stream function if provided, otherwise standard streamSimple
  const stream = await (streamFn
    ? streamFn(model, context, streamOptions)
    : streamSimple(model, context, streamOptions));

  // If no progress callback, just collect the result directly
  if (!onProgress) {
    return stream.result();
  }

  // Stream with progress reporting
  let generatedChars = 0;
  let lastReportTime = 0;

  for await (const event of stream) {
    if (signal.aborted) break;
    if (event.type === "text_delta") {
      generatedChars += event.delta.length;
      const now = Date.now();
      if (now - lastReportTime >= progressIntervalMs) {
        onProgress(generatedChars);
        lastReportTime = now;
      }
    }
  }

  // Final progress report
  if (generatedChars > 0) {
    onProgress(generatedChars);
  }

  return stream.result();
}
