/** Lifecycle status, cancellation, and stale-UI isolation for smart compaction. */
import { recordCompactionCancellationReason } from "../../agent-pool/compaction-cancel-reason.js";
import type { PiclawCompactionTriggerMetadata } from "../../agent-pool/compaction-trigger-context.js";
import { createLogger } from "../../utils/logger.js";
import { estimateSmartCompactionCompletionPercent, formatProgressCount, formatSmartCompactionStatus } from "./context.js";
import type { ProgressiveCompactionProgress } from "./progressive.js";

const log = createLogger("ext.smart-compaction.status");

function resilientUi(ctx: { ui: Record<string, unknown> }): typeof ctx.ui {
  return new Proxy(ctx.ui, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== "function") return value;
      return (...args: unknown[]) => {
        try {
          return (value as (...fnArgs: unknown[]) => unknown).apply(target, args);
        } catch (err) {
          if (err instanceof Error && /stale|disposed|invalid/i.test(err.message)) {
            log.debug(`UI call ${String(prop)} suppressed (stale ctx)`);
            return undefined;
          }
          throw err;
        }
      };
    },
  });
}

export type ResilientCtx<T> = Omit<T, "ui"> & { ui: T extends { ui: infer U } ? U : never };

export function makeResilientCtx<T extends { ui: Record<string, unknown> }>(ctx: T): ResilientCtx<T> {
  return Object.create(ctx, { ui: { get: () => resilientUi(ctx), configurable: true } });
}

export function cancelCompactionWithReason(ctx: { sessionManager?: unknown }, message: string): { cancel: true } {
  recordCompactionCancellationReason(ctx.sessionManager, message);
  return { cancel: true };
}

export interface SmartCompactionStatusOwner {
  token: symbol;
  chatJid?: string;
  sessionManager?: object;
  fallback: boolean;
}

const statusOwnerByChat = new Map<string, symbol>();
const statusOwnerBySessionManager = new WeakMap<object, symbol>();
let fallbackStatusOwner: symbol | null = null;

/** Claim UI ownership before publishing any status for one compaction run. */
export function beginCompactionStatusOwnership(
  metadata: PiclawCompactionTriggerMetadata,
  ctx: { sessionManager?: unknown },
): SmartCompactionStatusOwner {
  const token = Symbol("smart-compaction-status");
  if (metadata.chatJid && metadata.chatJid !== "unknown") {
    statusOwnerByChat.set(metadata.chatJid, token);
    return { token, chatJid: metadata.chatJid, fallback: false };
  }
  if (ctx.sessionManager && typeof ctx.sessionManager === "object") {
    statusOwnerBySessionManager.set(ctx.sessionManager, token);
    return { token, sessionManager: ctx.sessionManager, fallback: false };
  }
  fallbackStatusOwner = token;
  return { token, fallback: true };
}

/** True only while this run is still the newest status owner for its scope. */
export function ownsCompactionStatus(owner: SmartCompactionStatusOwner): boolean {
  if (owner.chatJid) return statusOwnerByChat.get(owner.chatJid) === owner.token;
  if (owner.sessionManager) return statusOwnerBySessionManager.get(owner.sessionManager) === owner.token;
  return owner.fallback && fallbackStatusOwner === owner.token;
}

export function publishCompactionStatus(
  ctx: { ui: { setStatus?: (key: string, text: string | undefined) => void } },
  message?: string,
  completionPercent?: number | null,
  owner?: SmartCompactionStatusOwner,
): void {
  if (owner && !ownsCompactionStatus(owner)) return;
  ctx.ui.setStatus?.("smart_compaction", message ? formatSmartCompactionStatus(message, completionPercent) : undefined);
}

/** Clear status only if this run still owns it, then retire the ownership token. */
export function finishCompactionStatusOwnership(
  ctx: { ui: { setStatus?: (key: string, text: string | undefined) => void } },
  owner: SmartCompactionStatusOwner,
): void {
  if (!ownsCompactionStatus(owner)) return;
  publishCompactionStatus(ctx, undefined, undefined, owner);
  if (owner.chatJid) statusOwnerByChat.delete(owner.chatJid);
  else if (owner.sessionManager) statusOwnerBySessionManager.delete(owner.sessionManager);
  else if (owner.fallback) fallbackStatusOwner = null;
}

export function isRecoveryCompaction(metadata: PiclawCompactionTriggerMetadata): boolean {
  return metadata.willRetry || metadata.trigger === "recovery" || metadata.trigger === "overflow";
}

export function getCompactionStatusPrefix(metadata: PiclawCompactionTriggerMetadata): string {
  if (isRecoveryCompaction(metadata)) return "Recovery compaction";
  if (metadata.trigger === "idle") return "Idle smart compaction";
  if (metadata.trigger === "manual") return "Manual smart compaction";
  if (metadata.trigger === "model_switch" || metadata.trigger === "model_downshift") return "Target-aware smart compaction";
  return "Smart compaction";
}

export function statusMessage(metadata: PiclawCompactionTriggerMetadata, message: string): string {
  return `${getCompactionStatusPrefix(metadata)}: ${message}`;
}

export function estimateProgressiveProgressCompletion(progress?: ProgressiveCompactionProgress): number {
  if (progress?.phase === "progressive_chunk" && progress.chunkIndex && progress.totalChunks) {
    return 30 + Math.round(((progress.chunkIndex - 0.5) / Math.max(1, progress.totalChunks)) * 40);
  }
  if (progress?.phase === "progressive_merge") return 78;
  if (progress?.phase === "progressive_compress") return 90;
  if (progress?.phase === "progressive_final") return 94;
  return estimateSmartCompactionCompletionPercent(progress?.phase ?? "progressive_streaming");
}

export function formatProgressiveProgressMessage(progress?: ProgressiveCompactionProgress): string {
  if (progress?.phase === "progressive_chunk" && progress.chunkIndex && progress.totalChunks) {
    return `Smart compaction: summarizing chunk ${formatProgressCount(progress.chunkIndex, progress.totalChunks)}…`;
  }
  if (progress?.phase === "progressive_merge" && progress.mergePass && progress.batchIndex) {
    return `Smart compaction: merging summaries pass ${progress.mergePass}, batch ${progress.batchIndex}…`;
  }
  if (progress?.phase === "progressive_compress" && progress.compressPass) {
    return `Smart compaction: compressing final summary, pass ${formatProgressCount(progress.compressPass, 3)}…`;
  }
  if (progress?.phase === "progressive_final") {
    return "Smart compaction: final progressive merge still running…";
  }
  return "Smart compaction: progressive summary still running…";
}
