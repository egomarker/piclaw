/**
 * context-mode.ts – Tool-output storage and search extension.
 *
 * Intercepts large eligible tool results, stores them on disk, and replaces
 * the inline output with a compact preview + search handle. Also registers
 * the batch_exec and search_tool_output tools.
 *
 * Activated unconditionally (no env-var gate).
 */
import { createHash } from "node:crypto";

import {
  buildPreview,
  createBatchExecTool,
  createToolOutputSearchTool,
  getToolResultCompactionEnabled,
  getToolResultCompactionThresholdsByTool,
  readToolOutputFile,
  saveToolOutput,
} from "../../src/extensions/context-mode-api.js";

const DEFAULT_STORE_THRESHOLD_BYTES = parseInt(process.env.PICLAW_TOOL_OUTPUT_STORE_BYTES || "4096", 10);
const DEFAULT_STORE_THRESHOLD_LINES = parseInt(process.env.PICLAW_TOOL_OUTPUT_STORE_LINES || "40", 10);
const PREVIEW_LINES = parseInt(process.env.PICLAW_TOOL_OUTPUT_PREVIEW_LINES || "8", 10);
const PREVIEW_LINE_CHARS = parseInt(process.env.PICLAW_TOOL_OUTPUT_PREVIEW_LINE_CHARS || "200", 10);
const STORED_OUTPUT_CACHE_MAX = 512;

const storedOutputByDigest = new Map<string, ReturnType<typeof saveToolOutput>>();

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function readDetailsStringField(details: unknown, key: string): string | undefined {
  if (!isRecord(details)) return undefined;
  const value = details[key];
  return typeof value === "string" ? value : undefined;
}

function extractText(content: unknown): string {
  if (!Array.isArray(content)) return "";
  return content
    .map((item) => {
      if (!isRecord(item)) return "";
      if (item.type !== "text") return "";
      return typeof item.text === "string" ? item.text : "";
    })
    .join("");
}

function hasImageOrBinaryBlocks(content: unknown): boolean {
  if (!Array.isArray(content)) return false;
  return content.some((item) => {
    if (!isRecord(item)) return false;
    if (item.type === "image") return true;
    if (item.type !== "text" && typeof item.data === "string" && item.data.length > 0) return true;
    return false;
  });
}

function hasStoredOutputMarker(text: string): boolean {
  if (!text) return false;
  return /tool-output:[A-Za-z0-9_-]+/.test(text)
    || /Use search_tool_output with handle\s+"[A-Za-z0-9_-]+"/.test(text);
}

function hasExistingStoredOutputDetails(details: unknown): boolean {
  if (!details || (typeof details !== "object" && !Array.isArray(details))) return false;

  const stack: unknown[] = [details];
  const seen = new Set<unknown>();
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || seen.has(current)) continue;
    seen.add(current);

    if (Array.isArray(current)) {
      for (const value of current) {
        if (value && typeof value === "object") stack.push(value);
      }
      continue;
    }

    if (!isRecord(current)) continue;
    for (const [rawKey, value] of Object.entries(current)) {
      const key = rawKey.toLowerCase();
      if (key.includes("storedoutput") || key.includes("stored_output") || key.includes("tool_output")) {
        if (typeof value === "string" && value.trim()) return true;
        if (typeof value === "number" && Number.isFinite(value)) return true;
        if (Array.isArray(value) || isRecord(value)) return true;
      }
      if (value && typeof value === "object") stack.push(value);
    }
  }

  return false;
}

function resolveOutputSourceFromTool(toolName: unknown, command?: unknown): string {
  const normalizedToolName = typeof toolName === "string" && toolName.trim()
    ? toolName.trim()
    : "unknown";
  if (normalizedToolName === "bash") {
    const normalizedCommand = typeof command === "string" ? command : "";
    return `bash:${normalizedCommand}`;
  }
  return `tool:${normalizedToolName}`;
}

function resolveOutputSource(event: unknown): string {
  if (!isRecord(event)) return resolveOutputSourceFromTool("unknown");
  const input = isRecord(event.input) ? event.input : null;
  return resolveOutputSourceFromTool(event.toolName, input?.command);
}

function normalizeToolName(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function resolveStoreThresholds(toolName: unknown): { bytes: number; lines: number } {
  const normalized = normalizeToolName(toolName);
  const overrides = getToolResultCompactionThresholdsByTool();
  const override = normalized ? overrides[normalized] : undefined;
  return {
    bytes: Number.isFinite(Number(override?.bytes)) ? Math.max(1, Math.round(Number(override?.bytes))) : DEFAULT_STORE_THRESHOLD_BYTES,
    lines: Number.isFinite(Number(override?.lines)) ? Math.max(1, Math.round(Number(override?.lines))) : DEFAULT_STORE_THRESHOLD_LINES,
  };
}

function shouldStoreOutput(text: string, lineCount: number, toolName: unknown): boolean {
  const bytes = Buffer.byteLength(text || "", "utf8");
  const thresholds = resolveStoreThresholds(toolName);
  return bytes > thresholds.bytes || lineCount > thresholds.lines;
}

function buildStoredOutputSummary(saved: ReturnType<typeof saveToolOutput>, preview: string): string {
  return [
    `Output stored as tool-output:${saved.id} (${saved.lineCount} lines, ${formatBytes(saved.sizeBytes)}).`,
    preview ? `Preview:\n${preview}` : null,
    `Use search_tool_output with handle "${saved.id}" and a query to retrieve relevant snippets.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function computeOutputDigest(fullOutput: string, source: string): string {
  const hash = createHash("sha1");
  hash.update(source);
  hash.update("\0");
  hash.update(fullOutput);
  return hash.digest("hex");
}

function rememberStoredOutput(digest: string, saved: ReturnType<typeof saveToolOutput>): void {
  storedOutputByDigest.set(digest, saved);
  while (storedOutputByDigest.size > STORED_OUTPUT_CACHE_MAX) {
    const firstKey = storedOutputByDigest.keys().next().value;
    if (!firstKey) break;
    storedOutputByDigest.delete(firstKey);
  }
}

function getOrSaveStoredOutput(fullOutput: string, source: string, summary: string): ReturnType<typeof saveToolOutput> {
  const digest = computeOutputDigest(fullOutput, source);
  const cached = storedOutputByDigest.get(digest);
  if (cached) return cached;
  const saved = saveToolOutput(fullOutput, { source, summary });
  rememberStoredOutput(digest, saved);
  return saved;
}

function compactTextOutput(
  text: string,
  options: {
    fullOutput?: string;
    toolName?: unknown;
    source: string;
  },
): { summaryText: string; saved: ReturnType<typeof saveToolOutput> } | null {
  const fullOutput = options.fullOutput ?? text;
  if (!fullOutput.trim()) return null;
  if (hasStoredOutputMarker(text) || hasStoredOutputMarker(fullOutput)) return null;

  const lineCount = fullOutput ? fullOutput.replace(/\r\n/g, "\n").split("\n").length : 0;
  if (!shouldStoreOutput(fullOutput, lineCount, options.toolName)) return null;

  const preview = buildPreview(fullOutput, PREVIEW_LINES, PREVIEW_LINE_CHARS);
  const saved = getOrSaveStoredOutput(fullOutput, options.source, preview);
  return {
    summaryText: buildStoredOutputSummary(saved, preview),
    saved,
  };
}

function normalizeToolResultRole(role: unknown): string {
  const normalized = typeof role === "string" ? role.trim().toLowerCase() : "";
  if (normalized === "toolresult") return "tool_result";
  return normalized;
}

function resolveToolNameFromUnknown(record: unknown): string {
  if (!isRecord(record)) return "unknown";
  const candidates = [record.toolName, record.tool_name, record.name];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return "unknown";
}

function compactLegacyToolResultContent(content: unknown, toolName: unknown): {
  content: unknown;
  modified: boolean;
} {
  if (!Array.isArray(content)) return { content, modified: false };
  if (hasImageOrBinaryBlocks(content)) return { content, modified: false };

  const text = extractText(content);
  if (!text.trim()) return { content, modified: false };

  try {
    const compacted = compactTextOutput(text, {
      toolName,
      source: resolveOutputSourceFromTool(toolName),
    });
    if (!compacted) return { content, modified: false };
    return {
      content: [{ type: "text", text: compacted.summaryText }],
      modified: true,
    };
  } catch {
    return { content, modified: false };
  }
}

function compactNestedToolResultBlocks(content: unknown): {
  content: unknown;
  modified: boolean;
} {
  if (!Array.isArray(content)) return { content, modified: false };

  let modified = false;
  const next = content.map((item) => {
    if (!isRecord(item)) return item;

    const type = typeof item.type === "string" ? item.type.trim().toLowerCase() : "";
    if ((type === "tool_result" || type === "toolresult") && Array.isArray(item.content)) {
      const compacted = compactLegacyToolResultContent(item.content, resolveToolNameFromUnknown(item));
      if (compacted.modified) {
        modified = true;
        return { ...item, content: compacted.content };
      }
      return item;
    }

    if (Array.isArray(item.content)) {
      const nested = compactNestedToolResultBlocks(item.content);
      if (nested.modified) {
        modified = true;
        return { ...item, content: nested.content };
      }
    }

    return item;
  });

  return { content: next, modified };
}

export default function (pi: any) {
  // Tool-output cleanup is process-scoped and starts from runtime startup.
  // Keep this session extension focused on registering the tools/hooks needed
  // for the active session so cold session creation does not repeat lifecycle work.
  pi.registerTool(createToolOutputSearchTool());
  pi.registerTool(createBatchExecTool(process.cwd()));

  pi.on("tool_result", async (event: any) => {
    if (!getToolResultCompactionEnabled()) return;
    if (event?.isError) return;
    if (hasExistingStoredOutputDetails(event?.details)) return;
    if (hasImageOrBinaryBlocks(event?.content)) return;

    const text = extractText(event?.content);
    if (!text.trim()) return;
    if (hasStoredOutputMarker(text)) return;

    const fullOutputPath = readDetailsStringField(event?.details, "fullOutputPath");
    let fullOutput = text;
    if (fullOutputPath) {
      const fileText = readToolOutputFile(fullOutputPath);
      if (fileText !== null) fullOutput = fileText;
    }

    try {
      const compacted = compactTextOutput(text, {
        fullOutput,
        toolName: event?.toolName,
        source: resolveOutputSource(event),
      });
      if (!compacted) return;

      return {
        content: [{ type: "text", text: compacted.summaryText }],
        details: {
          storedOutputId: compacted.saved.id,
          storedOutputPath: compacted.saved.path,
          storedOutputLines: compacted.saved.lineCount,
          storedOutputBytes: compacted.saved.sizeBytes,
          storedOutputSource: resolveOutputSource(event),
        },
      };
    } catch {
      // Fail open: preserve inline tool result when tool-output persistence fails.
      return;
    }
  });

  // Optional provider-request-time compaction layer:
  // compact legacy oversized inline tool results in outbound context only.
  pi.on("context", async (event: any) => {
    if (!getToolResultCompactionEnabled()) return {};
    if (!Array.isArray(event?.messages)) return {};

    let modified = false;
    const messages = event.messages.map((message: any) => {
      if (!isRecord(message)) return message;
      let nextMessage = message;

      const role = normalizeToolResultRole(message.role);
      if (role === "tool_result" && Array.isArray(nextMessage.content)) {
        const compacted = compactLegacyToolResultContent(nextMessage.content, resolveToolNameFromUnknown(nextMessage));
        if (compacted.modified) {
          modified = true;
          nextMessage = { ...nextMessage, content: compacted.content };
        }
      }

      if (Array.isArray(nextMessage.content)) {
        const nested = compactNestedToolResultBlocks(nextMessage.content);
        if (nested.modified) {
          modified = true;
          nextMessage = { ...nextMessage, content: nested.content };
        }
      }

      return nextMessage;
    });

    if (!modified) return {};
    return { messages };
  });
}
