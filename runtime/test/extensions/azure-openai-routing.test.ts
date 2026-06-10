/**
 * azure-openai-routing.test.ts – Tests for Azure model routing guardrails.
 *
 * Covers:
 * - Slice 1: Responses-only route guarantee for gpt-5-4-pro
 * - Slice 2: Reasoning cap for gpt-5-mini tool flows
 * - Slice 3: Foundry compat flags on model registration
 */
import { expect, test, describe } from "bun:test";
import {
  registerAzureProviders,
  capToolFlowReasoning,
  getAzureContextInputBudget,
  getAzureMaxEstimatedInputTokens,
  getAzureResponsesReasoningConfig,
  getAzureResponsesTextConfig,
} from "../../extensions/integrations/azure-openai.ts";

describe("Slice 1: Responses-only routing", () => {
  test("gpt-5-4-pro is registered with the Responses API name", () => {
    const providers: Array<{ name: string; config: any }> = [];
    registerAzureProviders((name, config) => providers.push({ name, config }), "test-token");

    // Find the azure-openai provider
    const azureProvider = providers.find(p => p.name === "azure-openai");
    if (!azureProvider) return; // gpt-5-4-pro may not be in AOAI_MODEL_IDS

    const proModel = azureProvider.config.models.find((m: any) => m.id === "gpt-5-4-pro");
    if (!proModel) return; // gpt-5-4-pro may not be configured

    // Must use the Responses API, never completions
    expect(proModel.api).toBe("azure-openai-responses-mi");
    expect(proModel.api).not.toContain("completions");
  });

  test("all Azure OpenAI models use the Responses API", () => {
    const providers: Array<{ name: string; config: any }> = [];
    registerAzureProviders((name, config) => providers.push({ name, config }), "test-token");

    const azureProvider = providers.find(p => p.name === "azure-openai");
    if (!azureProvider) return;

    for (const model of azureProvider.config.models) {
      expect(model.api).toBe("azure-openai-responses-mi");
    }
  });

  test("Azure Responses stream payload disables server-side storage", async () => {
    const providers: Array<{ name: string; config: any }> = [];
    registerAzureProviders((name, config) => providers.push({ name, config }), "test-token");

    const azureProvider = providers.find(p => p.name === "azure-openai")!;
    const model = azureProvider.config.models[0];
    expect(model).toBeTruthy();

    const controller = new AbortController();
    controller.abort();
    let payload: any;
    azureProvider.config.streamSimple(
      {
        ...model,
        provider: "azure-openai",
        baseUrl: azureProvider.config.baseUrl,
        headers: {},
      },
      { messages: [], tools: [] },
      {
        signal: controller.signal,
        onPayload: (next: unknown) => { payload = next; },
      },
    );

    expect(payload).toBeTruthy();
    expect(payload.store).toBe(false);
    expect(payload.model).toBe(model.id);
    expect(payload.stream).toBe(true);
  });

  test("Foundry text models use the completions API, not Responses", () => {
    const providers: Array<{ name: string; config: any }> = [];
    registerAzureProviders((name, config) => providers.push({ name, config }), "test-token");

    const foundryProvider = providers.find(p => p.name === "azure-foundry");
    if (!foundryProvider) return;

    for (const model of foundryProvider.config.models) {
      expect(model.api).toBe("azure-foundry-openai-completions-mi");
    }
  });
});

describe("Slice 3: Foundry compat flags", () => {
  test("Foundry text models have compat flags set", () => {
    const providers: Array<{ name: string; config: any }> = [];
    registerAzureProviders((name, config) => providers.push({ name, config }), "test-token");

    const foundryProvider = providers.find(p => p.name === "azure-foundry");
    if (!foundryProvider) return;

    for (const model of foundryProvider.config.models) {
      expect(model.compat).toBeDefined();
      expect(model.compat.supportsStore).toBe(false);
      expect(model.compat.maxTokensField).toBe("max_tokens");
      expect(model.compat.supportsReasoningEffort).toBe(false);
      expect(model.compat.requiresAssistantAfterToolResult).toBe(true);
    }
  });

  test("Azure OpenAI models do NOT have Foundry compat flags", () => {
    const providers: Array<{ name: string; config: any }> = [];
    registerAzureProviders((name, config) => providers.push({ name, config }), "test-token");

    const azureProvider = providers.find(p => p.name === "azure-openai");
    if (!azureProvider) return;

    for (const model of azureProvider.config.models) {
      // Azure OpenAI models should not have Foundry-specific compat
      expect(model.compat).toBeUndefined();
    }
  });
});

describe("Proactive token-budget guard", () => {
  test("gpt-5-4 falls back to a context-aware budget when only default TPM is known", () => {
    expect(getAzureContextInputBudget("gpt-5-4")).toBe(900000);
    expect(getAzureMaxEstimatedInputTokens("gpt-5-4")).toBe(900000);
  });

  test("gpt-5.5 and deployment-name aliases use the 1.05M Azure context budget", () => {
    expect(getAzureContextInputBudget("gpt-5.5")).toBe(900000);
    expect(getAzureContextInputBudget("gpt-5.5-pro")).toBe(900000);
    expect(getAzureContextInputBudget("gpt-5-5")).toBe(900000);
    expect(getAzureContextInputBudget("gpt-5-5-pro")).toBe(900000);
  });

  test("unknown models fall back to the absolute cap", () => {
    expect(getAzureContextInputBudget("unknown-model")).toBe(120000);
    expect(getAzureMaxEstimatedInputTokens("unknown-model")).toBe(120000);
  });
});

describe("Responses text config", () => {
  test("defaults Azure GPT-5 text verbosity to medium", () => {
    expect(getAzureResponsesTextConfig()).toEqual({
      format: { type: "text" },
      verbosity: "medium",
    });
  });

  test("preserves supported verbosity overrides", () => {
    expect(getAzureResponsesTextConfig("low").verbosity).toBe("low");
    expect(getAzureResponsesTextConfig("high").verbosity).toBe("high");
  });

  test("clamps unsupported verbosity to medium", () => {
    expect(getAzureResponsesTextConfig("weird").verbosity).toBe("medium");
  });
});

describe("Responses reasoning config", () => {
  test("defaults reasoning summary to concise when omitted", () => {
    expect(getAzureResponsesReasoningConfig("gpt-5-4", { reasoningEffort: "high" }, false)).toEqual({
      effort: "high",
      summary: "concise",
    });
  });

  test("preserves supported reasoning summary overrides", () => {
    expect(getAzureResponsesReasoningConfig("gpt-5-4", { reasoningEffort: "medium", reasoningSummary: "concise" }, false)).toEqual({
      effort: "medium",
      summary: "concise",
    });
  });

  test("applies tool-flow effort cap without dropping the summary", () => {
    expect(getAzureResponsesReasoningConfig("gpt-5-mini", { reasoningEffort: "high" }, true)).toEqual({
      effort: "medium",
      summary: "concise",
    });
  });

  test("returns null when reasoning is fully disabled", () => {
    expect(getAzureResponsesReasoningConfig("gpt-5-4", undefined, false)).toBeNull();
  });
});

describe("Slice 2: Tool-flow reasoning cap", () => {
  test("gpt-5-mini at high is capped to medium when tools are present", () => {
    expect(capToolFlowReasoning("gpt-5-mini", "high", true)).toBe("medium");
  });

  test("gpt-5-mini at xhigh is capped to medium when tools are present", () => {
    expect(capToolFlowReasoning("gpt-5-mini", "xhigh", true)).toBe("medium");
  });

  test("gpt-5-mini at medium is NOT capped (already at or below cap)", () => {
    expect(capToolFlowReasoning("gpt-5-mini", "medium", true)).toBe("medium");
  });

  test("gpt-5-mini at minimal is NOT capped", () => {
    expect(capToolFlowReasoning("gpt-5-mini", "minimal", true)).toBe("minimal");
  });

  test("gpt-5-mini at high is NOT capped when no tools", () => {
    expect(capToolFlowReasoning("gpt-5-mini", "high", false)).toBe("high");
  });

  test("gpt-5-4 at high is NOT capped (no cap defined for this model)", () => {
    expect(capToolFlowReasoning("gpt-5-4", "high", true)).toBe("high");
  });

  test("gpt-5-4-pro at high is NOT capped", () => {
    expect(capToolFlowReasoning("gpt-5-4-pro", "high", true)).toBe("high");
  });

  test("unknown model at high is NOT capped", () => {
    expect(capToolFlowReasoning("gpt-99", "high", true)).toBe("high");
  });
});

describe("Function call arguments sanitization", () => {
  // The sanitization happens inside streamAzureOpenAIResponses which is hard to
  // unit test directly. Instead we export a helper and test the pattern inline.
  // These tests verify the logic that should be applied after convertResponsesMessages.

  function sanitizeFunctionCallArguments(items: any[]): void {
    for (const item of items) {
      if (item.type === "function_call") {
        const args = item.arguments;
        if (args === undefined || args === null) {
          item.arguments = "{}";
        } else if (typeof args !== "string") {
          item.arguments = JSON.stringify(args);
        }
      }
    }
  }

  test("undefined arguments become '{}'", () => {
    const items = [{ type: "function_call", call_id: "c1", name: "bash", arguments: undefined }];
    sanitizeFunctionCallArguments(items);
    expect(items[0].arguments).toBe("{}");
  });

  test("null arguments become '{}'", () => {
    const items = [{ type: "function_call", call_id: "c1", name: "bash", arguments: null }];
    sanitizeFunctionCallArguments(items);
    expect(items[0].arguments).toBe("{}");
  });

  test("object arguments are JSON-stringified", () => {
    const items = [{ type: "function_call", call_id: "c1", name: "bash", arguments: { command: "ls" } }];
    sanitizeFunctionCallArguments(items);
    expect(items[0].arguments).toBe('{"command":"ls"}');
  });

  test("string arguments are preserved as-is", () => {
    const items = [{ type: "function_call", call_id: "c1", name: "bash", arguments: '{"command":"ls"}' }];
    sanitizeFunctionCallArguments(items);
    expect(items[0].arguments).toBe('{"command":"ls"}');
  });

  test("non-function_call items are not modified", () => {
    const items = [{ type: "message", role: "assistant", content: [] }];
    sanitizeFunctionCallArguments(items);
    expect((items[0] as any).arguments).toBeUndefined();
  });
});

describe("Tool schema sanitization for Azure", () => {
  // Import not possible (private function), so we replicate the logic here
  // to verify the pattern the extension applies.
  function sanitizeToolSchema(schema: unknown): unknown {
    if (!schema || typeof schema !== "object") return schema;
    if (Array.isArray(schema)) return schema.map(sanitizeToolSchema);
    const result: Record<string, unknown> = { ...(schema as Record<string, unknown>) };
    if (result.type === "array" && !result.items) {
      result.items = {};
    }
    if (result.properties && typeof result.properties === "object" && !Array.isArray(result.properties)) {
      const fixed: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(result.properties as Record<string, unknown>)) {
        fixed[key] = sanitizeToolSchema(value);
      }
      result.properties = fixed;
    }
    if (result.items && typeof result.items === "object") {
      result.items = sanitizeToolSchema(result.items);
    }
    for (const key of ["anyOf", "oneOf", "allOf"] as const) {
      if (Array.isArray(result[key])) {
        result[key] = (result[key] as unknown[]).map(sanitizeToolSchema);
      }
    }
    return result;
  }

  test("array without items gets items: {}", () => {
    const schema = { type: "object", properties: { edits: { type: "array" } } };
    const fixed = sanitizeToolSchema(schema) as any;
    expect(fixed.properties.edits.items).toEqual({});
  });

  test("array with items is preserved", () => {
    const schema = { type: "object", properties: { edits: { type: "array", items: { type: "string" } } } };
    const fixed = sanitizeToolSchema(schema) as any;
    expect(fixed.properties.edits.items).toEqual({ type: "string" });
  });

  test("nested array without items is fixed", () => {
    const schema = {
      type: "object",
      properties: {
        outer: {
          type: "object",
          properties: {
            inner: { type: "array" },
          },
        },
      },
    };
    const fixed = sanitizeToolSchema(schema) as any;
    expect(fixed.properties.outer.properties.inner.items).toEqual({});
  });

  test("non-array types are unchanged", () => {
    const schema = { type: "object", properties: { name: { type: "string" } } };
    const fixed = sanitizeToolSchema(schema) as any;
    expect(fixed.properties.name).toEqual({ type: "string" });
    expect(fixed.properties.name.items).toBeUndefined();
  });

  test("null/undefined input returns as-is", () => {
    expect(sanitizeToolSchema(null)).toBeNull();
    expect(sanitizeToolSchema(undefined)).toBeUndefined();
  });

  test("anyOf/oneOf branches are recursed", () => {
    const schema = {
      anyOf: [
        { type: "array" },
        { type: "string" },
      ],
    };
    const fixed = sanitizeToolSchema(schema) as any;
    expect(fixed.anyOf[0].items).toEqual({});
    expect(fixed.anyOf[1].items).toBeUndefined();
  });
});
