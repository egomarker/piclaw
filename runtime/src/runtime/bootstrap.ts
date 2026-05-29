/**
 * runtime/bootstrap.ts – Runtime bootstrap orchestration and default dependency wiring.
 */

import { ensureAddonRuntimeEntriesLoaded } from "../addons/runtime-contributions.js";
import {
  getIdentityConfig,
  getRoutingConfig,
  getRuntimeTimingConfig,
} from "../core/config.js";
import { stopIpcWatcher } from "../ipc.js";
import type { SchedulerDeps } from "../task-scheduler.js";
import { stopSchedulerLoop } from "../task-scheduler.js";
import { createLogger } from "../utils/logger.js";
import type { RuntimeSignalRegistrar } from "./composition.js";
import { installAddonRuntimeInterop } from "./addon-interop.js";
import { registerRuntimeShutdownSignals } from "./composition.js";
import { startRuntimeLoop, type StartRuntimeLoopDeps } from "./coordinator.js";
import { registerOptionalProviders } from "./provider-bootstrap.js";
import { createShutdownHandler, type ShutdownDeps } from "./shutdown.js";
import { registerShutdownHandler } from "./shutdown-registry.js";
import {
  initializeRuntimeEnvironment,
  queueStartupResumePendingIpc,
  startOptionalPushoverChannel,
  startWebChannel,
} from "./startup.js";
import {
  createRuntimeSenders,
  startRuntimeWorkers,
  type RuntimeModelResolver,
  type RuntimePushoverWorkerChannel,
  type RuntimeSenders,
  type RuntimeWebWorkerChannel,
} from "./wiring.js";

const log = createLogger("runtime.bootstrap");

/** Queue contract required by runtime bootstrap orchestration. */
export type RuntimeBootstrapQueue =
  & StartRuntimeLoopDeps["queue"]
  & SchedulerDeps["queue"]
  & ShutdownDeps["queue"];

/** Agent-pool contract required by runtime bootstrap orchestration. */
export type RuntimeBootstrapAgentPool =
  & StartRuntimeLoopDeps["agentPool"]
  & SchedulerDeps["agentPool"]
  & RuntimeModelResolver
  & ShutdownDeps["agentPool"];

/** Runtime state contract required by runtime bootstrap orchestration. */
export type RuntimeBootstrapState = StartRuntimeLoopDeps["state"];

/** Web channel contract required by runtime bootstrap orchestration. */
export type RuntimeBootstrapWeb = RuntimeWebWorkerChannel & ShutdownDeps["web"];

/** Legacy channel contract — retained for backward compatibility. */

/** Optional pushover channel contract required by runtime bootstrap orchestration. */
export type RuntimeBootstrapPushover = RuntimePushoverWorkerChannel & NonNullable<ShutdownDeps["pushover"]>;

/** Runtime core services contract consumed by bootstrap orchestration. */
export interface RuntimeBootstrapCoreServices {
  queue: RuntimeBootstrapQueue;
  agentPool: RuntimeBootstrapAgentPool;
  state: RuntimeBootstrapState;
}

/** Concrete runtime-core contract required to wire production startup modules. */
export interface RuntimeBootstrapDefaultCoreServices extends RuntimeBootstrapCoreServices {
  queue: Parameters<typeof startWebChannel>[0];
  agentPool: Parameters<typeof startWebChannel>[1];
}

/** Dependency injection contract for the runtime bootstrap sequence. */
export interface RuntimeBootstrapDeps {
  core: RuntimeBootstrapCoreServices;
  assistantName: string;
  triggerPattern: RegExp;
  pollIntervalMs: number;
  signalRegistrar: RuntimeSignalRegistrar;
  initializeRuntimeEnvironment(state: RuntimeBootstrapState): void;
  registerOptionalProviders(agentPool: RuntimeBootstrapAgentPool): void | Promise<void>;
  startWebChannel(queue: RuntimeBootstrapQueue, agentPool: RuntimeBootstrapAgentPool): Promise<RuntimeBootstrapWeb>;
  startOptionalPushoverChannel(): Promise<RuntimeBootstrapPushover | null>;
  createShutdownHandler(deps: ShutdownDeps): (signal: string) => Promise<void>;
  registerRuntimeShutdownSignals(
    registrar: RuntimeSignalRegistrar,
    shutdown: (signal: string) => Promise<void>
  ): void;
  createRuntimeSenders(
    web: RuntimeBootstrapWeb,
    pushover: RuntimeBootstrapPushover | null
  ): RuntimeSenders;
  startRuntimeWorkers(
    queue: RuntimeBootstrapQueue,
    agentPool: RuntimeBootstrapAgentPool,
    web: RuntimeBootstrapWeb,
    senders: RuntimeSenders
  ): void;
  installAddonRuntimeInterop(options: {
    queue: RuntimeBootstrapQueue;
    web: RuntimeBootstrapWeb;
    state: RuntimeBootstrapState;
    agentPool: RuntimeBootstrapAgentPool;
    assistantName: string;
    triggerPattern: RegExp;
    sendMessage: RuntimeSenders["sendMessage"];
  }): void;
  ensureAddonRuntimeEntriesLoaded(): Promise<void>;
  queueStartupResumePendingIpc(): void;
  startRuntimeLoop(deps: StartRuntimeLoopDeps): Promise<void>;
  log(message: string): void;
  stopIpcWatcher(): Promise<void>;
  stopSchedulerLoop(): void;
}

/**
 * Build default runtime bootstrap dependencies from production modules.
 */
export function createDefaultRuntimeBootstrapDeps(core: RuntimeBootstrapDefaultCoreServices): RuntimeBootstrapDeps {
  return {
    core,
    assistantName: getIdentityConfig().assistantName,
    triggerPattern: getRoutingConfig().triggerPattern,
    pollIntervalMs: getRuntimeTimingConfig().pollIntervalMs,
    signalRegistrar: process,
    initializeRuntimeEnvironment: () => initializeRuntimeEnvironment(core.state),
    registerOptionalProviders: () => registerOptionalProviders(core.agentPool),
    startWebChannel: () => startWebChannel(core.queue, core.agentPool),
    startOptionalPushoverChannel: () => startOptionalPushoverChannel(),
    createShutdownHandler,
    registerRuntimeShutdownSignals,
    createRuntimeSenders,
    startRuntimeWorkers,
    installAddonRuntimeInterop,
    ensureAddonRuntimeEntriesLoaded,
    queueStartupResumePendingIpc,
    startRuntimeLoop,
    log: (message) => log.info(message, { operation: "bootstrap.banner" }),
    stopIpcWatcher,
    stopSchedulerLoop,
  };
}

/**
 * Bootstrap and run all runtime subsystems in production order.
 */
export async function bootstrapRuntime(deps: RuntimeBootstrapDeps): Promise<void> {
  const { queue, agentPool, state } = deps.core;

  deps.initializeRuntimeEnvironment(state);
  await deps.registerOptionalProviders(agentPool);
  deps.log("=== Piclaw - Pi Coding Agent Assistant ===");

  const web = await deps.startWebChannel(queue, agentPool);
  const pushover = await deps.startOptionalPushoverChannel();

  const shutdown = deps.createShutdownHandler({
    queue,
    agentPool,
    web,
    pushover,
    stopIpcWatcher: deps.stopIpcWatcher,
    stopSchedulerLoop: deps.stopSchedulerLoop,
  });
  registerShutdownHandler(shutdown);
  deps.registerRuntimeShutdownSignals(deps.signalRegistrar, shutdown);

  const senders = deps.createRuntimeSenders(web, pushover);
  deps.installAddonRuntimeInterop({
    queue,
    web,
    state,
    agentPool,
    assistantName: deps.assistantName,
    triggerPattern: deps.triggerPattern,
    sendMessage: senders.sendMessage,
  });
  await deps.ensureAddonRuntimeEntriesLoaded();
  deps.startRuntimeWorkers(queue, agentPool, web, senders);

  await deps.startRuntimeLoop({
    queue,
    state,
    agentPool,
    assistantName: deps.assistantName,
    triggerPattern: deps.triggerPattern,
    sendMessage: senders.sendMessage,
    pollIntervalMs: deps.pollIntervalMs,
  });
}
