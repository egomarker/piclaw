import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { resolve } from "path";

import { WORKSPACE_DIR } from "../core/config.js";
import { getDb } from "../db.js";
import { createLogger, debugSuppressedError } from "../utils/logger.js";

export const DAILY_NOTES_DIR = resolve(WORKSPACE_DIR, "notes/daily");
const SUMMARY_MARKER = "<!-- NEEDS_SUMMARY -->";
const SUMMARY_UPDATE_MARKER = "<!-- NEEDS_SUMMARY_UPDATE -->";
const INCOMPLETE_WARNING_TITLE = "> ⚠ **Incomplete daily note**";
const DREAM_CUES_START = "<!-- DREAM_CUES";
const DREAM_CUES_END = "DREAM_CUES -->";
const log = createLogger("agent-memory.daily-notes");

interface FrontMatter {
  fields: Record<string, string>;
  body: string;
  hasFrontMatter: boolean;
}

interface Row {
  sender_name: string;
  is_bot_message: number;
  content: string;
  timestamp: string;
  chat_jid: string;
  root_chat_jid: string;
  day: string;
}

interface DailyMessageStats {
  day: string;
  firstTimestamp: string;
  lastTimestamp: string;
  totalMsgs: number;
  userMsgs: number;
  botMsgs: number;
  sessionTrees: number;
  sessionChats: number;
}

export interface RefreshDailyNotesResult {
  scope_mode: string;
  scope_anchor: string;
  created: number;
  updated: number;
  skipped: number;
  days: string[];
}

export interface DailyNoteSummaryBacklog {
  unsummarised: number;
  partial: number;
  missing_watermark: number;
  missing: number;
  dates: string[];
}

function getDailyNotesDir(): string {
  return resolve(process.env.PICLAW_WORKSPACE || WORKSPACE_DIR, "notes/daily");
}

function formatDateLong(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

function todayStr(): string { return new Date().toISOString().slice(0, 10); }

function windowStartDay(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}

function buildDailyMessageStats(day: string, messages: Row[]): DailyMessageStats {
  return {
    day,
    firstTimestamp: messages[0].timestamp,
    lastTimestamp: messages[messages.length - 1].timestamp,
    totalMsgs: messages.length,
    userMsgs: messages.filter((message) => !message.is_bot_message).length,
    botMsgs: messages.filter((message) => message.is_bot_message).length,
    sessionTrees: new Set(messages.map((message) => message.root_chat_jid)).size,
    sessionChats: new Set(messages.map((message) => message.chat_jid)).size,
  };
}

function noteSliceMetadataDrift(
  fields: Record<string, string>,
  stats: DailyMessageStats,
  scope: { mode: string; anchor: string },
): boolean {
  return (fields.date || "") !== stats.day
    || (fields.messages_total || "") !== String(stats.totalMsgs)
    || (fields.messages_user || "") !== String(stats.userMsgs)
    || (fields.messages_assistant || "") !== String(stats.botMsgs)
    || (fields.session_trees || "") !== String(stats.sessionTrees)
    || (fields.session_chats || "") !== String(stats.sessionChats)
    || (fields.first_message || "") !== stats.firstTimestamp
    || (fields.last_message || "") !== stats.lastTimestamp
    || (fields.scope_mode || "") !== scope.mode
    || (fields.scope_anchor || "") !== scope.anchor;
}

function splitFrontMatter(content: string): FrontMatter {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { fields: {}, body: content, hasFrontMatter: false };
  const fmText = match[1];
  const body = content.slice(match[0].length);
  const fields: Record<string, string> = {};
  for (const line of fmText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    fields[key] = value;
  }
  return { fields, body, hasFrontMatter: true };
}

function formatFrontMatter(fields: Record<string, string>): string {
  const order = [
    "date",
    "summarised_until",
    "messages_total",
    "messages_user",
    "messages_assistant",
    "session_trees",
    "session_chats",
    "first_message",
    "last_message",
    "scope_mode",
    "scope_anchor",
  ];
  const lines = ["---"];
  for (const key of order) {
    if (key in fields) {
      const value = fields[key];
      lines.push(value ? `${key}: ${value}` : `${key}:`);
    }
  }
  for (const key of Object.keys(fields).filter((key) => !order.includes(key)).sort()) {
    const value = fields[key];
    lines.push(value ? `${key}: ${value}` : `${key}:`);
  }
  lines.push("---");
  return lines.join("\n");
}

function stripLegacyWatermark(body: string): { body: string; watermark: string | null } {
  const match = body.match(/^\s*<!--\s*summarised_until:(\S+)\s*-->\s*\n?/m);
  if (!match) return { body, watermark: null };
  return { body: body.replace(match[0], ""), watermark: match[1] };
}

function extractSummary(body: string): string | null {
  const match = body.match(/## Summary\s*\n+([\s\S]*?)(?=^##\s|\s*$)/m);
  if (!match) return null;
  const raw = match[1].trim();
  if (!raw || raw === SUMMARY_MARKER) return null;
  if (raw.startsWith(SUMMARY_MARKER)) {
    const cleaned = raw.replace(SUMMARY_MARKER, "").trim();
    return cleaned.length ? cleaned : null;
  }
  return raw;
}

function stripMetadataLines(body: string): string {
  body = body.replace(/^\*\*Messages:\*\*.*\n?/m, "");
  body = body.replace(/^\*\*Time span:\*\*.*\n?/m, "");
  return body;
}

function appendSummaryUpdate(body: string, lastTs: string): string {
  if (body.includes(SUMMARY_UPDATE_MARKER)) return body;
  const heading = `## Summary update (${lastTs.slice(11, 16)} UTC)`;
  return `${body.trimEnd()}\n\n${heading}\n\n${SUMMARY_UPDATE_MARKER}\n`;
}

function stripIncompleteWarning(body: string): string {
  const lines = body.split("\n");
  const output: string[] = [];
  let skipping = false;

  for (const line of lines) {
    if (!skipping && line.trim() === INCOMPLETE_WARNING_TITLE) {
      skipping = true;
      continue;
    }
    if (skipping) {
      if (line.startsWith("> ") || line.trim() === ">" || line.trim() === "") {
        continue;
      }
      skipping = false;
    }
    output.push(line);
  }

  return output.join("\n").replace(/^\n+/, "");
}

function buildIncompleteWarning(options: { summarisedUntil?: string; lastTimestamp: string; needsSummaryUpdate?: boolean }): string {
  const lines = [INCOMPLETE_WARNING_TITLE];
  if (options.needsSummaryUpdate && options.summarisedUntil) {
    lines.push(`> Summary currently covers messages only through \`${options.summarisedUntil}\`.`);
  }
  lines.push(`> Latest message currently on file: \`${options.lastTimestamp}\`.`);
  return `${lines.join("\n")}\n`;
}

function upsertIncompleteWarning(
  body: string,
  options: { summarisedUntil?: string; lastTimestamp: string; needsSummaryUpdate?: boolean } | null,
): string {
  const cleaned = stripIncompleteWarning(body).trimStart();
  if (!options) return cleaned;
  const warning = buildIncompleteWarning(options).trimEnd();
  const summaryIndex = cleaned.indexOf("\n## Summary");
  if (summaryIndex >= 0) {
    const before = cleaned.slice(0, summaryIndex).trimEnd();
    const after = cleaned.slice(summaryIndex + 1).trimStart();
    return `${before}\n\n${warning}\n\n${after}`;
  }
  return `${warning}\n\n${cleaned}`;
}

function stripDreamCues(body: string): string {
  return body
    .replace(/\n?<!-- DREAM_CUES[\s\S]*?DREAM_CUES -->\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

function cleanCueText(text: string, maxLen = 180): string {
  const cleaned = String(text || "")
    .replace(/--/g, "—")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > maxLen ? `${cleaned.slice(0, maxLen - 1)}…` : cleaned;
}

function buildCueTerms(messages: Row[]): string[] {
  const stop = new Set(["about", "after", "again", "also", "because", "before", "could", "from", "have", "into", "just", "like", "more", "need", "only", "that", "their", "then", "there", "this", "with", "would"]);
  const counts = new Map<string, number>();
  for (const msg of messages) {
    for (const word of String(msg.content || "").toLowerCase().match(/[a-z0-9][a-z0-9_-]{3,}/g) || []) {
      if (stop.has(word)) continue;
      counts.set(word, (counts.get(word) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 16)
    .map(([word]) => word);
}

function buildDreamCues(messages: Row[], options: { firstTimestamp: string; lastTimestamp: string; totalMsgs: number; sessionTrees: number; sessionChats: number }): string {
  const includeFullSlice = options.totalMsgs <= 50 && options.sessionTrees <= 2;
  const selected = includeFullSlice
    ? messages
    : [...messages.slice(0, 5), ...messages.slice(Math.max(5, messages.length - 5))];
  const lines = [
    DREAM_CUES_START,
    "These cues are hidden recovery hints for Dream. Treat front matter as the transcript contract; use message IDs/timestamps with messages search only if more evidence is needed.",
    `slice: ${options.firstTimestamp}..${options.lastTimestamp}`,
    `messages_total: ${options.totalMsgs}`,
    `session_trees: ${options.sessionTrees}`,
    `session_chats: ${options.sessionChats}`,
    `bounded_full_slice: ${includeFullSlice ? "yes" : "no"}`,
  ];
  const terms = buildCueTerms(messages);
  if (terms.length > 0) lines.push(`cue_terms: ${terms.join(", ")}`);
  lines.push("message_snippets:");
  for (const msg of selected) {
    const role = msg.is_bot_message ? "assistant" : "user";
    lines.push(`- ${msg.timestamp} ${role} ${cleanCueText(msg.sender_name, 40)} [${cleanCueText(msg.chat_jid, 80)}]: ${cleanCueText(msg.content)}`);
  }
  if (!includeFullSlice && selected.length < messages.length) {
    lines.push(`omitted_middle_messages: ${messages.length - selected.length}`);
  }
  lines.push(DREAM_CUES_END);
  return lines.join("\n");
}

function upsertDreamCues(body: string, cues: string): string {
  const cleaned = stripDreamCues(body).trimStart();
  const summaryIndex = cleaned.indexOf("\n## Summary");
  if (summaryIndex >= 0) {
    const before = cleaned.slice(0, summaryIndex).trimEnd();
    const after = cleaned.slice(summaryIndex + 1).trimStart();
    return `${before}\n\n${cues}\n\n${after}`;
  }
  return `${cues}\n\n${cleaned}`;
}

function resolveScope(chatJid: string): { clause: string; params: string[]; mode: string; anchor: string } {
  const normalized = String(chatJid || '').trim();
  if (normalized === '*' || normalized.toLowerCase() === 'all') {
    return {
      clause: "m.chat_jid NOT LIKE 'dream:%'",
      params: [],
      mode: 'all-chats',
      anchor: '*',
    };
  }
  if (normalized.startsWith("web:")) {
    return { clause: "m.chat_jid LIKE 'web:%'", params: [], mode: "all-web-session-trees", anchor: normalized };
  }
  return { clause: "m.chat_jid = ?", params: [normalized], mode: "chat-only", anchor: normalized };
}

function loadDailyMessageStatsSince(cutoffIso: string, scope: { clause: string; params: string[] }): Map<string, DailyMessageStats> {
  const db = getDb();
  const rows = db.query<{
    day: string;
    first_timestamp: string;
    last_timestamp: string;
    total_msgs: number;
    user_msgs: number;
    bot_msgs: number;
    session_trees: number;
    session_chats: number;
  }, any[]>(
    `SELECT substr(m.timestamp, 1, 10) AS day,
            MIN(m.timestamp) AS first_timestamp,
            MAX(m.timestamp) AS last_timestamp,
            COUNT(*) AS total_msgs,
            SUM(CASE WHEN COALESCE(m.is_bot_message, 0) = 0 THEN 1 ELSE 0 END) AS user_msgs,
            SUM(CASE WHEN COALESCE(m.is_bot_message, 0) = 1 THEN 1 ELSE 0 END) AS bot_msgs,
            COUNT(DISTINCT COALESCE(cb.root_chat_jid, m.chat_jid)) AS session_trees,
            COUNT(DISTINCT m.chat_jid) AS session_chats
     FROM messages m
     LEFT JOIN chat_branches cb ON cb.chat_jid = m.chat_jid
     WHERE ${scope.clause}
       AND m.timestamp >= ?
     GROUP BY day
     ORDER BY day ASC`
  ).all(...scope.params, cutoffIso);

  return new Map(rows.map((row) => [row.day, {
    day: row.day,
    firstTimestamp: row.first_timestamp,
    lastTimestamp: row.last_timestamp,
    totalMsgs: row.total_msgs,
    userMsgs: row.user_msgs,
    botMsgs: row.bot_msgs,
    sessionTrees: row.session_trees,
    sessionChats: row.session_chats,
  }]));
}

export function inspectDailyNoteSummaryBacklog(options?: { recentDays?: number }): DailyNoteSummaryBacklog {
  const recentDays = Math.max(1, Math.floor(Number(options?.recentDays) || 7));
  const dailyNotesDir = resolve(process.env.PICLAW_WORKSPACE || WORKSPACE_DIR, "notes/daily");
  const cutoff = windowStartDay(recentDays);
  const today = todayStr();
  const allChatsScope = resolveScope("*");
  let unsummarised = 0;
  let partial = 0;
  let missing_watermark = 0;
  let missing = 0;
  const dates = new Set<string>();
  const existingDates = new Set<string>();
  let statsByDay = new Map<string, DailyMessageStats>();

  try {
    statsByDay = loadDailyMessageStatsSince(`${cutoff}T00:00:00.000Z`, allChatsScope);
  } catch (error) {
    debugSuppressedError(log, "Failed to inspect message days while checking daily-note backlog.", error, {
      operation: "daily_notes.inspect_backlog.message_days",
      recentDays,
    });
  }

  if (existsSync(dailyNotesDir)) {
    for (const file of readdirSync(dailyNotesDir).filter((entry) => /^\d{4}-\d{2}-\d{2}\.md$/.test(entry)).sort()) {
      const date = file.slice(0, 10);
      existingDates.add(date);
      if (date < cutoff) continue;
      const content = readFileSync(resolve(dailyNotesDir, file), 'utf8');
      const { fields, body } = splitFrontMatter(content);
      const summary = extractSummary(body);
      const summarisedUntil = (fields.summarised_until || '').trim();
      const needsSummaryUpdate = body.includes(SUMMARY_UPDATE_MARKER);
      const hasIncompleteWarning = body.includes(INCOMPLETE_WARNING_TITLE);
      const stats = statsByDay.get(date);
      const metadataDrift = stats ? noteSliceMetadataDrift(fields, stats, allChatsScope) : false;
      const newerMessagesExist = Boolean(summary && summarisedUntil && stats && stats.lastTimestamp > summarisedUntil);

      if (!summary) {
        unsummarised += 1;
        dates.add(date);
        continue;
      }
      if (!summarisedUntil) {
        missing_watermark += 1;
        dates.add(date);
        continue;
      }
      if (needsSummaryUpdate || hasIncompleteWarning || metadataDrift || newerMessagesExist) {
        partial += 1;
        dates.add(date);
      }
    }
  }

  for (const day of [...statsByDay.keys()].sort()) {
    if (day >= today) continue;
    if (!existingDates.has(day)) {
      missing += 1;
      dates.add(day);
    }
  }

  return { unsummarised, partial, missing_watermark, missing, dates: [...dates].sort() };
}

export function refreshDailyNotesFromMessages(options?: { days?: number; chatJid?: string; force?: boolean }): RefreshDailyNotesResult {
  const days = Math.max(1, Math.floor(Number(options?.days) || 7));
  const chatJid = typeof options?.chatJid === "string" && options.chatJid.trim() ? options.chatJid.trim() : "web:default";
  const force = Boolean(options?.force);

  const dailyNotesDir = getDailyNotesDir();
  mkdirSync(dailyNotesDir, { recursive: true });
  const db = getDb();
  const scope = resolveScope(chatJid);
  const params: any[] = [...scope.params];
  const cutoffDay = windowStartDay(days);
  const cutoffIso = `${cutoffDay}T00:00:00.000Z`;
  const rows = db.query<Row, any[]>(
    `SELECT m.sender_name,
            m.is_bot_message,
            m.content,
            m.timestamp,
            m.chat_jid,
            COALESCE(cb.root_chat_jid, m.chat_jid) AS root_chat_jid,
            substr(m.timestamp, 1, 10) AS day
     FROM messages m
     LEFT JOIN chat_branches cb ON cb.chat_jid = m.chat_jid
     WHERE ${scope.clause} AND m.timestamp >= ?
     ORDER BY m.timestamp ASC`
  ).all(...params, cutoffIso);

  const dayMap = new Map<string, Row[]>();
  for (const row of rows) {
    if (!dayMap.has(row.day)) dayMap.set(row.day, []);
    dayMap.get(row.day)!.push(row);
  }

  const sortedDays = [...dayMap.keys()].sort();
  const today = todayStr();
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const day of sortedDays) {
    const filePath = `${dailyNotesDir}/${day}.md`;
    const messages = dayMap.get(day)!;
    const stats = buildDailyMessageStats(day, messages);
    const { firstTimestamp, lastTimestamp, totalMsgs, userMsgs, botMsgs, sessionTrees, sessionChats } = stats;
    const isToday = day === today;

    if (existsSync(filePath)) {
      const original = readFileSync(filePath, "utf8");
      const { fields, body: rawBody, hasFrontMatter } = splitFrontMatter(original);
      const stripped = stripLegacyWatermark(rawBody);
      let body = stripMetadataLines(stripped.body);
      const summary = extractSummary(body);
      const existingWm = fields.summarised_until || stripped.watermark || "";
      const hasWm = existingWm.length > 0;
      const needsPartialUpdate = Boolean(summary && hasWm && lastTimestamp > existingWm);
      const needsMigration = !hasFrontMatter || !("date" in fields) || !("summarised_until" in fields);
      const metadataDrift = noteSliceMetadataDrift(fields, stats, scope);
      const needsSliceReseed = !summary || !hasWm || needsMigration || metadataDrift;
      const shouldWrite = isToday || force || needsSliceReseed || needsPartialUpdate;

      if (!shouldWrite) {
        skipped += 1;
        continue;
      }

      if (needsPartialUpdate) {
        body = appendSummaryUpdate(body, lastTimestamp);
      }

      const incompleteState = !summary
        ? { lastTimestamp }
        : needsPartialUpdate
          ? { summarisedUntil: existingWm, lastTimestamp, needsSummaryUpdate: true }
          : needsSliceReseed
            ? { lastTimestamp }
            : null;
      body = upsertIncompleteWarning(body, incompleteState);
      body = incompleteState
        ? upsertDreamCues(body, buildDreamCues(messages, { firstTimestamp, lastTimestamp, totalMsgs, sessionTrees, sessionChats }))
        : stripDreamCues(body);

      const nextFields: Record<string, string> = {
        ...fields,
        date: day,
        summarised_until: existingWm,
        messages_total: String(totalMsgs),
        messages_user: String(userMsgs),
        messages_assistant: String(botMsgs),
        session_trees: String(sessionTrees),
        session_chats: String(sessionChats),
        first_message: firstTimestamp,
        last_message: lastTimestamp,
        scope_mode: scope.mode,
        scope_anchor: scope.anchor,
      };

      writeFileSync(filePath, `${formatFrontMatter(nextFields)}\n${body.trimStart()}`, "utf8");
      updated += 1;
      continue;
    }

    const lines: string[] = [];
    lines.push(`# ${formatDateLong(day)}`);
    lines.push("");
    lines.push(`← ${sortedDays[sortedDays.indexOf(day) - 1] ? `[[${sortedDays[sortedDays.indexOf(day) - 1]}]]` : "—"} | ${sortedDays[sortedDays.indexOf(day) + 1] ? `[[${sortedDays[sortedDays.indexOf(day) + 1]}]]` : "—"} →`);
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push(INCOMPLETE_WARNING_TITLE);
    lines.push(`> Latest message currently on file: \`${lastTimestamp}\`.`);
    lines.push("");
    lines.push(buildDreamCues(messages, { firstTimestamp, lastTimestamp, totalMsgs, sessionTrees, sessionChats }));
    lines.push("");
    lines.push("## Summary");
    lines.push("");
    lines.push(SUMMARY_MARKER);
    lines.push("");

    const fmFields: Record<string, string> = {
      date: day,
      summarised_until: "",
      messages_total: String(totalMsgs),
      messages_user: String(userMsgs),
      messages_assistant: String(botMsgs),
      session_trees: String(sessionTrees),
      session_chats: String(sessionChats),
      first_message: firstTimestamp,
      last_message: lastTimestamp,
      scope_mode: scope.mode,
      scope_anchor: scope.anchor,
    };
    writeFileSync(filePath, `${formatFrontMatter(fmFields)}\n${lines.join("\n")}`, "utf8");
    created += 1;
  }

  return {
    scope_mode: scope.mode,
    scope_anchor: scope.anchor,
    created,
    updated,
    skipped,
    days: sortedDays,
  };
}
