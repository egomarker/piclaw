import type { ToolCallIndexer } from "./indexer.js";

/** Removes summarized ToolResultMessages while keeping assistant tool-call blocks and all other context. */
export function pruneMessages(messages: any[], indexer: ToolCallIndexer): any[] {
  return messages.filter((msg) => !(msg?.role === "toolResult" && msg.toolCallId && indexer.isSummarized(msg.toolCallId)));
}
