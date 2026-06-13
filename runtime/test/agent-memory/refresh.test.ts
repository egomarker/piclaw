import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

function writeDailyNote(workspace: string, date: string, summary: string) {
  const dir = join(workspace, "notes", "daily");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${date}.md`), `---\ndate: ${date}\nsummarised_until: ${date}T23:59:59.000Z\nmessages_total: 4\nmessages_user: 2\nmessages_assistant: 2\nsession_trees: 1\nsession_chats: 1\nfirst_message: ${date}T12:00:00.000Z\nlast_message: ${date}T12:15:00.000Z\nscope_mode: all-web-session-trees\nscope_anchor: web:default\n---\n# ${date}\n\n## Summary\n\n${summary}\n`, "utf8");
}

function isoDateDaysAgo(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 24 * 3_600_000).toISOString().slice(0, 10);
}

test("refresh keeps notes/memory/days sparse by default and only indexes sparse day files when they already exist", async () => {
  const base = mkdtempSync(join(tmpdir(), "piclaw-refresh-sparse-"));
  const store = join(base, "store");
  const data = join(base, "data");
  mkdirSync(store, { recursive: true });
  mkdirSync(data, { recursive: true });

  try {
    const recentDate = isoDateDaysAgo(1);
    writeDailyNote(base, recentDate, "Infra tooling and memory maintenance landed.");

    const script = `
      import { initDatabase, storeMessage } from ${JSON.stringify(new URL("../../src/db.js", import.meta.url).pathname)};
      import { refreshAgentMemoryFromDailyNotes } from ${JSON.stringify(new URL("../../src/agent-memory/refresh.js", import.meta.url).pathname)};
      initDatabase();
      storeMessage({
        id: 'msg-' + Date.now(),
        chat_jid: 'web:default',
        sender: 'user',
        sender_name: 'You',
        content: 'database, not just daily-note summaries',
        timestamp: '${recentDate}T12:10:00.000Z',
        is_bot_message: false,
      });
      refreshAgentMemoryFromDailyNotes({ recentDays: 7 });
    `;

    const env = {
      ...process.env,
      PICLAW_WORKSPACE: base,
      PICLAW_STORE: store,
      PICLAW_DATA: data,
      PICLAW_DB_IN_MEMORY: "1",
    };

    let proc = Bun.spawnSync([process.execPath, "-e", script], { env, stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode).toBe(0);

    const sparsePath = join(base, "notes", "memory", "days", `${recentDate}.md`);
    expect(await Bun.file(sparsePath).exists()).toBe(false);
    let memoryIndex = readFileSync(join(base, "notes", "memory", "MEMORY.md"), "utf8");
    expect(memoryIndex).toContain(`[${recentDate}](../daily/${recentDate}.md)`);

    mkdirSync(join(base, "notes", "memory", "days"), { recursive: true });
    writeFileSync(sparsePath, `# ${recentDate}\n\n## Durable takeaways\n\n- Custom sparse memory file.\n`, "utf8");

    proc = Bun.spawnSync([process.execPath, "-e", script], { env, stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode).toBe(0);
    expect(readFileSync(sparsePath, "utf8")).toContain("Custom sparse memory file");
    memoryIndex = readFileSync(join(base, "notes", "memory", "MEMORY.md"), "utf8");
    expect(memoryIndex).toContain(`[${recentDate}](days/${recentDate}.md)`);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("refreshAgentMemoryFromDailyNotes uses all-chats scope when a daily note is anchored to *", () => {
  const base = mkdtempSync(join(tmpdir(), "piclaw-refresh-all-chats-"));
  const store = join(base, "store");
  const data = join(base, "data");
  mkdirSync(store, { recursive: true });
  mkdirSync(data, { recursive: true });

  try {
    const recentDate = isoDateDaysAgo(1);
    const dailyDir = join(base, "notes", "daily");
    mkdirSync(dailyDir, { recursive: true });
    writeFileSync(
      join(dailyDir, `${recentDate}.md`),
      `---\ndate: ${recentDate}\nsummarised_until: ${recentDate}T18:30:00.000Z\nmessages_total: 2\nmessages_user: 1\nmessages_assistant: 1\nsession_trees: 1\nsession_chats: 1\nfirst_message: ${recentDate}T14:47:53.547Z\nlast_message: ${recentDate}T15:04:59.757Z\nscope_mode: all-chats\nscope_anchor: *\n---\n# ${recentDate}\n\n## Summary\n\nFull code review of the mycare project was discussed.\n`,
      "utf8",
    );

    const script = `
      import { initDatabase, storeMessage } from ${JSON.stringify(new URL("../../src/db.js", import.meta.url).pathname)};
      import { refreshAgentMemoryFromDailyNotes } from ${JSON.stringify(new URL("../../src/agent-memory/refresh.js", import.meta.url).pathname)};
      initDatabase();
      storeMessage({
        id: 'user-1',
        chat_jid: 'mc-review',
        sender: 'user',
        sender_name: 'You',
        content: 'do a full thorough code review of mycare project in workspace and write detailed report about issues that were found.',
        timestamp: '${recentDate}T14:47:53.547Z',
        is_bot_message: false,
      });
      storeMessage({
        id: 'agent-1',
        chat_jid: 'mc-review',
        sender: 'agent',
        sender_name: 'Assistant',
        content: "Here's the full code review report.",
        timestamp: '${recentDate}T15:04:59.757Z',
        is_bot_message: true,
        is_terminal_agent_reply: true,
      });
      refreshAgentMemoryFromDailyNotes({ recentDays: 7 });
    `;

    const env = {
      ...process.env,
      PICLAW_WORKSPACE: base,
      PICLAW_STORE: store,
      PICLAW_DATA: data,
      PICLAW_DB_IN_MEMORY: "1",
    };

    const proc = Bun.spawnSync([process.execPath, "-e", script], { env, stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode, proc.stderr.toString()).toBe(0);

    const feedback = readFileSync(join(base, "notes", "memory", "feedback.md"), "utf8");
    const project = readFileSync(join(base, "notes", "memory", "project.md"), "utf8");
    expect(feedback).toContain("[mc-review] do a full thorough code review of mycare project");
    expect(project).toContain("[mc-review] Here's the full code review report.");
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});
