import type { ModelRuntime } from "@earendil-works/pi-coding-agent";

export interface ModelRefreshResult {
  status: "completed" | "timed_out" | "failed";
  errors: ReadonlyMap<string, Error>;
  error?: Error;
}

export interface ModelRefreshCoordinatorOptions {
  modelRuntime: Pick<ModelRuntime, "refresh">;
  timeoutMs?: number;
  onComplete?: (result: ModelRefreshResult) => void;
}

/** Coalesces post-start catalog refresh requests and bounds caller wait time. */
export class ModelRefreshCoordinator {
  private inFlight: Promise<ModelRefreshResult> | null = null;
  private operationInFlight: Promise<void> | null = null;

  constructor(private readonly options: ModelRefreshCoordinatorOptions) {}

  queue(): Promise<ModelRefreshResult> {
    if (this.inFlight) return this.inFlight;
    const task = this.run();
    const tracked = task.finally(() => {
      if (this.inFlight === tracked) this.inFlight = null;
    });
    this.inFlight = tracked;
    return tracked;
  }

  private async run(): Promise<ModelRefreshResult> {
    if (this.operationInFlight) return { status: "timed_out", errors: new Map() };

    const controller = new AbortController();
    const timeoutMs = Math.max(1, this.options.timeoutMs ?? 15_000);
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    let resolveTimeout: (() => void) | undefined;
    const timeoutPromise = new Promise<void>((resolve) => { resolveTimeout = resolve; });

    const refreshOperation = this.options.modelRuntime.refresh({
      allowNetwork: true,
      signal: controller.signal,
    });
    const operationSettled = refreshOperation.then(() => undefined, () => undefined).finally(() => {
      if (this.operationInFlight === operationSettled) this.operationInFlight = null;
    });
    this.operationInFlight = operationSettled;

    timeoutHandle = setTimeout(() => {
      controller.abort();
      resolveTimeout?.();
    }, timeoutMs);
    (timeoutHandle as { unref?: () => void }).unref?.();

    let result: ModelRefreshResult;
    try {
      const winner = await Promise.race([
        refreshOperation.then((refreshed) => ({ kind: "refresh" as const, refreshed })),
        timeoutPromise.then(() => ({ kind: "timeout" as const })),
      ]);
      if (winner.kind === "timeout") {
        result = { status: "timed_out", errors: new Map() };
      } else {
        result = {
          status: winner.refreshed.aborted ? "timed_out" : "completed",
          errors: winner.refreshed.errors,
        };
      }
    } catch (error) {
      result = {
        status: controller.signal.aborted ? "timed_out" : "failed",
        errors: new Map(),
        error: error instanceof Error ? error : new Error(String(error)),
      };
    } finally {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    }
    this.options.onComplete?.(result);
    return result;
  }
}
