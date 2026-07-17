import { afterEach, describe, expect, test } from "bun:test";
import {
  registerOptionalProviders,
  resetProviderBootstrapForTests,
  stopOptionalProviders,
  setProviderBootstrapLoaderForTests,
  type ProviderBootstrapAgentPool,
} from "../../src/runtime/provider-bootstrap.js";
import { setEnv } from "../helpers.js";

const restoreEnvStack: Array<() => void> = [];

afterEach(() => {
  resetProviderBootstrapForTests();
  while (restoreEnvStack.length > 0) {
    const restore = restoreEnvStack.pop();
    restore?.();
  }
});

function splitCsv(value: string | undefined): string[] {
  return (value ?? "").split(",").map((entry) => entry.trim()).filter(Boolean);
}

function installFakeAzureBootstrapLoader(): void {
  setProviderBootstrapLoaderForTests(async () => ({
    startAzureProviderBootstrap(register) {
      return {
        stop() {},
        async refresh() {
          const aoaiBaseUrl = process.env.AOAI_BASE_URL;
          if (aoaiBaseUrl) {
            let token = process.env.AOAI_API_KEY || "";
            if (!token) {
              const response = await fetch("http://example.test/imds");
              const payload = await response.json() as { access_token?: string };
              token = payload.access_token || "";
            }
            register("azure-openai", {
              baseUrl: aoaiBaseUrl,
              apiKey: token || undefined,
              models: splitCsv(process.env.AOAI_MODEL_IDS).map((id) => ({ id })),
            });
          }

          const foundryBaseUrl = process.env.FOUNDRY_BASE_URL;
          if (foundryBaseUrl) {
            let token = process.env.FOUNDRY_API_KEY || process.env.AOAI_API_KEY || "";
            if (!token) {
              const response = await fetch("http://example.test/imds");
              const payload = await response.json() as { access_token?: string };
              token = payload.access_token || "";
            }
            register("azure-foundry", {
              baseUrl: foundryBaseUrl,
              apiKey: token || undefined,
              models: splitCsv(process.env.FOUNDRY_MODEL_IDS).map((id) => ({ id })),
            });
          }
        },
      };
    },
  }));
}

function createPool(registrations: Array<{
  provider: string;
  config: Parameters<ProviderBootstrapAgentPool["registerModelProvider"]>[1];
}>): ProviderBootstrapAgentPool {
  return {
    hasProviderModels: () => false,
    registerModelProvider: (provider, config) => {
      registrations.push({ provider, config });
    },
  };
}

describe("runtime provider bootstrap", () => {
  test("registers azure-openai provider models when AOAI env is configured", async () => {
    installFakeAzureBootstrapLoader();
    restoreEnvStack.push(setEnv({
      AOAI_API_KEY: "token",
      AOAI_BASE_URL: "https://aoai.example",
      AOAI_MODEL_IDS: "gpt-5,gpt-5-mini",
      AOAI_MODEL_NAMES: "GPT 5,GPT 5 Mini",
      FOUNDRY_API_KEY: undefined,
      FOUNDRY_BASE_URL: undefined,
      FOUNDRY_MODEL_IDS: undefined,
      FOUNDRY_MODEL_NAMES: undefined,
    }));

    const registrations: Array<{
      provider: string;
      config: Parameters<ProviderBootstrapAgentPool["registerModelProvider"]>[1];
    }> = [];

    await registerOptionalProviders(createPool(registrations));

    expect(registrations).toHaveLength(1);
    expect(registrations[0].provider).toBe("azure-openai");
    expect(registrations[0].config.apiKey).toBe("token");
    expect(registrations[0].config.models?.map((m) => m.id)).toEqual(["gpt-5", "gpt-5-mini"]);
  });

  test("registers azure-openai provider models immediately in managed-identity mode", async () => {
    installFakeAzureBootstrapLoader();
    restoreEnvStack.push(setEnv({
      AOAI_API_KEY: undefined,
      AOAI_BASE_URL: "https://aoai.example",
      AOAI_MODEL_IDS: "gpt-5,gpt-5-mini",
      AOAI_MODEL_NAMES: "GPT 5,GPT 5 Mini",
      FOUNDRY_API_KEY: undefined,
      FOUNDRY_BASE_URL: undefined,
      FOUNDRY_MODEL_IDS: undefined,
      FOUNDRY_MODEL_NAMES: undefined,
    }));

    const previousFetch = globalThis.fetch;
    globalThis.fetch = (async () => new Response(JSON.stringify({
      access_token: "token-for-tests",
      expires_on: String(Math.floor(Date.now() / 1000) + 3600),
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })) as typeof fetch;

    const registrations: Array<{
      provider: string;
      config: Parameters<ProviderBootstrapAgentPool["registerModelProvider"]>[1];
    }> = [];

    try {
      await registerOptionalProviders(createPool(registrations));
    } finally {
      globalThis.fetch = previousFetch;
    }

    expect(registrations).toHaveLength(1);
    expect(registrations[0].provider).toBe("azure-openai");
    expect(registrations[0].config.apiKey).toBe("token-for-tests");
    expect(registrations[0].config.models?.map((m) => m.id)).toEqual(["gpt-5", "gpt-5-mini"]);
  });

  test("registers azure-foundry provider models when Foundry env is configured", async () => {
    installFakeAzureBootstrapLoader();
    restoreEnvStack.push(setEnv({
      AOAI_API_KEY: undefined,
      AOAI_BASE_URL: undefined,
      AOAI_MODEL_IDS: undefined,
      AOAI_MODEL_NAMES: undefined,
      FOUNDRY_API_KEY: "foundry-token",
      FOUNDRY_BASE_URL: "https://foundry.example",
      FOUNDRY_MODEL_IDS: "mistral-large-3,mistral-small-3",
      FOUNDRY_MODEL_NAMES: "Mistral Large 3,Mistral Small 3",
    }));

    const registrations: Array<{
      provider: string;
      config: Parameters<ProviderBootstrapAgentPool["registerModelProvider"]>[1];
    }> = [];

    await registerOptionalProviders(createPool(registrations));

    expect(registrations).toHaveLength(1);
    expect(registrations[0].provider).toBe("azure-foundry");
    expect(registrations[0].config.apiKey).toBe("foundry-token");
    expect(registrations[0].config.models?.map((m) => m.id)).toEqual(["mistral-large-3", "mistral-small-3"]);
  });

  test("registers azure-foundry provider models immediately in managed-identity mode", async () => {
    installFakeAzureBootstrapLoader();
    restoreEnvStack.push(setEnv({
      AOAI_API_KEY: undefined,
      AOAI_BASE_URL: undefined,
      AOAI_MODEL_IDS: undefined,
      AOAI_MODEL_NAMES: undefined,
      FOUNDRY_API_KEY: undefined,
      FOUNDRY_BASE_URL: "https://foundry.example",
      FOUNDRY_MODEL_IDS: "mistral-large-3,mistral-small-3",
      FOUNDRY_MODEL_NAMES: "Mistral Large 3,Mistral Small 3",
    }));

    const previousFetch = globalThis.fetch;
    globalThis.fetch = (async () => new Response(JSON.stringify({
      access_token: "token-for-tests",
      expires_on: String(Math.floor(Date.now() / 1000) + 3600),
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })) as typeof fetch;

    const registrations: Array<{
      provider: string;
      config: Parameters<ProviderBootstrapAgentPool["registerModelProvider"]>[1];
    }> = [];

    try {
      await registerOptionalProviders(createPool(registrations));
    } finally {
      globalThis.fetch = previousFetch;
    }

    expect(registrations).toHaveLength(1);
    expect(registrations[0].provider).toBe("azure-foundry");
    expect(registrations[0].config.apiKey).toBe("token-for-tests");
    expect(registrations[0].config.models?.map((m) => m.id)).toEqual(["mistral-large-3", "mistral-small-3"]);
  });

  test("repeated registration has one process owner and stopOptionalProviders stops it", async () => {
    let starts = 0;
    let stops = 0;
    setProviderBootstrapLoaderForTests(async () => ({
      startAzureProviderBootstrap() {
        starts += 1;
        return { stop() { stops += 1; }, async refresh() {} };
      },
    }));
    restoreEnvStack.push(setEnv({ AOAI_BASE_URL: "https://aoai.example" }));
    const pool = createPool([]);
    await registerOptionalProviders(pool);
    await registerOptionalProviders(pool);
    expect(starts).toBe(1);
    stopOptionalProviders();
    expect(stops).toBe(1);
  });

  test("failed initial refresh stops and clears the process owner so a later retry can start", async () => {
    let starts = 0;
    let stops = 0;
    setProviderBootstrapLoaderForTests(async () => ({
      startAzureProviderBootstrap() {
        starts += 1;
        return { stop() { stops += 1; }, async refresh() { if (starts === 1) throw new Error("token unavailable"); } };
      },
    }));
    restoreEnvStack.push(setEnv({ AOAI_BASE_URL: "https://aoai.example" }));
    const pool = createPool([]);
    await expect(registerOptionalProviders(pool)).rejects.toThrow("token unavailable");
    await registerOptionalProviders(pool);
    expect(starts).toBe(2);
    expect(stops).toBe(1);
  });

  test("does nothing when optional provider env vars are missing", async () => {
    installFakeAzureBootstrapLoader();
    restoreEnvStack.push(setEnv({
      AOAI_API_KEY: undefined,
      AOAI_BASE_URL: undefined,
      AOAI_MODEL_IDS: undefined,
      AOAI_MODEL_NAMES: undefined,
      FOUNDRY_API_KEY: undefined,
      FOUNDRY_BASE_URL: undefined,
      FOUNDRY_MODEL_IDS: undefined,
      FOUNDRY_MODEL_NAMES: undefined,
    }));

    let called = false;
    const pool: ProviderBootstrapAgentPool = {
      hasProviderModels: () => false,
      registerModelProvider: () => {
        called = true;
      },
    };

    await registerOptionalProviders(pool);

    expect(called).toBe(false);
  });
});
