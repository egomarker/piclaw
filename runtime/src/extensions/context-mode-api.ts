/**
 * extensions/context-mode-api.ts – Stable extension-facing API for context-mode helpers.
 *
 * Provides a narrow, documented import surface for `extensions/integrations/context-mode.ts`
 * so extension code does not reach into multiple internal module paths.
 */

export {
  createBatchExecTool,
  createToolOutputSearchTool,
} from "../tools/context-tools.js";

export {
  buildPreview,
  readToolOutputFile,
  saveToolOutput,
  startToolOutputCleanup,
} from "../tool-output.js";

export {
  getToolResultCompactionEnabled,
  getToolResultCompactionThresholdsByTool,
  getToolResultCompactionTools,
  getToolResultSemanticSummaryConfig,
} from "../core/config.js";

export { resolveModelRequestAuth } from "../utils/model-auth.js";
