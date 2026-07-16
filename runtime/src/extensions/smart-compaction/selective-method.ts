/** Selective processing-method adapter over the shared source/lifecycle contract. */
import type { FileOperations } from "@earendil-works/pi-coding-agent";
import type { TopicShiftSignal } from "./selective-prompt.js";
import { buildSelectivePromptWithCoverage, type SelectivePromptBuildResult } from "./selective-prompt.js";
import type { PreparedCompactionSource } from "./source.js";

export function buildSelectiveMethodPrompt(input: {
  source: PreparedCompactionSource;
  tokensBefore: number;
  fileOps: FileOperations;
  topicShift: TopicShiftSignal | null;
}): SelectivePromptBuildResult {
  return buildSelectivePromptWithCoverage(
    input.source.llmMessages,
    {
      tokensBefore: input.tokensBefore,
      previousSummary: input.source.previousSummary,
      fileOps: input.fileOps,
      keptMessagesSummary: input.source.retainedContext,
      turnPrefixSummary: "",
    },
    input.source.customInstructions,
    input.topicShift,
    input.source.humanUserIndexes,
  );
}
