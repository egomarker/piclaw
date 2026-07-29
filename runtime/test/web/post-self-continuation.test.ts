import { describe, expect, test } from "bun:test";
import { getSelfContinuationMeta } from "../../web/src/components/post.js";

describe("self-continuation post helpers", () => {
  test("labels an exit_process continuation as an agent self-resume", () => {
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
        label: "Agent self-resume",
      },
    ];

    expect(getSelfContinuationMeta(blocks)).toEqual({
      block: blocks[1],
      restartId: "restart-123",
      label: "Agent self-resume",
    });
  });

  test("ignores ordinary or malformed inbound message metadata", () => {
    expect(getSelfContinuationMeta(undefined)).toBeNull();
    expect(getSelfContinuationMeta([{ type: "self_continuation", source: "user" }])).toBeNull();
    expect(getSelfContinuationMeta([{
      type: "self_continuation",
      source: "exit_process",
      restart_id: "",
    }])).toBeNull();
  });
});
