/**
 * session-recordings/session-recordings.ts – Opt-in chat trace recording storage.
 *
 * Stores normalized JSONL event traces under runtime data so they can be
 * replayed by a standalone web shim without invoking live agents or tools.
 */

import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

import { getSessionRecordingsConfig } from "../core/config.js";
import type { InteractionRow } from "../db.js";
import { createUuid } from "../utils/ids.js";
import { createLogger, debugSuppressedError } from "../utils/logger.js";
import { isPathWithin } from "../utils/path-safety.js";

const log = createLogger("session-recordings");

export const SESSION_TRACE_SCHEMA_VERSION = 1;

export type SessionRecordingMode = "metadata" | "redacted" | "full";
export type SessionRecordingStatus = "recording" | "stopped";

export type SessionTraceEventKind =
  | "recording_started"
  | "recording_stopped"
  | "timeline_message"
  | "sse_event"
  | "user_input"
  | "assistant_output"
  | "tool_activity"
  | "status"
  | "fixture_note";

export interface SessionTraceEvent {
  version: number;
  recording_id: string;
  seq: number;
  kind: SessionTraceEventKind;
  chat_jid: string;
  at: string;
  t_ms: number;
  data: unknown;
  redactions?: string[];
}

export interface SessionRecordingRedactionOptions {
  /** Additional JavaScript regex sources applied to string payloads in redacted mode. */
  patterns?: string[];
  /** Additional object keys to redact exactly (case-insensitive) in redacted mode. */
  keys?: string[];
  /** Maximum string size retained in redacted mode before truncation metadata is inserted. */
  maxStringLength?: number;
}

export interface SessionRecordingMeta {
  id: string;
  chatJid: string;
  title: string;
  mode: SessionRecordingMode;
  status: SessionRecordingStatus;
  startedAt: string;
  endedAt?: string;
  eventCount: number;
  tracePath: string;
  redaction?: SessionRecordingRedactionOptions;
}

interface ActiveRecordingState {
  meta: SessionRecordingMeta;
  startedMs: number;
  seq: number;
}

const activeByChat = new Map<string, ActiveRecordingState>();

function recordingsDir(): string {
  return resolve(getSessionRecordingsConfig().directory);
}

function safeRecordingId(id: string): string {
  return basename(String(id || "").trim()).replace(/[^a-zA-Z0-9_.-]+/g, "");
}

function recordingDir(id: string): string {
  const root = recordingsDir();
  const dir = resolve(root, safeRecordingId(id));
  if (!isPathWithin(root, dir)) throw new Error("Invalid recording id.");
  return dir;
}

function metaPath(id: string): string {
  return join(recordingDir(id), "meta.json");
}

function tracePath(id: string): string {
  return join(recordingDir(id), "trace.jsonl");
}

function ensureRecordingRoot(): void {
  mkdirSync(recordingsDir(), { recursive: true });
}

function normalizeMode(value: unknown): SessionRecordingMode {
  return value === "metadata" || value === "full" || value === "redacted" ? value : "redacted";
}

function normalizeChatJid(value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text || "web:default";
}

function normalizeTitle(value: unknown, chatJid: string): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text || `Recording ${chatJid} ${new Date().toISOString()}`;
}

function writeMeta(meta: SessionRecordingMeta): void {
  mkdirSync(recordingDir(meta.id), { recursive: true });
  writeFileSync(metaPath(meta.id), JSON.stringify(meta, null, 2));
}

function readMeta(id: string): SessionRecordingMeta | null {
  try {
    const path = metaPath(id);
    if (!existsSync(path)) return null;
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as SessionRecordingMeta;
  } catch {
    return null;
  }
}

const SECRET_KEY_PATTERN = /(?:secret|token|password|authorization|api[_-]?key|access[_-]?key|refresh[_-]?token|private[_-]?key|credential|cookie|session|set-cookie|x-api-key|passphrase)/i;
const SECRET_VALUE_PATTERNS: Array<[RegExp, string]> = [
  [/\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g, "[redacted-github-token]"],
  [/\bsk-[A-Za-z0-9_-]{16,}\b/g, "[redacted-api-key]"],
  [/\b(?:Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{12,}\b/gi, "[redacted-authorization]"],
  [/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, "[redacted-jwt]"],
  [/\b[A-Za-z0-9+/]{32,}={0,2}\b/g, "[redacted-secret-like]"],
  [/data:[^;\s]+;base64,[A-Za-z0-9+/=]{64,}/gi, "[redacted-data-url]"],
];
const DEFAULT_MAX_REDACTED_STRING_LENGTH = 12_000;

function normalizeRedactionOptions(value: unknown): SessionRecordingRedactionOptions | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const patterns = Array.isArray(record.patterns)
    ? record.patterns.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 20)
    : undefined;
  const keys = Array.isArray(record.keys)
    ? record.keys.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 50)
    : undefined;
  const maxStringLength = Number(record.maxStringLength ?? record.max_string_length);
  const normalized: SessionRecordingRedactionOptions = {};
  if (patterns?.length) normalized.patterns = patterns;
  if (keys?.length) normalized.keys = keys;
  if (Number.isFinite(maxStringLength)) normalized.maxStringLength = Math.min(128_000, Math.max(256, Math.round(maxStringLength)));
  return Object.keys(normalized).length ? normalized : undefined;
}

function customKeyMatches(key: string, redaction?: SessionRecordingRedactionOptions): boolean {
  const normalized = String(key || "").trim().toLowerCase();
  if (!normalized) return false;
  return Boolean(redaction?.keys?.some((candidate) => candidate.toLowerCase() === normalized));
}

function redactString(value: string, redactions: string[], redaction?: SessionRecordingRedactionOptions): string {
  let next = value;
  for (const [pattern, replacement] of SECRET_VALUE_PATTERNS) {
    if (pattern.test(next)) {
      pattern.lastIndex = 0;
      redactions.push(replacement.slice(1, -1));
      next = next.replace(pattern, replacement);
    }
  }
  for (const source of redaction?.patterns || []) {
    try {
      const pattern = new RegExp(source, "g");
      if (pattern.test(next)) {
        pattern.lastIndex = 0;
        redactions.push("custom-pattern");
        next = next.replace(pattern, "[redacted-custom]");
      }
    } catch {
      redactions.push("invalid-custom-pattern");
    }
  }
  const maxLength = redaction?.maxStringLength || DEFAULT_MAX_REDACTED_STRING_LENGTH;
  if (next.length > maxLength) {
    redactions.push("truncated-string");
    next = `${next.slice(0, maxLength)}\n[truncated ${next.length - maxLength} chars]`;
  }
  return next;
}

function sanitizeForRecording(value: unknown, mode: SessionRecordingMode, redactions: string[], key = "", redaction?: SessionRecordingRedactionOptions): unknown {
  if (mode === "full") return value;
  if (mode === "metadata") {
    if (value === null || value === undefined) return value;
    if (typeof value === "string") return { type: "string", length: value.length };
    if (typeof value === "number" || typeof value === "boolean") return value;
    if (Array.isArray(value)) return { type: "array", length: value.length };
    if (typeof value === "object") return { type: "object", keys: Object.keys(value as Record<string, unknown>).sort() };
    return String(typeof value);
  }
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    if (SECRET_KEY_PATTERN.test(key) || customKeyMatches(key, redaction)) {
      redactions.push(`key:${key}`);
      return "[redacted]";
    }
    return redactString(value, redactions, redaction);
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map((item) => sanitizeForRecording(item, mode, redactions, key, redaction));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [entryKey, entryValue] of Object.entries(value as Record<string, unknown>)) {
      out[entryKey] = sanitizeForRecording(entryValue, mode, redactions, entryKey, redaction);
    }
    return out;
  }
  return String(value);
}

function appendEvent(state: ActiveRecordingState, kind: SessionTraceEventKind, data: unknown): SessionTraceEvent {
  const redactions: string[] = [];
  const now = Date.now();
  const event: SessionTraceEvent = {
    version: SESSION_TRACE_SCHEMA_VERSION,
    recording_id: state.meta.id,
    seq: ++state.seq,
    kind,
    chat_jid: state.meta.chatJid,
    at: new Date(now).toISOString(),
    t_ms: Math.max(0, now - state.startedMs),
    data: sanitizeForRecording(data, state.meta.mode, redactions, "", state.meta.redaction),
    ...(redactions.length > 0 ? { redactions: Array.from(new Set(redactions)) } : {}),
  };
  appendFileSync(state.meta.tracePath, `${JSON.stringify(event)}\n`);
  state.meta.eventCount = event.seq;
  writeMeta(state.meta);
  return event;
}

export function startSessionRecording(options: {
  chatJid?: unknown;
  title?: unknown;
  mode?: unknown;
  redaction?: unknown;
} = {}): SessionRecordingMeta {
  ensureRecordingRoot();
  const chatJid = normalizeChatJid(options.chatJid);
  const existing = activeByChat.get(chatJid);
  if (existing) return { ...existing.meta };

  const id = createUuid("rec");
  const now = new Date().toISOString();
  const dir = recordingDir(id);
  mkdirSync(dir, { recursive: true });
  const meta: SessionRecordingMeta = {
    id,
    chatJid,
    title: normalizeTitle(options.title, chatJid),
    mode: normalizeMode(options.mode),
    status: "recording",
    startedAt: now,
    eventCount: 0,
    tracePath: tracePath(id),
    redaction: normalizeRedactionOptions(options.redaction),
  };
  writeFileSync(meta.tracePath, "");
  const state: ActiveRecordingState = { meta, startedMs: Date.now(), seq: 0 };
  activeByChat.set(chatJid, state);
  writeMeta(meta);
  appendEvent(state, "recording_started", { title: meta.title, mode: meta.mode, redaction: meta.redaction || null });
  return { ...state.meta };
}

export function stopSessionRecording(chatJidOrId: string): SessionRecordingMeta | null {
  const key = String(chatJidOrId || "").trim();
  let state = activeByChat.get(key) || null;
  if (!state) {
    for (const candidate of activeByChat.values()) {
      if (candidate.meta.id === key) {
        state = candidate;
        break;
      }
    }
  }
  if (!state) return null;
  appendEvent(state, "recording_stopped", { reason: "operator_stop" });
  state.meta.status = "stopped";
  state.meta.endedAt = new Date().toISOString();
  writeMeta(state.meta);
  activeByChat.delete(state.meta.chatJid);
  return { ...state.meta };
}

export function listSessionRecordings(): SessionRecordingMeta[] {
  ensureRecordingRoot();
  return readdirSync(recordingsDir(), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readMeta(entry.name))
    .filter((meta): meta is SessionRecordingMeta => Boolean(meta))
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export function getSessionRecording(id: string): { meta: SessionRecordingMeta; events: SessionTraceEvent[] } | null {
  const meta = readMeta(id);
  if (!meta) return null;
  const path = tracePath(meta.id);
  const events = existsSync(path)
    ? readFileSync(path, "utf8")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as SessionTraceEvent)
    : [];
  return { meta, events };
}

export function deleteSessionRecording(id: string): boolean {
  const safeId = safeRecordingId(id);
  if (!safeId) return false;
  for (const [chatJid, state] of activeByChat) {
    if (state.meta.id === safeId) activeByChat.delete(chatJid);
  }
  const dir = recordingDir(safeId);
  if (!existsSync(dir)) return false;
  rmSync(dir, { recursive: true, force: true });
  return true;
}

export function getActiveSessionRecording(chatJid: string): SessionRecordingMeta | null {
  const state = activeByChat.get(normalizeChatJid(chatJid));
  return state ? { ...state.meta } : null;
}

export function listActiveSessionRecordings(): SessionRecordingMeta[] {
  return Array.from(activeByChat.values()).map((state) => ({ ...state.meta }));
}

export function previewSessionRecordingRedaction(payload: unknown, options: { mode?: unknown; redaction?: unknown } = {}): { data: unknown; redactions: string[] } {
  const redactions: string[] = [];
  const data = sanitizeForRecording(payload, normalizeMode(options.mode), redactions, "", normalizeRedactionOptions(options.redaction));
  return { data, redactions: Array.from(new Set(redactions)) };
}

export function recordSessionFixtureNote(chatJid: string, data: unknown): SessionTraceEvent | null {
  const state = activeByChat.get(normalizeChatJid(chatJid));
  if (!state) return null;
  return appendEvent(state, "fixture_note", data);
}

export function recordTimelineInteraction(interaction: InteractionRow | null | undefined): void {
  if (!interaction?.chat_jid) return;
  const state = activeByChat.get(interaction.chat_jid);
  if (!state) return;
  try {
    const kind = interaction.data?.type === "user_message"
      ? "user_input"
      : interaction.data?.type === "agent_response"
        ? "assistant_output"
        : "timeline_message";
    appendEvent(state, kind, {
      interaction_id: interaction.id,
      timestamp: interaction.timestamp,
      data: interaction.data,
    });
  } catch (error) {
    debugSuppressedError(log, "Failed to append recorded timeline interaction.", error, {
      operation: "session_recording.record_timeline",
      chatJid: interaction.chat_jid,
    });
  }
}

function kindFromSseEvent(eventType: string, data?: unknown): SessionTraceEventKind {
  const payloadType = data && typeof data === "object" ? String((data as Record<string, unknown>).type || "") : "";
  if (eventType.includes("tool") || payloadType === "tool_call" || payloadType === "tool_status") return "tool_activity";
  if (eventType === "agent_status") return "status";
  if (eventType === "agent_response") return "assistant_output";
  if (eventType === "new_post" || eventType === "new_reply") return "timeline_message";
  return "sse_event";
}

function readChatJidFromPayload(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const value = record.chat_jid ?? record.chatJid;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function recordSseEvent(eventType: string, data: unknown): void {
  const chatJid = readChatJidFromPayload(data);
  if (!chatJid) return;
  const state = activeByChat.get(chatJid);
  if (!state) return;
  try {
    appendEvent(state, kindFromSseEvent(eventType, data), { event_type: eventType, payload: data });
  } catch (error) {
    debugSuppressedError(log, "Failed to append recorded SSE event.", error, {
      operation: "session_recording.record_sse",
      chatJid,
      eventType,
    });
  }
}

export function resetSessionRecordingsForTests(): void {
  activeByChat.clear();
}
