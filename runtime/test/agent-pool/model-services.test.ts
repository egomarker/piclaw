import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { ModelsRefreshOptions, ModelsRefreshResult } from "@earendil-works/pi-ai";
import type { CreateModelRuntimeOptions, ModelRuntime } from "@earendil-works/pi-coding-agent";

import { PiclawModelRegistry, createRuntimeModelServices } from "../../src/agent-pool/model-services.js";

const roots: string[] = [];
const originalPiclawAgentDir = process.env.PICLAW_PI_AGENT_DIR;
const originalUpstreamAgentDir = process.env.PI_CODING_AGENT_DIR;
afterEach(() => {
  if (originalPiclawAgentDir === undefined) delete process.env.PICLAW_PI_AGENT_DIR;
  else process.env.PICLAW_PI_AGENT_DIR = originalPiclawAgentDir;
  if (originalUpstreamAgentDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
  else process.env.PI_CODING_AGENT_DIR = originalUpstreamAgentDir;
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function tempAgentDir(): string {
  const root = mkdtempSync(join(tmpdir(), "piclaw-model-services-"));
  roots.push(root);
  return join(root, "agent");
}

describe("runtime model services", () => {
  test("creates the runtime cache-first with canonical agent paths", async () => {
    const agentDir = tempAgentDir();
    let captured: CreateModelRuntimeOptions | null = null;
    const fakeRuntime = { refresh: async () => ({ aborted: false, errors: new Map() }) } as unknown as ModelRuntime;

    const services = await createRuntimeModelServices({
      agentDir,
      createModelRuntime: async (options) => {
        captured = options;
        return fakeRuntime;
      },
    });

    expect(captured).toMatchObject({
      authPath: join(agentDir, "auth.json"),
      modelsPath: join(agentDir, "models.json"),
      modelsStorePath: join(agentDir, "models-store.json"),
      allowModelNetwork: false,
    });
    expect(captured?.credentials).toBe(services.credentialStore);
    expect(services.modelRuntime).toBe(fakeRuntime);
    expect(services.modelRegistry).toBeInstanceOf(PiclawModelRegistry);
  });

  test("default construction uses Piclaw's agent directory over a conflicting upstream path", async () => {
    const root = mkdtempSync(join(tmpdir(), "piclaw-model-services-env-"));
    roots.push(root);
    const piclawAgentDir = join(root, "piclaw-agent");
    process.env.PICLAW_PI_AGENT_DIR = piclawAgentDir;
    process.env.PI_CODING_AGENT_DIR = join(root, "upstream-agent");
    let captured: CreateModelRuntimeOptions | null = null;
    const fakeRuntime = { refresh: async () => ({ aborted: false, errors: new Map() }) } as unknown as ModelRuntime;

    const services = await createRuntimeModelServices({
      createModelRuntime: async (options) => {
        captured = options;
        return fakeRuntime;
      },
    });

    expect(services.agentDir).toBe(piclawAgentDir);
    expect(services.credentialStore.authPath).toBe(join(piclawAgentDir, "auth.json"));
    expect(captured).toMatchObject({
      authPath: join(piclawAgentDir, "auth.json"),
      modelsPath: join(piclawAgentDir, "models.json"),
      modelsStorePath: join(piclawAgentDir, "models-store.json"),
    });
  });

  test("compat registry coalesces concurrent config reloads", async () => {
    tempAgentDir();
    let refreshCalls = 0;
    const refreshOptions: unknown[] = [];
    let release: (() => void) | undefined;
    const blocker = new Promise<void>((resolve) => { release = resolve; });
    const result = { aborted: false, errors: new Map<string, Error>([["github-copilot", new Error("catalog unavailable")]]) };
    const runtime = {
      refresh: async (options: unknown) => {
        refreshCalls += 1;
        refreshOptions.push(options);
        await blocker;
        return result;
      },
    } as unknown as ModelRuntime;
    const registry = new PiclawModelRegistry(runtime);

    const first = registry.refresh();
    const second = registry.refresh();
    expect(first).toBe(second);
    expect(refreshCalls).toBe(1);
    release?.();
    expect(await first).toBe(result);
    expect(await second).toBe(result);

    expect(await registry.refresh()).toBe(result);
    expect(refreshCalls).toBe(2);
    expect(refreshOptions).toEqual([{ allowNetwork: false }, { allowNetwork: false }]);
  });

  test("cleans up coalescing after a rejected refresh", async () => {
    const failure = new Error("config reload failed");
    const result = { aborted: false, errors: new Map<string, Error>() };
    let calls = 0;
    const registry = new PiclawModelRegistry({
      refresh: async () => {
        calls += 1;
        if (calls === 1) throw failure;
        return result;
      },
    } as unknown as ModelRuntime);
    const first = registry.refresh();
    expect(registry.refresh()).toBe(first);
    await expect(first).rejects.toBe(failure);
    expect(await registry.refresh()).toBe(result);
    expect(calls).toBe(2);
  });

  test("explicit scope, force, network and signal requests remain independent", async () => {
    const requests: ModelsRefreshOptions[] = [];
    const releases: Array<(value: ModelsRefreshResult) => void> = [];
    const registry = new PiclawModelRegistry({
      refresh: (options: ModelsRefreshOptions) => {
        requests.push(options);
        return new Promise<ModelsRefreshResult>((resolve) => releases.push(resolve));
      },
    } as unknown as ModelRuntime);
    const controller = new AbortController();
    const cached = registry.refresh();
    const scoped = registry.refresh({ providers: ["github-copilot"], force: true, allowNetwork: true, signal: controller.signal });
    const offline = registry.refresh({ providers: ["openai"], force: true });
    expect(scoped).not.toBe(cached);
    expect(offline).not.toBe(cached);
    expect(requests).toEqual([
      { allowNetwork: false },
      { providers: ["github-copilot"], force: true, allowNetwork: true, signal: controller.signal },
      { providers: ["openai"], force: true, allowNetwork: false },
    ]);
    const result = { aborted: false, errors: new Map<string, Error>() };
    for (const release of releases) release(result);
    expect(await scoped).toBe(result);
    expect(await offline).toBe(result);
    expect(await cached).toBe(result);
  });

  test("forwards a cancelled operation and its exact refresh result", async () => {
    const controller = new AbortController();
    const result = { aborted: true, errors: new Map<string, Error>() };
    let received: ModelsRefreshOptions | undefined;
    const registry = new PiclawModelRegistry({
      refresh: async (options: ModelsRefreshOptions) => {
        received = options;
        expect(options.signal?.aborted).toBe(true);
        return result;
      },
    } as unknown as ModelRuntime);
    controller.abort();
    expect(await registry.refresh({ signal: controller.signal })).toBe(result);
    expect(received).toEqual({ signal: controller.signal, allowNetwork: false });
  });
});
