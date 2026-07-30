import { describe, expect, test } from "bun:test";
import {
  getRestartHandoffMeta,
  getSelfContinuationMeta,
} from "../../web/src/components/post.js";

describe("self-continuation post helpers", () => {
  test("recognizes an exit_process continuation without persisting a display label", () => {
    const blocks = [
      {
        type: "restart_handoff",
        source: "exit_process",
        restart_id: "restart-123",
        phase: "resume",
      },
      {
        type: "self_continuation",
        source: "exit_process",
        restart_id: "restart-123",
        label: "Legacy English label",
      },
    ];

    expect(getSelfContinuationMeta(blocks)).toEqual({
      block: blocks[1],
      restartId: "restart-123",
    });
  });

  test("reads locale-neutral restart notice and completion metadata", () => {
    expect(getRestartHandoffMeta([{
      type: "restart_handoff",
      source: "exit_process",
      restart_id: " restart-notice ",
      phase: "notice",
      reason: " Deploy the new build. ",
    }])).toEqual({
      block: {
        type: "restart_handoff",
        source: "exit_process",
        restart_id: " restart-notice ",
        phase: "notice",
        reason: " Deploy the new build. ",
      },
      restartId: "restart-notice",
      phase: "notice",
      reason: "Deploy the new build.",
    });

    expect(getRestartHandoffMeta([{
      type: "restart_handoff",
      source: "exit_process",
      restart_id: "restart-complete",
      phase: "completion",
    }])).toMatchObject({
      restartId: "restart-complete",
      phase: "completion",
      reason: "",
    });
  });

  test("ignores ordinary or malformed restart metadata", () => {
    expect(getSelfContinuationMeta(undefined)).toBeNull();
    expect(getSelfContinuationMeta([{ type: "self_continuation", source: "user" }])).toBeNull();
    expect(getSelfContinuationMeta([{
      type: "self_continuation",
      source: "exit_process",
      restart_id: "restart-unpaired",
    }])).toBeNull();
    expect(getSelfContinuationMeta([{
      type: "restart_handoff",
      source: "exit_process",
      restart_id: "restart-a",
      phase: "resume",
    }, {
      type: "self_continuation",
      source: "exit_process",
      restart_id: "restart-b",
    }])).toBeNull();
    expect(getSelfContinuationMeta([{
      type: "self_continuation",
      source: "exit_process",
      restart_id: "",
    }])).toBeNull();
    expect(getRestartHandoffMeta([{ type: "restart_handoff", source: "user" }])).toBeNull();
    expect(getRestartHandoffMeta([{
      type: "restart_handoff",
      source: "exit_process",
      restart_id: "restart-invalid-phase",
      phase: "unknown",
    }])).toBeNull();
  });
});
