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

test("formatProviderError parses API error status prefixes for Azure rate limits", () => {
  const formatted = formatProviderError(
    "Azure OpenAI API error (429): RateLimitReached. Wait about 30s before retrying."
  );

  expect(formatted).toMatchObject({
    category: "rate_limit",
  });
  expect(formatted?.detail).toContain("status: 429");
});
