import { describe, expect, it } from "bun:test";
import {
  buildTrimmedCompactionRetryPrompt,
  getCompactionRetryPromptTokenTarget,
} from "../../src/extensions/smart-compaction.js";

describe("smart-compaction public compatibility helpers", () => {
  it("retains model-aware retry prompt sizing", () => {
    expect(getCompactionRetryPromptTokenTarget({ contextWindow: 128_000 }))
      .toBeGreaterThan(getCompactionRetryPromptTokenTarget({ contextWindow: 16_000 }));
  });

  it("retains bounded prompt trimming without using it in compaction execution", () => {
    const prompt = [
      "# Smart compaction prompt",
      "## Session Metadata",
      "- important instructions",
      "\n## Conversation Excerpts",
      "older".repeat(20_000),
      "RECENT-CONTEXT-MARKER",
    ].join("\n");

    const trimmed = buildTrimmedCompactionRetryPrompt(prompt, 8_000);

    expect(trimmed).toBeTruthy();
    expect(trimmed!.length).toBeLessThan(prompt.length);
    expect(trimmed).toContain("## Session Metadata");
    expect(trimmed).toContain("## Conversation Excerpts");
    expect(trimmed).toContain("RECENT-CONTEXT-MARKER");
  });
});
