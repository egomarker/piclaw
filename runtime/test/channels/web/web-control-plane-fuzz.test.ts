import { expect, test } from "bun:test";

import {
  DEFAULT_FUZZ_ARTIFACT_DIR,
  DEFAULT_FUZZ_SEED,
  runWebControlPlaneFuzzAudit,
} from "./web-control-plane-fuzz-audit.js";

const TEST_ARTIFACT_DIR = `${DEFAULT_FUZZ_ARTIFACT_DIR}/test`;

test("web control-plane fuzz audit stays replayable and gap-free for the canonical seed", async () => {
  const summary = await runWebControlPlaneFuzzAudit({
    seed: DEFAULT_FUZZ_SEED,
    iterations: 45,
    artifactDir: TEST_ARTIFACT_DIR,
  });

  expect(summary.web_fuzz_gap_count).toBe(0);
  expect(summary.unhandled_exceptions).toBe(0);
  expect(summary.typed_failure_gaps).toBe(0);
  expect(summary.extension_hook_order_failures).toBe(0);
  expect(summary.artifact_outputs_present).toBe(1);
  expect(summary.summaryPath).toContain(TEST_ARTIFACT_DIR);
});
