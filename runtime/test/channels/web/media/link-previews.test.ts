/**
 * test/channels/web/link-previews.test.ts – Tests for OpenGraph link preview fetching.
 *
 * Verifies URL extraction from messages, OG metadata parsing, DNS safety
 * checks, and link preview storage/broadcast via SSE.
 */

import { afterEach, expect, test } from "bun:test";
import { getTestWorkspace, setEnv, waitFor } from "../../../helpers.js";

let restoreEnv: (() => void) | null = null;
const TEST_PREVIEW_BASE_URL = "https://93.184.216.34";

afterEach(() => {
  restoreEnv?.();
  restoreEnv = null;
});

test("extractUrls trims punctuation and limits", async () => {
  const { extractUrls } = await import("../../../../src/channels/web/media/link-previews.js");
  const urls = extractUrls("Check https://example.com, and https://example.org/path).", 1);
  expect(urls).toEqual(["https://example.com"]);
});

test("extractUrls ignores links inside markdown code blocks", async () => {
  const { extractUrls } = await import("../../../../src/channels/web/media/link-previews.js");
  const urls = extractUrls([
    "See https://example.com/outside.",
    "```ts",
    "const docs = 'https://example.com/in-fence';",
    "```",
    "    curl https://example.com/indented",
    "And https://example.org/after.",
  ].join("\n"));

  expect(urls).toEqual(["https://example.com/outside", "https://example.org/after"]);
});

test("scheduleLinkPreviews stores metadata, caches image, and broadcasts update", async () => {
  const ws = getTestWorkspace();
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await import("../../../../src/db.js");
  db.initDatabase();
  db.storeChatMetadata("web:default", new Date().toISOString(), "Web");

  const message = {
    id: `msg-${Math.random()}`,
    chat_jid: "web:default",
    sender: "user",
    sender_name: "User",
    content: `See ${TEST_PREVIEW_BASE_URL}/schedule-docs.`, 
    timestamp: new Date().toISOString(),
    is_from_me: false,
    is_bot_message: false,
  };

  const rowId = db.storeMessage(message);
  const { scheduleLinkPreviews } = await import("../../../../src/channels/web/media/link-previews.js");

  const html = `
    <html>
      <head>
        <meta property="og:title" content="Example Docs" />
        <meta property="og:description" content="Docs for testing." />
        <meta property="og:image" content="${TEST_PREVIEW_BASE_URL}/schedule-image.png" />
        <meta property="og:site_name" content="Example" />
      </head>
      <body>Test</body>
    </html>
  `;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    if (url === `${TEST_PREVIEW_BASE_URL}/schedule-docs`) {
      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    if (url === `${TEST_PREVIEW_BASE_URL}/schedule-image.png`) {
      return new Response(new Uint8Array([137, 80, 78, 71]), {
        status: 200,
        headers: { "content-type": "image/png", "content-length": "4" },
      });
    }
    return new Response("not found", { status: 404 });
  };

  const events: Array<{ type: string; data: unknown }> = [];
  const channel = {
    pendingLinkPreviews: new Set<number>(),
    broadcastEvent: (type: string, data: unknown) => {
      events.push({ type, data });
    },
  };

  try {
    scheduleLinkPreviews(channel as any, "web:default", rowId, message.content);
    await waitFor(() => events.some((event) => event.type === "interaction_updated"));

    const updated = db.getMessageByRowId("web:default", rowId);
    expect(updated?.data.link_previews?.length).toBe(1);
    const preview = updated?.data.link_previews?.[0] as any;
    expect(preview.title).toBe("Example Docs");
    expect(preview.site_name).toBe("Example");
    expect(preview.image).toMatch(/^\/media\/\d+$/);
    const mediaId = Number(String(preview.image).replace("/media/", ""));
    expect(db.getMediaById(mediaId)?.content_type).toBe("image/png");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fetchLinkPreview reuses cached image before expiry", async () => {
  const ws = getTestWorkspace();
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await import("../../../../src/db.js");
  db.initDatabase();

  const { fetchLinkPreview } = await import("../../../../src/channels/web/media/link-previews.js");

  const html = `
    <html><head>
      <meta property="og:title" content="Example Docs" />
      <meta property="og:image" content="${TEST_PREVIEW_BASE_URL}/reuse-image.png" />
    </head><body>Test</body></html>
  `;

  const originalFetch = globalThis.fetch;
  let imageFetches = 0;
  globalThis.fetch = async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    if (url === `${TEST_PREVIEW_BASE_URL}/reuse-docs`) {
      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    if (url === `${TEST_PREVIEW_BASE_URL}/reuse-image.png`) {
      imageFetches += 1;
      return new Response(new Uint8Array([137, 80, 78, 71]), {
        status: 200,
        headers: { "content-type": "image/png", "content-length": "4" },
      });
    }
    return new Response("not found", { status: 404 });
  };

  try {
    const first = await fetchLinkPreview(`${TEST_PREVIEW_BASE_URL}/reuse-docs`);
    const second = await fetchLinkPreview(`${TEST_PREVIEW_BASE_URL}/reuse-docs`);
    expect(first?.image).toMatch(/^\/media\/\d+$/);
    expect(second?.image).toBe(first?.image);
    expect(imageFetches).toBe(1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("expired cached preview images are purged and refreshed", async () => {
  const ws = getTestWorkspace();
  restoreEnv = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });

  const db = await import("../../../../src/db.js");
  db.initDatabase();

  const { fetchLinkPreview } = await import("../../../../src/channels/web/media/link-previews.js");

  const html = `
    <html><head>
      <meta property="og:title" content="Example Docs" />
      <meta property="og:image" content="${TEST_PREVIEW_BASE_URL}/expire-image.png" />
    </head><body>Test</body></html>
  `;

  const originalFetch = globalThis.fetch;
  let imageFetches = 0;
  globalThis.fetch = async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    if (url === `${TEST_PREVIEW_BASE_URL}/expire-docs`) {
      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    if (url === `${TEST_PREVIEW_BASE_URL}/expire-image.png`) {
      imageFetches += 1;
      return new Response(new Uint8Array([137, 80, 78, 71, imageFetches]), {
        status: 200,
        headers: { "content-type": "image/png", "content-length": "5" },
      });
    }
    return new Response("not found", { status: 404 });
  };

  try {
    const first = await fetchLinkPreview(`${TEST_PREVIEW_BASE_URL}/expire-docs`);
    const firstMediaId = Number(String(first?.image).replace("/media/", ""));
    db.getDb()
      .prepare("UPDATE link_preview_image_cache SET expires_at = ? WHERE source_url = ?")
      .run("2000-01-01T00:00:00.000Z", `${TEST_PREVIEW_BASE_URL}/expire-image.png`);

    const second = await fetchLinkPreview(`${TEST_PREVIEW_BASE_URL}/expire-docs`);
    const secondMediaId = Number(String(second?.image).replace("/media/", ""));

    expect(second?.image).toMatch(/^\/media\/\d+$/);
    expect(secondMediaId).not.toBe(firstMediaId);
    expect(db.getMediaById(firstMediaId)).toBeUndefined();
    expect(db.getMediaById(secondMediaId)?.content_type).toBe("image/png");
    expect(imageFetches).toBe(2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
