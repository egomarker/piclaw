/**
 * agent-pool/usage.ts – Extract and persist LLM token usage from agent events.
 *
 * Listens for `message_end` events with `role: "assistant"` and usage metadata,
 * then writes a TokenUsageRecord to the database (db/token-usage.ts).
 *
 * Consumers:
 *   - agent-pool.ts calls recordMessageUsage() inside its event handler for
 *     each assistant message completion during an agent run.
 */

import { storeTokenUsage } from "../db.js";

interface AssistantUsageMessage {
  role?: unknown;
  usage?: unknown;
  timestamp?: unknown;
  model?: unknown;
  responseModel?: unknown;
  provider?: unknown;
  api?: unknown;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function asNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  return typeof value === "number" ? value : 0;
}

function asStringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function firstNumber(...values: unknown[]): number {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return 0;
}

function extractReasoningTokens(usage: Record<string, unknown>): number {
  const outputDetails = asRecord(usage.outputTokensDetails)
    ?? asRecord(usage.output_tokens_details)
    ?? asRecord(usage.completion_tokens_details);
  return firstNumber(
    usage.reasoningTokens,
    usage.reasoning_tokens,
    usage.reasoning,
    outputDetails?.reasoning_tokens,
    outputDetails?.reasoningTokens,
  );
}

/**
 * Extract token usage from an assistant message and store it in the database.
 * Called on each `message_end` event during agent execution.
 */
export function recordMessageUsage(chatJid: string, message: unknown): void {
  const msg = asRecord(message) as AssistantUsageMessage | null;
  if (!msg || msg.role !== "assistant") return;

  const usage = asRecord(msg.usage);
  if (!usage) return;

  const input = asNumber(usage, "input");
  const output = asNumber(usage, "output");
  const cacheRead = asNumber(usage, "cacheRead");
  const cacheWrite = asNumber(usage, "cacheWrite");
  const reasoningTokens = extractReasoningTokens(usage);
  const totalTokens =
    asNumber(usage, "totalTokens") ||
    asNumber(usage, "total") ||
    input + output + cacheRead + cacheWrite;

  const cost = asRecord(usage.cost) ?? {};
  const costInput = asNumber(cost, "input");
  const costOutput = asNumber(cost, "output");
  const costCacheRead = asNumber(cost, "cacheRead");
  const costCacheWrite = asNumber(cost, "cacheWrite");
  const costTotal =
    asNumber(cost, "total") ||
    costInput + costOutput + costCacheRead + costCacheWrite;

  const runAt = typeof msg.timestamp === "string"
    ? (() => {
        const ts = new Date(msg.timestamp);
        return Number.isNaN(ts.getTime()) ? new Date().toISOString() : ts.toISOString();
      })()
    : new Date().toISOString();

  storeTokenUsage({
    chat_jid: chatJid,
    run_at: runAt,
    input_tokens: input,
    output_tokens: output,
    reasoning_tokens: reasoningTokens,
    cache_read_tokens: cacheRead,
    cache_write_tokens: cacheWrite,
    total_tokens: totalTokens,
    cost_input: costInput,
    cost_output: costOutput,
    cost_cache_read: costCacheRead,
    cost_cache_write: costCacheWrite,
    cost_total: costTotal,
    model: asStringOrNull(msg.model),
    response_model: asStringOrNull(msg.responseModel),
    provider: asStringOrNull(msg.provider),
    api: asStringOrNull(msg.api),
    turns: 1,
  });
}
