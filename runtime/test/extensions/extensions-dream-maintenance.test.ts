import { beforeEach, afterEach, describe, expect, test } from "bun:test";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import "../helpers.js";
import { withTempWorkspaceEnv, importFresh } from "../helpers.js";

function writeDailyNote(workspace: string, date: string, summary: string | null) {
  const dir = join(workspace, "notes/daily");
  mkdirSync(dir, { recursive: true });
  const body = summary ? summary : "<!-- NEEDS_SUMMARY -->";
  writeFileSync(join(dir, `${date}.md`), `---\ndate: ${date}\nsummarised_until: ${summary ? `${date}T23:59:59.000Z` : ""}\nmessages_total: 4\nmessages_user: 2\nmessages_assistant: 2\nsession_trees: 1\nsession_chats: 1\nfirst_message: ${date}T12:00:00.000Z\nlast_message: ${date}T12:15:00.000Z\nscope_mode: all-web-session-trees\nscope_anchor: web:default\n---\n# ${date}\n\n## Summary\n\n${body}\n`, "utf8");
}

type CommandEntry = { name: string; handler: (args: string) => Promise<void> };

function createFakeApi() {
  const commands = new Map<string, CommandEntry>();
  const messages: Array<{ customType: string; content: string; display: boolean }> = [];
  const userMessages: unknown[] = [];

  const api: ExtensionAPI = {
    on() {},
    registerTool() {},
    registerCommand(name: string, options: any) {
      commands.set(name, { name, handler: options.handler });
    },
    registerShortcut() {},
    registerFlag() {},
    getFlag() { return undefined; },
    registerMessageRenderer() {},
    sendMessage(msg: any) { messages.push(msg); },
    sendUserMessage(msg: any) { userMessages.push(msg); },
    appendEntry() {},
    setSessionName() {},
    getSessionName() { return undefined; },
    setLabel() {},
    exec: async () => ({ exitCode: 0, stdout: "", stderr: "" }),
    getActiveTools: () => [],
    getAllTools: () => [],
    setActiveTools() {},
    getCommands: () => [],
    setModel: async () => true,
    getThinkingLevel: () => "off" as any,
    setThinkingLevel() {},
    registerProvider() {},
    unregisterProvider() {},
  } as unknown as ExtensionAPI;

  return { api, commands, messages, userMessages };
}

describe("dream maintenance extension", () => {
  beforeEach(() => {
    process.env.PICLAW_DB_IN_MEMORY = "1";
  });

  afterEach(() => {
    delete process.env.PICLAW_DB_IN_MEMORY;
  });

  test("registers /dream", async () => {
    await withTempWorkspaceEnv("piclaw-dream-ext-", {}, async (ws) => {
      writeDailyNote(ws.workspace, "2026-04-04", "SSH surface was finalised and validated.");
      writeDailyNote(ws.workspace, "2026-04-05", null);

      const mod = await importFresh<typeof import("../src/extensions/dream-maintenance.js")>("../src/extensions/dream-maintenance.js");
      const fake = createFakeApi();
      mod.dreamMaintenance(fake.api);

      expect(fake.commands.has("dream")).toBe(true);
      expect(fake.messages.length).toBe(0);
    });
  });

  test("queues an out-of-band dream run without injecting a user message", async () => {
    await withTempWorkspaceEnv("piclaw-dream-ext-queue-", {}, async (ws) => {
      const mod = await importFresh<typeof import("../src/extensions/dream-maintenance.js")>("../src/extensions/dream-maintenance.js");
      const fake = createFakeApi();
      mod.dreamMaintenance(fake.api);

      await fake.commands.get("dream")!.handler("14");
      expect(fake.userMessages.length).toBe(0);
      expect(fake.messages[0].content).toContain("Dream queued in the background");
      const tasksDir = join(ws.data, "ipc", "tasks");
      const files = Bun.spawnSync(["bash", "-lc", `ls -1 ${JSON.stringify(tasksDir)}`], { stdout: "pipe", stderr: "pipe" }).stdout.toString().trim().split(/\n+/).filter(Boolean);
      expect(files.length).toBe(1);
      const payload = JSON.parse(readFileSync(join(tasksDir, files[0]), "utf8"));
      expect(payload.type).toBe("run_dream");
      expect(payload.mode).toBe("manual");
      expect(payload.days).toBe(14);
    });
  });

  test("shows usage for invalid arguments", async () => {
    await withTempWorkspaceEnv("piclaw-dream-ext-usage-", {}, async () => {
      const mod = await importFresh<typeof import("../src/extensions/dream-maintenance.js")>("../src/extensions/dream-maintenance.js");
      const fake = createFakeApi();
      mod.dreamMaintenance(fake.api);

      await fake.commands.get("dream")!.handler("nonsense");
      expect(fake.messages[0].content).toContain("Usage: /dream [days]");
    });
  });
});
