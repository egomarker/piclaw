import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { SessionManager, SettingsManager } from "@earendil-works/pi-coding-agent";
import type { AssistantMessage } from "@earendil-works/pi-ai";
import { setEnv } from "../helpers.js";
import { createRealTestModelServices } from "../model-services-fixture.js";
import { createSessionInDir } from "../../src/agent-pool/session.js";

function assistant(text: string): AssistantMessage {
  return {
    role: "assistant", content: [{ type: "text", text }], api: "openai-responses",
    provider: "openai", model: "gpt-4o", stopReason: "stop", timestamp: 1_000,
    usage: { input: 10, output: 5, cacheRead: 0, cacheWrite: 0, totalTokens: 15,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
  };
}

function seedLargeHistory(manager: SessionManager) {
  manager.appendModelChange("openai", "gpt-4.1");
  manager.appendThinkingLevelChange("off");
  manager.appendMessage({ role: "system", content: "Fixture checkpoint prompt", timestamp: 1_000,
    sections: { preamble: "Fixture checkpoint prompt", cwd: manager.getCwd() }, toolsAdded: [] });
  const firstUser = manager.appendMessage({ role: "user", content: "Historical request", timestamp: 1_000 });
  for (let index = 0; index < 12; index++) manager.appendMessage(assistant(`${index}: ${"history ".repeat(8_500)}`));
  const keptUser = manager.appendMessage({ role: "user", content: "Retained request", timestamp: 2_000 });
  manager.appendMessage(assistant("Retained answer"));
  const omitted = manager.appendMessage({ role: "user", content: "Omit from model context only", timestamp: 2_000 });
  manager.appendContextEdit(omitted, null);
  return { firstUser, keptUser, omitted };
}

describe("canonical session compaction trimming", () => {
  for (const retainNone of [false, true]) {
    test(`preload trim preserves ${retainNone ? "retain-none" : "retained suffix"} checkpoints, edits and a cumulative archive`, async () => {
      const root = mkdtempSync(join(tmpdir(), "piclaw-canonical-trim-"));
      const workspaceDir = join(root, "workspace");
      const sessionDir = join(root, "sessions");
      mkdirSync(workspaceDir, { recursive: true });
      const restoreEnv = setEnv({ PICLAW_WORKSPACE: workspaceDir });
      try {
        const manager = SessionManager.create(workspaceDir, sessionDir);
        const { keptUser } = seedLargeHistory(manager);
        const compaction = manager.appendCompaction("Canonical checkpoint", retainNone ? null : keptUser, 90_000);
        // Keep explicit selections in the retained suffix. If they exist only
        // in the dropped prefix, the safe comparison must refuse the trim.
        manager.appendModelChange("openai", "gpt-4.1");
        manager.appendThinkingLevelChange("off");
        manager.appendUsage("fixture_usage", "openai", "gpt-4o", assistant("usage").usage);
        manager.appendMessage({ role: "user", content: "Continue after checkpoint", timestamp: 3_000 });
        const beforeContext = manager.buildSessionContext();
        const file = manager.getSessionFile()!;
        const original = readFileSync(file, "utf8");
        expect(statSync(file).size).toBeGreaterThan(512 * 1024);
        const { modelRuntime } = await createRealTestModelServices(join(root, "agent"));
        const runtime = await createSessionInDir(sessionDir, { modelRuntime, settingsManager: SettingsManager.inMemory(), tools: [] });
        try {
          const after = readFileSync(file, "utf8");
          expect(after.length).toBeLessThan(original.length / 2);
          expect(runtime.session.sessionManager.buildSessionContext()).toEqual(beforeContext);
          const entries = runtime.session.sessionManager.getEntries();
          expect(entries.find((entry) => entry.id === compaction)).toMatchObject({
            type: "compaction", firstKeptEntryId: retainNone ? compaction : keptUser,
            systemMessage: { role: "system", content: "Fixture checkpoint prompt" },
          });
          expect(JSON.stringify(beforeContext.messages)).not.toContain("fixture_usage");
          expect(JSON.stringify(beforeContext.messages)).not.toContain("Omit from model context only");
          const archivePath = join(sessionDir, "archive", basename(file));
          expect(readFileSync(archivePath, "utf8")).toBe(original);

          // A second destructive trim must merge newer history, not replace the
          // first archive with an already-trimmed fragment.
          const current = runtime.session.sessionManager;
          for (let index = 0; index < 12; index++) current.appendMessage(assistant(`new ${index}: ${"new history ".repeat(6_500)}`));
          current.appendCompaction("Second checkpoint", null, 85_000);
          current.appendModelChange("openai", "gpt-4.1");
          current.appendThinkingLevelChange("off");
          const secondContext = current.buildSessionContext();
          const secondBefore = readFileSync(file, "utf8");
          await runtime.dispose();
          const resumed = await createSessionInDir(sessionDir, { modelRuntime, settingsManager: SettingsManager.inMemory(), tools: [] });
          try {
            expect(resumed.session.sessionManager.buildSessionContext()).toEqual(secondContext);
            expect(statSync(file).size).toBeLessThan(secondBefore.length / 2);
            const archive = readFileSync(archivePath, "utf8");
            expect(archive.startsWith(original)).toBe(true);
            expect(archive).toContain("Second checkpoint");
            expect(archive).toContain("new 11:");
          } finally {
            await resumed.dispose();
          }
        } finally {
          await runtime.dispose();
        }
      } finally {
        restoreEnv();
        rmSync(root, { recursive: true, force: true });
      }
    }, 30_000);
  }

  for (const scenario of ["model selection", "branch ancestry", "extension state"] as const) {
    test(`preload refuses a trim that would lose ${scenario}`, async () => {
      const root = mkdtempSync(join(tmpdir(), "piclaw-canonical-trim-skip-"));
      const workspaceDir = join(root, "workspace");
      const sessionDir = join(root, "sessions");
      mkdirSync(workspaceDir, { recursive: true });
      const restoreEnv = setEnv({ PICLAW_WORKSPACE: workspaceDir });
      try {
        const manager = SessionManager.create(workspaceDir, sessionDir);
        if (scenario === "extension state") manager.appendCustomEntry("fixture_state", { routing: "preserve this branch state" });
        const { firstUser, keptUser } = seedLargeHistory(manager);
        manager.appendCompaction("Checkpoint on the previous branch", keptUser, 90_000);
        if (scenario === "branch ancestry") {
          manager.branch(firstUser);
          manager.appendMessage({ role: "user", content: "Alternate branch request", timestamp: 3_000 });
        } else if (scenario === "extension state") {
          manager.appendModelChange("openai", "gpt-4.1");
          manager.appendThinkingLevelChange("off");
        }
        const beforeContext = manager.buildSessionContext();
        const file = manager.getSessionFile()!;
        const original = readFileSync(file, "utf8");
        const { modelRuntime } = await createRealTestModelServices(join(root, "agent"));
        const runtime = await createSessionInDir(sessionDir, { modelRuntime, settingsManager: SettingsManager.inMemory(), tools: [] });
        try {
          expect(readFileSync(file, "utf8")).toBe(original);
          expect(runtime.session.sessionManager.buildSessionContext()).toEqual(beforeContext);
          // Assistant messages identify the physical responder, not the
          // explicit selection. The latter must survive on the active branch.
          expect(runtime.session.sessionManager.getBranch().filter((entry) => entry.type === "model_change").at(-1))
            .toMatchObject({ provider: "openai", modelId: "gpt-4.1" });
          if (scenario === "extension state") {
            expect(runtime.session.sessionManager.getBranch().find((entry) => entry.type === "custom"))
              .toMatchObject({ customType: "fixture_state", data: { routing: "preserve this branch state" } });
          }
          if (scenario === "branch ancestry") expect(beforeContext.messages.at(-1)).toMatchObject({ role: "user", content: "Alternate branch request" });
        } finally {
          await runtime.dispose();
        }
      } finally {
        restoreEnv();
        rmSync(root, { recursive: true, force: true });
      }
    }, 30_000);
  }
});
