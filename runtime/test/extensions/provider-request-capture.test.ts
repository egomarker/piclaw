import { afterEach, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  createProviderRequestCaptureExtension,
  parseProviderRequestCaptureSessionIds,
} from "../../src/extensions/provider-request-capture.js";
import { createFakeExtensionApi } from "./fake-extension-api.js";

const tempDirectories: string[] = [];

function createTempDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), "piclaw-provider-request-capture-"));
  tempDirectories.push(directory);
  return directory;
}

function createContext(sessionId: string) {
  return {
    cwd: "/workspace",
    sessionManager: {
      getSessionId: () => sessionId,
      getSessionFile: () => `/sessions/${sessionId}.jsonl`,
    },
    model: {
      provider: "opencode-zen",
      id: "x-preview-f-free",
      api: "openai-completions",
    },
  } as any;
}

function getProviderRequestHandler(harness: ReturnType<typeof createFakeExtensionApi>) {
  const registration = harness.handlers.find(({ event }) => event === "before_provider_request");
  expect(registration).toBeDefined();
  return registration!.handler;
}

afterEach(() => {
  while (tempDirectories.length > 0) {
    rmSync(tempDirectories.pop()!, { recursive: true, force: true });
  }
});

test("parseProviderRequestCaptureSessionIds accepts comma and whitespace delimiters", () => {
  expect([...parseProviderRequestCaptureSessionIds(" first,second\n third  ")]).toEqual([
    "first",
    "second",
    "third",
  ]);
  expect(parseProviderRequestCaptureSessionIds("  ").size).toBe(0);
});

test("provider request capture writes exact payload bytes and separate metadata without mutation", async () => {
  const directory = createTempDirectory();
  const sessionId = "01a02fba-a37b-7090-bb4a-519b4e09eadf";
  const harness = createFakeExtensionApi();
  createProviderRequestCaptureExtension({
    getConfig: () => ({ enabled: true, directory, sessionIds: sessionId }),
    now: () => new Date("2026-08-23T20:00:00.123Z"),
    createCaptureId: () => "capture-a",
  })(harness.api);

  const payload = {
    model: "x-preview-f-free",
    messages: [
      { role: "system", content: "system" },
      { role: "user", content: "héllo" },
    ],
    stream: true,
    omittedByTransport: undefined,
  };
  const expectedRequestBody = JSON.stringify(payload);
  const payloadBefore = structuredClone(payload);

  const result = await getProviderRequestHandler(harness)(
    { type: "before_provider_request", payload },
    createContext(sessionId),
  );

  expect(result).toBeUndefined();
  expect(payload).toEqual(payloadBefore);
  const sessionDirectory = join(directory, sessionId);
  const files = readdirSync(sessionDirectory).sort();
  expect(files).toEqual([
    "2026-08-23T20-00-00-123Z__0001__capture-a.meta.json",
    "2026-08-23T20-00-00-123Z__0001__capture-a.request.json",
  ]);

  const requestPath = join(sessionDirectory, files[1]);
  const metadataPath = join(sessionDirectory, files[0]);
  expect(readFileSync(requestPath, "utf8")).toBe(expectedRequestBody);
  const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
  expect(metadata).toMatchObject({
    capturedAt: "2026-08-23T20:00:00.123Z",
    sessionId,
    sessionFile: `/sessions/${sessionId}.jsonl`,
    provider: "opencode-zen",
    modelId: "x-preview-f-free",
    api: "openai-completions",
    sequence: 1,
    requestFile: files[1],
    payloadBytes: Buffer.byteLength(expectedRequestBody, "utf8"),
    payloadSha256: createHash("sha256").update(expectedRequestBody, "utf8").digest("hex"),
    serialization: "JSON.stringify",
  });
  expect(statSync(directory).mode & 0o777).toBe(0o700);
  expect(statSync(sessionDirectory).mode & 0o777).toBe(0o700);
  expect(statSync(requestPath).mode & 0o777).toBe(0o600);
  expect(statSync(metadataPath).mode & 0o777).toBe(0o600);
});

test("provider request capture honors the session allowlist", async () => {
  const directory = createTempDirectory();
  const harness = createFakeExtensionApi();
  createProviderRequestCaptureExtension({
    getConfig: () => ({ enabled: true, directory, sessionIds: "allowed-session" }),
  })(harness.api);

  const payload = { messages: [{ role: "user", content: "unchanged" }] };
  const result = await getProviderRequestHandler(harness)(
    { type: "before_provider_request", payload },
    createContext("other-session"),
  );

  expect(result).toBeUndefined();
  expect(payload).toEqual({ messages: [{ role: "user", content: "unchanged" }] });
  expect(readdirSync(directory)).toEqual([]);
});

test("provider request capture is disabled by default config and capture failures are non-fatal", async () => {
  const disabledDirectory = createTempDirectory();
  const disabledHarness = createFakeExtensionApi();
  createProviderRequestCaptureExtension({
    getConfig: () => ({ enabled: false, directory: disabledDirectory, sessionIds: "" }),
  })(disabledHarness.api);
  await getProviderRequestHandler(disabledHarness)(
    { type: "before_provider_request", payload: { messages: [] } },
    createContext("disabled-session"),
  );
  expect(readdirSync(disabledDirectory)).toEqual([]);

  const failureDirectory = createTempDirectory();
  const failureHarness = createFakeExtensionApi();
  createProviderRequestCaptureExtension({
    getConfig: () => ({ enabled: true, directory: failureDirectory, sessionIds: "" }),
  })(failureHarness.api);
  const circular: Record<string, unknown> = {};
  circular.self = circular;
  const result = await getProviderRequestHandler(failureHarness)(
    { type: "before_provider_request", payload: circular },
    createContext("circular-session"),
  );
  expect(result).toBeUndefined();
  expect(circular.self).toBe(circular);
  expect(readdirSync(failureDirectory)).toEqual([]);
});
