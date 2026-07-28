/**
 * channels/web/agent-status-store.ts – in-memory + persisted web agent status state.
 */

import { getInflightRuns, getPreflightRuns, type InflightRun, type PreflightRun } from "../../../db.js";

interface AgentStatusStateStore {
  load(): void;
  save(): void;
  setAgentStatus(chatJid: string, status: Record<string, unknown> | null): void;
  getAgentStatuses(): Record<string, Record<string, unknown>>;
}

interface AgentStatusInflightStore {
  getPreflightRuns?: () => Array<Pick<PreflightRun, "chatJid" | "startedAt">>;
  getInflightRuns(): Array<Pick<InflightRun, "chatJid" | "startedAt">>;
}

const STATUS_RUNTIME_GENERATION = [
  String(process.pid || "0"),
  Date.now().toString(36),
  Math.random().toString(36).slice(2, 10),
].join(":");

const STATUS_RUNTIME_GENERATION_KEY = "runtime_generation";

function withRuntimeGeneration(status: Record<string, unknown>): Record<string, unknown> {
  return {
    ...status,
    [STATUS_RUNTIME_GENERATION_KEY]: STATUS_RUNTIME_GENERATION,
  };
}

function hasCurrentRuntimeGeneration(status: Record<string, unknown> | null | undefined): boolean {
  if (!status || typeof status !== "object") return false;
  return status[STATUS_RUNTIME_GENERATION_KEY] === STATUS_RUNTIME_GENERATION;
}

function buildRestartRecoveryStatus(
  pending: Pick<InflightRun, "startedAt"> | Pick<PreflightRun, "startedAt">,
  phase: "preflight" | "inflight",
): Record<string, unknown> {
  return {
    type: "intent",
    kind: "info",
    intent_key: "recovery",
    source: "startup_recovery",
    title: phase === "preflight" ? "Recovering interrupted pre-prompt work" : "Recovering interrupted response",
    detail: phase === "preflight"
      ? "Clearing a persisted preflight marker before the prompt started."
      : "Reconstructing runtime state from the persisted inflight marker.",
    blocking: true,
    started_at: pending.startedAt,
    [STATUS_RUNTIME_GENERATION_KEY]: STATUS_RUNTIME_GENERATION,
  };
}

/** In-memory + persisted lifecycle store for active web agent statuses. */
export class AgentStatusStore {
  private activeAgentStatuses = new Map<string, Record<string, unknown>>();
  private terminalStatusExpiresAt = new Map<string, number>();
  private terminalStatusTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(
    private readonly state: AgentStatusStateStore,
    private readonly inflightStore: AgentStatusInflightStore = { getPreflightRuns, getInflightRuns },
    private readonly terminalStatusTtlMs = 15_000,
  ) {}

  private clearTerminalStatusTimer(chatJid: string): void {
    const timer = this.terminalStatusTimers.get(chatJid);
    if (timer) clearTimeout(timer);
    this.terminalStatusTimers.delete(chatJid);
  }

  private clearAllTerminalStatusTimers(): void {
    for (const timer of this.terminalStatusTimers.values()) clearTimeout(timer);
    this.terminalStatusTimers.clear();
  }

  private scheduleTerminalStatusExpiry(chatJid: string, expiresAt: number): void {
    this.clearTerminalStatusTimer(chatJid);
    const timer = setTimeout(() => {
      if (this.terminalStatusExpiresAt.get(chatJid) !== expiresAt) return;
      this.activeAgentStatuses.delete(chatJid);
      this.terminalStatusExpiresAt.delete(chatJid);
      this.terminalStatusTimers.delete(chatJid);
    }, Math.max(0, expiresAt - Date.now()));
    (timer as { unref?: () => void }).unref?.();
    this.terminalStatusTimers.set(chatJid, timer);
  }

  load(): void {
    this.state.load();

    // Persisted agentStatuses are only trustworthy when they were written by
    // the current process generation. After a restart, the durable truth comes
    // from chat_cursors inflight markers, and get() synthesizes a fresh
    // recovery status from that durable state when needed.
    const restored = this.state.getAgentStatuses();
    const nextStatuses = new Map<string, Record<string, unknown>>();
    let mutated = false;

    for (const [jid, status] of Object.entries(restored)) {
      if (hasCurrentRuntimeGeneration(status)) {
        nextStatuses.set(jid, status);
        continue;
      }
      this.state.setAgentStatus(jid, null);
      mutated = true;
    }

    if (mutated) {
      this.state.save();
    }

    this.activeAgentStatuses = nextStatuses;
    this.clearAllTerminalStatusTimers();
    this.terminalStatusExpiresAt.clear();
  }

  update(chatJid: string, status: Record<string, unknown>): void {
    const type = status?.type;
    const stamped = withRuntimeGeneration(status);
    this.activeAgentStatuses.set(chatJid, stamped);
    if (type === "done" || type === "error") {
      const expiresAt = Date.now() + this.terminalStatusTtlMs;
      this.terminalStatusExpiresAt.set(chatJid, expiresAt);
      this.scheduleTerminalStatusExpiry(chatJid, expiresAt);
      return;
    }
    this.clearTerminalStatusTimer(chatJid);
    this.terminalStatusExpiresAt.delete(chatJid);
  }

  get(chatJid: string): Record<string, unknown> | null {
    const active = this.activeAgentStatuses.get(chatJid);
    if (active) {
      const expiresAt = this.terminalStatusExpiresAt.get(chatJid);
      if (expiresAt === undefined || expiresAt > Date.now()) return active;
      this.activeAgentStatuses.delete(chatJid);
      this.terminalStatusExpiresAt.delete(chatJid);
      this.clearTerminalStatusTimer(chatJid);
    }

    const inflight = this.inflightStore.getInflightRuns().find((entry) => entry.chatJid === chatJid);
    if (inflight) return buildRestartRecoveryStatus(inflight, "inflight");

    const preflight = this.inflightStore.getPreflightRuns?.().find((entry) => entry.chatJid === chatJid);
    if (!preflight) return null;
    return buildRestartRecoveryStatus(preflight, "preflight");
  }

  clearPersistedStatuses(): void {
    // Migration cleanup: removes any agentStatuses that were written to
    // router_state by older code. update() no longer persists active statuses,
    // so after one full restart cycle this becomes a no-op.
    const persisted = this.state.getAgentStatuses();
    const chatJids = Object.keys(persisted);
    this.activeAgentStatuses.clear();
    this.clearAllTerminalStatusTimers();
    this.terminalStatusExpiresAt.clear();
    if (chatJids.length === 0) return;
    for (const chatJid of chatJids) {
      this.state.setAgentStatus(chatJid, null);
    }
    this.state.save();
  }
}
