import { expect, test } from "bun:test";

import {
  AZURE_RATE_LIMIT_BACKOFF_MS,
  formatAzureRateLimitMessage,
  formatAzureRetryDelay,
  isAzureRetryableRequestError,
  parseRetryAfterMs,
  resolveAzureRetryDelayMs,
} from "../../extensions/integrations/azure-openai.ts";

test("parseRetryAfterMs accepts delta-seconds and HTTP dates", () => {
  expect(parseRetryAfterMs("7")).toBe(7000);

  const nowMs = Date.parse("2026-04-17T00:00:00.000Z");
  expect(parseRetryAfterMs("Fri, 17 Apr 2026 00:00:05 GMT", nowMs)).toBe(5000);
});

test("isAzureRetryableRequestError treats HTTP 429 as retryable", () => {
  expect(isAzureRetryableRequestError({ status: 429 })).toBe(true);
  expect(isAzureRetryableRequestError({ status: 503 })).toBe(true);
  expect(isAzureRetryableRequestError({ status: 400 })).toBe(false);
});

test("resolveAzureRetryDelayMs respects Retry-After before fallback backoff", () => {
  const delayMs = resolveAzureRetryDelayMs({
    attempt: 0,
    error: {
      status: 429,
      headers: {
        "retry-after": "9",
      },
    },
  });

  expect(delayMs).toBe(9000);
});

test("resolveAzureRetryDelayMs accepts response-shaped status and headers", () => {
  const delayMs = resolveAzureRetryDelayMs({
    attempt: 0,
    error: {
      response: {
        status: 429,
        headers: {
          "retry-after": "12",
        },
      },
    },
  });

  expect(delayMs).toBe(12000);
});

test("resolveAzureRetryDelayMs falls back to Azure rate-limit backoff for 429s without Retry-After", () => {
  expect(resolveAzureRetryDelayMs({
    attempt: 1,
    error: { status: 429 },
  })).toBe(AZURE_RATE_LIMIT_BACKOFF_MS);
});

if (typeof Headers !== "undefined") {
  test("resolveAzureRetryDelayMs reads Retry-After from Headers instances", () => {
    expect(resolveAzureRetryDelayMs({
      attempt: 0,
      error: { status: 429, headers: new Headers({ "retry-after": "11" }) },
    })).toBe(11000);
  });
}

test("formatAzureRetryDelay uses compact human-readable waits", () => {
  expect(formatAzureRetryDelay(9500)).toBe("10s");
  expect(formatAzureRetryDelay(61000)).toBe("2 minutes");
});

test("formatAzureRateLimitMessage includes model, deployment, Retry-After wait, and fallback action", () => {
  const message = formatAzureRateLimitMessage({
    modelId: "gpt-5-4",
    deploymentName: "westus-gpt-5-4",
    retryDelayMs: 30000,
    retryAfterHonored: true,
    exhausted: true,
  });

  expect(message).toContain("Retry budget exhausted");
  expect(message).toContain("model gpt-5-4 (deployment westus-gpt-5-4)");
  expect(message).toContain("Wait about 30s");
  expect(message).toContain("Retry-After");
  expect(message).toContain("switch to another model");
});
