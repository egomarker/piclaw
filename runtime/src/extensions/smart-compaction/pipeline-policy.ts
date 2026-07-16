/** Categorical pipelined retention policy, representations, and coverage ledger. */
import { createHash } from "node:crypto";
import {
  extractText,
  restrictToolAnalysisToAdjacentResultStream,
  serializeMessage,
  type ToolOutcomeAnalysis,
  type ToolOutcomeFact,
} from "./messages.js";
import type { PipelineEventGroup } from "./pipeline-events.js";
import type { CompactionSourceUnit, PreparedCompactionSource } from "./source.js";

export type PipelineDisposition = "required" | "canonical" | "summarize" | "drop_safe";

export type PipelineRepresentationMode =
  | "lossless"
  | "compact_facts"
  | "bounded_evidence"
  | "reference"
  | "none";

export type PipelineReasonCode =
  | "human_goal"
  | "human_correction"
  | "human_constraint"
  | "human_question"
  | "unresolved_tool_state"
  | "observed_tool_batch"
  | "observed_later_tool_state"
  | "delayed_tool_result"
  | "assistant_decision"
  | "assistant_narrative"
  | "synthetic_continuity"
  | "orphan_tool_result"
  | "context"
  | "empty_content"
  | "context_prune_summary_reference";

export type PipelineToolOutcomeStatus = "success" | "error" | "no_change" | "missing";
export type PipelineToolObservation = "adjacent" | "later" | "none";

export interface PipelineToolFact {
  callOrdinal: number;
  toolName: string;
  keyArgument: string;
  exactKeyArgument: string;
  pathArgument: string;
  argumentDigest: string;
  assistantSourceIndex: number;
  resultSourceIndex: number | null;
  resultEntryId: string | null;
  observation: PipelineToolObservation;
  status: PipelineToolOutcomeStatus;
  significant: boolean;
  lowInformationSuccess: boolean;
  outcome: string;
}

export interface PipelineRecordRelationships {
  duplicateOfGroupId?: string;
  laterResultGroupIds: string[];
  originToolGroupIds: string[];
}

export interface PipelineRecordMetrics {
  sourceChars: number;
  representedChars: number;
  reductionPercent: number;
  sourceTokenEstimate: number;
  representedTokenEstimate: number;
  tokenReductionPercent: number;
  sourceDigest: string;
  semanticDigest: string | null;
  representationDigest: string | null;
}

export interface PipelineAuditRecord {
  groupId: string;
  sourceIndexes: number[];
  sourceEntryIds: string[];
  disposition: PipelineDisposition;
  reason: PipelineReasonCode;
  representationMode: PipelineRepresentationMode;
  representationIds: string[];
  toolFacts: PipelineToolFact[];
  relationships: PipelineRecordRelationships;
  metrics: PipelineRecordMetrics;
}

export interface PipelineCompressionBucket {
  recordCount: number;
  sourceChars: number;
  representedChars: number;
  reductionPercent: number;
  sourceTokenEstimate: number;
  representedTokenEstimate: number;
  tokenReductionPercent: number;
}

export interface PipelineCompressionMetrics extends PipelineCompressionBucket {
  duplicateReferenceCount: number;
  byDisposition: Record<PipelineDisposition, PipelineCompressionBucket>;
}

export interface PipelinedPlan {
  records: PipelineAuditRecord[];
  units: CompactionSourceUnit[];
  dispositionCounts: Record<PipelineDisposition, number>;
  compression: PipelineCompressionMetrics;
  coverageComplete: true;
}

interface PipelineClassification {
  disposition: PipelineDisposition;
  reason: PipelineReasonCode;
}

interface PipelineRecordDraft {
  group: PipelineEventGroup;
  classification: PipelineClassification;
  body: string;
  semanticDigest: string | null;
  toolFacts: PipelineToolFact[];
  relationships: PipelineRecordRelationships;
}

const ALLOWLISTED_DROP_REASONS = new Set<PipelineReasonCode>(["empty_content"]);
const BOUNDED_EVIDENCE_MAX_CHARS = 900;
const CANONICAL_CONTEXT_MAX_CHARS = 700;
const TOOL_NARRATIVE_MAX_CHARS = 320;
const TOOL_OUTCOME_MAX_CHARS = 280;
const EVIDENCE_SIGNAL_PATTERNS = [
  /\b(?:blocked|error|fail(?:ed|ure)?|warning)\b/i,
  /\b(?:constraint|must|never|restart)\b/i,
  /\b(?:decision|decided|chose|chosen|selected)\b/i,
  /(?:(?:\.\.?\/|~\/|\/)[A-Za-z0-9._@%+~/-]+|(?:[A-Za-z0-9._-]+\/)+[A-Za-z0-9._-]+\.[A-Za-z0-9._-]+|[A-Za-z]:\\[^\s"'<>|]+)/i,
  /\b(?:regression|test)\b/i,
];

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value ?? "");
  } catch {
    return String(value ?? "");
  }
}

function sourcePayload(group: PipelineEventGroup): string {
  return group.sourceEvents
    .map((event) => `${event.sourceIndex}:${event.sourceEntryId ?? ""}:${safeJson(event.rawMessage)}`)
    .join("\n");
}

function sourceCharCount(group: PipelineEventGroup): number {
  return group.sourceEvents.reduce((total, event) => total + safeJson(event.rawMessage).length, 0);
}

function reductionPercent(sourceSize: number, representedSize: number): number {
  if (sourceSize <= 0) return representedSize > 0 ? -100 : 0;
  return Math.round((1 - representedSize / sourceSize) * 1_000) / 10;
}

function tokenEstimateForChars(chars: number): number {
  return chars <= 0 ? 0 : Math.max(1, Math.ceil(chars / 4));
}

function semanticSourcePayload(group: PipelineEventGroup): string {
  return group.sourceEvents.map((event) => safeJson(event.rawMessage)).join("\n");
}

function groupHasRawContent(group: PipelineEventGroup): boolean {
  return group.sourceEvents.some((event) => {
    if (extractText(event.rawMessage.content).trim()) return true;
    if (Array.isArray(event.rawMessage.content) && event.rawMessage.content.length > 0) return true;
    if (event.rawMessage.content != null && String(event.rawMessage.content).trim().length > 0) return true;
    const summary = (event.rawMessage as { summary?: unknown }).summary;
    return typeof summary === "string" && summary.trim().length > 0;
  });
}

function humanReason(group: PipelineEventGroup): PipelineReasonCode {
  const value = group.sourceEvents.map((event) => extractText(event.rawMessage.content)).join("\n");
  if (/\b(?:actually|correction|instead|still (?:broken|wrong)|that(?:'s| is) wrong)\b/i.test(value)) return "human_correction";
  if (/\b(?:do not|don't|must|never|only|without)\b/i.test(value)) return "human_constraint";
  if (/\?\s*(?:$|\n)/.test(value)) return "human_question";
  return "human_goal";
}

function assistantReason(group: PipelineEventGroup): PipelineReasonCode {
  return /\b(?:decision|decided|chose|chosen|conclusion|selected)\b/i.test(group.rendered)
    ? "assistant_decision"
    : "assistant_narrative";
}

function factStatus(fact: ToolOutcomeFact): PipelineToolOutcomeStatus {
  if (fact.missing || fact.resultIndex === null) return "missing";
  if (fact.noChange) return "no_change";
  if (fact.isError) return "error";
  return "success";
}

function delayedFactsForGroup(group: PipelineEventGroup, toolAnalysis: ToolOutcomeAnalysis): ToolOutcomeFact[] {
  const llmIndexes = new Set(group.llmMessageIndexes);
  return toolAnalysis.facts.filter((fact) =>
    fact.resultIndex !== null
    && llmIndexes.has(fact.resultIndex)
    && !llmIndexes.has(fact.assistantIndex)
  );
}

function classifyGroup(
  source: PreparedCompactionSource,
  group: PipelineEventGroup,
  toolAnalysis: ToolOutcomeAnalysis,
): PipelineClassification {
  if (
    group.sourceEvents.every((event) => event.contextPruned)
    && group.sourceEvents.every((event) => event.rawMessage.role === "toolResult")
  ) {
    return { disposition: "canonical", reason: "context_prune_summary_reference" };
  }
  if (!groupHasRawContent(group)) {
    return { disposition: "drop_safe", reason: "empty_content" };
  }
  if (group.kind === "human_turn") return { disposition: "required", reason: humanReason(group) };
  if (group.kind === "orphan_tool_result") return { disposition: "required", reason: "orphan_tool_result" };

  const delayedFacts = delayedFactsForGroup(group, toolAnalysis);
  if (delayedFacts.length > 0) {
    if (delayedFacts.some((fact) => fact.isError || fact.noChange)) {
      return { disposition: "required", reason: "unresolved_tool_state" };
    }
    return { disposition: "canonical", reason: "delayed_tool_result" };
  }

  if (group.kind === "tool_batch") {
    const assistantIndexes = [...new Set(toolAnalysis.facts
      .filter((fact) => group.llmMessageIndexes.includes(fact.assistantIndex))
      .map((fact) => fact.assistantIndex))];
    const globalFacts = toolAnalysis.facts.filter((fact) => assistantIndexes.includes(fact.assistantIndex));
    const localFacts = assistantIndexes.flatMap((assistantIndex) =>
      restrictToolAnalysisToAdjacentResultStream(source.llmMessages, assistantIndex, toolAnalysis).facts
    );
    if (globalFacts.some((fact) => fact.isError || fact.noChange || fact.missing)) {
      return { disposition: "required", reason: "unresolved_tool_state" };
    }
    if (localFacts.some((fact) => fact.missing)) {
      return { disposition: "canonical", reason: "observed_later_tool_state" };
    }
    return { disposition: "canonical", reason: "observed_tool_batch" };
  }
  if (group.kind === "synthetic_context") return { disposition: "canonical", reason: "synthetic_continuity" };
  if (group.kind === "assistant_narrative") return { disposition: "summarize", reason: assistantReason(group) };
  return { disposition: "summarize", reason: "context" };
}

function extractEvidenceSignals(value: string, budget: number): string {
  const snippets: string[] = [];
  const seen = new Set<string>();
  for (const pattern of EVIDENCE_SIGNAL_PATTERNS) {
    const matches = [...value.matchAll(new RegExp(pattern.source, "gi"))];
    const selected = matches.length > 1 ? [matches[0]!, matches.at(-1)!] : matches;
    for (const match of selected) {
      const index = match.index ?? 0;
      const snippet = value
        .slice(Math.max(0, index - 45), Math.min(value.length, index + match[0].length + 90))
        .replace(/\s+/g, " ")
        .trim();
      if (snippet && !seen.has(snippet)) {
        seen.add(snippet);
        snippets.push(snippet);
      }
    }
  }
  return snippets.join(" | ").slice(0, budget);
}

function boundedEvidence(value: string, maxChars = BOUNDED_EVIDENCE_MAX_CHARS): string {
  if (value.length <= maxChars) return value;
  const signalBudget = Math.min(300, Math.max(100, Math.floor(maxChars * 0.4)));
  const edgeBudget = Math.max(30, Math.floor((maxChars - signalBudget - 70) / 2));
  const signals = extractEvidenceSignals(value, signalBudget);
  const omitted = Math.max(0, value.length - edgeBudget * 2);
  return [
    value.slice(0, edgeBudget),
    `… (${omitted} chars compacted; evidence) …`,
    signals,
    value.slice(-edgeBudget),
  ].filter(Boolean).join("\n").slice(0, maxChars);
}

function assistantIndexForGroup(group: PipelineEventGroup, toolAnalysis: ToolOutcomeAnalysis): number | null {
  return toolAnalysis.facts.find((fact) => group.llmMessageIndexes.includes(fact.assistantIndex))?.assistantIndex ?? null;
}

function compactToolFact(group: PipelineEventGroup, fact: PipelineToolFact): string {
  const exactPath = fact.pathArgument.trim();
  const exactArgument = exactPath || fact.exactKeyArgument.trim();
  // Paths are durable evidence and must remain exact. Potentially enormous
  // command/query arguments retain bounded head/tail evidence plus a digest.
  const argument = exactPath || (exactArgument.length <= TOOL_OUTCOME_MAX_CHARS
    ? exactArgument
    : `${boundedEvidence(exactArgument, TOOL_OUTCOME_MAX_CHARS - 20)} #${fact.argumentDigest.slice(0, 12)}`);
  const call = `${fact.toolName}${argument ? `(${argument})` : `#${fact.callOrdinal}`}`;
  const isOriginGroup = group.sourceIndexes.includes(fact.assistantSourceIndex);
  if (isOriginGroup && fact.observation === "later") {
    return `${call} → result later@s${fact.resultSourceIndex ?? "?"}`;
  }
  const lineage = !isOriginGroup && fact.observation === "later"
    ? ` ← call@s${fact.assistantSourceIndex}`
    : "";
  if (fact.status === "missing") return `${call} → MISSING${lineage}`;
  const status = fact.status === "success" ? "ok" : fact.status;
  const outcome = boundedEvidence(fact.outcome.trim(), TOOL_OUTCOME_MAX_CHARS);
  return `${call} → ${status}${outcome ? `: ${outcome}` : ""}${lineage}`;
}

function compactToolBatchBody(
  source: PreparedCompactionSource,
  group: PipelineEventGroup,
  toolAnalysis: ToolOutcomeAnalysis,
  toolFacts: PipelineToolFact[],
): string {
  const assistantIndex = assistantIndexForGroup(group, toolAnalysis);
  const narrative = assistantIndex === null
    ? ""
    : extractText(source.llmMessages[assistantIndex]?.content).trim();
  return [
    narrative ? `note: ${boundedEvidence(narrative, TOOL_NARRATIVE_MAX_CHARS)}` : "",
    ...toolFacts.map((fact) => compactToolFact(group, fact)),
  ].filter(Boolean).join("\n") || boundedEvidence(group.rendered, CANONICAL_CONTEXT_MAX_CHARS);
}

function requiredLineage(group: PipelineEventGroup, toolFacts: PipelineToolFact[]): string {
  return toolFacts
    .filter((fact) => fact.observation === "later" && fact.resultSourceIndex !== null)
    .map((fact) => group.sourceIndexes.includes(fact.assistantSourceIndex)
      ? `tool lineage: call@s${fact.assistantSourceIndex} → result later@s${fact.resultSourceIndex} (a local MISSING marker only means the result was not adjacent)`
      : `tool lineage: result@s${fact.resultSourceIndex} ← call@s${fact.assistantSourceIndex}`)
    .join("\n");
}

function buildRepresentationBody(
  source: PreparedCompactionSource,
  group: PipelineEventGroup,
  classification: PipelineClassification,
  toolAnalysis: ToolOutcomeAnalysis,
  toolFacts: PipelineToolFact[],
): string {
  if (classification.disposition === "required") {
    const lineage = requiredLineage(group, toolFacts);
    return lineage ? `${lineage}\n${group.rendered}` : group.rendered;
  }
  if (classification.disposition === "canonical") {
    if (group.kind === "tool_batch" || toolFacts.length > 0) {
      return compactToolBatchBody(source, group, toolAnalysis, toolFacts);
    }
    const compact = group.llmMessageIndexes
      .map((index) => source.llmMessages[index] ? serializeMessage(source.llmMessages[index]!, index, source.humanUserIndexes) : "")
      .filter(Boolean)
      .join("\n");
    return boundedEvidence(compact || group.rendered, CANONICAL_CONTEXT_MAX_CHARS);
  }
  const compact = group.llmMessageIndexes
    .map((index) => source.llmMessages[index] ? serializeMessage(source.llmMessages[index]!, index, source.humanUserIndexes) : "")
    .filter(Boolean)
    .join("\n");
  return boundedEvidence(compact || group.rendered);
}

function callOrdinal(source: PreparedCompactionSource, fact: ToolOutcomeFact): number {
  const message = source.llmMessages[fact.assistantIndex];
  if (!message || message.role !== "assistant" || !Array.isArray(message.content)) return 1;
  const calls = (message.content as any[]).filter((block) => block?.type === "toolCall");
  const index = calls.findIndex((call) => call?.id === fact.callId);
  return index >= 0 ? index + 1 : 1;
}

function exactToolKeyArgument(source: PreparedCompactionSource, fact: ToolOutcomeFact): string {
  const message = source.llmMessages[fact.assistantIndex];
  if (!message || message.role !== "assistant" || !Array.isArray(message.content)) return fact.pathArgument || fact.keyArgument;
  const call = (message.content as any[]).find((block) => block?.type === "toolCall" && block?.id === fact.callId);
  const args = call?.arguments ?? {};
  const value = args.path ?? args.command ?? args.pattern ?? args.query ?? "";
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function pipelineToolFact(
  source: PreparedCompactionSource,
  fact: ToolOutcomeFact,
  observation: PipelineToolObservation,
): PipelineToolFact {
  const resultSourceIndex = fact.resultIndex === null
    ? null
    : source.sourceIndexesByLlmIndex[fact.resultIndex] ?? null;
  const resultEntryId = fact.resultIndex === null
    ? null
    : source.sourceEntryIdsByLlmIndex[fact.resultIndex] ?? null;
  const exactKeyArgument = exactToolKeyArgument(source, fact);
  return {
    callOrdinal: callOrdinal(source, fact),
    toolName: fact.toolName,
    keyArgument: fact.keyArgument,
    exactKeyArgument,
    pathArgument: fact.pathArgument,
    argumentDigest: digest(exactKeyArgument),
    assistantSourceIndex: source.sourceIndexesByLlmIndex[fact.assistantIndex] ?? fact.assistantIndex,
    resultSourceIndex,
    resultEntryId,
    observation,
    status: factStatus(fact),
    significant: fact.significant,
    lowInformationSuccess: fact.lowInformationSuccess,
    outcome: fact.outcome,
  };
}

function buildToolFacts(
  source: PreparedCompactionSource,
  group: PipelineEventGroup,
  toolAnalysis: ToolOutcomeAnalysis,
): PipelineToolFact[] {
  const delayedFacts = delayedFactsForGroup(group, toolAnalysis);
  if (delayedFacts.length > 0) {
    return delayedFacts.map((fact) => pipelineToolFact(source, fact, "later"));
  }
  const assistantIndexes = [...new Set(toolAnalysis.facts
    .filter((fact) => group.llmMessageIndexes.includes(fact.assistantIndex))
    .map((fact) => fact.assistantIndex))];
  return assistantIndexes.flatMap((assistantIndex) => {
    const localFacts = restrictToolAnalysisToAdjacentResultStream(source.llmMessages, assistantIndex, toolAnalysis).facts;
    const localByCallId = new Map(localFacts.map((fact) => [fact.callId, fact]));
    return toolAnalysis.facts
      .filter((fact) => fact.assistantIndex === assistantIndex)
      .map((fact) => {
        const local = localByCallId.get(fact.callId);
        const observation: PipelineToolObservation = local?.resultIndex !== null
          ? "adjacent"
          : fact.resultIndex !== null ? "later" : "none";
        return pipelineToolFact(source, fact, observation);
      });
  });
}

function buildRelationships(
  group: PipelineEventGroup,
  toolFacts: PipelineToolFact[],
  groupBySourceIndex: Map<number, PipelineEventGroup>,
): PipelineRecordRelationships {
  const laterResultGroupIds = [...new Set(toolFacts
    .filter((fact) =>
      fact.observation === "later"
      && group.sourceIndexes.includes(fact.assistantSourceIndex)
      && fact.resultSourceIndex !== null
      && !group.sourceIndexes.includes(fact.resultSourceIndex)
    )
    .map((fact) => groupBySourceIndex.get(fact.resultSourceIndex as number)?.id)
    .filter((id): id is string => !!id && id !== group.id))];
  const originToolGroupIds = [...new Set(toolFacts
    .filter((fact) =>
      fact.observation === "later"
      && fact.resultSourceIndex !== null
      && group.sourceIndexes.includes(fact.resultSourceIndex)
      && !group.sourceIndexes.includes(fact.assistantSourceIndex)
    )
    .map((fact) => groupBySourceIndex.get(fact.assistantSourceIndex)?.id)
    .filter((id): id is string => !!id && id !== group.id))];
  return { laterResultGroupIds, originToolGroupIds };
}

function representationMode(disposition: PipelineDisposition): PipelineRepresentationMode {
  if (disposition === "required") return "lossless";
  if (disposition === "canonical") return "compact_facts";
  if (disposition === "summarize") return "bounded_evidence";
  return "none";
}

function sameOrderedValues<T>(left: T[], right: T[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function emptyBucket(): PipelineCompressionBucket {
  return {
    recordCount: 0,
    sourceChars: 0,
    representedChars: 0,
    reductionPercent: 0,
    sourceTokenEstimate: 0,
    representedTokenEstimate: 0,
    tokenReductionPercent: 0,
  };
}

function buildCompressionMetrics(records: PipelineAuditRecord[]): PipelineCompressionMetrics {
  const byDisposition: Record<PipelineDisposition, PipelineCompressionBucket> = {
    required: emptyBucket(),
    canonical: emptyBucket(),
    summarize: emptyBucket(),
    drop_safe: emptyBucket(),
  };
  let sourceChars = 0;
  let representedChars = 0;
  let sourceTokenEstimate = 0;
  let representedTokenEstimate = 0;
  let duplicateReferenceCount = 0;
  for (const record of records) {
    const bucket = byDisposition[record.disposition];
    bucket.recordCount += 1;
    bucket.sourceChars += record.metrics.sourceChars;
    bucket.representedChars += record.metrics.representedChars;
    bucket.sourceTokenEstimate += record.metrics.sourceTokenEstimate;
    bucket.representedTokenEstimate += record.metrics.representedTokenEstimate;
    sourceChars += record.metrics.sourceChars;
    representedChars += record.metrics.representedChars;
    sourceTokenEstimate += record.metrics.sourceTokenEstimate;
    representedTokenEstimate += record.metrics.representedTokenEstimate;
    if (record.representationMode === "reference") duplicateReferenceCount += 1;
  }
  for (const bucket of Object.values(byDisposition)) {
    bucket.reductionPercent = reductionPercent(bucket.sourceChars, bucket.representedChars);
    bucket.tokenReductionPercent = reductionPercent(bucket.sourceTokenEstimate, bucket.representedTokenEstimate);
  }
  return {
    recordCount: records.length,
    sourceChars,
    representedChars,
    reductionPercent: reductionPercent(sourceChars, representedChars),
    sourceTokenEstimate,
    representedTokenEstimate,
    tokenReductionPercent: reductionPercent(sourceTokenEstimate, representedTokenEstimate),
    duplicateReferenceCount,
    byDisposition,
  };
}

function validatePipelineCoverage(
  source: PreparedCompactionSource,
  groups: PipelineEventGroup[],
  records: PipelineAuditRecord[],
  units: CompactionSourceUnit[],
  compression: PipelineCompressionMetrics,
): void {
  const sourceIndexSet = new Set(source.sourceEvents.map((event) => event.sourceIndex));
  const classifications = new Map<number, number>();
  const referencedRepresentationIds = new Set<string>();
  const unitById = new Map(units.map((unit) => [unit.id, unit]));
  const groupById = new Map(groups.map((group) => [group.id, group]));
  const recordById = new Map<string, PipelineAuditRecord>();

  if (unitById.size !== units.length) throw new Error("Pipelined coverage invariant failed: duplicate representation ID");
  for (const record of records) {
    const group = groupById.get(record.groupId);
    if (!group) throw new Error(`Pipelined coverage invariant failed: unknown group ${record.groupId}`);
    if (recordById.has(record.groupId)) throw new Error(`Pipelined coverage invariant failed: duplicate record ${record.groupId}`);
    recordById.set(record.groupId, record);
    if (record.metrics.sourceChars !== sourceCharCount(group)
      || record.metrics.sourceTokenEstimate !== tokenEstimateForChars(record.metrics.sourceChars)
      || record.metrics.sourceDigest !== digest(sourcePayload(group))) {
      throw new Error(`Pipelined coverage invariant failed: ${record.groupId} source metrics mismatch`);
    }
    if (record.disposition === "drop_safe" && !ALLOWLISTED_DROP_REASONS.has(record.reason)) {
      throw new Error(`Pipelined coverage invariant failed: ${record.groupId} used non-allowlisted drop reason ${record.reason}`);
    }
    if (record.disposition === "drop_safe") {
      if (record.representationMode !== "none" || record.representationIds.length > 0 || record.metrics.representationDigest !== null) {
        throw new Error(`Pipelined coverage invariant failed: dropped ${record.groupId} has a representation`);
      }
    } else if (record.representationIds.length !== 1 || record.representationMode === "none") {
      throw new Error(`Pipelined coverage invariant failed: ${record.groupId} must have exactly one representation`);
    }
    if (record.disposition === "required" && record.representationMode !== "lossless") {
      throw new Error(`Pipelined coverage invariant failed: required ${record.groupId} is not lossless`);
    }
    if (record.representationMode === "reference") {
      const target = record.relationships.duplicateOfGroupId
        ? recordById.get(record.relationships.duplicateOfGroupId)
        : undefined;
      if (!target || target.disposition === "required" || target.metrics.semanticDigest !== record.metrics.semanticDigest) {
        throw new Error(`Pipelined coverage invariant failed: invalid duplicate reference for ${record.groupId}`);
      }
    }
    for (const sourceIndex of record.sourceIndexes) {
      if (!sourceIndexSet.has(sourceIndex)) {
        throw new Error(`Pipelined coverage invariant failed: ${record.groupId} references unknown source event ${sourceIndex}`);
      }
      classifications.set(sourceIndex, (classifications.get(sourceIndex) ?? 0) + 1);
    }
    for (const relationshipId of [...record.relationships.laterResultGroupIds, ...record.relationships.originToolGroupIds]) {
      if (!groupById.has(relationshipId)) {
        throw new Error(`Pipelined coverage invariant failed: ${record.groupId} references unknown related group ${relationshipId}`);
      }
    }
    for (const fact of record.toolFacts) {
      if (!sourceIndexSet.has(fact.assistantSourceIndex)) {
        throw new Error(`Pipelined coverage invariant failed: ${record.groupId} has unknown tool source ${fact.assistantSourceIndex}`);
      }
      if (fact.resultSourceIndex !== null && !sourceIndexSet.has(fact.resultSourceIndex)) {
        throw new Error(`Pipelined coverage invariant failed: ${record.groupId} has unknown result source ${fact.resultSourceIndex}`);
      }
    }
    for (const representationId of record.representationIds) {
      const unit = unitById.get(representationId);
      if (!unit) throw new Error(`Pipelined coverage invariant failed: ${record.groupId} references missing representation ${representationId}`);
      if (referencedRepresentationIds.has(representationId)) {
        throw new Error(`Pipelined coverage invariant failed: representation ${representationId} is referenced more than once`);
      }
      referencedRepresentationIds.add(representationId);
      if (unit.groupId !== record.groupId
        || !sameOrderedValues(unit.sourceIndexes, record.sourceIndexes)
        || !sameOrderedValues(unit.sourceEntryIds, record.sourceEntryIds)) {
        throw new Error(`Pipelined coverage invariant failed: representation ${representationId} has mismatched provenance`);
      }
      if (!unit.renderedText.trim()
        || record.metrics.representedChars !== unit.renderedText.length
        || record.metrics.representedTokenEstimate !== tokenEstimateForChars(unit.renderedText.length)
        || record.metrics.representationDigest !== digest(unit.renderedText)) {
        throw new Error(`Pipelined coverage invariant failed: representation ${representationId} metrics mismatch`);
      }
      if (record.representationMode === "lossless" && !unit.renderedText.endsWith(group.rendered)) {
        throw new Error(`Pipelined coverage invariant failed: lossless representation ${representationId} omitted source content`);
      }
    }
  }
  for (const sourceEvent of source.sourceEvents) {
    const count = classifications.get(sourceEvent.sourceIndex) ?? 0;
    if (count !== 1) {
      throw new Error(`Pipelined coverage invariant failed: source event ${sourceEvent.sourceIndex} classified ${count} times`);
    }
  }
  for (const unit of units) {
    if (!referencedRepresentationIds.has(unit.id)) {
      throw new Error(`Pipelined coverage invariant failed: unreferenced representation ${unit.id}`);
    }
  }
  const recalculated = buildCompressionMetrics(records);
  if (safeJson(recalculated) !== safeJson(compression)) {
    throw new Error("Pipelined coverage invariant failed: aggregate compression metrics mismatch");
  }
}

function compactGroupId(groupId: string): string {
  return groupId.replace(/^group-/, "g");
}

function compactSourceIndexes(indexes: number[]): string {
  if (indexes.length === 0) return "-";
  const ranges: string[] = [];
  let start = indexes[0]!;
  let end = start;
  for (const value of indexes.slice(1)) {
    if (value === end + 1) {
      end = value;
      continue;
    }
    ranges.push(start === end ? String(start) : `${start}-${end}`);
    start = value;
    end = value;
  }
  ranges.push(start === end ? String(start) : `${start}-${end}`);
  return ranges.join(",");
}

function representationCode(disposition: PipelineDisposition, mode: PipelineRepresentationMode): string {
  if (mode === "reference") return "X";
  if (disposition === "required") return "R";
  if (disposition === "canonical") return "C";
  if (disposition === "summarize") return "S";
  return "D";
}

export function buildPipelinedPlan(
  source: PreparedCompactionSource,
  groups: PipelineEventGroup[],
  toolAnalysis: ToolOutcomeAnalysis,
): PipelinedPlan {
  const groupBySourceIndex = new Map(groups.flatMap((group) => group.sourceIndexes.map((index) => [index, group] as const)));
  const drafts: PipelineRecordDraft[] = groups.map((group) => {
    const classification = classifyGroup(source, group, toolAnalysis);
    const toolFacts = buildToolFacts(source, group, toolAnalysis);
    const body = classification.disposition === "drop_safe"
      ? ""
      : buildRepresentationBody(source, group, classification, toolAnalysis, toolFacts);
    return {
      group,
      classification,
      body,
      semanticDigest: body ? digest(semanticSourcePayload(group)) : null,
      toolFacts,
      relationships: buildRelationships(group, toolFacts, groupBySourceIndex),
    };
  });

  const records: PipelineAuditRecord[] = [];
  const units: CompactionSourceUnit[] = [];
  const dispositionCounts: Record<PipelineDisposition, number> = {
    required: 0,
    canonical: 0,
    summarize: 0,
    drop_safe: 0,
  };
  const firstGroupBySemanticKey = new Map<string, string>();

  for (const draft of drafts) {
    const { group, classification } = draft;
    dispositionCounts[classification.disposition] += 1;
    const representationId = `representation-${group.id}`;
    let mode = representationMode(classification.disposition);
    let body = draft.body;
    const referenceEligible = classification.disposition !== "required"
      && classification.disposition !== "drop_safe"
      && draft.semanticDigest
      && draft.toolFacts.length === 0
      && draft.relationships.laterResultGroupIds.length === 0
      && draft.relationships.originToolGroupIds.length === 0;
    if (referenceEligible) {
      const duplicateKey = `${classification.disposition}:${classification.reason}:${draft.semanticDigest}`;
      const duplicateOfGroupId = firstGroupBySemanticKey.get(duplicateKey);
      if (duplicateOfGroupId) {
        mode = "reference";
        draft.relationships.duplicateOfGroupId = duplicateOfGroupId;
        body = `= ${compactGroupId(duplicateOfGroupId)} (duplicate evidence; chronology retained)`;
      } else {
        firstGroupBySemanticKey.set(duplicateKey, group.id);
      }
    }
    const renderedText = classification.disposition === "drop_safe"
      ? ""
      : `### ${compactGroupId(group.id)} [${representationCode(classification.disposition, mode)} s=${compactSourceIndexes(group.sourceIndexes)}]\n${body}`;
    if (renderedText) {
      units.push({
        id: representationId,
        groupId: group.id,
        renderedText,
        sourceIndexes: [...group.sourceIndexes],
        sourceEntryIds: [...group.sourceEntryIds],
        segmentIndex: 1,
        segmentCount: 1,
      });
    }
    const sourceChars = sourceCharCount(group);
    const representedChars = renderedText.length;
    const sourceTokenEstimate = tokenEstimateForChars(sourceChars);
    const representedTokenEstimate = tokenEstimateForChars(representedChars);
    records.push({
      groupId: group.id,
      sourceIndexes: [...group.sourceIndexes],
      sourceEntryIds: [...group.sourceEntryIds],
      disposition: classification.disposition,
      reason: classification.reason,
      representationMode: mode,
      representationIds: renderedText ? [representationId] : [],
      toolFacts: draft.toolFacts,
      relationships: draft.relationships,
      metrics: {
        sourceChars,
        representedChars,
        reductionPercent: reductionPercent(sourceChars, representedChars),
        sourceTokenEstimate,
        representedTokenEstimate,
        tokenReductionPercent: reductionPercent(sourceTokenEstimate, representedTokenEstimate),
        sourceDigest: digest(sourcePayload(group)),
        semanticDigest: draft.semanticDigest,
        representationDigest: renderedText ? digest(renderedText) : null,
      },
    });
  }

  const compression = buildCompressionMetrics(records);
  validatePipelineCoverage(source, groups, records, units, compression);
  return { records, units, dispositionCounts, compression, coverageComplete: true };
}

export function isAllowlistedPipelineDropReason(reason: PipelineReasonCode): boolean {
  return ALLOWLISTED_DROP_REASONS.has(reason);
}
