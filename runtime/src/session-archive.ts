import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { createLogger, debugSuppressedError } from "./utils/logger.js";

const log = createLogger("session-archive");

function sessionLineId(line: string): string | null {
  try {
    const parsed = JSON.parse(line) as { id?: unknown };
    return typeof parsed?.id === "string" && parsed.id ? parsed.id : null;
  } catch {
    return null;
  }
}

/**
 * Merge two append-only session JSONL snapshots without duplicating entries.
 *
 * The older snapshot comes first so parent entries always precede descendants.
 * Malformed/id-less lines are retained unless they are byte-identical, because
 * preserving questionable persisted data is safer than silently discarding it.
 */
export function mergeSessionJsonlSnapshots(olderContent: string, newerContent: string): string {
  const olderLines = olderContent.split("\n").filter((line) => line.length > 0);
  const newerLines = newerContent.split("\n").filter((line) => line.length > 0);
  const merged = [...olderLines];
  const seenIds = new Set(olderLines.map(sessionLineId).filter((id): id is string => id !== null));
  const seenIdlessLines = new Set(olderLines.filter((line) => sessionLineId(line) === null));

  for (const line of newerLines) {
    const id = sessionLineId(line);
    if (id) {
      if (seenIds.has(id)) continue;
      seenIds.add(id);
    } else {
      if (seenIdlessLines.has(line)) continue;
      seenIdlessLines.add(line);
    }
    merged.push(line);
  }

  return merged.length > 0 ? `${merged.join("\n")}\n` : "";
}

/** Atomically write a source session merged with an optional older archive. */
export function writeMergedSessionArchive(
  sourcePath: string,
  destinationPath: string,
  olderArchivePath?: string,
): void {
  const sourceContent = readFileSync(sourcePath, "utf8");
  const olderContent = olderArchivePath && existsSync(olderArchivePath)
    ? readFileSync(olderArchivePath, "utf8")
    : "";
  const mergedContent = olderContent
    ? mergeSessionJsonlSnapshots(olderContent, sourceContent)
    : sourceContent;
  mkdirSync(dirname(destinationPath), { recursive: true });
  const tmpPath = `${destinationPath}.merge-${process.pid}-${Date.now()}.tmp`;
  try {
    writeFileSync(tmpPath, mergedContent, "utf8");
    renameSync(tmpPath, destinationPath);
  } finally {
    try {
      rmSync(tmpPath, { force: true });
    } catch (error) {
      debugSuppressedError(log, "Failed to clean up temporary merged session archive", error, { tmpPath });
    }
  }
}
