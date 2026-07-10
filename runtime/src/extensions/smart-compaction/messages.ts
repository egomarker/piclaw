/**
 * Extracted smart-compaction helper module.
 *
 * Keep this module focused; the public extension facade remains
 * ../smart-compaction.ts.
 */

import { convertToLlm } from "@earendil-works/pi-coding-agent";
import type { Message } from "@earendil-works/pi-ai";
import { RECENT_CONTEXT_BUDGET_CHARS, TOOL_RESULT_MAX_CHARS, USER_PREVIEW_MAX_CHARS } from "./config.js";

export function extractText(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return (content as any[])
    .filter((b) => b?.type === "text" && typeof b?.text === "string")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

// ---------------------------------------------------------------------------
// Synthetic message detection
// ---------------------------------------------------------------------------

/**
 * Prefixes used by pi upstream's convertToLlm to wrap compaction/branch
 * summaries as user-role messages. We must skip these in every function
 * that looks for real user turns.
 */
const SYNTHETIC_USER_PREFIXES = [
  "The conversation history before this point was compacted into the following summary:",
  "The following is a summary of a branch that this conversation came back from:",
];

/** True when a user-role LLM message is actually a synthetic summary wrapper. */
export function isSyntheticUserMessage(msg: Message): boolean {
  if (msg.role !== "user") return false;
  const text = extractText(msg.content);
  return SYNTHETIC_USER_PREFIXES.some((prefix) => text.startsWith(prefix));
}

/** True when an LLM user-role message came from a real human user turn. */
export function isRealUserMessage(msg: Message, idx: number, humanUserIndexes?: Set<number>): boolean {
  if (msg.role !== "user") return false;
  if (isSyntheticUserMessage(msg)) return false;
  const text = extractText(msg.content).trim();
  if (!text || text.startsWith("/")) return false;
  return humanUserIndexes ? humanUserIndexes.has(idx) : true;
}

export type SourceMessage = {
  role: string;
  content?: unknown;
  excludeFromContext?: boolean;
};

export function isRealUserSourceMessage(msg: SourceMessage): boolean {
  if (msg.role !== "user") return false;
  const text = extractText(msg.content).trim();
  return !!text && !text.startsWith("/");
}

export function convertMessagesWithMetadata(sourceMessages: SourceMessage[]): {
  llmMessages: Message[];
  humanUserIndexes: Set<number>;
  sourceIndexesByLlmIndex: number[];
} {
  const llmMessages: Message[] = [];
  const humanUserIndexes = new Set<number>();
  const sourceIndexesByLlmIndex: number[] = [];

  for (let sourceIndex = 0; sourceIndex < sourceMessages.length; sourceIndex += 1) {
    const source = sourceMessages[sourceIndex];
    const converted = convertToLlm([source as any]);
    if (converted.length === 0) continue;
    const start = llmMessages.length;
    llmMessages.push(...converted);
    for (let i = 0; i < converted.length; i += 1) {
      sourceIndexesByLlmIndex[start + i] = sourceIndex;
    }
    if (isRealUserSourceMessage(source)) {
      for (let i = 0; i < converted.length; i++) {
        humanUserIndexes.add(start + i);
      }
    }
  }

  return { llmMessages, humanUserIndexes, sourceIndexesByLlmIndex };
}

export function buildPreview(text: string, maxChars = USER_PREVIEW_MAX_CHARS): string {
  return text.length > maxChars ? text.slice(0, maxChars) + "..." : text;
}

const TOOL_OUTCOME_MAX_CHARS = 180;
const TOOL_NAME_MAX_CHARS = 60;
const TOOL_BATCH_MAX_CHARS = 20_000;
const FAILURE_OUTCOME_REGEX = /\b(error|failed|failure|exception|permission denied|timed? out|not found|unable to|cannot|could not)\b/i;
const ZERO_FAILURE_OUTCOME_REGEX = /\b(?:0|no)\s+(?:tests?\s+)?(?:failed|failures?|errors?|exceptions?)\b/gi;
const NO_CHANGE_OUTCOME_REGEX = /\b(?:applied\s*:\s*0|no changes? (?:applied|made)|nothing (?:changed|written)|replacement (?:text )?was not found)\b/i;
const SIGNIFICANT_OUTCOME_REGEX = /\b(?:tests?|passed|warning|critical|blocked|disk\s+(?:is\s+)?full|deploy|restart|deleted)\b/i;
const LOW_INFORMATION_MUTATION_SUCCESS_REGEX = /\b(?:ok|done|success(?:ful(?:ly)?)?|applied|created|updated|edited|wrote|written)\b/i;
const LOW_INFORMATION_MUTATION_TOOLS = new Set(["edit", "write"]);
const MUTATION_STATUS_TOOLS = new Set(["edit", "write"]);
const COMMAND_STATUS_TOOLS = new Set(["bash", "exec", "shell"]);
const COMMAND_FAILURE_OUTCOME_REGEX = /(?:\b(?:exit|status|code)\s*[:=]?\s*[1-9]\d*\b|\bcommand failed\b|\b[1-9]\d*\s+(?:tests?\s+)?failed\b|\bfatal:\s)/i;
const LOW_INFORMATION_READ_RESULT_REGEX = /^(?:read\s+)?ok[.!]?$/i;

export interface ToolOutcomeFact {
  callId: string;
  toolName: string;
  assistantIndex: number;
  resultIndex: number | null;
  keyArgument: string;
  pathArgument: string;
  outcome: string;
  isError: boolean;
  missing: boolean;
  noChange: boolean;
  significant: boolean;
  lowInformationSuccess: boolean;
}

export interface ToolOutcomeAnalysis {
  facts: ToolOutcomeFact[];
  matchedResultIndexes: Set<number>;
  orphanResultIndexes: number[];
  hasAssistantNarrative: boolean;
  hasFailure: boolean;
  hasMissing: boolean;
  hasSignificantOutcome: boolean;
  safeForNoOp: boolean;
}

function compactToolOutcome(text: string): string {
  const compact = text.replace(/\s+/g, " ").trim();
  return buildPreview(compact, TOOL_OUTCOME_MAX_CHARS);
}

function hasFailureOutcome(text: string): boolean {
  // Successful test summaries often contain phrases such as "0 failed" or
  // "no errors". Remove only those zero-count clauses before looking for real
  // failure evidence so prompt serialization never labels a passing run ERROR.
  return FAILURE_OUTCOME_REGEX.test(text.replace(ZERO_FAILURE_OUTCOME_REGEX, ""));
}

function toolCallKeyArgument(block: any): string {
  const args = block?.arguments ?? {};
  const value = args.path ?? args.command ?? args.pattern ?? args.query ?? "";
  return typeof value === "string" ? buildPreview(value.replace(/\s+/g, " ").trim(), 100) : "";
}

/** Providers may append an opaque `|...` signature to one side of a tool ID pair. */
function baseToolCallId(value: string): string {
  return value.split("|", 1)[0]?.trim() || value;
}

function toolCallIdsMatch(callId: string, resultId: string): boolean {
  return callId === resultId || baseToolCallId(callId) === baseToolCallId(resultId);
}

/**
 * Reconcile assistant tool-call batches with all consecutive matching results.
 * Outcome text is normalized and capped so callers never copy unbounded tool output.
 */
export function analyzeToolOutcomes(messages: Message[]): ToolOutcomeAnalysis {
  const facts: ToolOutcomeFact[] = [];
  const matchedResultIndexes = new Set<number>();
  let hasAssistantNarrative = false;

  for (let assistantIndex = 0; assistantIndex < messages.length; assistantIndex++) {
    const assistant = messages[assistantIndex];
    if (assistant.role !== "assistant" || !Array.isArray(assistant.content)) continue;
    const blocks = assistant.content as any[];
    const calls = blocks.filter((block) => block?.type === "toolCall" && typeof block.id === "string");
    if (blocks.some((block) => block?.type === "text" && block.text?.trim())) hasAssistantNarrative = true;
    if (calls.length === 0) continue;

    const consecutiveResults: Array<{ message: Message; index: number; toolCallId: string }> = [];
    for (let resultIndex = assistantIndex + 1; resultIndex < messages.length; resultIndex++) {
      const result = messages[resultIndex] as any;
      if (result.role !== "toolResult") break;
      if (typeof result.toolCallId === "string") {
        consecutiveResults.push({ message: result, index: resultIndex, toolCallId: result.toolCallId });
      }
    }
    const claimedResultIndexes = new Set<number>();

    for (const call of calls) {
      // Prefer an exact ID, then accept the provider's base-ID/signed-ID form.
      // Claim each result once so two calls sharing a base cannot both consume it.
      const matched = consecutiveResults.find((result) =>
        !claimedResultIndexes.has(result.index) && result.toolCallId === call.id,
      ) ?? consecutiveResults.find((result) =>
        !claimedResultIndexes.has(result.index) && toolCallIdsMatch(call.id, result.toolCallId),
      );
      const rawOutcome = matched ? extractText(matched.message.content).trim() : "";
      const outcome = compactToolOutcome(rawOutcome);
      const toolName = typeof call.name === "string" ? call.name : "?";
      const isError = !!(matched?.message as any)?.isError
        || (MUTATION_STATUS_TOOLS.has(toolName) && hasFailureOutcome(rawOutcome))
        || (COMMAND_STATUS_TOOLS.has(toolName) && COMMAND_FAILURE_OUTCOME_REGEX.test(rawOutcome));
      const missing = !matched;
      const noChange = NO_CHANGE_OUTCOME_REGEX.test(rawOutcome);
      const lowInformationSuccess = !!matched
        && !isError
        && !noChange
        && !SIGNIFICANT_OUTCOME_REGEX.test(rawOutcome)
        && rawOutcome.length <= 500
        && (
          (LOW_INFORMATION_MUTATION_TOOLS.has(toolName) && LOW_INFORMATION_MUTATION_SUCCESS_REGEX.test(rawOutcome))
          || (toolName === "read" && LOW_INFORMATION_READ_RESULT_REGEX.test(rawOutcome.trim()))
        );
      const significant = missing
        || isError
        || noChange
        || !lowInformationSuccess
        || SIGNIFICANT_OUTCOME_REGEX.test(rawOutcome);

      if (matched) {
        matchedResultIndexes.add(matched.index);
        claimedResultIndexes.add(matched.index);
      }
      facts.push({
        callId: call.id,
        toolName,
        assistantIndex,
        resultIndex: matched?.index ?? null,
        keyArgument: toolCallKeyArgument(call),
        pathArgument: typeof call.arguments?.path === "string" ? call.arguments.path : "",
        outcome,
        isError,
        missing,
        noChange,
        significant,
        lowInformationSuccess,
      });
    }
  }

  const orphanResultIndexes: number[] = [];
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === "toolResult" && !matchedResultIndexes.has(i)) orphanResultIndexes.push(i);
  }
  const hasFailure = facts.some((fact) => fact.isError || fact.noChange) || orphanResultIndexes.length > 0;
  const hasMissing = facts.some((fact) => fact.missing);
  const hasSignificantOutcome = facts.some((fact) => fact.significant) || orphanResultIndexes.length > 0;

  return {
    facts,
    matchedResultIndexes,
    orphanResultIndexes,
    hasAssistantNarrative,
    hasFailure,
    hasMissing,
    hasSignificantOutcome,
    safeForNoOp: !hasAssistantNarrative && !hasFailure && !hasMissing && !hasSignificantOutcome,
  };
}

/** Serialize a complete assistant tool batch with each matched result exactly once. */
export function serializeToolBatchCompact(
  messages: Message[],
  assistantIndex: number,
  analysis = analyzeToolOutcomes(messages),
): string {
  const facts = analysis.facts.filter((fact) => fact.assistantIndex === assistantIndex);
  if (facts.length === 0) return "";
  const assistantMessage = messages[assistantIndex];
  const narrative = assistantMessage?.role === "assistant" && Array.isArray(assistantMessage.content)
    ? (assistantMessage.content as any[])
        .filter((block: any) => block.type === "text" && typeof block.text === "string" && block.text.trim())
        .map((block: any) => block.text.trim())
        .join(" ")
        .replace(/\s+/g, " ")
    : "";
  const rendered = facts.map((fact) => {
    const call = `${buildPreview(fact.toolName, TOOL_NAME_MAX_CHARS)}(${fact.keyArgument})`;
    if (fact.missing) return `${call} → MISSING RESULT`;
    const state = fact.isError || fact.noChange ? "ERROR: " : "";
    return fact.outcome ? `${call} → ${state}${fact.outcome}` : `${call} → (empty result)`;
  });
  if (narrative) rendered.unshift(`Assistant: ${buildPreview(narrative, 400)}`);
  const prefix = `[${assistantIndex}|Tool]: `;
  const joined = `${prefix}${rendered.join(" | ")}`;
  if (joined.length <= TOOL_BATCH_MAX_CHARS) return joined;

  // Pathological batches still need a deterministic ceiling. Put failed,
  // missing, and no-change outcomes first before slicing so tail failures can
  // never disappear merely because many successful calls preceded them.
  const prioritized = facts
    .map((fact, index) => ({ fact, rendered: rendered[index + (narrative ? 1 : 0)] }))
    .sort((a, b) => Number(b.fact.isError || b.fact.missing || b.fact.noChange) - Number(a.fact.isError || a.fact.missing || a.fact.noChange));
  const prioritizedParts = narrative
    ? [rendered[0], ...prioritized.map((item) => item.rendered)]
    : prioritized.map((item) => item.rendered);
  const included: string[] = [];
  let usedChars = prefix.length;
  for (const part of prioritizedParts) {
    const separatorChars = included.length > 0 ? 3 : 0;
    const remainingCount = prioritizedParts.length - included.length;
    const trailer = ` | (+${remainingCount} outcomes omitted)`;
    if (usedChars + separatorChars + part.length + trailer.length > TOOL_BATCH_MAX_CHARS) break;
    included.push(part);
    usedChars += separatorChars + part.length;
  }
  const omitted = prioritizedParts.length - included.length;
  const trailer = omitted > 0 ? ` | (+${omitted} outcomes omitted)` : "";
  return `${prefix}${included.join(" | ")}${trailer}`;
}

/** Serialize one LLM message to a compact readable line. */
export function serializeMessage(msg: Message, idx: number, humanUserIndexes?: Set<number>): string {
  if (msg.role === "user") {
    if (isSyntheticUserMessage(msg)) {
      // Don't dump the full compaction/branch summary into excerpts.
      // A brief marker is enough — the previous summary is already in the prompt.
      return `[${idx}|CompactionSummary]: (previous compaction summary — see Previous Summary section)`;
    }
    const text = extractText(msg.content);
    if (!text) return "";
    return humanUserIndexes?.has(idx)
      ? `[${idx}|User]: ${text}`
      : `[${idx}|Context]: ${text}`;
  }
  if (msg.role === "assistant") {
    const parts: string[] = [];
    for (const block of msg.content as any[]) {
      if (block.type === "text") parts.push(block.text);
      else if (block.type === "toolCall") {
        const args = block.arguments ?? {};
        const summary = args.path ?? args.command ?? JSON.stringify(args);
        const trunc =
          typeof summary === "string" && summary.length > 120
            ? summary.slice(0, 117) + "..."
            : summary;
        parts.push(`→ ${block.name}(${trunc})`);
      }
    }
    return parts.length ? `[${idx}|Assistant]: ${parts.join(" | ")}` : "";
  }
  if (msg.role === "toolResult") {
    const text = extractText(msg.content);
    if (!text) return "";
    const trunc =
      text.length > TOOL_RESULT_MAX_CHARS
        ? text.slice(0, TOOL_RESULT_MAX_CHARS) +
          `\n… (${text.length - TOOL_RESULT_MAX_CHARS} chars truncated)`
        : text;
    const status = (msg as any).isError ? "ERROR:" : "";
    return `[${idx}|ToolResult:${status}${(msg as any).toolName ?? "?"}]: ${trunc}`;
  }
  return "";
}

/**
 * Walk backwards from the end of the message array, capturing user intent
 * with full fidelity while aggressively compressing tool call/result pairs.
 *
 * Returns a set of message indices to include, plus pre-rendered compact
 * versions for tool pairs (overrides the normal serializeMessage output).
 */
export function selectRecentContextBackwards(
  messages: Message[],
  humanUserIndexes?: Set<number>,
): { included: Set<number>; compactOverrides: Map<number, string> } {
  const included = new Set<number>();
  const compactOverrides = new Map<number, string>();
  const toolAnalysis = analyzeToolOutcomes(messages);
  const orphanResultIndexes = new Set(toolAnalysis.orphanResultIndexes);
  let budget = RECENT_CONTEXT_BUDGET_CHARS;

  // Reserve the nearest real human turn before walking backwards. Otherwise a
  // large final tool batch can consume the full budget and erase the active
  // instruction that initiated it (especially in split-turn compaction).
  let reservedUserIndex = -1;
  for (let candidate = messages.length - 1; candidate >= 0; candidate -= 1) {
    if (!isRealUserMessage(messages[candidate], candidate, humanUserIndexes)) continue;
    const line = serializeMessage(messages[candidate], candidate, humanUserIndexes);
    if (line) {
      reservedUserIndex = candidate;
      included.add(candidate);
      budget -= line.length;
    }
    break;
  }

  let i = messages.length - 1;
  while (i >= 0 && budget > 0) {
    const msg = messages[i];

    if (i === reservedUserIndex) {
      i--;
      continue;
    }

    if (msg.role === "user") {
      if (isSyntheticUserMessage(msg)) {
        // Compaction/branch summaries are synthetic — skip, don't eat budget
        i--;
        continue;
      }
      // Keep user-role context, but only real human turns are labeled as User.
      const line = serializeMessage(msg, i, humanUserIndexes);
      included.add(i);
      budget -= line.length;
      i--;
      continue;
    }

    if (msg.role === "assistant") {
      const hasToolCalls = Array.isArray(msg.content) &&
        (msg.content as any[]).some((b: any) => b.type === "toolCall");
      const hasText = Array.isArray(msg.content) &&
        (msg.content as any[]).some((b: any) => b.type === "text" && b.text?.trim());

      if (hasToolCalls) {
        const compact = serializeToolBatchCompact(messages, i, toolAnalysis);
        if (compact) {
          included.add(i);
          compactOverrides.set(i, compact);
          for (const fact of toolAnalysis.facts) {
            if (fact.assistantIndex !== i || fact.resultIndex === null) continue;
            included.add(fact.resultIndex);
            compactOverrides.set(fact.resultIndex, "");
          }
          budget -= compact.length;
        }
        i--;
        continue;
      }

      if (hasText) {
        // Assistant explanatory text — keep full
        const line = serializeMessage(msg, i, humanUserIndexes);
        included.add(i);
        budget -= line.length;
        i--;
        continue;
      }
    }

    if (msg.role === "toolResult") {
      // Matched results are emitted with their assistant batch. An orphan has
      // no issuing assistant in this context, so preserve its bounded outcome
      // explicitly rather than silently dropping anomalous execution state.
      if (orphanResultIndexes.has(i)) {
        const line = serializeMessage(msg, i, humanUserIndexes);
        if (line) {
          included.add(i);
          budget -= line.length;
        }
      }
      i--;
      continue;
    }

    i--;
  }

  return { included, compactOverrides };
}

// ---------------------------------------------------------------------------
// Fragment selection
// ---------------------------------------------------------------------------
