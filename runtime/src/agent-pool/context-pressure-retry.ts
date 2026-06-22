/**
 * context-pressure-retry.ts – Bounded context-overflow recovery for direct session.prompt() callers.
 *
 * Most normal chat turns go through runAgentPrompt(), which has full automatic
 * recovery. A few control/slash/follow-up paths intentionally call
 * session.prompt() directly. Keep those paths from surfacing provider context
 * window 400s without first trying one compaction.
 */

import type { AgentSession, AgentSessionEvent } from "@earendil-works/pi-coding-agent";

import { getChatJid } from "../core/chat-context.js";
import { isContextPressureFailure } from "./automatic-recovery.js";
import { runWithPiclawCompactionTrigger } from "./compaction-trigger-context.js";

export type DirectPromptOptions = { streamingBehavior?: "steer" | "followUp" };

function getAssistantErrorFromEvent(event: AgentSessionEvent): string | null {
  if (event.type !== "message_end") return null;
  const message = (event as { message?: { role?: unknown; stopReason?: unknown; errorMessage?: unknown } }).message;
  if (message?.role !== "assistant" || message.stopReason !== "error") return null;
  const errorMessage = typeof message.errorMessage === "string" ? message.errorMessage.trim() : "";
  return errorMessage || null;
}

/**
 * Run a direct prompt and, if the provider rejects it for context pressure,
 * compact the session once and retry the same direct prompt.
 */
export async function promptWithContextPressureRetry(
  session: AgentSession,
  text: string,
  options?: DirectPromptOptions,
): Promise<{ compacted: boolean; errorMessage?: string }> {
  let compacted = false;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let providerError: string | null = null;
    const unsubscribe = typeof (session as { subscribe?: unknown }).subscribe === "function"
      ? session.subscribe((event) => {
        providerError = getAssistantErrorFromEvent(event) ?? providerError;
      })
      : null;

    try {
      await session.prompt(text, options);
    } catch (error) {
      providerError = error instanceof Error ? error.message : String(error);
    } finally {
      unsubscribe?.();
    }

    if (providerError && isContextPressureFailure(providerError) && !compacted) {
      const chatJid = getChatJid("direct_prompt_context_pressure");
      await runWithPiclawCompactionTrigger(
        { chatJid, trigger: "recovery", willRetry: true, source: "direct_prompt_context_pressure", attempt: attempt + 1 },
        async () => await session.compact(),
      );
      compacted = true;
      continue;
    }

    if (providerError) throw new Error(providerError);
    return { compacted };
  }

  return { compacted };
}
