/**
 * agent-pool/turn-coordinator.ts – Tracks streaming turns and prompt lifecycle helpers.
 *
 * Extracts turn aggregation, session subscription wiring, and prompt timeout
 * handling out of AgentPool so prompt orchestration can stay focused on the
 * higher-level run flow.
 */

import type { AgentSession, AgentSessionEvent } from "@earendil-works/pi-coding-agent";
import type { Usage } from "@earendil-works/pi-ai";

import type { AttachmentInfo } from "./attachments.js";

interface AgentContentBlock {
  type?: unknown;
  id?: unknown;
  text?: unknown;
  textSignature?: unknown;
}

export type AssistantTextPhase = "commentary" | "final_answer" | null;

export interface AssistantTextSignature {
  phase: AssistantTextPhase;
  id: string | null;
}

/** Parse provider text metadata without trusting malformed signature JSON. */
export function parseAssistantTextSignature(signature: unknown): AssistantTextSignature {
  if (typeof signature !== "string" || !signature.trim()) return { phase: null, id: null };
  try {
    const parsed = JSON.parse(signature) as { phase?: unknown; id?: unknown };
    return {
      phase: parsed?.phase === "commentary" || parsed?.phase === "final_answer"
        ? parsed.phase
        : null,
      id: typeof parsed?.id === "string" && parsed.id.trim() ? parsed.id.trim() : null,
    };
  } catch {
    return { phase: null, id: null };
  }
}

/** Resolve signed text metadata from a streaming assistant partial block. */
export function resolveAssistantTextSignatureFromPartial(partial: unknown, contentIndex?: number): AssistantTextSignature {
  if (!partial || typeof partial !== "object") return { phase: null, id: null };
  const content = (partial as { content?: unknown }).content;
  if (!Array.isArray(content) || typeof contentIndex !== "number") return { phase: null, id: null };
  const block = content[contentIndex] as AgentContentBlock | undefined;
  if (!block || block.type !== "text") return { phase: null, id: null };
  return parseAssistantTextSignature(block.textSignature);
}

export interface AgentTurnTrackerOptions {
  /** Surface only completed commentary that is attached to a confirmed tool-use message. */
  emitToolUseCommentary?: boolean;
}

/** A single turn's output within a multi-turn agent run. */
export interface AgentTurnOutput {
  text: string;
  attachments: AttachmentInfo[];
  usage?: Usage;
  /** The completed assistant message committed immediately before tool dispatch. */
  followedByToolUse?: boolean;
  /** Display-only signed commentary that is excluded from completion accounting. */
  kind?: "commentary";
  /** Stable provider text-item identity used for idempotent persistence. */
  sourceKey?: string;
}

/** A completed assistant text stream intentionally kept out of durable output. */
export interface AgentTurnDiscard {
  reason: "tool_use_commentary" | "commentary_only";
}

/** Error state captured from an assistant message with stopReason "error". */
export interface AgentTurnError {
  stopReason: "error";
  errorMessage: string;
}

/** Aggregated assistant-turn tracking state for a single prompt run. */
export interface AgentTerminalAssistantState {
  stopReason: string | null;
  rawStopReason: string | null;
  errorMessage: string | null;
  hadTextContent: boolean;
  hadToolCallContent: boolean;
  hadThinkingContent: boolean;
}

export interface AgentTurnTracker {
  handleMessageUpdate: (event: AgentSessionEvent) => void;
  /** Resolve any unterminated streamed text before the prompt attempt is finalized. */
  finalizeAttempt: () => void;
  getFinalText: () => string;
  getTurnCount: () => number;
  getError: () => AgentTurnError | null;
  getLastAssistantState: () => AgentTerminalAssistantState | null;
  getFinalUsage: () => Usage | undefined;
}

/**
 * Result of arming a prompt timeout.
 * `timedOutRef.value` flips to true once the timeout abort fires.
 */
export interface PromptTimeoutState {
  timeoutId: ReturnType<typeof setTimeout> | null;
  timedOutRef: { value: boolean };
  completedRef: { value: boolean };
}

/** Dependencies injected into AgentTurnCoordinator. */
export interface AgentTurnCoordinatorOptions {
  takeAttachments: (chatJid: string) => AttachmentInfo[];
  touchSession: (chatJid: string) => void;
  /** @deprecated Usage is now recorded once per bound session; retained for test/extension option compatibility. */
  recordMessageUsage?: (chatJid: string, message: unknown) => void;
  onInfo?: (message: string, details: Record<string, unknown>) => void;
  onWarn?: (message: string, details: Record<string, unknown>) => void;
  onError?: (message: string, details: Record<string, unknown>) => void;
}

/**
 * Coordinates per-run assistant turn tracking and event lifecycle helpers.
 */
export class AgentTurnCoordinator {
  constructor(private readonly options: AgentTurnCoordinatorOptions) {}

  createTracker(
    chatJid: string,
    onTurnComplete?: (turn: AgentTurnOutput) => void,
    onTurnDiscard?: (discard: AgentTurnDiscard) => void,
    trackerOptions: AgentTurnTrackerOptions = {},
  ): AgentTurnTracker {
    let currentTurnText = "";
    let currentTurnPhase: AssistantTextPhase = null;
    let currentTurnSourceKey: string | undefined;
    let turnCount = 0;
    let messageHasDelta = false;
    let messageComplete = false;
    let currentTurnUsage: Usage | undefined;
    let lastError: AgentTurnError | null = null;
    let lastAssistantState: AgentTerminalAssistantState | null = null;

    const resolveTextSignatureFromBlock = (block: AgentContentBlock | undefined): AssistantTextSignature => {
      if (!block || block.type !== "text") return { phase: null, id: null };
      return parseAssistantTextSignature(block.textSignature);
    };

    const resolveTextPhaseFromBlock = (block: AgentContentBlock | undefined): AssistantTextPhase =>
      resolveTextSignatureFromBlock(block).phase;

    const extractAssistantTextFromContent = (content: unknown): {
      text: string;
      phase: AssistantTextPhase;
      hasText: boolean;
      hasCommentary: boolean;
      commentaryOnly: boolean;
      commentaryText: string;
      commentarySourceKey?: string;
    } => {
      if (!Array.isArray(content)) {
        const text = typeof content === "string" ? content : "";
        return {
          text,
          phase: null,
          hasText: Boolean(text.trim()),
          hasCommentary: false,
          commentaryOnly: false,
          commentaryText: "",
        };
      }

      const textBlocks = content.filter((block) => (block as AgentContentBlock | undefined)?.type === "text") as AgentContentBlock[];
      const finalAnswerText = textBlocks
        .filter((block) => resolveTextPhaseFromBlock(block) === "final_answer")
        .map((block) => (typeof block.text === "string" ? block.text : ""))
        .join("");
      const unphasedText = textBlocks
        .filter((block) => resolveTextPhaseFromBlock(block) === null)
        .map((block) => (typeof block.text === "string" ? block.text : ""))
        .join("");
      const commentaryBlocks = textBlocks
        .filter((block) => resolveTextPhaseFromBlock(block) === "commentary");
      const commentaryText = commentaryBlocks
        .map((block) => (typeof block.text === "string" ? block.text : ""))
        .join("");
      const commentarySourceIds = Array.from(new Set(commentaryBlocks
        .map((block) => resolveTextSignatureFromBlock(block).id)
        .filter((id): id is string => Boolean(id))));
      const allText = textBlocks
        .map((block) => (typeof block.text === "string" ? block.text : ""))
        .join("");
      const hasFinalAnswer = Boolean(finalAnswerText.trim());
      const text = hasFinalAnswer ? finalAnswerText : unphasedText;
      const hasCommentary = Boolean(commentaryText.trim());

      return {
        text,
        phase: hasFinalAnswer ? "final_answer" : null,
        hasText: Boolean(allText.trim()),
        hasCommentary,
        commentaryOnly: hasCommentary && !text.trim(),
        commentaryText,
        ...(commentarySourceIds.length > 0 ? { commentarySourceKey: commentarySourceIds.join("|") } : {}),
      };
    };

    const resetCurrentTurn = () => {
      currentTurnText = "";
      currentTurnPhase = null;
      currentTurnSourceKey = undefined;
      currentTurnUsage = undefined;
      messageHasDelta = false;
      messageComplete = false;
    };

    const flushTurn = (options: { followedByToolUse?: boolean } = {}) => {
      const text = currentTurnText.trim();
      if (!text && !onTurnComplete) {
        resetCurrentTurn();
        return;
      }
      if (text || turnCount > 0) {
        onTurnComplete?.({
          text,
          attachments: this.options.takeAttachments(chatJid),
          ...(currentTurnUsage ? { usage: currentTurnUsage } : {}),
          ...(options.followedByToolUse ? { followedByToolUse: true } : {}),
        });
        turnCount += 1;
      }
      resetCurrentTurn();
    };

    const handleMessageUpdate = (event: AgentSessionEvent) => {
      if (event.type === "message_update") {
        const messageEvent = event.assistantMessageEvent as {
          type?: string;
          delta?: string;
          contentIndex?: number;
          partial?: unknown;
        };
        if (messageEvent.type === "text_start") {
          const textLengthBeforeStart = currentTurnText.length;
          const hadCompletedMessage = messageComplete;
          const hadIncompleteAccumulation = !messageComplete && (messageHasDelta || currentTurnText.length > 0 || currentTurnPhase !== null);

          this.options.onInfo?.("Assistant text stream started", {
            operation: "turn_coordinator.text_start",
            chatJid,
            contentIndex: messageEvent.contentIndex ?? null,
            currentTurnTextLength: textLengthBeforeStart,
            messageHasDelta,
            messageComplete,
            currentTurnPhase,
          });

          if (messageComplete) {
            if (onTurnComplete) {
              flushTurn();
            } else {
              resetCurrentTurn();
            }
          } else if (messageHasDelta || currentTurnText || currentTurnPhase !== null) {
            // A new text stream started before the previous assistant message
            // emitted message_end. Discard the incomplete accumulation rather
            // than flushing it as a completed turn.
            resetCurrentTurn();
          }
          const signature = resolveAssistantTextSignatureFromPartial(messageEvent.partial, messageEvent.contentIndex);
          currentTurnPhase = signature.phase;
          currentTurnSourceKey = signature.id ?? undefined;

          this.options.onInfo?.("Assistant text stream boundary resolved", {
            operation: "turn_coordinator.text_start_boundary",
            chatJid,
            contentIndex: messageEvent.contentIndex ?? null,
            hadCompletedMessage,
            hadIncompleteAccumulation,
            nextTurnPhase: currentTurnPhase,
          });
        }
        if (messageEvent.type === "text_delta") {
          messageHasDelta = true;
          const signature = resolveAssistantTextSignatureFromPartial(messageEvent.partial, messageEvent.contentIndex);
          currentTurnPhase ??= signature.phase;
          currentTurnSourceKey ??= signature.id ?? undefined;
          currentTurnText += messageEvent.delta || "";
        }
        if (messageEvent.type === "text_end") {
          const signature = resolveAssistantTextSignatureFromPartial(messageEvent.partial, messageEvent.contentIndex);
          currentTurnPhase ??= signature.phase;
          currentTurnSourceKey ??= signature.id ?? undefined;
        }
        return;
      }

      if (event.type === "message_end") {
        const message = event.message as {
          role?: string;
          content?: unknown;
          stopReason?: string;
          rawStopReason?: string;
          errorMessage?: string;
          usage?: Usage;
        } | undefined;
        if (message?.role === "assistant") {
          // The latest completed assistant provider response is authoritative.
          // Keep historical errors in event logs, but do not let an earlier
          // provider error override a later successful retry in the same prompt.
          lastError = message.stopReason === "error" && message.errorMessage
            ? { stopReason: "error", errorMessage: message.errorMessage }
            : null;
          const contentBlocks = Array.isArray(message.content) ? message.content as AgentContentBlock[] : [];
          const extracted = extractAssistantTextFromContent(message.content);
          // Completion/recovery state counts only authoritative substantive
          // text. Signed commentary remains visible metadata, not reply text.
          const hadTextContent = Boolean(extracted.text.trim());
          const toolCallSourceIds = Array.from(new Set(contentBlocks
            .filter((block) => block?.type === "toolCall")
            .map((block) => typeof block.id === "string" ? block.id.trim() : "")
            .filter(Boolean)));
          const hadToolCallContent = toolCallSourceIds.length > 0
            || contentBlocks.some((block) => block?.type === "toolCall");
          const hadThinkingContent = contentBlocks.some((block: any) => block?.type === "thinking" && typeof block?.thinking === "string" && block.thinking.trim().length > 0);
          lastAssistantState = {
            stopReason: typeof message.stopReason === "string" && message.stopReason.trim() ? message.stopReason : null,
            rawStopReason: typeof message.rawStopReason === "string" && message.rawStopReason.trim() ? message.rawStopReason.trim() : null,
            errorMessage: typeof message.errorMessage === "string" && message.errorMessage.trim() ? message.errorMessage.trim() : null,
            hadTextContent,
            hadToolCallContent,
            hadThinkingContent,
          };
          currentTurnUsage = message.usage;
          // Prefer authoritative message_end text because extensions may
          // replace the streamed draft. Some providers omit visible text from
          // the finalized tool-call message, though, so retain the completed
          // stream as a fallback instead of silently losing what the UI showed.
          const streamedText = currentTurnText.trim();
          const authoritativeTextSeen = extracted.hasText;
          const streamedCommentaryOnly = !authoritativeTextSeen
            && Boolean(streamedText)
            && currentTurnPhase === "commentary";
          const commentaryOnly = extracted.commentaryOnly || streamedCommentaryOnly;
          const visibleCommentaryText = extracted.commentaryText.trim() || streamedText;
          const commentarySourceKey = extracted.commentarySourceKey
            ?? currentTurnSourceKey
            ?? (toolCallSourceIds.length > 0 ? `tool:${toolCallSourceIds.join("|")}` : undefined);
          currentTurnText = authoritativeTextSeen ? extracted.text.trim() : streamedText;
          currentTurnPhase = authoritativeTextSeen ? extracted.phase : currentTurnPhase;

          this.options.onInfo?.("Assistant message completed", {
            operation: "turn_coordinator.message_end",
            chatJid,
            stopReason: message.stopReason ?? null,
            rawStopReason: message.rawStopReason ?? null,
            extractedTextLength: extracted.text.length,
            phase: extracted.phase,
            hasCommentary: extracted.hasCommentary,
            commentaryOnly,
            messageHasDelta,
            currentTurnTextLength: currentTurnText.length,
            hadTextContent,
            hadToolCallContent,
            hadThinkingContent,
          });

          messageHasDelta = false;
          messageComplete = true;
          // Signed commentary remains non-authoritative. The optional display
          // path is limited to a completed tool-use message, emits no
          // attachments, and deliberately does not advance the substantive
          // turn counter. This also preserves commentary from a mixed-phase
          // tool-use message while final-answer/unphased text continues through
          // the ordinary turn path below.
          const canDisplayToolUseCommentary = Boolean(
            trackerOptions.emitToolUseCommentary
              && message.stopReason === "toolUse"
              && hadToolCallContent
              && (extracted.hasCommentary || streamedCommentaryOnly)
              && visibleCommentaryText
              && onTurnComplete
          );
          if (canDisplayToolUseCommentary) {
            onTurnComplete?.({
              text: visibleCommentaryText,
              attachments: [],
              ...(commentaryOnly && currentTurnUsage ? { usage: currentTurnUsage } : {}),
              followedByToolUse: true,
              kind: "commentary",
              ...(commentarySourceKey ? { sourceKey: commentarySourceKey } : {}),
            });
          }
          if (commentaryOnly) {
            if (!canDisplayToolUseCommentary) {
              onTurnDiscard?.({
                reason: message.stopReason === "toolUse" && hadToolCallContent
                  ? "tool_use_commentary"
                  : "commentary_only",
              });
            }
            resetCurrentTurn();
            return;
          }
          if (message.stopReason === "toolUse" && hadToolCallContent) {
            if (onTurnComplete) {
              flushTurn({ followedByToolUse: true });
            } else {
              resetCurrentTurn();
            }
          }
          return;
        }
        messageHasDelta = false;
        messageComplete = true;
      }
    };

    const finalizeAttempt = () => {
      // Providers can throw or abort without emitting message_end. Never let a
      // dangling signed commentary stream become final text or a web draft
      // fallback when the attempt is finalized.
      if (currentTurnText.trim() && currentTurnPhase === "commentary") {
        onTurnDiscard?.({ reason: "commentary_only" });
        resetCurrentTurn();
      }
    };

    return {
      handleMessageUpdate,
      finalizeAttempt,
      getFinalText: () => currentTurnPhase === "commentary" ? "" : currentTurnText.trim(),
      getTurnCount: () => turnCount,
      getError: () => lastError,
      getLastAssistantState: () => lastAssistantState,
      getFinalUsage: () => currentTurnUsage,
    };
  }

  subscribe(
    session: AgentSession,
    chatJid: string,
    tracker: AgentTurnTracker,
    onEvent?: (event: AgentSessionEvent) => void,
  ): () => void {
    return session.subscribe((event: AgentSessionEvent) => {
      this.options.touchSession(chatJid);

      if (onEvent) {
        try {
          onEvent(event);
        } catch (err) {
          this.options.onWarn?.("Event handler error", {
            operation: "subscribe_to_session.on_event",
            chatJid,
            err,
          });
        }
      }

      tracker.handleMessageUpdate(event);

    });
  }

  startPromptTimeout(
    session: AgentSession,
    chatJid: string,
    timeoutMs: number,
  ): PromptTimeoutState {
    const timedOutRef = { value: false };
    const completedRef = { value: false };
    if (!timeoutMs || timeoutMs <= 0) {
      return { timeoutId: null, timedOutRef, completedRef };
    }

    const timeoutId = setTimeout(() => {
      void (async () => {
        if (completedRef.value) return;
        timedOutRef.value = true;
        this.options.onError?.("Prompt timed out; aborting session", {
          operation: "start_prompt_timeout",
          chatJid,
          timeoutMs,
        });
        await session.abort();
      })().catch((err) => {
        if (completedRef.value) return;
        this.options.onWarn?.("Failed to abort timed-out prompt", {
          operation: "start_prompt_timeout.abort",
          chatJid,
          timeoutMs,
          err,
        });
      });
    }, timeoutMs);

    return { timeoutId, timedOutRef, completedRef };
  }
}
