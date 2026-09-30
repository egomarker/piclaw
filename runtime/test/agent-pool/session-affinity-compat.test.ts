import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Api, Model } from "@earendil-works/pi-ai";

import {
  applyLegacySessionAffinityCompatibility,
  installLegacySessionAffinityCompatibility,
} from "../../src/agent-pool/session-affinity-compat.js";
import { createRuntimeModelServices } from "../../src/agent-pool/model-services.js";

function model(id: string, compat: Record<string, unknown>): Model<Api> {
  return {
    id,
    name: id,
    provider: "custom-openai",
    api: "openai-responses",
    baseUrl: "https://example.invalid/v1",
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 100_000,
    maxTokens: 8_000,
    compat,
  } as Model<Api>;
}

describe("legacy session affinity compatibility", () => {
  test("maps the removed boolean field without overriding an explicit replacement", () => {
    const disabled = model("disabled", { sendSessionIdHeader: false });
    const enabled = model("enabled", { sendSessionIdHeader: true });
    const explicit = model("explicit", { sendSessionIdHeader: false, sessionAffinityFormat: "openrouter" });

    expect(applyLegacySessionAffinityCompatibility([disabled, enabled, explicit])).toEqual([
      { provider: "custom-openai", modelId: "disabled", previous: false, sessionAffinityFormat: "openai-nosession" },
      { provider: "custom-openai", modelId: "enabled", previous: true, sessionAffinityFormat: "openai" },
    ]);
    expect((disabled.compat as any).sessionAffinityFormat).toBe("openai-nosession");
    expect((enabled.compat as any).sessionAffinityFormat).toBe("openai");
    expect((explicit.compat as any).sessionAffinityFormat).toBe("openrouter");
  });

  test("preserves the removed field when ModelRuntime loads a real legacy models.json", async () => {
    const root = mkdtempSync(join(tmpdir(), "piclaw-affinity-models-"));
    try {
      writeFileSync(join(root, "models.json"), JSON.stringify({
        providers: {
          legacy: {
            baseUrl: "https://example.invalid/v1",
            api: "openai-responses",
            apiKey: "test-key",
            models: [{ id: "legacy-model", compat: { sendSessionIdHeader: false } }],
          },
        },
      }));
      const { modelRegistry: registry } = await createRuntimeModelServices({ agentDir: root });
      const warnings: Array<Record<string, unknown>> = [];

      expect(registry.getError()).toBeUndefined();
      expect((registry.find("legacy", "legacy-model")?.compat as any).sendSessionIdHeader).toBe(false);
      installLegacySessionAffinityCompatibility(registry, (_message, details) => warnings.push(details));

      expect((registry.find("legacy", "legacy-model")?.compat as any).sessionAffinityFormat).toBe("openai-nosession");
      expect(warnings).toHaveLength(1);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("reloads models.json without freezing the compatibility overlay snapshot", async () => {
    const root = mkdtempSync(join(tmpdir(), "piclaw-affinity-reload-"));
    const modelsPath = join(root, "models.json");
    const writeModels = (ids: string[]) => writeFileSync(modelsPath, JSON.stringify({
      providers: {
        legacy: {
          baseUrl: "https://example.invalid/v1",
          api: "openai-responses",
          apiKey: "test-key",
          models: ids.map((id) => ({ id, compat: { sendSessionIdHeader: false } })),
        },
      },
    }));
    try {
      writeModels(["one"]);
      const { modelRegistry: registry } = await createRuntimeModelServices({ agentDir: root });
      installLegacySessionAffinityCompatibility(registry, () => {});
      expect(registry.getAll().filter((entry) => entry.provider === "legacy").map((entry) => entry.id)).toEqual(["one"]);

      writeModels(["one", "two"]);
      await registry.refresh();
      expect(registry.getAll().filter((entry) => entry.provider === "legacy").map((entry) => entry.id)).toEqual(["one", "two"]);
      expect((registry.find("legacy", "two")?.compat as any).sessionAffinityFormat).toBe("openai-nosession");

      writeModels(["two"]);
      await registry.refresh();
      expect(registry.getAll().filter((entry) => entry.provider === "legacy").map((entry) => entry.id)).toEqual(["two"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 20_000);

  test("decorates real runtime reads and reloads without rewriting JSONC or explicit affinity", async () => {
    const root = mkdtempSync(join(tmpdir(), "piclaw-affinity-jsonc-"));
    const path = join(root, "models.json");
    const jsonc = `{
      // Keep this operator comment and trailing commas.
      "providers": {
        "legacy": {
          "baseUrl": "https://example.invalid/v1",
          "api": "openai-responses",
          "apiKey": "fixture-key",
          "models": [
            { "id": "disabled", "compat": { "sendSessionIdHeader": false } },
            { "id": "enabled", "compat": { "sendSessionIdHeader": true } },
            { "id": "explicit", "compat": { "sendSessionIdHeader": false, "sessionAffinityFormat": "openrouter" } },
          ],
        },
      },
    }\n`;
    try {
      writeFileSync(path, jsonc);
      const { modelRegistry: registry, modelRuntime } = await createRuntimeModelServices({ agentDir: root });
      const warnings: Array<Record<string, unknown>> = [];
      installLegacySessionAffinityCompatibility(registry, (_message, details) => warnings.push(details));
      const formats = (models: readonly Model<Api>[]) => models.filter((entry) => entry.provider === "legacy")
        .map((entry) => [entry.id, (entry.compat as any).sessionAffinityFormat]).sort();
      const expected = [["disabled", "openai-nosession"], ["enabled", "openai"], ["explicit", "openrouter"]];
      expect(formats(registry.getAll())).toEqual(expected);
      expect(formats(modelRuntime.getModels("legacy"))).toEqual(expected);
      expect(formats(await modelRuntime.getAvailable("legacy", { signal: new AbortController().signal }))).toEqual(expected);
      expect((modelRuntime.getModel("legacy", "enabled")?.compat as any).sessionAffinityFormat).toBe("openai");
      const result = await registry.refresh();
      expect(result.aborted).toBe(false);
      expect(result.errors.size).toBe(0);
      expect(formats(registry.getAll())).toEqual(expected);
      expect(warnings).toHaveLength(2);
      expect(readFileSync(path, "utf8")).toBe(jsonc);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("works with lightweight registry doubles that do not expose refresh", () => {
    const legacyModel = model("no-refresh", { sendSessionIdHeader: false });
    const warnings: Array<Record<string, unknown>> = [];
    installLegacySessionAffinityCompatibility({ getAll: () => [legacyModel] } as any, (_message, details) => warnings.push(details));
    expect((legacyModel.compat as any).sessionAffinityFormat).toBe("openai-nosession");
    expect(warnings).toHaveLength(1);
  });

  test("reapplies only after asynchronous registry refresh completes", async () => {
    let models = [model("legacy", { sendSessionIdHeader: false })];
    let release: (() => void) | undefined;
    const blocker = new Promise<void>((resolve) => { release = resolve; });
    const warnings: Array<Record<string, unknown>> = [];
    const result = { aborted: true, errors: new Map([["custom-openai", new Error("catalog failed")]]) };
    const options = { providers: ["custom-openai"], allowNetwork: false, signal: new AbortController().signal };
    const registry = {
      getAll: () => models,
      refresh: async (received: unknown) => {
        expect(received).toBe(options);
        await blocker;
        models = [model("legacy", { sendSessionIdHeader: false }), model("new-legacy", { sendSessionIdHeader: true })];
        return result;
      },
    } as any;

    installLegacySessionAffinityCompatibility(registry, (_message, details) => warnings.push(details));
    const refreshing = registry.refresh(options);
    expect(models).toHaveLength(1);
    release?.();
    expect(await refreshing).toBe(result);

    expect((models[0].compat as any).sessionAffinityFormat).toBe("openai-nosession");
    expect((models[1].compat as any).sessionAffinityFormat).toBe("openai");
    expect(warnings.map((warning) => warning.model)).toEqual([
      "custom-openai/legacy",
      "custom-openai/new-legacy",
    ]);
  });
});
