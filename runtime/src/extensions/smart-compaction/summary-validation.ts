import { MIN_SUMMARY_CHARS } from "./config.js";

export type CompactionSummarySchema = "final" | "chunk";

export interface CompactionSummaryValidationSuccess {
  ok: true;
  text: string;
  stopReason: "stop";
}

export interface CompactionSummaryValidationFailure {
  ok: false;
  code:
    | "stop_reason"
    | "missing_text"
    | "too_short"
    | "too_large"
    | "missing_heading"
    | "duplicate_heading"
    | "unexpected_heading"
    | "leading_content"
    | "heading_order"
    | "empty_section"
    | "invalid_progress_structure"
    | "invalid_terminal_section"
    | "invalid_file_sections";
  reason: string;
  retryable: boolean;
  stopReason: string;
}

export type CompactionSummaryValidation =
  | CompactionSummaryValidationSuccess
  | CompactionSummaryValidationFailure;

const FINAL_HEADINGS = [
  "Goal",
  "Current Active Topic",
  "Historical / Background Context",
  "Constraints & Preferences",
  "Progress",
  "Key Decisions",
  "Next Steps",
  "Critical Context",
] as const;

const CHUNK_HEADINGS = [
  "Chunk Range",
  "Goals / User Intent",
  "Constraints & Preferences",
  "Decisions",
  "Files / Commands / Tool Outcomes",
  "Progress",
  "Open Questions / Next Steps",
  "Key Continuity Facts",
] as const;

const REQUIRED_NON_EMPTY: Record<CompactionSummarySchema, readonly string[]> = {
  final: ["Goal", "Progress", "Critical Context"],
  chunk: ["Goals / User Intent", "Progress", "Key Continuity Facts"],
};

function failure(
  code: CompactionSummaryValidationFailure["code"],
  reason: string,
  stopReason: string,
  retryable = true,
): CompactionSummaryValidationFailure {
  return { ok: false, code, reason, retryable, stopReason };
}

function extractResponseText(response: any): string {
  if (!Array.isArray(response?.content)) return "";
  return response.content
    .filter((block: any) => block?.type === "text" && typeof block.text === "string")
    .map((block: any) => block.text)
    .join("\n")
    .trim();
}

function hasSubstantiveSectionContent(content: string): boolean {
  return content
    .replace(/^###\s+.*$/gm, "")
    .replace(/^[-*]\s*(?:\[[ xX]\]\s*)?/gm, "")
    .replace(/^\d+\.\s*/gm, "")
    .trim().length > 0;
}

/** Validate both provider completion state and schema completeness before persistence. */
export function validateCompactionSummaryResponse(
  response: any,
  schema: CompactionSummarySchema,
  maxChars: number,
): CompactionSummaryValidation {
  const stopReason = typeof response?.stopReason === "string" ? response.stopReason : "missing";
  if (stopReason !== "stop") {
    return failure(
      "stop_reason",
      `completion stop reason was ${stopReason}; expected stop`,
      stopReason,
      stopReason === "length",
    );
  }

  const text = extractResponseText(response);
  if (!text) return failure("missing_text", "completion contained no text", stopReason);
  if (text.length < MIN_SUMMARY_CHARS) {
    return failure("too_short", `summary was ${text.length} characters; minimum is ${MIN_SUMMARY_CHARS}`, stopReason);
  }
  if (text.length > maxChars) {
    return failure("too_large", `summary was ${text.length} characters; maximum is ${maxChars}`, stopReason);
  }

  const expected = schema === "final" ? FINAL_HEADINGS : CHUNK_HEADINGS;
  const headingMatches = [...text.matchAll(/^##\s+([^\n]+?)\s*$/gm)].map((match) => ({
    heading: match[1].trim(),
    index: match.index ?? 0,
    bodyStart: (match.index ?? 0) + match[0].length,
  }));

  if (headingMatches.length > 0 && text.slice(0, headingMatches[0].index).trim()) {
    return failure("leading_content", "commentary appeared before the first required heading", stopReason);
  }
  for (const heading of expected) {
    const matches = headingMatches.filter((candidate) => candidate.heading === heading);
    if (matches.length === 0) {
      return failure("missing_heading", `missing required heading: ## ${heading}`, stopReason);
    }
    if (matches.length > 1) {
      return failure("duplicate_heading", `duplicated required heading: ## ${heading}`, stopReason);
    }
  }
  const unexpected = headingMatches.find((candidate) => !expected.includes(candidate.heading as any));
  if (unexpected) {
    return failure("unexpected_heading", `unexpected top-level heading: ## ${unexpected.heading}`, stopReason);
  }

  const expectedPositions = expected.map((heading) => headingMatches.findIndex((candidate) => candidate.heading === heading));
  for (let i = 1; i < expectedPositions.length; i++) {
    if (expectedPositions[i] <= expectedPositions[i - 1]) {
      return failure("heading_order", `required heading is out of order: ## ${expected[i]}`, stopReason);
    }
  }

  const sectionContent = new Map<string, string>();
  for (const heading of REQUIRED_NON_EMPTY[schema]) {
    const position = headingMatches.findIndex((candidate) => candidate.heading === heading);
    const match = headingMatches[position];
    const next = headingMatches[position + 1];
    const content = text.slice(match.bodyStart, next?.index ?? text.length);
    sectionContent.set(heading, content);
    if (!hasSubstantiveSectionContent(content)) {
      return failure("empty_section", `required section is empty: ## ${heading}`, stopReason);
    }
  }

  const progress = sectionContent.get("Progress") ?? "";
  if (schema === "final") {
    const progressHeadings = [...progress.matchAll(/^###\s+(Done|In Progress|Blocked)\s*$/gmi)].map((match) => match[1].toLowerCase());
    if (progressHeadings.join(",") !== "done,in progress,blocked") {
      return failure("invalid_progress_structure", "## Progress must contain ### Done, ### In Progress, and ### Blocked exactly once and in order", stopReason);
    }
  } else {
    const labels = [...progress.matchAll(/^[-*]\s*(Done|In progress|Blocked)\s*:/gmi)].map((match) => match[1].toLowerCase());
    if (labels.join(",") !== "done,in progress,blocked") {
      return failure("invalid_progress_structure", "chunk ## Progress must contain Done, In progress, and Blocked list items exactly once and in order", stopReason);
    }
  }

  const terminalHeading = schema === "final" ? "Critical Context" : "Key Continuity Facts";
  const terminalMatch = headingMatches.find((candidate) => candidate.heading === terminalHeading)!;
  const fileSectionRanges: Array<{ start: number; end: number }> = [];
  const tagLikeMatches = [...text.matchAll(/<\/?(?:read-files|modified-files)\b[^>\n]*(?:>|$)/gi)];
  if (schema === "chunk" && tagLikeMatches.length > 0) {
    return failure("invalid_file_sections", "chunk summaries must not contain deterministic file blocks", stopReason);
  }
  for (const match of tagLikeMatches) {
    if (!/^<\/?(?:read-files|modified-files)>$/i.test(match[0])) {
      return failure("invalid_file_sections", `malformed deterministic file tag: ${match[0]}`, stopReason);
    }
  }
  for (const tag of ["read-files", "modified-files"] as const) {
    const opens = [...text.matchAll(new RegExp(`<${tag}>`, "gi"))];
    const closes = [...text.matchAll(new RegExp(`</${tag}>`, "gi"))];
    if (opens.length !== closes.length || opens.length > 1) {
      return failure("invalid_file_sections", `${tag} must have at most one balanced opening/closing pair`, stopReason);
    }
    if (opens.length === 0) continue;
    const start = opens[0].index ?? -1;
    const closeStart = closes[0].index ?? -1;
    if (start < terminalMatch.bodyStart || closeStart <= start) {
      return failure("invalid_file_sections", `${tag} must be a balanced block after ## ${terminalHeading}`, stopReason);
    }
    const end = closeStart + closes[0][0].length;
    const body = text.slice(start + opens[0][0].length, closeStart).trim();
    if (!body) return failure("invalid_file_sections", `${tag} block is empty`, stopReason);
    fileSectionRanges.push({ start, end });
  }
  fileSectionRanges.sort((a, b) => a.start - b.start);
  for (let index = 1; index < fileSectionRanges.length; index += 1) {
    if (fileSectionRanges[index].start < fileSectionRanges[index - 1].end) {
      return failure("invalid_file_sections", "deterministic file blocks must not overlap", stopReason);
    }
  }

  const terminal = (sectionContent.get(terminalHeading) ?? "")
    .replace(/<read-files>[\s\S]*?<\/read-files>/gi, "")
    .replace(/<modified-files>[\s\S]*?<\/modified-files>/gi, "");
  const invalidTerminalLine = terminal
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && !/^(?:[-*]\s+|\d+\.\s+|###\s+|<\/?(?:read-files|modified-files)>)/.test(line));
  if (invalidTerminalLine) {
    return failure("invalid_terminal_section", `unexpected commentary after ## ${terminalHeading}`, stopReason);
  }

  return { ok: true, text, stopReason: "stop" };
}

export function buildCompactionRepairInstruction(schema: CompactionSummarySchema, reason: string): string {
  const format = schema === "final"
    ? FINAL_HEADINGS.map((heading) => `## ${heading}`).join("\n")
    : CHUNK_HEADINGS.map((heading) => `## ${heading}`).join("\n");
  return `\n\n## Output Repair Requirement\nThe previous completion was rejected: ${reason}. Return one concise, complete summary only. End normally with stopReason=stop. Include every heading exactly once and in this order:\n${format}\nDo not include commentary before or after the summary.`;
}
