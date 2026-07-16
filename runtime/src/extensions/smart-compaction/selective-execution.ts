/** Backward-compatible Selective names for the shared single-request model executor. */
export {
  runCompactionModelExecution as runSelectiveCompaction,
  type CompactionModelExecutionResult as SelectiveCompactionExecutionResult,
  type CompactionModelStage as SelectiveCompactionStage,
} from "./model-execution.js";
