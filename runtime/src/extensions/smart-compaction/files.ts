/**
 * Extracted smart-compaction helper module.
 *
 * Keep this module focused; the public extension facade remains
 * ../smart-compaction.ts.
 */

import path from "node:path";
import type { FileOperations } from "@earendil-works/pi-coding-agent";
import type { ToolOutcomeAnalysis } from "./messages.js";

// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalize a file path: strip the workspace prefix so all paths are
 * workspace-relative. Tool calls record paths inconsistently — some
 * absolute (`/workspace/foo`), some relative (`foo`). Without this,
 * `compressFilePaths` can't find a common prefix and the output bloats.
 */
const CWD_PREFIX = process.cwd().endsWith("/") ? process.cwd() : process.cwd() + "/";
const WORKSPACE_PREFIX = "/workspace/";
const CWD_WORKSPACE_PREFIX = CWD_PREFIX.startsWith(WORKSPACE_PREFIX)
  ? CWD_PREFIX.slice(WORKSPACE_PREFIX.length)
  : "";

/** Normalize current tool/file-operation paths to workspace-relative form. */
function normalizePath(p: string): string {
  const resolved = path.isAbsolute(p)
    ? path.normalize(p)
    : CWD_WORKSPACE_PREFIX && p.startsWith(CWD_WORKSPACE_PREFIX)
      ? path.resolve(WORKSPACE_PREFIX, p)
      : path.resolve(process.cwd(), p);
  if (resolved.startsWith(WORKSPACE_PREFIX)) return resolved.slice(WORKSPACE_PREFIX.length);
  if (resolved.startsWith(CWD_PREFIX)) return resolved.slice(CWD_PREFIX.length);
  return resolved;
}

/** Persisted summary paths are already workspace-relative; keep that meaning. */
function normalizePersistedPath(p: string): string {
  if (p.startsWith("/")) return normalizePath(p);
  return path.posix.normalize(p.startsWith("./") ? p.slice(2) : p);
}

function normalizePathSet(paths: Iterable<string>): string[] {
  const seen = new Set<string>();
  for (const p of paths) {
    seen.add(normalizePath(p));
  }
  return [...seen];
}

/** Compute final read-only / modified file lists from FileOperations. */
function parseCompressedFileBlock(summary: string | undefined, tag: "read-files" | "modified-files"): Set<string> {
  const paths = new Set<string>();
  if (!summary) return paths;
  const match = summary.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!match) return paths;

  const addPersistedPath = (path: string) => {
    const normalized = normalizePersistedPath(path);
    paths.add(normalized);
    // Compatibility with summaries produced while a nested repository cwd was
    // treated as the path root. The alias is matching-only and is never emitted.
    if (CWD_WORKSPACE_PREFIX && !normalized.startsWith(CWD_WORKSPACE_PREFIX)) {
      paths.add(normalizePersistedPath(`${CWD_WORKSPACE_PREFIX}${normalized}`));
    }
  };

  let base = "";
  let sawGroupedEntryUnderBase = false;
  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.trim().replace(/^[-*]\s+/, "");
    if (!line || line === "(none)") continue;
    if (line.startsWith("base:")) {
      const declaredBase = line.slice("base:".length).trim();
      base = declaredBase === "./" ? "" : declaredBase;
      continue;
    }
    const grouped = line.match(/^(.*\/|\.\/):\s*(.+)$/);
    if (grouped) {
      const directory = grouped[1] === "./" ? "" : grouped[1];
      for (const file of grouped[2].split(",").map((part) => part.trim()).filter(Boolean)) {
        addPersistedPath(`${base}${directory}${file}`);
      }
      if (base) sawGroupedEntryUnderBase = true;
      continue;
    }
    addPersistedPath(line.startsWith("/") ? line : `${base}${line}`);
    // Compatibility for summaries emitted before compressed clusters inserted
    // `base: ./` before a root-level outlier. Those blocks are ambiguous, so
    // retain the root interpretation only after a genuine grouped base entry;
    // a lone base-relative singleton must not gain a workspace-root alias.
    if (base && sawGroupedEntryUnderBase && !line.startsWith("/")) {
      addPersistedPath(line);
    }
  }
  return paths;
}

/**
 * Remove write/edit paths that only have failed, missing, or no-change results
 * in the current compaction window. Paths inherited from an earlier valid
 * summary, or successfully modified at least once in this window, are retained.
 */
export function reconcileFileOperations(
  fileOps: FileOperations,
  toolAnalysis: ToolOutcomeAnalysis,
  previousSummary?: string,
): FileOperations {
  const priorModified = parseCompressedFileBlock(previousSummary, "modified-files");
  const attemptedMutationPaths = new Set<string>();
  const successfulMutationPaths = new Set<string>();

  for (const fact of toolAnalysis.facts) {
    if ((fact.toolName !== "write" && fact.toolName !== "edit") || !fact.pathArgument) continue;
    const path = normalizePath(fact.pathArgument);
    attemptedMutationPaths.add(path);
    if (!fact.missing && !fact.isError && !fact.noChange) successfulMutationPaths.add(path);
  }

  const shouldKeepMutation = (path: string): boolean => {
    const normalized = normalizePath(path);
    return !attemptedMutationPaths.has(normalized)
      || successfulMutationPaths.has(normalized)
      || priorModified.has(normalized);
  };

  return {
    read: new Set(fileOps.read),
    written: new Set([...fileOps.written].filter(shouldKeepMutation)),
    edited: new Set([...fileOps.edited].filter(shouldKeepMutation)),
  };
}

export function fileListsFromOps(fileOps: FileOperations): {
  readFiles: string[];
  modifiedFiles: string[];
} {
  const modified = new Set(filterJunkPaths(normalizePathSet([...fileOps.written, ...fileOps.edited])));
  const readOnly = filterJunkPaths(normalizePathSet([...fileOps.read]).filter((f) => !modified.has(f)));
  return { readFiles: readOnly, modifiedFiles: [...modified] };
}

/**
 * Filter out paths that are noise rather than meaningful project context.
 * These are temp files, device nodes, session logs, and similar paths that
 * clutter the read-files list without helping the LLM understand the project.
 */
const JUNK_PATH_PATTERNS: RegExp[] = [
  /^\/dev\//,                          // device nodes (/dev/stdin, /dev/null)
  /^\/var\/log\//,                     // host log files
  /^\/proc\//,                         // proc filesystem
  /^\/sys\//,                          // sys filesystem
  /(?:^|\/)tmp\//,                    // host, workspace, or nested-repo tmp/
  /(?:^|\/)\.piclaw\/tmp\//,          // piclaw temp files
  /(?:^|\/)\.cache\//,                // cache dirs
  /(?:^|\/)node_modules\//,           // dependency trees
  /(?:^|\/)\.pi\/agent\/sessions\//,  // pi session files
  /(?:^|\/)\.pi\/agent\/models\.json$/, // pi model config
  /(?:^|\/)\.pi\/agent\/settings\.json$/, // pi settings
  /(?:^|\/)bun\.lock$/,               // lockfiles
  /(?:^|\/)package-lock\.json$/,
  /\.jsonl$/,                          // session/log jsonl files
  /\.wasm$/,                           // binary blobs
  /\.map$/,                            // source maps
  /\.min\.js$/,                        // minified bundles
  /\.bundle\.(js|css)$/,               // bundles
  /\.meta\.json$/,                     // meta files
];

/**
 * Find the longest common directory prefix for a set of paths.
 * Returns a prefix ending in `/`, or an empty string when no shared
 * directory prefix exists.
 */
function findCommonDirectoryPrefix(paths: string[]): string {
  if (paths.length === 0) return "";
  let prefix = paths[0];
  for (let i = 1; i < paths.length; i++) {
    while (!paths[i].startsWith(prefix)) {
      const slash = prefix.lastIndexOf("/", prefix.length - 2);
      if (slash < 0) return "";
      prefix = prefix.slice(0, slash + 1);
    }
  }
  return prefix;
}

/**
 * Group paths by their top-level root so unrelated outliers (`tmp/...`)
 * do not destroy compression for the main cluster (`piclaw/...`).
 */
function topLevelPathKey(path: string): string {
  if (!path.includes("/")) return "";
  if (path.startsWith("/")) {
    const trimmed = path.slice(1);
    const slash = trimmed.indexOf("/");
    return slash >= 0 ? `/${trimmed.slice(0, slash + 1)}` : path;
  }
  const slash = path.indexOf("/");
  return slash >= 0 ? path.slice(0, slash + 1) : "";
}

/** Render a single compressed path cluster. */
function renderCompressedPathCluster(paths: string[]): string {
  if (paths.length === 0) return "(none)";
  const sorted = [...paths].sort();
  const prefix = findCommonDirectoryPrefix(sorted);
  // Grouped entries use commas as separators. Keep comma-bearing filenames on
  // individual lines so persisted file facts remain reversible.
  if (sorted.some((filePath) => path.posix.basename(filePath).includes(","))) {
    const lines = prefix ? [`base: ${prefix}`] : [];
    lines.push(...sorted.map((filePath) => prefix ? filePath.slice(prefix.length) : filePath));
    return lines.join("\n");
  }

  const groups = new Map<string, string[]>();
  for (const p of sorted) {
    const rel = prefix ? p.slice(prefix.length) : p;
    const lastSlash = rel.lastIndexOf("/");
    const dir = lastSlash >= 0 ? rel.slice(0, lastSlash + 1) : "";
    const file = lastSlash >= 0 ? rel.slice(lastSlash + 1) : rel;
    if (!groups.has(dir)) groups.set(dir, []);
    groups.get(dir)!.push(file);
  }

  const lines: string[] = [];
  if (prefix) lines.push(`base: ${prefix}`);
  for (const [dir, files] of [...groups.entries()].sort()) {
    if (files.length === 1) {
      lines.push(`${dir}${files[0]}`);
    } else {
      lines.push(`${dir || "./"}: ${files.join(", ")}`);
    }
  }
  return lines.join("\n");
}

/**
 * Compress a list of file paths by factoring out common prefixes and,
 * when needed, compressing multiple top-level clusters independently.
 *
 * Example:
 *   piclaw/runtime/web/src/ui/app.ts
 *   piclaw/runtime/web/src/ui/theme.ts
 *   piclaw/runtime/test/web/app.test.ts
 *   tmp/report.patch
 * →
 *   base: piclaw/runtime/
 *   web/src/ui/: app.ts, theme.ts
 *   test/web/: app.test.ts
 *   base: ./
 *   tmp/report.patch
 */
export function compressFilePaths(paths: string[]): string {
  if (paths.length === 0) return "(none)";
  const uniqueSorted = [...new Set(paths)].sort();
  if (uniqueSorted.length <= 3) return uniqueSorted.join("\n");

  const globalPrefix = findCommonDirectoryPrefix(uniqueSorted);
  if (globalPrefix) return renderCompressedPathCluster(uniqueSorted);

  const clusters = new Map<string, string[]>();
  for (const path of uniqueSorted) {
    const key = topLevelPathKey(path);
    if (!clusters.has(key)) clusters.set(key, []);
    clusters.get(key)!.push(path);
  }

  if (clusters.size <= 1) return renderCompressedPathCluster(uniqueSorted);

  const lines: string[] = [];
  let activeBase = false;
  for (const key of [...clusters.keys()].sort()) {
    const cluster = clusters.get(key)!;
    const rendered = cluster.length === 1 ? cluster[0] : renderCompressedPathCluster(cluster);
    const declaresBase = /^base:\s+/m.test(rendered);
    if (!declaresBase && activeBase) {
      // Delimit a following root-relative cluster so the parser cannot inherit
      // the previous compressed cluster's base prefix.
      lines.push("base: ./");
      activeBase = false;
    }
    lines.push(rendered);
    if (declaresBase) activeBase = true;
  }
  return lines.join("\n");
}

export function filterJunkPaths(paths: string[]): string[] {
  return paths.filter((p) => !JUNK_PATH_PATTERNS.some((re) => re.test(p)));
}
