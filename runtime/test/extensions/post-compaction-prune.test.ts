import { describe, expect, test } from "bun:test";
import { pruneCompactedSessionEntries } from "../../src/extensions/post-compaction-prune.js";

type Entry = { type: string; id: string; parentId?: string | null; message?: unknown };

function makeManager(fileEntries: Entry[], activeLeafId: string, exposeBranch = true) {
  const byId = new Map(fileEntries.map((entry) => [entry.id, entry]));
  const getBranch = () => {
    const branch: Entry[] = [];
    let current = byId.get(activeLeafId);
    while (current) {
      branch.push(current);
      current = current.parentId ? byId.get(current.parentId) : undefined;
    }
    return branch.reverse();
  };
  return {
    fileEntries,
    byId,
    ...(exposeBranch ? { getBranch } : {}),
  };
}

describe("post-compaction memory pruning", () => {
  test("tombstones only superseded entries on a linear active branch", () => {
    const entries: Entry[] = [
      { type: "message", id: "old-user", parentId: null, message: { role: "user", content: "old" } },
      { type: "message", id: "old-assistant", parentId: "old-user", message: { role: "assistant", content: "old" } },
      { type: "model_change", id: "kept-metadata", parentId: "old-assistant" },
      { type: "message", id: "kept-user", parentId: "kept-metadata", message: { role: "user", content: "current" } },
      { type: "compaction", id: "compact", parentId: "kept-user" },
    ];
    const manager = makeManager(entries, "compact");

    expect(pruneCompactedSessionEntries(manager, "kept-metadata")).toBe(2);
    expect(manager.byId.get("old-user")).toEqual({ type: "pruned", id: "old-user", parentId: null });
    expect(manager.byId.get("old-assistant")).toEqual({ type: "pruned", id: "old-assistant", parentId: "old-user" });
    expect(manager.byId.get("kept-metadata")).toBe(entries[2]);
    expect(manager.byId.get("kept-user")).toBe(entries[3]);
  });

  test("preserves alternate-branch entries and every active ancestor they require", () => {
    const root: Entry = { type: "message", id: "root", parentId: null, message: { role: "user", content: "root" } };
    const fork: Entry = { type: "message", id: "fork", parentId: "root", message: { role: "assistant", content: "fork" } };
    const activeOnly: Entry = { type: "message", id: "active-only", parentId: "fork", message: { role: "assistant", content: "active" } };
    const side: Entry = { type: "message", id: "side", parentId: "fork", message: { role: "user", content: "side" } };
    const kept: Entry = { type: "message", id: "kept", parentId: "active-only", message: { role: "user", content: "kept" } };
    const compact: Entry = { type: "compaction", id: "compact", parentId: "kept" };
    // File order intentionally places the side branch before firstKeptEntryId;
    // global-index pruning would destroy it.
    const entries = [root, fork, activeOnly, side, kept, compact];
    const manager = makeManager(entries, "compact");

    expect(pruneCompactedSessionEntries(manager, "kept")).toBe(1);
    expect(manager.byId.get("root")).toBe(root);
    expect(manager.byId.get("fork")).toBe(fork);
    expect(manager.byId.get("side")).toBe(side);
    expect(manager.byId.get("active-only")).toEqual({
      type: "pruned",
      id: "active-only",
      parentId: "fork",
    });
  });

  test("refuses unsafe file-order pruning when the active branch is unavailable", () => {
    const entries: Entry[] = [
      { type: "message", id: "old", parentId: null, message: { role: "user", content: "old" } },
      { type: "message", id: "kept", parentId: "old", message: { role: "user", content: "kept" } },
    ];
    const manager = makeManager(entries, "kept", false);

    expect(pruneCompactedSessionEntries(manager, "kept")).toBe(0);
    expect(manager.byId.get("old")).toBe(entries[0]);
  });
});
