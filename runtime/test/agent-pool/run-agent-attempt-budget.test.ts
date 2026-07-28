import { describe, expect, test } from "bun:test";

import "../helpers.js";

import { createAttemptToolBudgetController } from "../../src/agent-pool/run-agent-attempt-budget.js";

describe("prompt attempt tool budget", () => {
  test("applies a deferred soft stop after every threshold-crossing tool call finishes", () => {
    let activeTools = ["read", "bash"];
    const session = {
      agent: {},
      getActiveToolNames: () => [...activeTools],
      setActiveToolsByName: (names: string[]) => { activeTools = [...names]; },
    } as any;
    const controller = createAttemptToolBudgetController({
      session,
      chatJid: "web:test-attempt-budget",
      initialToolExecutionCount: 0,
      toolUseMessageBudget: 2,
      toolUseWarningThreshold: 1,
      runOptions: {},
      getRunObservabilityDetails: () => ({}),
    });

    controller.requestToolBudgetSoftStop([{ id: "call-a" }, { id: "call-b" }], 2);
    expect(controller.state.toolUseSoftStopApplied).toBe(false);
    expect(activeTools).toEqual(["read", "bash"]);

    controller.consumeToolExecutionEnd("call-a", false);
    expect(controller.state.toolUseSoftStopApplied).toBe(false);
    expect(activeTools).toEqual(["read", "bash"]);

    controller.consumeToolExecutionEnd("call-b", false);
    expect(controller.state.toolUseSoftStopApplied).toBe(true);
    expect(activeTools).toEqual([]);

    controller.restoreToolBudgetSoftStop();
    expect(activeTools).toEqual(["read", "bash"]);
  });
});
