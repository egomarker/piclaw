/**
 * skel/.pi/extensions/context-mode.ts – Example extension for context-aware tools.
 *
 * Registers batch_exec, tool_output_search, and enhanced bash/read/edit tools
 * that support tool output persistence and preview. Shipped as a skel template
 * so new workspaces get these tools automatically.
 */

import { isBashToolResult } from "@earendil-works/pi-coding-agent";

import {
  createBatchExecTool,
  createToolOutputSearchTool,
} from "/workspace/piclaw/runtime/src/tools/context-tools.ts";
import {
  buildPreview,
  saveToolOutput,
  readToolOutputFile,
  startToolOutputCleanup,
} from "/workspace/piclaw/runtime/src/tool-output.ts";

const STORE_THRESHOLD_BYTES = parseInt(process.env.PICLAW_TOOL_OUTPUT_STORE_BYTES || "4096", 10);
const STORE_THRESHOLD_LINES = parseInt(process.env.PICLAW_TOOL_OUTPUT_STORE_LINES || "40", 10);
const PREVIEW_LINES = parseInt(process.env.PICLAW_TOOL_OUTPUT_PREVIEW_LINES || "8", 10);
const PREVIEW_LINE_CHARS = parseInt(process.env.PICLAW_TOOL_OUTPUT_PREVIEW_LINE_CHARS || "200", 10);
const RETENTION_DAYS = parseInt(process.env.PICLAW_TOOL_OUTPUT_RETENTION_DAYS || "7", 10);
const CLEANUP_INTERVAL_MS = parseInt(
  process.env.PICLAW_TOOL_OUTPUT_CLEANUP_INTERVAL_MS || String(12 * 60 * 60 * 1000),
  10
);

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extractText(content: Array<{ type: string; text?: string }> | undefined): string {
  if (!content) return "";
  return content.map((item) => (item.type === "text" ? item.text || "" : "")).join("");
}

function shouldStoreOutput(text: string, lineCount: number): boolean {
  const bytes = Buffer.byteLength(text || "", "utf8");
  return bytes > STORE_THRESHOLD_BYTES || lineCount > STORE_THRESHOLD_LINES;
}

export default function (pi: any) {
  pi.on("session_start", () => {
    startToolOutputCleanup(RETENTION_DAYS, CLEANUP_INTERVAL_MS);
  });

  pi.registerTool(createToolOutputSearchTool());
  pi.registerTool(createBatchExecTool(process.cwd()));

  pi.on("tool_result", async (event: any) => {
    if (!isBashToolResult(event)) return;
    if (event.isError) return;
    if (event.details?.storedOutputId || event.details?.storedOutputPath) return;

    const text = extractText(event.content);
    const fullOutputPath = event.details?.fullOutputPath;
    let fullOutput = text;
    if (fullOutputPath) {
      const fileText = readToolOutputFile(fullOutputPath);
      if (fileText !== null) fullOutput = fileText;
    }

    const lineCount = fullOutput ? fullOutput.replace(/\r\n/g, "\n").split("\n").length : 0;
    if (!shouldStoreOutput(fullOutput, lineCount)) return;

    const preview = buildPreview(fullOutput, PREVIEW_LINES, PREVIEW_LINE_CHARS);
    const saved = saveToolOutput(fullOutput, {
      source: `bash:${event.input?.command || ""}`,
      summary: preview,
    });

    const summaryText = [
      `Output stored as tool-output:${saved.id} (${saved.lineCount} lines, ${formatBytes(saved.sizeBytes)}).`,
      preview ? `Preview:\n${preview}` : null,
      `Use tool_output_search with handle "${saved.id}" and a query to retrieve relevant snippets.`,
    ]
      .filter(Boolean)
      .join("\n\n");

    return {
      content: [{ type: "text", text: summaryText }],
      details: {
        storedOutputId: saved.id,
        storedOutputPath: saved.path,
        storedOutputLines: saved.lineCount,
        storedOutputBytes: saved.sizeBytes,
      },
    };
  });
}
