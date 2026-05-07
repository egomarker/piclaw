import { expect, test } from "bun:test";

import { AuthStorage, ModelRegistry, SettingsManager, getAgentDir } from "@earendil-works/pi-coding-agent";

import { createAgentPoolServices } from "../../src/agent-pool/service-factory.js";

function createSettingsManager() {
  return SettingsManager.create("/workspace", getAgentDir());
}

test("createAgentPoolServices wires the extracted helper services together", () => {
  const pool = new Map();
  const sidePool = new Map();
  const activeForkBaseLeafByChat = new Map();
  const authStorage = AuthStorage.create();
  const modelRegistry = ModelRegistry.inMemory(authStorage);
  const settingsManager = createSettingsManager();

  const services = createAgentPoolServices({
    pool,
    sidePool,
    activeForkBaseLeafByChat,
    authStorage,
    modelRegistry,
    settingsManager,
    workspaceDir: "/workspace",
  });

  expect(services.attachments).toBeDefined();
  expect(services.sessionBinder).toBeDefined();
  expect(services.toolFactory).toBeDefined();
  expect(services.turnCoordinator).toBeDefined();
  expect(services.sessionManager).toBeDefined();
  expect(services.runtimeFacade).toBeDefined();
  expect(services.branchManager).toBeDefined();
  expect(services.runtimeFacade.isStreaming("web:default")).toBe(false);
});

test("createAgentPoolServices scopes attachment registries per pool", () => {
  const authStorage = AuthStorage.create();
  const modelRegistry = ModelRegistry.inMemory(authStorage);
  const settingsManager = createSettingsManager();

  const first = createAgentPoolServices({
    pool: new Map(),
    sidePool: new Map(),
    activeForkBaseLeafByChat: new Map(),
    authStorage,
    modelRegistry,
    settingsManager,
    workspaceDir: "/workspace",
  });
  const second = createAgentPoolServices({
    pool: new Map(),
    sidePool: new Map(),
    activeForkBaseLeafByChat: new Map(),
    authStorage,
    modelRegistry,
    settingsManager,
    workspaceDir: "/workspace",
  });

  first.attachments.register("web:default", {
    id: 1,
    name: "report.txt",
    contentType: "text/plain",
    size: 6,
    kind: "file",
    sourcePath: "/tmp/report.txt",
  });

  expect(first.attachments.take("web:default")).toHaveLength(1);
  expect(second.attachments.take("web:default")).toHaveLength(0);
});
