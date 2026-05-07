/**
 * agent-pool/session-binder.ts – Session binder lifecycle helper.
 */

import type { AgentSessionRuntime } from "@earendil-works/pi-coding-agent";

import type { PoolEntry } from "./session-manager.js";

/** Dependencies required to bind existing/new sessions into AgentPool. */
export interface AgentSessionBinderOptions {
  pool: Map<string, PoolEntry>;
  onError?: (message: string, details: Record<string, unknown>) => void;
}

/**
 * Manages the optional session binder callback and applies it to sessions.
 */
export class AgentSessionBinder {
  private binder?: (runtime: AgentSessionRuntime, chatJid: string) => Promise<void> | void;

  constructor(private readonly options: AgentSessionBinderOptions) {}

  setBinder(binder?: (runtime: AgentSessionRuntime, chatJid: string) => Promise<void> | void): void {
    this.binder = binder;
    if (!binder) return;
    for (const [jid, entry] of this.options.pool) {
      void this.runBinder(entry.runtime, jid, "set_session_binder.bind_existing_session");
    }
  }

  async bindSession(runtime: AgentSessionRuntime, chatJid: string): Promise<void> {
    await this.runBinder(runtime, chatJid, "bind_session");
  }

  private async runBinder(runtime: AgentSessionRuntime, chatJid: string, operation: string): Promise<void> {
    if (!this.binder) return;
    try {
      await this.binder(runtime, chatJid);
    } catch (err) {
      this.options.onError?.("Failed to bind session", {
        operation,
        chatJid,
        err,
      });
    }
  }
}
