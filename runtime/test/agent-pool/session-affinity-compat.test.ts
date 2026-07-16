import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Api, Model } from "@earendil-works/pi-ai";
import { AuthStorage, ModelRegistry } from "@earendil-works/pi-coding-agent";

import {
  applyLegacySessionAffinityCompatibility,
  installLegacySessionAffinityCompatibility,
} from "../../src/agent-pool/session-affinity-compat.js";

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
    const explicit = model("explicit", {
      sendSessionIdHeader: false,
      sessionAffinityFormat: "openrouter",
    });

    expect(applyLegacySessionAffinityCompatibility([disabled, enabled, explicit])).toEqual([
      {
        provider: "custom-openai",
        modelId: "disabled",
        previous: false,
        sessionAffinityFormat: "openai-nosession",
      },
      {
        provider: "custom-openai",
        modelId: "enabled",
        previous: true,
        sessionAffinityFormat: "openai",
      },
    ]);
    expect((disabled.compat as any).sessionAffinityFormat).toBe("openai-nosession");
    expect((enabled.compat as any).sessionAffinityFormat).toBe("openai");
    expect((explicit.compat as any).sessionAffinityFormat).toBe("openrouter");
  });

  test("preserves the removed field when Pi loads a real legacy models.json", () => {
    const root = mkdtempSync(join(tmpdir(), "piclaw-affinity-models-"));
    try {
      const modelsPath = join(root, "models.json");
      writeFileSync(modelsPath, JSON.stringify({
        providers: {
          legacy: {
            baseUrl: "https://example.invalid/v1",
            api: "openai-responses",
            models: [{ id: "legacy-model", compat: { sendSessionIdHeader: false } }],
          },
        },
      }));
      const registry = ModelRegistry.create(AuthStorage.create(join(root, "auth.json")), modelsPath);
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

  test("works with lightweight registry doubles that do not expose refresh", () => {
    const legacyModel = model("no-refresh", { sendSessionIdHeader: false });
    const warnings: Array<Record<string, unknown>> = [];
    const registry = {
      getAll: () => [legacyModel],
    };

    installLegacySessionAffinityCompatibility(registry as any, (_message, details) => warnings.push(details));

    expect((legacyModel.compat as any).sessionAffinityFormat).toBe("openai-nosession");
    expect(warnings).toHaveLength(1);
  });

  test("reapplies after registry refresh and warns once per model", () => {
    let models = [model("legacy", { sendSessionIdHeader: false })];
    const warnings: Array<Record<string, unknown>> = [];
    const registry = {
      getAll: () => models,
      refresh: () => {
        models = [model("legacy", { sendSessionIdHeader: false }), model("new-legacy", { sendSessionIdHeader: true })];
      },
    } as unknown as ModelRegistry;

    installLegacySessionAffinityCompatibility(registry, (_message, details) => warnings.push(details));
    expect((models[0].compat as any).sessionAffinityFormat).toBe("openai-nosession");
    expect(warnings).toHaveLength(1);

    registry.refresh();
    expect((models[0].compat as any).sessionAffinityFormat).toBe("openai-nosession");
    expect((models[1].compat as any).sessionAffinityFormat).toBe("openai");
    expect(warnings.map((warning) => warning.model)).toEqual([
      "custom-openai/legacy",
      "custom-openai/new-legacy",
    ]);

    installLegacySessionAffinityCompatibility(registry, () => {
      throw new Error("installer must be idempotent");
    });
    registry.refresh();
    expect(warnings).toHaveLength(2);
  });
});
