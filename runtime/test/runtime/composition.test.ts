import { describe, expect, test } from "bun:test";
import {
  createRuntimeBaseServices,
  registerRuntimeShutdownSignals,
  type RuntimeSignalRegistrar,
} from "../../src/runtime/composition.js";
import { RuntimeState } from "../../src/runtime/state.js";

describe("runtime composition helpers", () => {
  test("createRuntimeBaseServices builds fresh queue/state instances without AgentPool", () => {
    const first = createRuntimeBaseServices({ dataDir: "/tmp/runtime-a" });
    const second = createRuntimeBaseServices({ dataDir: "/tmp/runtime-b" });

    expect(first.queue).toBeTruthy();
    expect(first.state).toBeInstanceOf(RuntimeState);
    expect("agentPool" in first).toBe(false);

    expect(second.queue).toBeTruthy();
    expect(second.state).toBeInstanceOf(RuntimeState);
    expect(first.queue).not.toBe(second.queue);
    expect(first.state).not.toBe(second.state);
  });

  test("createRuntimeBaseServices honors injected factories and dataDir", () => {
    let seenDataDir = "";
    const queue = {} as never;
    const state = {} as RuntimeState;

    const base = createRuntimeBaseServices({
      dataDir: "/tmp/custom-runtime",
      createQueue: () => queue,
      createState: (dataDir) => {
        seenDataDir = dataDir;
        return state;
      },
    });

    expect(base.queue).toBe(queue);
    expect(base.state).toBe(state);
    expect(seenDataDir).toBe("/tmp/custom-runtime");
  });

  test("registerRuntimeShutdownSignals wires SIGTERM/SIGINT handlers", async () => {
    const listeners = new Map<string, () => void>();
    const registrar: RuntimeSignalRegistrar = {
      on: (event, listener) => {
        listeners.set(event, listener);
      },
    };

    const calls: string[] = [];
    const shutdown = async (signal: string) => {
      calls.push(signal);
    };

    registerRuntimeShutdownSignals(registrar, shutdown);

    expect(listeners.has("SIGTERM")).toBe(true);
    expect(listeners.has("SIGINT")).toBe(true);

    listeners.get("SIGTERM")?.();
    listeners.get("SIGINT")?.();

    await Promise.resolve();
    expect(calls).toEqual(["SIGTERM", "SIGINT"]);
  });
});
