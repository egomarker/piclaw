/**
 * Opt-in capture of the final provider request payload.
 *
 * This extension must be registered last. It observes the payload after every
 * other `before_provider_request` handler and returns `undefined`, so it cannot
 * replace or mutate the request. Captures contain sensitive conversation data
 * and are written with owner-only permissions.
 */

import { createHash, randomUUID } from "node:crypto";
import { chmodSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import type { ExtensionFactory } from "@earendil-works/pi-coding-agent";

import {
  getProviderRequestCaptureConfig,
  type ProviderRequestCaptureConfig,
} from "../core/config.js";
import { createLogger } from "../utils/logger.js";

const log = createLogger("extensions.provider-request-capture");

export interface ProviderRequestCaptureMetadata {
  capturedAt: string;
  sessionId: string;
  sessionFile: string | null;
  provider: string | null;
  modelId: string | null;
  api: string | null;
  sequence: number;
  requestFile: string;
  payloadBytes: number;
  payloadSha256: string;
  serialization: "JSON.stringify";
}

export interface ProviderRequestCaptureResult {
  requestPath: string;
  metadataPath: string;
  metadata: ProviderRequestCaptureMetadata;
}

export interface PersistProviderRequestOptions {
  directory: string;
  sessionId: string;
  sessionFile?: string | null;
  provider?: string | null;
  modelId?: string | null;
  api?: string | null;
  payload: unknown;
  capturedAt: Date;
  sequence: number;
  captureId?: string;
}

export interface ProviderRequestCaptureExtensionOptions {
  getConfig?: () => Readonly<ProviderRequestCaptureConfig>;
  now?: () => Date;
  createCaptureId?: () => string;
}

function safePathSegment(value: string): string {
  const sanitized = value.trim().replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 200);
  if (!sanitized || sanitized === "." || sanitized === "..") {
    throw new Error("Provider request capture requires a valid session ID.");
  }
  return sanitized;
}

function writeAtomic(path: string, contents: string): void {
  const tempPath = `${path}.tmp-${process.pid}-${randomUUID()}`;
  try {
    writeFileSync(tempPath, contents, { encoding: "utf8", flag: "wx", mode: 0o600 });
    renameSync(tempPath, path);
    chmodSync(path, 0o600);
  } catch (error) {
    rmSync(tempPath, { force: true });
    throw error;
  }
}

/** Parse the optional session allowlist. An empty value means all sessions. */
export function parseProviderRequestCaptureSessionIds(raw: string): ReadonlySet<string> {
  return new Set(raw.split(/[\s,]+/u).map((value) => value.trim()).filter(Boolean));
}

/** Persist a raw request body and separate metadata sidecar without changing the payload. */
export function persistProviderRequestCapture(
  options: PersistProviderRequestOptions,
): ProviderRequestCaptureResult {
  const requestJson = JSON.stringify(options.payload);
  if (requestJson === undefined) {
    throw new Error("Provider request payload is not JSON serializable.");
  }

  const root = resolve(options.directory);
  const sessionDirectory = resolve(root, safePathSegment(options.sessionId));
  mkdirSync(sessionDirectory, { recursive: true, mode: 0o700 });
  chmodSync(root, 0o700);
  chmodSync(sessionDirectory, 0o700);

  const timestamp = options.capturedAt.toISOString().replace(/[:.]/g, "-");
  const sequence = Math.max(0, Math.trunc(options.sequence));
  const captureId = safePathSegment(options.captureId ?? randomUUID());
  const stem = `${timestamp}__${String(sequence).padStart(4, "0")}__${captureId}`;
  const requestPath = resolve(sessionDirectory, `${stem}.request.json`);
  const metadataPath = resolve(sessionDirectory, `${stem}.meta.json`);
  const metadata: ProviderRequestCaptureMetadata = {
    capturedAt: options.capturedAt.toISOString(),
    sessionId: options.sessionId,
    sessionFile: options.sessionFile ?? null,
    provider: options.provider ?? null,
    modelId: options.modelId ?? null,
    api: options.api ?? null,
    sequence,
    requestFile: basename(requestPath),
    payloadBytes: Buffer.byteLength(requestJson, "utf8"),
    payloadSha256: createHash("sha256").update(requestJson, "utf8").digest("hex"),
    serialization: "JSON.stringify",
  };

  // Keep the transport-equivalent JSON bytes clean; metadata lives separately.
  writeAtomic(requestPath, requestJson);
  writeAtomic(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  return { requestPath, metadataPath, metadata };
}

export function createProviderRequestCaptureExtension(
  options: ProviderRequestCaptureExtensionOptions = {},
): ExtensionFactory {
  const getConfig = options.getConfig ?? getProviderRequestCaptureConfig;
  const now = options.now ?? (() => new Date());
  const createCaptureId = options.createCaptureId ?? randomUUID;

  return (pi) => {
    let sequence = 0;
    pi.on("before_provider_request", (event, ctx) => {
      try {
        const config = getConfig();
        if (!config.enabled) return;

        const sessionId = ctx.sessionManager.getSessionId();
        const allowedSessionIds = parseProviderRequestCaptureSessionIds(config.sessionIds);
        if (allowedSessionIds.size > 0 && !allowedSessionIds.has(sessionId)) return;

        sequence += 1;
        const result = persistProviderRequestCapture({
          directory: resolve(ctx.cwd, config.directory),
          sessionId,
          sessionFile: ctx.sessionManager.getSessionFile(),
          provider: ctx.model?.provider,
          modelId: ctx.model?.id,
          api: ctx.model?.api,
          payload: event.payload,
          capturedAt: now(),
          sequence,
          captureId: createCaptureId(),
        });
        log.info("Captured final provider request payload", {
          operation: "provider_request_capture.write",
          sessionId,
          provider: ctx.model?.provider,
          modelId: ctx.model?.id,
          api: ctx.model?.api,
          requestPath: result.requestPath,
          payloadBytes: result.metadata.payloadBytes,
          payloadSha256: result.metadata.payloadSha256,
        });
      } catch (error) {
        log.warn("Failed to capture final provider request payload; request will continue unchanged", {
          operation: "provider_request_capture.write_failed",
          error: error instanceof Error ? error.message : String(error),
        });
      }
      // Returning undefined is deliberate: the provider payload is observational only.
    });
  };
}

export const providerRequestCapture = createProviderRequestCaptureExtension();
