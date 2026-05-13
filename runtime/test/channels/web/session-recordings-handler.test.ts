import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { handleSessionRecordingRoutes } from "../../../src/channels/web/handlers/session-recordings.js";
import { resetSessionRecordingsForTests } from "../../../src/session-recordings/session-recordings.js";

let tempDir = "";
const previousDir = process.env.PICLAW_RECORDINGS_DIR;

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), "piclaw-recordings-routes-test-"));
  process.env.PICLAW_RECORDINGS_DIR = tempDir;
  resetSessionRecordingsForTests();
});

afterEach(() => {
  resetSessionRecordingsForTests();
  if (previousDir === undefined) delete process.env.PICLAW_RECORDINGS_DIR;
  else process.env.PICLAW_RECORDINGS_DIR = previousDir;
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
});

describe("session recording routes", () => {
  test("starts, lists, fetches, stops, and deletes recordings", async () => {
    const start = await handleSessionRecordingRoutes(new Request("https://example.com/agent/recordings/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_jid: "web:test", title: "Route test" }),
    }), "/agent/recordings/start", json);
    expect(start?.status).toBe(201);
    const startBody = await start!.json();
    const id = startBody.recording.id;

    const list = await handleSessionRecordingRoutes(new Request("https://example.com/agent/recordings"), "/agent/recordings", json);
    expect(list?.status).toBe(200);
    expect((await list!.json()).recordings).toHaveLength(1);

    const fetched = await handleSessionRecordingRoutes(new Request(`https://example.com/agent/recordings/${id}`), `/agent/recordings/${id}`, json);
    expect(fetched?.status).toBe(200);
    expect((await fetched!.json()).meta.id).toBe(id);

    const stop = await handleSessionRecordingRoutes(new Request("https://example.com/agent/recordings/stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }), "/agent/recordings/stop", json);
    expect(stop?.status).toBe(200);
    expect((await stop!.json()).recording.status).toBe("stopped");

    const deleted = await handleSessionRecordingRoutes(new Request(`https://example.com/agent/recordings/${id}`, { method: "DELETE" }), `/agent/recordings/${id}`, json);
    expect(deleted?.status).toBe(200);
    expect((await deleted!.json()).deleted).toBe(true);
  });

  test("serves standalone playback html with valid inline script", async () => {
    const response = await handleSessionRecordingRoutes(new Request("https://example.com/recordings/playback"), "/recordings/playback", json);
    expect(response?.status).toBe(200);
    expect(response?.headers.get("Content-Type")).toContain("text/html");

    const html = await response!.text();
    expect(html).toContain("Session Playback");
    expect(html).toContain('new RegExp("\\\\n+")');
    expect(html).not.toContain("split(/\n+/)");

    const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    expect(script).toBeTruthy();
    expect(() => new Function(script!)).not.toThrow();
  });

  test("exports recordings and previews redaction", async () => {
    const start = await handleSessionRecordingRoutes(new Request("https://example.com/agent/recordings/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_jid: "web:export", title: "Export test", redaction: { keys: ["customer_id"] } }),
    }), "/agent/recordings/start", json);
    const id = (await start!.json()).recording.id;
    await handleSessionRecordingRoutes(new Request("https://example.com/agent/recordings/stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }), "/agent/recordings/stop", json);

    const jsonExport = await handleSessionRecordingRoutes(new Request(`https://example.com/agent/recordings/${id}/export?format=json`), `/agent/recordings/${id}/export`, json);
    expect(jsonExport?.headers.get("Content-Disposition")).toContain("attachment");
    expect(jsonExport?.headers.get("Content-Type")).toContain("application/json");

    const htmlExport = await handleSessionRecordingRoutes(new Request(`https://example.com/agent/recordings/${id}/export?format=html`), `/agent/recordings/${id}/export`, json);
    expect(htmlExport?.headers.get("Content-Type")).toContain("text/html");
    expect(await htmlExport!.text()).toContain("embeddedTrace");

    const preview = await handleSessionRecordingRoutes(new Request("https://example.com/agent/recordings/redact-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: { customer_id: "C-123", token: "secret-value" }, redaction: { keys: ["customer_id"] } }),
    }), "/agent/recordings/redact-preview", json);
    const body = await preview!.json();
    expect(body.preview.data.customer_id).toBe("[redacted]");
    expect(body.preview.data.token).toBe("[redacted]");
  });
});
