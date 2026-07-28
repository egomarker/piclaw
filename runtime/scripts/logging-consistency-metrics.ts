import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOTS = ["runtime/src", "runtime/extensions", "runtime/scripts"];
const VALID_EXT = /\.(ts|tsx|js)$/;

type ParserState = "code" | "lineComment" | "blockComment" | "singleQuote" | "doubleQuote" | "template";

export interface LoggingConsistencyMetrics {
  inconsistentLoggingSites: number;
  warnErrorWithoutOperation: number;
  caughtWarnErrorWithoutErr: number;
  directSuppressedDebugSites: number;
}

export interface LoggingConsistencyMatch {
  filePath: string;
  index: number;
  line: number;
  snippet: string;
}

function shouldSkipPath(filePath: string): boolean {
  return filePath.includes("/vendor/")
    || filePath.includes("/static/")
    || filePath.includes("/node_modules/")
    || filePath.endsWith(".min.js");
}

function collectFiles(roots: string[]): string[] {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const filePath = path.join(dir, name);
      if (shouldSkipPath(filePath)) continue;
      let stat;
      try {
        stat = statSync(filePath);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        walk(filePath);
        continue;
      }
      if (!VALID_EXT.test(name)) continue;
      files.push(filePath);
    }
  };
  roots.forEach(walk);
  return files;
}

function buildNonCodeMask(source: string): Uint8Array {
  const mask = new Uint8Array(source.length);
  let state: ParserState = "code";
  let escaped = false;
  const templateExprDepth: number[] = [];

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1] || "";

    if (state === "lineComment") {
      mask[i] = 1;
      if (ch === "\n") state = "code";
      continue;
    }
    if (state === "blockComment") {
      mask[i] = 1;
      if (ch === "*" && next === "/") {
        mask[i + 1] = 1;
        i++;
        state = "code";
      }
      continue;
    }
    if (state === "singleQuote") {
      mask[i] = 1;
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === "'") state = "code";
      continue;
    }
    if (state === "doubleQuote") {
      mask[i] = 1;
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') state = "code";
      continue;
    }
    if (state === "template") {
      mask[i] = 1;
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === "$" && next === "{") {
        mask[i + 1] = 1;
        i++;
        templateExprDepth.push(1);
        state = "code";
        continue;
      }
      if (ch === "`") state = "code";
      continue;
    }

    if (templateExprDepth.length > 0) {
      if (ch === "{") {
        templateExprDepth[templateExprDepth.length - 1] += 1;
        continue;
      }
      if (ch === "}") {
        const nextDepth = templateExprDepth[templateExprDepth.length - 1] - 1;
        if (nextDepth <= 0) {
          templateExprDepth.pop();
          state = "template";
        } else {
          templateExprDepth[templateExprDepth.length - 1] = nextDepth;
        }
        continue;
      }
    }

    if (ch === "/" && next === "/") {
      mask[i] = 1;
      mask[i + 1] = 1;
      i++;
      state = "lineComment";
      continue;
    }
    if (ch === "/" && next === "*") {
      mask[i] = 1;
      mask[i + 1] = 1;
      i++;
      state = "blockComment";
      continue;
    }
    if (ch === "'") {
      mask[i] = 1;
      state = "singleQuote";
      continue;
    }
    if (ch === '"') {
      mask[i] = 1;
      state = "doubleQuote";
      continue;
    }
    if (ch === "`") {
      mask[i] = 1;
      state = "template";
      continue;
    }
  }

  return mask;
}

function lineOfIndex(source: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index; i++) if (source[i] === "\n") line++;
  return line;
}

function snippetAt(source: string, index: number): string {
  const start = source.lastIndexOf("\n", index) + 1;
  const endIndex = source.indexOf("\n", index);
  const end = endIndex === -1 ? source.length : endIndex;
  return source.slice(start, end).trim();
}

function skipBalancedGroup(source: string, index: number, mask: Uint8Array, open: string, close: string): number {
  if (source[index] !== open) return index;
  let depth = 0;
  for (let cursor = index; cursor < source.length; cursor++) {
    if (mask[cursor]) continue;
    if (source[cursor] === open) depth++;
    else if (source[cursor] === close) {
      depth--;
      if (depth === 0) return cursor + 1;
    }
  }
  return source.length;
}

function extractCallObjectLiteral(source: string, startIndex: number, mask: Uint8Array): string | null {
  let cursor = source.indexOf("(", startIndex);
  if (cursor < 0) return null;
  cursor = skipBalancedGroup(source, cursor, mask, "(", ")");
  return source.slice(startIndex, cursor);
}

function findWarnErrorWithoutOperationInSource(source: string): LoggingConsistencyMatch[] {
  const matches: LoggingConsistencyMatch[] = [];
  const mask = buildNonCodeMask(source);
  const regex = /log\.(warn|error)\s*\(/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source))) {
    const index = match.index;
    if (mask[index]) continue;
    const call = extractCallObjectLiteral(source, index, mask);
    if (!call) continue;
    const hasObjectArg = /,\s*\{[\s\S]*\}\s*\)$/.test(call);
    if (!hasObjectArg) continue;
    if (/\boperation\s*:/.test(call)) continue;
    matches.push({ filePath: "", index, line: lineOfIndex(source, index), snippet: snippetAt(source, index) });
  }
  return matches;
}

function findCaughtWarnErrorWithoutErrInSource(source: string): LoggingConsistencyMatch[] {
  const matches: LoggingConsistencyMatch[] = [];
  const mask = buildNonCodeMask(source);
  const regex = /catch\s*\(([^)]+)\)\s*\{/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source))) {
    const index = match.index;
    if (mask[index]) continue;
    const errName = match[1]?.trim();
    if (!errName || !/^[$A-Za-z_][$A-Za-z0-9_]*$/.test(errName)) continue;
    const openBrace = source.indexOf("{", index);
    const closeBrace = skipBalancedGroup(source, openBrace, mask, "{", "}") - 1;
    const body = source.slice(openBrace + 1, closeBrace);
    const logsErr = new RegExp(`log\\.(warn|error)\\s*\\([\\s\\S]*?\\berr\\s*:\\s*${errName}\\b`).test(body);
    const logsCaught = new RegExp(`log\\.(warn|error)\\s*\\([\\s\\S]*?\\b${errName}\\b`).test(body);
    if (logsCaught && !logsErr) {
      matches.push({ filePath: "", index, line: lineOfIndex(source, index), snippet: snippetAt(source, index) });
    }
    regex.lastIndex = closeBrace;
  }
  return matches;
}

function findDirectSuppressedDebugSitesInSource(source: string): LoggingConsistencyMatch[] {
  const matches: LoggingConsistencyMatch[] = [];
  const mask = buildNonCodeMask(source);
  const regex = /log\.debug\s*\(/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source))) {
    const index = match.index;
    if (mask[index]) continue;
    const call = extractCallObjectLiteral(source, index, mask);
    if (!call) continue;
    if (!/\bsuppressed\s*:\s*true\b/.test(call)) continue;
    if (/debugSuppressedError\s*\(/.test(call)) continue;
    matches.push({ filePath: "", index, line: lineOfIndex(source, index), snippet: snippetAt(source, index) });
  }
  return matches;
}

function attachPaths(filePath: string, matches: LoggingConsistencyMatch[]): LoggingConsistencyMatch[] {
  return matches.map((match) => ({ ...match, filePath }));
}

export function getLoggingConsistencyMetrics(roots: string[] = ROOTS): LoggingConsistencyMetrics {
  const files = collectFiles(roots);
  const warnErrorWithoutOperation = files.flatMap((filePath) => attachPaths(filePath, findWarnErrorWithoutOperationInSource(readFileSync(filePath, "utf8"))));
  const caughtWarnErrorWithoutErr = files.flatMap((filePath) => attachPaths(filePath, findCaughtWarnErrorWithoutErrInSource(readFileSync(filePath, "utf8"))));
  const directSuppressedDebugSites = files.flatMap((filePath) => attachPaths(filePath, findDirectSuppressedDebugSitesInSource(readFileSync(filePath, "utf8"))));

  return {
    inconsistentLoggingSites: warnErrorWithoutOperation.length + caughtWarnErrorWithoutErr.length + directSuppressedDebugSites.length,
    warnErrorWithoutOperation: warnErrorWithoutOperation.length,
    caughtWarnErrorWithoutErr: caughtWarnErrorWithoutErr.length,
    directSuppressedDebugSites: directSuppressedDebugSites.length,
  };
}

export function printLoggingConsistencyMetrics(metrics: LoggingConsistencyMetrics): void {
  console.log(`METRIC inconsistent_logging_sites=${metrics.inconsistentLoggingSites}`);
  console.log(`METRIC warn_error_without_operation=${metrics.warnErrorWithoutOperation}`);
  console.log(`METRIC caught_warn_error_without_err=${metrics.caughtWarnErrorWithoutErr}`);
  console.log(`METRIC direct_suppressed_debug_sites=${metrics.directSuppressedDebugSites}`);
}

if (import.meta.main) {
  printLoggingConsistencyMetrics(getLoggingConsistencyMetrics());
}
