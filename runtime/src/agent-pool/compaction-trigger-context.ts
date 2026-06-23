import { AsyncLocalStorage } from "node:async_hooks";

export type PiclawCompactionTrigger =
  | "manual"
  | "pre_prompt"
  | "idle"
  | "recovery"
  | "model_switch"
  | "model_downshift"
  | "rotation"
  | "threshold"
  | "overflow"
  | string;

export interface PiclawCompactionTriggerMetadata {
  chatJid: string;
  trigger: PiclawCompactionTrigger;
  willRetry: boolean;
  source: string;
  attempt?: number;
  targetContextWindow?: number;
  targetModelLabel?: string;
}

export interface UpstreamCompactionEventMetadata {
  reason?: string;
  willRetry?: boolean;
}

const compactionTriggerStorage = new AsyncLocalStorage<PiclawCompactionTriggerMetadata>();

export function getActivePiclawCompactionTrigger(): PiclawCompactionTriggerMetadata | null {
  return compactionTriggerStorage.getStore() ?? null;
}

export async function runWithPiclawCompactionTrigger<T>(
  metadata: PiclawCompactionTriggerMetadata,
  fn: () => Promise<T>,
): Promise<T> {
  return await compactionTriggerStorage.run(metadata, fn);
}

export function resolvePiclawCompactionTrigger(
  upstream: UpstreamCompactionEventMetadata = {},
): PiclawCompactionTriggerMetadata {
  const active = getActivePiclawCompactionTrigger();
  if (active) return active;
  return {
    chatJid: "unknown",
    trigger: upstream.reason ?? "manual",
    willRetry: upstream.willRetry === true,
    source: "upstream",
  };
}

export function buildPiclawCompactionEventFields(
  metadata: PiclawCompactionTriggerMetadata,
  upstream: UpstreamCompactionEventMetadata = {},
): Record<string, unknown> {
  const reason = upstream.reason ?? metadata.trigger;
  return {
    reason,
    trigger: metadata.trigger,
    piclawReason: metadata.trigger,
    willRetry: upstream.willRetry ?? metadata.willRetry,
    source: metadata.source,
    chatJid: metadata.chatJid,
    ...(metadata.attempt !== undefined ? { attempt: metadata.attempt } : {}),
    ...(metadata.targetContextWindow !== undefined ? { targetContextWindow: metadata.targetContextWindow } : {}),
    ...(metadata.targetModelLabel !== undefined ? { targetModelLabel: metadata.targetModelLabel } : {}),
  };
}
