import { expect, test } from "bun:test";
import { estimateSmartCompactionCompletionPercent, formatSmartCompactionStatus } from "../../src/extensions/smart-compaction/context.js";

test("uses canonical repair and method completion phase names", () => {
  expect(estimateSmartCompactionCompletionPercent("generating_summary_repair", 0)).toBe(55);
  expect(estimateSmartCompactionCompletionPercent("completed_selective", 0)).toBe(100);
  expect(estimateSmartCompactionCompletionPercent("completed_pipelined", 0)).toBe(100);
});

test("formats real trigger-prefixed progress without double compaction labels", () => {
  expect(formatSmartCompactionStatus("Manual smart compaction: provider-native compaction in progress — openai-codex/gpt-5.5", 18))
    .toBe("Smart compaction: 18% — provider-native compaction in progress — openai-codex/gpt-5.5");
  expect(formatSmartCompactionStatus("Recovery compaction: local pipelined fallback — provider-native unsupported", 30))
    .toBe("Smart compaction: 30% — local pipelined fallback — provider-native unsupported");
});

test("does not retain obsolete fallback and method phase mappings", () => {
  expect(estimateSmartCompactionCompletionPercent("generating_summary_trimmed_retry", 0)).toBe(50);
  expect(estimateSmartCompactionCompletionPercent("builtin_fallback", 0)).toBe(50);
  expect(estimateSmartCompactionCompletionPercent("progressive_builtin_fallback", 0)).toBe(50);
  expect(estimateSmartCompactionCompletionPercent("completed_traditional_pipelined", 0)).toBe(50);
});
