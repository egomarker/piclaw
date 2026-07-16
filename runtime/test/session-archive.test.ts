import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mergeSessionJsonlSnapshots, writeMergedSessionArchive } from "../src/session-archive.js";

let cleanupDir: string | null = null;
afterEach(() => {
  if (cleanupDir) rmSync(cleanupDir, { recursive: true, force: true });
  cleanupDir = null;
});

const line = (id: string, type = "message") => JSON.stringify({ type, id, parentId: null });

describe("session archive merging", () => {
  it("preserves chronological entries while deduplicating an overlapping trimmed suffix", () => {
    const older = `${line("session", "session")}\n${line("old")}\n${line("overlap")}\n`;
    const newer = `${line("session", "session")}\n${line("overlap")}\n${line("new")}\n`;

    const ids = mergeSessionJsonlSnapshots(older, newer)
      .trim()
      .split("\n")
      .map((entry) => JSON.parse(entry).id);

    expect(ids).toEqual(["session", "old", "overlap", "new"]);
  });

  it("updates a cumulative archive atomically across repeated trims", () => {
    cleanupDir = mkdtempSync(join(tmpdir(), "piclaw-session-archive-"));
    const archivePath = join(cleanupDir, "archive", "session.jsonl");
    const firstSource = join(cleanupDir, "first.jsonl");
    const secondSource = join(cleanupDir, "second.jsonl");
    writeFileSync(firstSource, `${line("session", "session")}\n${line("old")}\n${line("kept")}\n`);
    writeFileSync(secondSource, `${line("session", "session")}\n${line("kept")}\n${line("between-trims")}\n`);

    writeMergedSessionArchive(firstSource, archivePath);
    writeMergedSessionArchive(secondSource, archivePath, archivePath);

    const ids = readFileSync(archivePath, "utf8")
      .trim()
      .split("\n")
      .map((entry) => JSON.parse(entry).id);
    expect(ids).toEqual(["session", "old", "kept", "between-trims"]);
  });
});
