import { describe, expect, it } from "bun:test";
import {
  assemblePipelineEvents,
  buildPipelinedPlan,
  prepareCompactionSource,
} from "../../src/extensions/smart-compaction.js";

const text = (value: string) => [{ type: "text", text: value }];
const user = (value: string) => ({ role: "user", content: text(value) });
const assistant = (value: string) => ({ role: "assistant", content: text(value) });
const toolCall = (id: string, name: string, args: unknown) => ({
  role: "assistant",
  content: [{ type: "text", text: `Running ${name}.` }, { type: "toolCall", id, name, arguments: args }],
});
const toolResult = (id: string, name: string, value: string, isError = false) => ({
  role: "toolResult",
  toolCallId: id,
  toolName: name,
  content: text(value),
  isError,
});

function repeated(seed: string, count: number): string {
  return Array.from({ length: count }, (_, index) =>
    `${seed}-${index}: preserve constraints, exact paths, decisions, and observed outcomes.`
  ).join(" ");
}

function prepare(rawMessages: any[]) {
  return prepareCompactionSource({
    rawMessages,
    rawSourceEntryIds: rawMessages.map((_, index) => `entry-${index}`),
    modelSafeSourceMessages: rawMessages,
    modelSafeSourceIndexes: rawMessages.map((_, index) => index),
    previousSummary: "## Goal\nContinue the active task.",
    retainedContext: "The newest user turn remains verbatim.",
    customInstructions: "Preserve exact failures and deployment restrictions.",
    fileOps: { read: new Set(), written: new Set(), edited: new Set() },
  });
}

function routineDiscussion() {
  const messages: any[] = [];
  for (let index = 1; index <= 12; index += 1) {
    messages.push(user(`Discussion request ${index}: do not deploy without approval.`));
    messages.push(assistant(`Decision ${index}. ${repeated(`analysis-${index}`, 24)}`));
  }
  return messages;
}

function toolHeavyImplementation() {
  const messages: any[] = [];
  for (let index = 1; index <= 12; index += 1) {
    const id = `tool-${index}`;
    messages.push(user(`Implement module ${index} under /workspace/src without restarting.`));
    messages.push(toolCall(id, index % 2 ? "read" : "bash", index % 2
      ? { path: `/workspace/src/module-${index}.ts` }
      : { command: `bun test module-${index}` }));
    messages.push(toolResult(id, index % 2 ? "read" : "bash", `${repeated(`tool-output-${index}`, 35)}\n${index % 5 === 0 ? "1 test failed" : "all tests passed"}`, index % 5 === 0));
    messages.push(assistant(`Decision ${index}: continue with the observed result. ${repeated(`follow-up-${index}`, 12)}`));
  }
  return messages;
}

function mixedDebugging() {
  const messages: any[] = [];
  for (let index = 1; index <= 12; index += 1) {
    const id = `debug-${index}`;
    messages.push(user(`${index % 4 === 0 ? "Actually, the error persists." : "Continue debugging."} Do not restart.`));
    messages.push(toolCall(id, "bash", { command: `bun test regression-${index}` }));
    messages.push(toolResult(id, "bash", `${repeated(`trace-${index}`, 28)}\n${index % 4 === 0 ? "1 test failed" : "all tests passed"}`, index % 4 === 0));
    messages.push(assistant(`Decision ${index}: preserve the current evidence. ${repeated(`finding-${index}`, 15)}`));
  }
  return messages;
}

function build(rawMessages: any[]) {
  const source = prepare(rawMessages);
  const assembled = assemblePipelineEvents(source);
  return buildPipelinedPlan(source, assembled.groups, assembled.toolAnalysis);
}

describe("Pipelined classification-ledger compression", () => {
  it("reaches the deterministic sample reduction target without weakening required records", () => {
    const fixtures = [
      { name: "routine", plan: build(routineDiscussion()) },
      { name: "tool-heavy", plan: build(toolHeavyImplementation()) },
      { name: "mixed-debugging", plan: build(mixedDebugging()) },
    ];
    const plans = fixtures.map(({ plan }) => plan);
    if (process.env.PIPELINED_COMPRESSION_REPORT === "1") {
      console.log(JSON.stringify(fixtures.map(({ name, plan }) => ({
        name,
        coverageComplete: plan.coverageComplete,
        sourceChars: plan.compression.sourceChars,
        representedChars: plan.compression.representedChars,
        reductionPercent: plan.compression.reductionPercent,
        sourceTokenEstimate: plan.compression.sourceTokenEstimate,
        representedTokenEstimate: plan.compression.representedTokenEstimate,
        tokenReductionPercent: plan.compression.tokenReductionPercent,
        byDisposition: plan.compression.byDisposition,
      })), null, 2));
    }
    const averageReduction = plans.reduce((total, plan) => total + plan.compression.reductionPercent, 0) / plans.length;
    const averageTokenReduction = plans.reduce((total, plan) => total + plan.compression.tokenReductionPercent, 0) / plans.length;

    expect(plans.every((plan) => plan.coverageComplete)).toBe(true);
    expect(plans.every((plan) => plan.compression.representedTokenEstimate < plan.compression.sourceTokenEstimate)).toBe(true);
    expect(plans.every((plan) => plan.compression.reductionPercent >= 35)).toBe(true);
    expect(plans.every((plan) => plan.compression.tokenReductionPercent >= 35)).toBe(true);
    expect(plans.every((plan) => plan.records.every((record) =>
      record.disposition !== "required" || record.representationMode === "lossless"
    ))).toBe(true);
    const canonicalSourceChars = plans.reduce((total, plan) => total + plan.compression.byDisposition.canonical.sourceChars, 0);
    const canonicalRepresentedChars = plans.reduce((total, plan) => total + plan.compression.byDisposition.canonical.representedChars, 0);
    const summarizeSourceChars = plans.reduce((total, plan) => total + plan.compression.byDisposition.summarize.sourceChars, 0);
    const summarizeRepresentedChars = plans.reduce((total, plan) => total + plan.compression.byDisposition.summarize.representedChars, 0);
    expect(canonicalRepresentedChars).toBeLessThan(canonicalSourceChars);
    expect(summarizeRepresentedChars).toBeLessThan(summarizeSourceChars);
    expect(averageReduction).toBeGreaterThanOrEqual(40);
    expect(averageTokenReduction).toBeGreaterThanOrEqual(40);
  });
});
