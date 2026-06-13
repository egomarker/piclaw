import { expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const DB_MODULE = new URL("../../src/db.js", import.meta.url).pathname;
const DAILY_NOTES_MODULE = new URL("../../src/agent-memory/daily-notes.js", import.meta.url).pathname;

function isoDateDaysAgo(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 24 * 3_600_000).toISOString().slice(0, 10);
}

function makeEnv(base: string): Record<string, string | undefined> {
  return {
    ...process.env,
    PICLAW_WORKSPACE: base,
    PICLAW_STORE: join(base, "store"),
    PICLAW_DATA: join(base, "data"),
    PICLAW_DB_IN_MEMORY: "1",
  };
}

function makeTempWorkspace(prefix: string): string {
  const base = mkdtempSync(join(tmpdir(), prefix));
  mkdirSync(join(base, "store"), { recursive: true });
  mkdirSync(join(base, "data"), { recursive: true });
  return base;
}

test("refreshDailyNotesFromMessages adds a visible incomplete warning to new unsummarised notes", () => {
  const base = makeTempWorkspace("piclaw-daily-notes-warning-");
  try {
    const day = isoDateDaysAgo(1);
    const userTs = `${day}T10:00:00.000Z`;
    const agentTs = `${day}T10:05:00.000Z`;

    const script = `
      import { initDatabase, storeMessage } from ${JSON.stringify(DB_MODULE)};
      import { refreshDailyNotesFromMessages } from ${JSON.stringify(DAILY_NOTES_MODULE)};
      initDatabase();
      storeMessage({
        id: 'user-1',
        chat_jid: 'web:default',
        sender: 'user',
        sender_name: 'You',
        content: 'hello',
        timestamp: '${userTs}',
        is_bot_message: false,
      });
      storeMessage({
        id: 'agent-1',
        chat_jid: 'web:default',
        sender: 'agent',
        sender_name: 'Smith',
        content: 'hi',
        timestamp: '${agentTs}',
        is_bot_message: true,
        is_terminal_agent_reply: true,
      });
      const out = refreshDailyNotesFromMessages({ chatJid: '*', days: 7 });
      console.log(JSON.stringify({ created: out.created }));
    `;

    const proc = Bun.spawnSync([process.execPath, "-e", script], { env: makeEnv(base), stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode, proc.stderr.toString()).toBe(0);
    const result = JSON.parse(proc.stdout.toString().trim().split("\n").pop()!);
    expect(result.created).toBe(1);

    const notePath = join(base, "notes", "daily", `${day}.md`);
    expect(existsSync(notePath)).toBe(true);
    const note = readFileSync(notePath, "utf8");
    expect(note).toContain("> ⚠ **Incomplete daily note**");
    expect(note).toContain(`Latest message currently on file: \`${agentTs}\`.`);
    expect(note).toContain("<!-- DREAM_CUES");
    expect(note).toContain(`slice: ${userTs}..${agentTs}`);
    expect(note).toContain("bounded_full_slice: yes");
    expect(note).toContain("hello");
    expect(note).toContain("<!-- NEEDS_SUMMARY -->");
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("inspectDailyNoteSummaryBacklog reports message days with missing daily note files", async () => {
  const base = makeTempWorkspace("piclaw-daily-notes-missing-backlog-");
  try {
    const day = isoDateDaysAgo(2);
    const userTs = `${day}T10:00:00.000Z`;
    const script = `
      import { initDatabase, storeMessage } from ${JSON.stringify(DB_MODULE)};
      import { inspectDailyNoteSummaryBacklog } from ${JSON.stringify(DAILY_NOTES_MODULE)};
      initDatabase();
      storeMessage({
        id: 'user-1',
        chat_jid: 'web:default',
        sender: 'user',
        sender_name: 'You',
        content: 'missing day should be backfilled',
        timestamp: '${userTs}',
        is_bot_message: false,
      });
      console.log(JSON.stringify(inspectDailyNoteSummaryBacklog({ recentDays: 7 })));
    `;
    const proc = Bun.spawnSync([process.execPath, "-e", script], { env: makeEnv(base), stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode, proc.stderr.toString()).toBe(0);
    const result = JSON.parse(proc.stdout.toString().trim().split("\n").pop()!);
    expect(result).toMatchObject({ unsummarised: 0, partial: 0, missing_watermark: 0, missing: 1, dates: [day] });
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("refreshDailyNotesFromMessages materializes all missing past days in the requested window", async () => {
  const base = makeTempWorkspace("piclaw-daily-notes-missing-refresh-");
  try {
    const olderDay = isoDateDaysAgo(3);
    const newerDay = isoDateDaysAgo(1);
    const olderTs = `${olderDay}T10:00:00.000Z`;
    const newerTs = `${newerDay}T10:00:00.000Z`;
    const script = `
      import { initDatabase, storeMessage } from ${JSON.stringify(DB_MODULE)};
      import { refreshDailyNotesFromMessages } from ${JSON.stringify(DAILY_NOTES_MODULE)};
      initDatabase();
      storeMessage({
        id: 'older-user',
        chat_jid: 'web:default',
        sender: 'user',
        sender_name: 'You',
        content: 'older missing day',
        timestamp: '${olderTs}',
        is_bot_message: false,
      });
      storeMessage({
        id: 'newer-user',
        chat_jid: 'web:default',
        sender: 'user',
        sender_name: 'You',
        content: 'newer missing day',
        timestamp: '${newerTs}',
        is_bot_message: false,
      });
      const out = refreshDailyNotesFromMessages({ chatJid: '*', days: 7 });
      console.log(JSON.stringify({ created: out.created, days: out.days }));
    `;
    const proc = Bun.spawnSync([process.execPath, "-e", script], { env: makeEnv(base), stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode, proc.stderr.toString()).toBe(0);
    const result = JSON.parse(proc.stdout.toString().trim().split("\n").pop()!);
    expect(result.created).toBe(2);
    expect(result.days).toEqual([olderDay, newerDay]);
    expect(existsSync(join(base, "notes", "daily", `${olderDay}.md`))).toBe(true);
    expect(existsSync(join(base, "notes", "daily", `${newerDay}.md`))).toBe(true);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("inspectDailyNoteSummaryBacklog reports unfinished seeded notes", async () => {
  const base = makeTempWorkspace("piclaw-daily-notes-backlog-");
  try {
    const day = isoDateDaysAgo(1);
    mkdirSync(join(base, "notes", "daily"), { recursive: true });
    writeFileSync(
      join(base, "notes", "daily", `${day}.md`),
      `---\ndate: ${day}\nsummarised_until:\nmessages_total: 2\nmessages_user: 1\nmessages_assistant: 1\nsession_trees: 1\nsession_chats: 1\nfirst_message: ${day}T10:00:00.000Z\nlast_message: ${day}T10:05:00.000Z\nscope_mode: all-chats\nscope_anchor: *\n---\n# ${day}\n\n## Summary\n\n<!-- NEEDS_SUMMARY -->\n`,
      "utf8",
    );
    const script = `
      import { inspectDailyNoteSummaryBacklog } from ${JSON.stringify(DAILY_NOTES_MODULE)};
      console.log(JSON.stringify(inspectDailyNoteSummaryBacklog({ recentDays: 7 })));
    `;
    const proc = Bun.spawnSync([process.execPath, "-e", script], { env: makeEnv(base), stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode, proc.stderr.toString()).toBe(0);
    const result = JSON.parse(proc.stdout.toString().trim().split("\n").pop()!);
    expect(result).toMatchObject({ unsummarised: 1, partial: 0, missing_watermark: 0, dates: [day] });
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("refreshDailyNotesFromMessages adds an incomplete warning and summary update marker to stale notes", () => {
  const base = makeTempWorkspace("piclaw-daily-notes-stale-");
  try {
    const day = isoDateDaysAgo(1);
    const firstTs = `${day}T10:00:00.000Z`;
    const laterTs = `${day}T11:30:00.000Z`;

    // Pre-create a note with a summary covering only the first message
    mkdirSync(join(base, "notes", "daily"), { recursive: true });
    writeFileSync(
      join(base, "notes", "daily", `${day}.md`),
      `---\ndate: ${day}\nsummarised_until: ${firstTs}\nmessages_total: 1\nmessages_user: 1\nmessages_assistant: 0\nsession_trees: 1\nsession_chats: 1\nfirst_message: ${firstTs}\nlast_message: ${firstTs}\nscope_mode: all-chats\nscope_anchor: *\n---\n# ${day}\n\n## Summary\n\nEarlier summary.\n`,
      "utf8",
    );

    const script = `
      import { initDatabase, storeMessage } from ${JSON.stringify(DB_MODULE)};
      import { refreshDailyNotesFromMessages } from ${JSON.stringify(DAILY_NOTES_MODULE)};
      initDatabase();
      storeMessage({
        id: 'user-1',
        chat_jid: 'web:default',
        sender: 'user',
        sender_name: 'You',
        content: 'first',
        timestamp: '${firstTs}',
        is_bot_message: false,
      });
      storeMessage({
        id: 'agent-1',
        chat_jid: 'web:default',
        sender: 'agent',
        sender_name: 'Smith',
        content: 'later',
        timestamp: '${laterTs}',
        is_bot_message: true,
        is_terminal_agent_reply: true,
      });
      const out = refreshDailyNotesFromMessages({ chatJid: '*', days: 7 });
      console.log(JSON.stringify({ updated: out.updated }));
    `;

    const proc = Bun.spawnSync([process.execPath, "-e", script], { env: makeEnv(base), stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode, proc.stderr.toString()).toBe(0);
    const result = JSON.parse(proc.stdout.toString().trim().split("\n").pop()!);
    expect(result.updated).toBe(1);

    const note = readFileSync(join(base, "notes", "daily", `${day}.md`), "utf8");
    expect(note).toContain("> ⚠ **Incomplete daily note**");
    expect(note).toContain(`Summary currently covers messages only through \`${firstTs}\`.`);
    expect(note).toContain(`Latest message currently on file: \`${laterTs}\`.`);
    expect(note).toContain("<!-- DREAM_CUES");
    expect(note).toContain(`slice: ${firstTs}..${laterTs}`);
    expect(note).toContain("first");
    expect(note).toContain("later");
    expect(note).toContain(`## Summary update (${laterTs.slice(11, 16)} UTC)`);
    expect(note).toContain("<!-- NEEDS_SUMMARY_UPDATE -->");
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("refreshDailyNotesFromMessages rehydrates stale unfinished past notes instead of skipping them", () => {
  const base = makeTempWorkspace("piclaw-daily-notes-reseed-");
  try {
    const day = isoDateDaysAgo(1);
    const firstTs = `${day}T10:00:00.000Z`;
    const laterTs = `${day}T18:30:00.000Z`;

    mkdirSync(join(base, "notes", "daily"), { recursive: true });
    writeFileSync(
      join(base, "notes", "daily", `${day}.md`),
      `---\ndate: ${day}\nsummarised_until:\nmessages_total: 1\nmessages_user: 1\nmessages_assistant: 0\nsession_trees: 1\nsession_chats: 1\nfirst_message: ${firstTs}\nlast_message: ${firstTs}\nscope_mode: all-chats\nscope_anchor: *\n---\n# ${day}\n\n## Summary\n\n<!-- NEEDS_SUMMARY -->\n`,
      "utf8",
    );

    const script = `
      import { initDatabase, storeMessage } from ${JSON.stringify(DB_MODULE)};
      import { refreshDailyNotesFromMessages } from ${JSON.stringify(DAILY_NOTES_MODULE)};
      initDatabase();
      storeMessage({
        id: 'user-1',
        chat_jid: 'web:default',
        sender: 'user',
        sender_name: 'You',
        content: 'first',
        timestamp: '${firstTs}',
        is_bot_message: false,
      });
      storeMessage({
        id: 'agent-1',
        chat_jid: 'mc-review',
        sender: 'agent',
        sender_name: 'Assistant',
        content: 'later code review follow-up',
        timestamp: '${laterTs}',
        is_bot_message: true,
        is_terminal_agent_reply: true,
      });
      const out = refreshDailyNotesFromMessages({ chatJid: '*', days: 7 });
      console.log(JSON.stringify({ updated: out.updated }));
    `;

    const proc = Bun.spawnSync([process.execPath, "-e", script], { env: makeEnv(base), stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode, proc.stderr.toString()).toBe(0);
    const result = JSON.parse(proc.stdout.toString().trim().split("\n").pop()!);
    expect(result.updated).toBe(1);

    const note = readFileSync(join(base, "notes", "daily", `${day}.md`), "utf8");
    expect(note).toContain("messages_total: 2");
    expect(note).toContain("messages_assistant: 1");
    expect(note).toContain(`last_message: ${laterTs}`);
    expect(note).toContain(`slice: ${firstTs}..${laterTs}`);
    expect(note).toContain("mc-review");
    expect(note).toContain("<!-- NEEDS_SUMMARY -->");
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("inspectDailyNoteSummaryBacklog treats stale complete notes as partial backlog", () => {
  const base = makeTempWorkspace("piclaw-daily-notes-partial-backlog-");
  try {
    const day = isoDateDaysAgo(1);
    const firstTs = `${day}T10:00:00.000Z`;
    const laterTs = `${day}T18:30:00.000Z`;

    mkdirSync(join(base, "notes", "daily"), { recursive: true });
    writeFileSync(
      join(base, "notes", "daily", `${day}.md`),
      `---\ndate: ${day}\nsummarised_until: ${firstTs}\nmessages_total: 1\nmessages_user: 1\nmessages_assistant: 0\nsession_trees: 1\nsession_chats: 1\nfirst_message: ${firstTs}\nlast_message: ${firstTs}\nscope_mode: all-chats\nscope_anchor: *\n---\n# ${day}\n\n## Summary\n\nEarlier summary.\n`,
      "utf8",
    );

    const script = `
      import { initDatabase, storeMessage } from ${JSON.stringify(DB_MODULE)};
      import { inspectDailyNoteSummaryBacklog } from ${JSON.stringify(DAILY_NOTES_MODULE)};
      initDatabase();
      storeMessage({
        id: 'user-1',
        chat_jid: 'web:default',
        sender: 'user',
        sender_name: 'You',
        content: 'first',
        timestamp: '${firstTs}',
        is_bot_message: false,
      });
      storeMessage({
        id: 'agent-1',
        chat_jid: 'mc-review',
        sender: 'agent',
        sender_name: 'Assistant',
        content: 'later code review follow-up',
        timestamp: '${laterTs}',
        is_bot_message: true,
        is_terminal_agent_reply: true,
      });
      console.log(JSON.stringify(inspectDailyNoteSummaryBacklog({ recentDays: 7 })));
    `;

    const proc = Bun.spawnSync([process.execPath, "-e", script], { env: makeEnv(base), stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode, proc.stderr.toString()).toBe(0);
    const result = JSON.parse(proc.stdout.toString().trim().split("\n").pop()!);
    expect(result).toMatchObject({ unsummarised: 0, partial: 1, missing_watermark: 0, missing: 0, dates: [day] });
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test("refreshDailyNotesFromMessages uses UTC day boundaries for the start of the requested window", () => {
  const base = makeTempWorkspace("piclaw-daily-notes-boundary-");
  try {
    const day = "2026-06-11";
    const firstTs = `${day}T00:03:10.000Z`;
    const laterTs = `${day}T23:54:04.812Z`;

    const script = `
      const fixedNow = new Date('2026-06-13T12:00:00.000Z').getTime();
      Date.now = () => fixedNow;
      const { initDatabase, storeMessage } = await import(${JSON.stringify(DB_MODULE)});
      const { refreshDailyNotesFromMessages } = await import(${JSON.stringify(DAILY_NOTES_MODULE)});
      initDatabase();
      storeMessage({
        id: 'user-1',
        chat_jid: 'telegram:1',
        sender: 'user',
        sender_name: 'You',
        content: 'early retained message',
        timestamp: '${firstTs}',
        is_bot_message: false,
      });
      storeMessage({
        id: 'agent-1',
        chat_jid: 'telegram:1',
        sender: 'agent',
        sender_name: 'Assistant',
        content: 'late retained message',
        timestamp: '${laterTs}',
        is_bot_message: true,
        is_terminal_agent_reply: true,
      });
      const out = refreshDailyNotesFromMessages({ chatJid: '*', days: 2 });
      console.log(JSON.stringify({ created: out.created, days: out.days }));
    `;

    const proc = Bun.spawnSync([process.execPath, "-e", script], { env: makeEnv(base), stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode, proc.stderr.toString()).toBe(0);
    const result = JSON.parse(proc.stdout.toString().trim().split("\n").pop()!);
    expect(result).toMatchObject({ created: 1, days: [day] });

    const note = readFileSync(join(base, "notes", "daily", `${day}.md`), "utf8");
    expect(note).toContain(`first_message: ${firstTs}`);
    expect(note).toContain(`last_message: ${laterTs}`);
    expect(note).toContain("messages_total: 2");
    expect(note).toContain("early retained message");
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});
