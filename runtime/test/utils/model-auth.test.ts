import { describe, expect, test } from "bun:test";
import { resolveModelRequestAuth } from "../../src/utils/model-auth.js";

describe("model auth helper", () => {
  const model = { provider: "openai", id: "gpt-test" } as any;

  test("uses getApiKeyAndHeaders request auth when available", async () => {
    const auth = await resolveModelRequestAuth({
      getApiKeyAndHeaders: async () => ({
        ok: true,
        apiKey: "header-key",
        headers: { "X-Test": "1" },
        env: { TEST_BASE_URL: "https://example.test" },
      }),
      getApiKey: async () => "legacy-key",
    } as any, model);

    expect(auth).toEqual({
      ok: true,
      apiKey: "header-key",
      headers: { "X-Test": "1" },
      env: { TEST_BASE_URL: "https://example.test" },
    });
  });

  test("uses getApiKey only as a legacy fallback", async () => {
    const auth = await resolveModelRequestAuth({
      getApiKey: async () => "direct-key",
    } as any, model);

    expect(auth).toEqual({ ok: true, apiKey: "direct-key" });
  });

  test("returns a stable error when no credentials are available", async () => {
    const auth = await resolveModelRequestAuth({
      getApiKeyAndHeaders: async () => ({ ok: false, error: "missing auth" }),
    } as any, model);

    expect(auth).toEqual({ ok: false, error: "missing auth" });
  });

  test("returns error when getApiKey returns undefined", async () => {
    const auth = await resolveModelRequestAuth({
      getApiKey: async () => undefined,
    } as any, model);

    expect(auth).toEqual({ ok: false, error: "No credentials available for openai/gpt-test." });
  });
});
