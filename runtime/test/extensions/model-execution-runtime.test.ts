import { afterEach, expect, test } from "bun:test";

import {
  __setRuntimeModelExecutorForTests,
  getRuntimeModelExecutor,
  installRuntimeModelExecutor,
} from "../../src/extensions/model-execution-runtime.js";

afterEach(() => __setRuntimeModelExecutorForTests(null));

function model(provider = "github-copilot", api = "openai-responses") {
  return { provider, api, id: "model" } as any;
}

test("runtime executor preserves caller payload transform then sanitizes connection-bound IDs", async () => {
  const events: string[] = [];
  let options: any;
  installRuntimeModelExecutor({
    streamSimple: (_model: any, _context: any, nextOptions: any) => {
      options = nextOptions;
      return {} as any;
    },
    completeSimple: async () => ({}) as any,
  } as any);
  getRuntimeModelExecutor()!.streamSimple(model(), { messages: [] }, {
    onPayload: async (payload: any) => {
      events.push("caller");
      return { ...payload, caller: true };
    },
  });
  const transformed = await options.onPayload({ input: [{ type: "reasoning", id: "rs_1" }, { type: "message", id: "msg_1" }] }, model());
  expect(events).toEqual(["caller"]);
  expect(transformed).toEqual({ input: [{ type: "message" }], caller: true });
});

test("runtime executor removes orphan Responses outputs after caller payload transforms", async () => {
  let options: any;
  installRuntimeModelExecutor({
    streamSimple: (_model: any, _context: any, nextOptions: any) => { options = nextOptions; return {} as any; },
    completeSimple: async () => ({}) as any,
  } as any);
  getRuntimeModelExecutor()!.streamSimple(model(), { messages: [] }, {
    onPayload: async (payload: any) => ({
      ...payload,
      input: [
        ...payload.input,
        { type: "function_call_output", call_id: "call_orphan", output: "secret" },
      ],
    }),
  });
  const transformed = await options.onPayload({ input: [{ type: "message", role: "user", content: [] }] }, model());
  expect(transformed).toEqual({ input: [{ type: "message", role: "user", content: [] }] });
});

test("runtime executor preserves non-Copilot reasoning while removing duplicate optional IDs", async () => {
  let options: any;
  installRuntimeModelExecutor({
    streamSimple: (_model: any, _context: any, nextOptions: any) => { options = nextOptions; return {} as any; },
    completeSimple: async () => ({}) as any,
  } as any);
  getRuntimeModelExecutor()!.streamSimple(model("openai", "openai-responses"), { messages: [] });
  const transformed = await options.onPayload({ input: [{ type: "message", id: "m1" }, { type: "message", id: "m1" }] }, model("openai", "openai-responses"));
  expect(transformed).toEqual({ input: [{ type: "message", id: "m1" }, { type: "message" }] });
});

test("runtime executor falls back to the requested model when provider callback omits selectedModel", async () => {
  let options: any;
  installRuntimeModelExecutor({
    streamSimple: (_model: any, _context: any, nextOptions: any) => { options = nextOptions; return {} as any; },
    completeSimple: async () => ({}) as any,
  } as any);
  getRuntimeModelExecutor()!.streamSimple(model("azure-openai", "azure-openai-responses-mi"), { messages: [] });
  const transformed = await options.onPayload({ input: [{ type: "message", id: "m1" }, { type: "message", id: "m1" }] });
  expect(transformed).toEqual({ input: [{ type: "message", id: "m1" }, { type: "message" }] });
});

test("runtime executor observes provider responses before the caller callback", async () => {
  const events: string[] = [];
  let options: any;
  installRuntimeModelExecutor({
    streamSimple: (_model: any, _context: any, nextOptions: any) => { options = nextOptions; return {} as any; },
    completeSimple: async () => ({}) as any,
  } as any);
  getRuntimeModelExecutor()!.streamSimple(model(), { messages: [] }, {
    onResponse: async () => { events.push("caller"); },
  });
  await options.onResponse({ status: 200, headers: { "x-request-id": "req-1" } }, model());
  expect(events).toEqual(["caller"]);
});

test("runtime executor can only be installed once", () => {
  const runtime = { streamSimple: () => ({}), completeSimple: async () => ({}) } as any;
  installRuntimeModelExecutor(runtime);
  expect(() => installRuntimeModelExecutor(runtime)).toThrow("already installed");
});
