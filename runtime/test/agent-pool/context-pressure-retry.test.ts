import { beforeEach, describe, expect, it } from "bun:test";

import "../helpers.js";
import { recordCompactionCancellationReason } from "../../src/agent-pool/compaction-cancel-reason.js";
import { initDatabase } from "../../src/db.js";
import {
  promptWithContextPressureRetry,
  RECOVERY_CONTINUATION_PROMPT,
} from "../../src/agent-pool/context-pressure-retry.js";

const CONTEXT_ERROR = "OpenAI API error (400): Your input exceeds the context window of this model.";

beforeEach(() => initDatabase());

class ContextPressureSession {
  private listeners: Array<(event: any) => void> = [];
  promptCalls = 0;
  promptTexts: string[] = [];
  compactCalls = 0;
  sessionManager = {};

  subscribe(listener: (event: any) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((candidate) => candidate !== listener);
    };
  }

  async prompt(text: string) {
    this.promptCalls += 1;
    this.promptTexts.push(text);
    if (this.promptCalls === 1) {
      for (const listener of this.listeners) {
        listener({
          type: "message_end",
          message: { role: "assistant", stopReason: "error", errorMessage: CONTEXT_ERROR, content: [] },
        });
      }
    }
  }

  async compact() {
    this.compactCalls += 1;
  }
}

describe("promptWithContextPressureRetry compaction lifecycle", () => {
  it("uses the shared lifecycle and retries only after successful compaction", async () => {
    const session = new ContextPressureSession();

    await expect(promptWithContextPressureRetry(session as any, "continue"))
      .resolves.toEqual({ compacted: true });
    expect(session.promptCalls).toBe(2);
    expect(session.promptTexts).toEqual(["continue", "continue"]);
    expect(session.compactCalls).toBe(1);
  });

  it("uses a continuation instead of duplicating a persisted user turn", async () => {
    class PersistingSession extends ContextPressureSession {
      leafId = "baseline";
      override sessionManager = { getLeafId: () => this.leafId };

      override async prompt(text: string) {
        this.leafId = `attempt-${this.promptCalls + 1}`;
        await super.prompt(text);
      }

      override async compact() {
        this.compactCalls += 1;
        this.leafId = "compacted";
      }
    }

    const session = new PersistingSession();
    await expect(promptWithContextPressureRetry(session as any, "continue"))
      .resolves.toEqual({ compacted: true });
    expect(session.promptTexts).toEqual(["continue", RECOVERY_CONTINUATION_PROMPT]);
  });

  it("surfaces a recorded smart-compaction cancellation reason and does not retry", async () => {
    class FailedCompactionSession extends ContextPressureSession {
      override async compact() {
        this.compactCalls += 1;
        recordCompactionCancellationReason(this.sessionManager, "Smart compaction terminal validation failed");
        throw new Error("Compaction cancelled");
      }
    }
    const session = new FailedCompactionSession();

    await expect(promptWithContextPressureRetry(session as any, "continue"))
      .rejects.toThrow("Smart compaction terminal validation failed");
    expect(session.promptCalls).toBe(1);
    expect(session.compactCalls).toBe(1);
  });
});
