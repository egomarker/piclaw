import { expect, test } from "bun:test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  getAddonNonWebCommandPolicies,
  getAddonRecoveryExcludedChatJidPrefixes,
  getAddonStatusPanelPayload,
  getInstalledAddonRuntimeEntryPaths,
  resetAddonRuntimeContributionsForTests,
  runAddonAdaptiveCardIntent,
  runAddonStatusPanelAction,
} from "../../src/addons/runtime-contributions.js";
import { withTempWorkspaceEnv } from "../helpers.js";

test("installed addon runtime entries register status panel, card-intent, and stream-session handlers", async () => {
  resetAddonRuntimeContributionsForTests();
  await withTempWorkspaceEnv("piclaw-addon-runtime-", {}, async (workspace) => {
    const addonDir = join(workspace.workspace, ".pi", "extensions", "node_modules", "piclaw-addon-example");
    mkdirSync(addonDir, { recursive: true });
    writeFileSync(join(addonDir, "package.json"), JSON.stringify({
      name: "piclaw-addon-example",
      version: "0.1.0",
      type: "module",
      pi: {
        extensions: ["index.ts"],
        runtime: {
          entries: ["runtime.ts"],
          recovery: { excludeChatJidPrefixes: ["telegram:", "telegram:", "  ", 123] },
          nonWebCommandPolicies: [
            {
              chatJidPrefixes: ["telegram:", "tg:", "TG:", "", 123],
              allowedCommands: ["steer", "SHELL", "queue-all", "queue-all", ""],
            },
            {
              chatJidPrefixes: ["signal:", "  signal:", null],
              allowedCommands: [],
            },
            {
              chatJidPrefixes: [],
              allowedCommands: ["ignored"],
            },
          ],
        },
      },
    }, null, 2));
    writeFileSync(join(addonDir, "index.ts"), "export default function noop() {}\n");
    writeFileSync(join(addonDir, "runtime.ts"), `
const api = globalThis.__piclaw_runtime;
api?.registerStatusPanelProvider?.({
  key: "example",
  getPayload(chatJid) {
    return { key: "example", chat_jid: chatJid, content: [{ type: "status", value: 1 }] };
  },
  runAction(action, payload) {
    return { action, payload };
  },
});
api?.registerAdaptiveCardIntentHandler?.("example-intent", async (context) => {
  await context.sendMessage("handled:" + String(context.rawSubmissionData.value || ""), { threadId: context.threadId });
});
const stream = api?.streamSessions?.open?.({
  chatJid: "web:test",
  kind: "portainer.logs.follow",
  label: "Follow container logs",
  toolName: "portainer",
  metadata: { endpoint_id: 2, container: "demo" },
  timeoutMs: 5000,
});
stream?.write?.("line one", { kind: "stdout" });
stream?.write?.("line two", { kind: "stdout", metadata: { seq: 2 } });
stream?.complete?.("finished");
export {};
`);

    expect(getInstalledAddonRuntimeEntryPaths(workspace.workspace)).toEqual([
      join(addonDir, "runtime.ts"),
    ]);
    expect(getAddonRecoveryExcludedChatJidPrefixes(workspace.workspace)).toEqual(["telegram:"]);
    expect(getAddonNonWebCommandPolicies(workspace.workspace)).toEqual([
      {
        chatJidPrefixes: ["telegram:", "tg:"],
        allowedCommands: ["steer", "shell", "queue-all"],
      },
      {
        chatJidPrefixes: ["signal:"],
        allowedCommands: [],
      },
    ]);

    expect(await getAddonStatusPanelPayload("example", "web:test")).toEqual({
      key: "example",
      chat_jid: "web:test",
      content: [{ type: "status", value: 1 }],
    });

    expect(await runAddonStatusPanelAction("example", "stop", { chat_jid: "web:test" })).toEqual({
      action: "stop",
      payload: { chat_jid: "web:test" },
    });

    const messages: string[] = [];
    const handled = await runAddonAdaptiveCardIntent("example-intent", {
      chatJid: "web:test",
      threadId: "thread-1",
      rawSubmissionData: { value: "ok" },
      sendMessage: async (content) => {
        messages.push(content);
      },
    });

    expect(handled).toBe(true);
    expect(messages).toEqual(["handled:ok"]);

    const runtimeApi = (globalThis as any).__piclaw_runtime;
    const sessions = runtimeApi.streamSessions.list({ chatJid: "web:test", toolName: "portainer" });
    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({
      chatJid: "web:test",
      kind: "portainer.logs.follow",
      label: "Follow container logs",
      toolName: "portainer",
      status: "completed",
      reason: "finished",
      metadata: { endpoint_id: 2, container: "demo" },
      frameCount: 2,
    });
    expect(sessions[0].frames.map((frame: any) => frame.data)).toEqual(["line one", "line two"]);
    expect(runtimeApi.streamSessions.get(sessions[0].id)?.frames[1].metadata).toEqual({ seq: 2 });
  });
  resetAddonRuntimeContributionsForTests();
});

test("runtime stream sessions support cancellation and timeout cleanup", async () => {
  resetAddonRuntimeContributionsForTests();
  const runtimeApi = (await import("../../src/addons/runtime-contributions.js")).installAddonRuntimeApi();
  const cancellations: string[] = [];
  const cleaned: string[] = [];
  const events: string[] = [];
  const unsubscribe = runtimeApi.streamSessions.subscribe((event: any) => {
    events.push(event.type);
  });

  const cancellable = runtimeApi.streamSessions.open({
    chatJid: "web:test",
    kind: "portainer.exec.attach",
    label: "Attach shell",
    timeoutMs: 5000,
    onCancel: (reason: string) => cancellations.push(reason),
    onCleanup: (snapshot: any) => cleaned.push(snapshot.status),
  });
  cancellable.write("ready", { kind: "status" });
  const cancelled = runtimeApi.streamSessions.cancel(cancellable.id, "user abort");
  expect(cancelled?.status).toBe("cancelled");
  expect(cancellable.signal.aborted).toBe(true);
  expect(cancellations).toEqual(["user abort"]);
  expect(cleaned).toEqual(["cancelled"]);

  const timedOut = runtimeApi.streamSessions.open({
    chatJid: "web:test",
    kind: "portainer.logs.follow",
    timeoutMs: 1,
    onCancel: (reason: string) => cancellations.push(reason),
  });
  await new Promise((resolve) => setTimeout(resolve, 10));
  expect(runtimeApi.streamSessions.get(timedOut.id)?.status).toBe("timed_out");
  expect(cancellations).toContain("timeout");
  expect(events).toContain("created");
  expect(events).toContain("frame");
  expect(events).toContain("cancelled");
  expect(events).toContain("timed_out");
  unsubscribe();
  resetAddonRuntimeContributionsForTests();
});
