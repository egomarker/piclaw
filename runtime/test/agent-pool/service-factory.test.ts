import { expect, test } from "bun:test";

import { SettingsManager, getAgentDir } from "@earendil-works/pi-coding-agent";

import { createAgentPoolServices } from "../../src/agent-pool/service-factory.js";
import { createTempWorkspace } from "../helpers.js";
import { createRealTestModelServices } from "../model-services-fixture.js";

function createSettingsManager() {
  return SettingsManager.create("/workspace", getAgentDir());
}

function createServicesOptions(modelServices: Awaited<ReturnType<typeof createRealTestModelServices>>) {
  return {
    authStorage: modelServices.credentialStore,
    modelRuntime: modelServices.modelRuntime,
    modelRegistry: modelServices.modelRegistry,
    settingsManager: createSettingsManager(),
    workspaceDir: "/workspace",
  };
}

test("createAgentPoolServices wires the extracted helper services together", async () => {
  const workspace = createTempWorkspace("service-factory-");
  try {
    const modelServices = await createRealTestModelServices(workspace.base);
    const services = createAgentPoolServices({
      pool: new Map(),
      sidePool: new Map(),
      activeForkBaseLeafByChat: new Map(),
      ...createServicesOptions(modelServices),
    });

    expect(services.attachments).toBeDefined();
    expect(services.sessionBinder).toBeDefined();
    expect(services.toolFactory).toBeDefined();
    expect(services.turnCoordinator).toBeDefined();
    expect(services.sessionManager).toBeDefined();
    expect(services.runtimeFacade).toBeDefined();
    expect(services.branchManager).toBeDefined();
    expect(services.runtimeFacade.isStreaming("web:default")).toBe(false);
  } finally {
    workspace.cleanup();
  }
});

test("createAgentPoolServices scopes attachment registries per pool", async () => {
  const workspace = createTempWorkspace("service-factory-scope-");
  try {
    const modelServices = await createRealTestModelServices(workspace.base);
    const options = createServicesOptions(modelServices);
    const first = createAgentPoolServices({
      pool: new Map(), sidePool: new Map(), activeForkBaseLeafByChat: new Map(), ...options,
    });
    const second = createAgentPoolServices({
      pool: new Map(), sidePool: new Map(), activeForkBaseLeafByChat: new Map(), ...options,
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
  } finally {
    workspace.cleanup();
  }
});
