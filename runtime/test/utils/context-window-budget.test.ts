import { afterEach, describe, expect, test } from "bun:test";

import { setEnv } from "../helpers.js";
import { resetCompactionRuntimeConfigForTests, setCompactionRuntimeConfigForTests } from "../../src/core/config.js";
import {
  applyTokenEstimateSafetyMultiplier,
  getCompactionRequestOverheadTokens,
  getSystemPromptOverheadTokens,
  getUnknownModelContextWindow,
} from "../../src/utils/context-window-budget.js";

afterEach(() => {
  resetCompactionRuntimeConfigForTests();
});

describe("context-window budget config parsing", () => {
  test("uses domain-backed compaction overhead settings", () => {
    setCompactionRuntimeConfigForTests({
      systemPromptOverheadTokens: 6_000,
      compactionRequestOverheadTokens: 1_500,
      tokenEstimateSafetyMultiplier: 1.25,
    });

    expect(getSystemPromptOverheadTokens()).toBe(6_000);
    expect(getCompactionRequestOverheadTokens()).toBe(1_500);
    expect(applyTokenEstimateSafetyMultiplier(100)).toBe(125);
  });

  test("unknown-model context window keeps strict env fallback semantics", () => {
    const restore = setEnv({ PICLAW_UNKNOWN_MODEL_CONTEXT_WINDOW: "9999oops" });
    try {
      expect(getUnknownModelContextWindow()).toBe(64_000);
    } finally {
      restore();
    }
  });

  test("unknown-model zero preserves fallback semantics", () => {
    const restore = setEnv({ PICLAW_UNKNOWN_MODEL_CONTEXT_WINDOW: "0" });
    try {
      expect(getUnknownModelContextWindow()).toBe(64_000);
    } finally {
      restore();
    }
  });
});
