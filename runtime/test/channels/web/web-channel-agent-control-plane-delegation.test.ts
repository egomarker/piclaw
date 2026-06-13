import { afterEach, describe, expect, test } from "bun:test";

import { createWebChannelTestFixture } from "./helpers/web-channel-fixture.ts";

let cleanup: (() => void) | null = null;

afterEach(() => {
  cleanup?.();
  cleanup = null;
});

type ControlPlaneServiceStub = {
  handleAutoresearchStatus(req: Request): Promise<Response>;
  handleAutoresearchStop(req: Request): Promise<Response>;
  handleAutoresearchDismiss(req: Request): Promise<Response>;
  handleAgentOobeComplete(req: Request): Promise<Response>;
  handleAgentQueueState(req: Request): Promise<Response>;
  handleAgentQueueRemove(req: Request): Promise<Response>;
  handleAgentQueueSteer(req: Request): Promise<Response>;
  handleAgentBranchFork(req: Request): Promise<Response>;
  handleAgentBranchRename(req: Request): Promise<Response>;
  handleAgentBranchPrune(req: Request): Promise<Response>;
  handleAgentBranchDownload(req: Request): Response;
  handleAgentBranchPurge(req: Request): Promise<Response>;
  handleAgentBranchRestore(req: Request): Promise<Response>;
};

describe("WebChannel agent control-plane delegation", () => {
  test("delegates queue, branch, and autoresearch wrappers to the extracted control-plane service", async () => {
    const fixture = await createWebChannelTestFixture({ workspace: "temp" });
    cleanup = fixture.cleanup;

    const calls: string[] = [];
    const response = (label: string, status = 200) => new Response(label, { status });
    const controlPlaneService: ControlPlaneServiceStub = {
      handleAutoresearchStatus: async (req) => {
        calls.push(`autoresearch-status:${req.method}:${new URL(req.url).searchParams.get("chat_jid") ?? ""}`);
        return response("autoresearch-status");
      },
      handleAutoresearchStop: async (req) => {
        calls.push(`autoresearch-stop:${req.method}`);
        return response("autoresearch-stop", 207);
      },
      handleAutoresearchDismiss: async (req) => {
        calls.push(`autoresearch-dismiss:${req.method}`);
        return response("autoresearch-dismiss", 208);
      },
      handleAgentOobeComplete: async (req) => {
        calls.push(`oobe-complete:${req.method}`);
        return response("oobe-complete", 216);
      },
      handleAgentQueueState: async (req) => {
        calls.push(`queue-state:${req.method}:${new URL(req.url).searchParams.get("chat_jid") ?? ""}`);
        return response("queue-state");
      },
      handleAgentQueueRemove: async (req) => {
        calls.push(`queue-remove:${req.method}`);
        return response("queue-remove", 209);
      },
      handleAgentQueueSteer: async (req) => {
        calls.push(`queue-steer:${req.method}`);
        return response("queue-steer", 210);
      },
      handleAgentBranchFork: async (req) => {
        calls.push(`branch-fork:${req.method}`);
        return response("branch-fork", 211);
      },
      handleAgentBranchRename: async (req) => {
        calls.push(`branch-rename:${req.method}`);
        return response("branch-rename", 212);
      },
      handleAgentBranchPrune: async (req) => {
        calls.push(`branch-prune:${req.method}`);
        return response("branch-prune", 213);
      },
      handleAgentBranchDownload: (req) => {
        calls.push(`branch-download:${req.method}:${new URL(req.url).searchParams.get("chat_jid") ?? ""}`);
        return response("branch-download", 217);
      },
      handleAgentBranchPurge: async (req) => {
        calls.push(`branch-purge:${req.method}`);
        return response("branch-purge", 214);
      },
      handleAgentBranchRestore: async (req) => {
        calls.push(`branch-restore:${req.method}`);
        return response("branch-restore", 215);
      },
    };

    (fixture.channel as unknown as { controlPlaneService: ControlPlaneServiceStub }).controlPlaneService = controlPlaneService;

    expect(await (await fixture.channel.handleAutoresearchStatus(new Request("https://example.com/agent/autoresearch/status?chat_jid=web%3Abranch"))).text())
      .toBe("autoresearch-status");
    expect((await fixture.channel.handleAutoresearchStop(new Request("https://example.com/agent/autoresearch/stop", { method: "POST" }))).status)
      .toBe(207);
    expect((await fixture.channel.handleAutoresearchDismiss(new Request("https://example.com/agent/autoresearch/dismiss", { method: "POST" }))).status)
      .toBe(208);
    expect((await fixture.channel.handleAgentOobeComplete(new Request("https://example.com/agent/oobe/complete", { method: "POST" }))).status)
      .toBe(216);
    expect(await (await fixture.channel.handleAgentQueueState(new Request("https://example.com/agent/queue-state?chat_jid=web%3Abranch"))).text())
      .toBe("queue-state");
    expect((await fixture.channel.handleAgentQueueRemove(new Request("https://example.com/agent/queue-remove", { method: "POST" }))).status)
      .toBe(209);
    expect((await fixture.channel.handleAgentQueueSteer(new Request("https://example.com/agent/queue-steer", { method: "POST" }))).status)
      .toBe(210);
    expect((await fixture.channel.handleAgentBranchFork(new Request("https://example.com/agent/branch-fork", { method: "POST" }))).status)
      .toBe(211);
    expect((await fixture.channel.handleAgentBranchRename(new Request("https://example.com/agent/branch-rename", { method: "POST" }))).status)
      .toBe(212);
    expect((await fixture.channel.handleAgentBranchPrune(new Request("https://example.com/agent/branch-prune", { method: "POST" }))).status)
      .toBe(213);
    expect(fixture.channel.handleAgentBranchDownload(new Request("https://example.com/agent/branch-download?chat_jid=web%3Aarchived")).status)
      .toBe(217);
    expect((await fixture.channel.handleAgentBranchPurge(new Request("https://example.com/agent/branch-purge", { method: "POST" }))).status)
      .toBe(214);
    expect((await fixture.channel.handleAgentBranchRestore(new Request("https://example.com/agent/branch-restore", { method: "POST" }))).status)
      .toBe(215);

    expect(calls).toEqual([
      "autoresearch-status:GET:web:branch",
      "autoresearch-stop:POST",
      "autoresearch-dismiss:POST",
      "oobe-complete:POST",
      "queue-state:GET:web:branch",
      "queue-remove:POST",
      "queue-steer:POST",
      "branch-fork:POST",
      "branch-rename:POST",
      "branch-prune:POST",
      "branch-download:GET:web:archived",
      "branch-purge:POST",
      "branch-restore:POST",
    ]);
  });
});
