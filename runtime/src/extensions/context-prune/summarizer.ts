import { completeSimple } from "@earendil-works/pi-ai";
import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { CapturedBatch, SummarizeResult } from "./types.js";
import { serializeBatchForSummarizer } from "./batch-capture.js";

const SYSTEM_PROMPT = `You are summarizing a batch of tool calls made by an AI coding assistant.
For each tool call provide:
- Tool name and a one-sentence description of what it did
- Key outcome: success/failure and the most important data returned
- Any findings the future conversation needs to remember

Keep each tool call to 1-3 bullet points. Be concise and preserve concrete paths, commands, errors, and IDs.`;

function extractTextContent(message: any): string {
  const content = Array.isArray(message?.content) ? message.content : [];
  return content
    .filter((c: any) => c?.type === "text")
    .map((c: any) => String(c.text || ""))
    .join("\n")
    .trim();
}

export async function summarizeBatch(
  batch: CapturedBatch,
  ctx: ExtensionContext,
  options: { signal?: AbortSignal } = {},
): Promise<SummarizeResult | null> {
  if (options.signal?.aborted) return null;

  const auth = await ctx.modelRegistry.getApiKeyAndHeaders(ctx.model as any);
  if (!auth.ok) {
    const authMessage = "error" in auth ? auth.error : "authentication failed";
    throw new Error(`context prune summarization auth failed: ${authMessage}`);
  }

  const serialized = serializeBatchForSummarizer(batch);
  const userMessage = `${SYSTEM_PROMPT}\n\n<tool-call-batch>\n${serialized}\n</tool-call-batch>`;
  const response = await completeSimple(
    ctx.model as any,
    {
      messages: [{ role: "user", content: [{ type: "text", text: userMessage }], timestamp: Date.now() }],
    },
    { apiKey: auth.apiKey, headers: auth.headers, signal: options.signal },
  );

  if (options.signal?.aborted || response.stopReason === "aborted") return null;
  if (response.stopReason === "error") throw new Error(response.errorMessage ?? "summarizer stopped with error");

  const summaryText = extractTextContent(response);
  return summaryText ? { summaryText, usage: response.usage } : null;
}
