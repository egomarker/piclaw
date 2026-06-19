import type { ExtensionAPI, ExtensionFactory } from "@earendil-works/pi-coding-agent";

import { normalizeLlmMessages } from "../agent-pool/llm-context-normalizer.js";

/**
 * Defensive last-mile cleanup for messages before they are converted to provider
 * payloads.  This keeps malformed persisted/custom messages from reaching
 * pi-ai provider adapters with missing/non-array content fields.
 */
export const llmContextNormalizer: ExtensionFactory = (pi: ExtensionAPI): void => {
  pi.on("context", (event) => {
    const normalized = normalizeLlmMessages(event.messages);
    return normalized.changed ? { messages: normalized.value } : undefined;
  });
};
