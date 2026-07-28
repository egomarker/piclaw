import { expect, test } from "bun:test";

import { formatProviderError, parseProviderError } from "../../src/channels/web/handlers/provider-error-format.js";

test("formatProviderError recognizes output-length stop diagnostics", () => {
  const message = "Provider stopped because it hit the maximum output length before finalization (finish reason: length). The partial answer was preserved.";

  const parsed = parseProviderError(message);
  expect(parsed?.message).toContain("maximum output length");

  const formatted = formatProviderError(message);
  expect(formatted).toMatchObject({
    category: "output_limit",
    label: "output limit",
    title: "Provider output limit reached",
    severity: "warning",
  });
  expect(formatted?.detail).toContain("Ask to continue");
});

test("formatProviderError does not misclassify context-length pressure as output limit", () => {
  const formatted = formatProviderError("OpenAI API error (400): maximum context length exceeded");

  expect(formatted?.category).not.toBe("output_limit");
});

test("formatProviderError gives switch-model guidance for definitive model_not_supported", () => {
  const raw = 'OpenAI API error (400): {"message":"The requested model is not supported.","code":"model_not_supported","param":"model","type":"invalid_request_error"}';

  const formatted = formatProviderError(raw);
  expect(formatted?.category).toBe("model_availability");
  expect(formatted?.detail).toContain("code: model_not_supported");
  expect(formatted?.detail).toContain("Switch to a supported model");
  expect(formatted?.detail).not.toContain("temporary provider outage");
});

test("formatProviderError keeps retry guidance for transient model outages", () => {
  const formatted = formatProviderError("400 Model not supported during GitHub provider outage");

  expect(formatted?.category).toBe("model_availability");
  expect(formatted?.detail).toContain("temporary provider outage");
  expect(formatted?.detail).not.toContain("Switch to a supported model");
});

test("formatProviderError parses API error status prefixes for Azure rate limits", () => {
  const formatted = formatProviderError(
    "Azure OpenAI API error (429): RateLimitReached. Wait about 30s before retrying."
  );

  expect(formatted).toMatchObject({
    category: "rate_limit",
  });
  expect(formatted?.detail).toContain("status: 429");
});
