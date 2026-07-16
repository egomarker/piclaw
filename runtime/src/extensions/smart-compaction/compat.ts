/** Legacy public helpers retained without reintroducing lossy execution retries. */
import { getTokenEstimateSafetyMultiplier } from "../../utils/context-window-budget.js";

/**
 * Build the historical bounded retry prompt shape for external callers.
 * Smart-compaction execution no longer uses this helper: provider input
 * overflow cancels rather than retrying with omitted source material.
 */
export function buildTrimmedCompactionRetryPrompt(promptText: string, targetPromptTokens: number): string | null {
  const targetChars = Math.max(1_000, Math.floor(targetPromptTokens / getTokenEstimateSafetyMultiplier()) * 4);
  if (promptText.length <= targetChars) return null;
  const marker = "\n## Conversation Excerpts";
  const markerIndex = promptText.indexOf(marker);
  const notice = "\n\n… (older/less relevant compaction excerpts trimmed after provider context-overflow; preserve current task continuity from the remaining excerpts) …\n\n";
  if (markerIndex < 0) {
    const headChars = Math.min(Math.floor(targetChars * 0.35), Math.floor(promptText.length * 0.35));
    const tailChars = targetChars - headChars - notice.length;
    if (tailChars < 256) return null;
    return `${promptText.slice(0, headChars)}${notice}${promptText.slice(-tailChars)}`;
  }

  const headEnd = Math.min(promptText.length, markerIndex + marker.length + 512);
  const head = promptText.slice(0, headEnd);
  const tailChars = targetChars - head.length - notice.length;
  if (tailChars < 1_000) return null;
  return `${head}${notice}${promptText.slice(-tailChars)}`;
}
