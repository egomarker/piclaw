import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Type } from "typebox";
import { Agent } from "@earendil-works/pi-agent-core";
import { AuthStorage, ModelRegistry, SettingsManager, getAgentDir, type ExtensionFactory } from "@earendil-works/pi-coding-agent";
import { fauxAssistantMessage, fauxToolCall, registerFauxProvider } from "@earendil-works/pi-ai";
import "../helpers.js";
import { createSessionInDir } from "../../src/agent-pool/session.ts";
import { applyActiveToolsImmediately, bindImmediateToolActivation } from "../../src/agent-pool/tool-activation-live-update.js";

const customExtension: ExtensionFactory = (pi) => {
  pi.registerTool({
    name: "demo_extension_tool",
    label: "demo_extension_tool",
    description: "Demo extension tool",
    parameters: Type.Object({ value: Type.String() }),
    async execute(_toolCallId: string, params: { value: string }) {
      return {
        content: [{ type: "text" as const, text: `demo:${params.value}` }],
        details: { ok: true, echoed: params.value },
      };
    },
  });
};

describe("same-turn tool activation live update", () => {
  test("newly activated tools become callable later in the same turn", async () => {
    const faux = registerFauxProvider();
    try {
      const delayedCalls: string[] = [];
      const agent = new Agent({
        initialState: {
          model: faux.getModel(),
          tools: [],
        },
        toolExecution: "sequential",
      });

      const session = {
        agent,
        _toolRegistry: new Map<string, any>(),
        _baseSystemPrompt: "",
        _rebuildSystemPrompt: (toolNames: string[]) => `tools: ${toolNames.join(", ")}`,
      };

      const activateToolsTool = {
        name: "activate_tools",
        description: "Activate tools.",
        parameters: Type.Object({ names: Type.Array(Type.String()) }),
        async execute(_toolCallId: string, params: { names: string[] }) {
          applyActiveToolsImmediately(session, ["activate_tools", ...params.names]);
          return {
            content: [{ type: "text" as const, text: `Activated: ${params.names.join(", ")}` }],
            details: { ok: true },
          };
        },
      };

      const delayedTool = {
        name: "delayed_tool",
        description: "Only available after activation.",
        parameters: Type.Object({}),
        async execute() {
          delayedCalls.push("delayed_tool");
          return {
            content: [{ type: "text" as const, text: "Delayed tool ran" }],
            details: { ok: true },
          };
        },
      };

      session._toolRegistry.set(activateToolsTool.name, activateToolsTool);
      session._toolRegistry.set(delayedTool.name, delayedTool);

      const initialToolsRef = agent.state.tools;
      bindImmediateToolActivation(session as any);
      session.setActiveToolsByName?.(["activate_tools"]);
      expect(agent.state.tools).toBe(initialToolsRef);
      expect(agent.state.tools.map((tool) => tool.name)).toEqual(["activate_tools"]);

      faux.setResponses([
        fauxAssistantMessage(fauxToolCall("activate_tools", { names: ["delayed_tool"] })),
        (context) => fauxAssistantMessage(
          context.tools?.some((tool) => tool.name === "delayed_tool")
            ? fauxToolCall("delayed_tool", {})
            : "delayed tool missing",
        ),
        fauxAssistantMessage("done"),
      ]);

      await agent.prompt("activate and use the delayed tool");

      expect(delayedCalls).toEqual(["delayed_tool"]);
      expect(agent.state.tools).toBe(initialToolsRef);
      expect(agent.state.tools.map((tool) => tool.name)).toEqual(["activate_tools", "delayed_tool"]);

      const assistantTexts = agent.state.messages
        .filter((message) => message.role === "assistant")
        .flatMap((message) => message.content)
        .filter((block) => block.type === "text")
        .map((block) => block.text);
      expect(assistantTexts).toContain("done");

      const toolResults = agent.state.messages.filter((message) => message.role === "toolResult");
      expect(toolResults.map((message) => message.toolName)).toContain("delayed_tool");
    } finally {
      faux.unregister();
    }
  });

  test("extension tools activated via activate_tools are callable in the same turn", async () => {
    const authStorage = AuthStorage.create();
    authStorage.set("faux", { type: "api_key", key: "test-key" });
    const modelRegistry = ModelRegistry.inMemory(authStorage);
    const settingsManager = SettingsManager.create("/workspace", getAgentDir());
    const tempRoot = mkdtempSync(join(tmpdir(), "piclaw-issue13-"));
    const workspaceDir = join(tempRoot, "workspace");
    mkdirSync(workspaceDir, { recursive: true });
    const sessionDir = join(tempRoot, "session");
    const previousWorkspace = process.env.PICLAW_WORKSPACE;
    process.env.PICLAW_WORKSPACE = workspaceDir;
    const faux = registerFauxProvider();

    try {
      const runtime = await createSessionInDir(sessionDir, {
        authStorage,
        modelRegistry,
        settingsManager,
        tools: [],
        extensionFactories: [customExtension],
      });
      const session: any = runtime.session;
      session.agent.state.model = faux.getModel();
      session.setActiveToolsByName(["activate_tools"]);

      faux.setResponses([
        fauxAssistantMessage(fauxToolCall("activate_tools", { names: ["demo_extension_tool"] })),
        (context) => fauxAssistantMessage(
          context.tools?.some((tool) => tool.name === "demo_extension_tool")
            ? fauxToolCall("demo_extension_tool", { value: "same-turn" })
            : "demo tool missing from context",
        ),
        fauxAssistantMessage("done"),
      ]);

      await session.prompt("activate and use the demo extension tool");

      const assistantTexts = session.agent.state.messages
        .filter((message) => message.role === "assistant")
        .flatMap((message) => message.content)
        .filter((block) => block.type === "text")
        .map((block) => block.text);
      expect(assistantTexts).toContain("done");

      const toolResults = session.agent.state.messages.filter((message) => message.role === "toolResult");
      expect(toolResults.map((message) => message.toolName)).toContain("demo_extension_tool");
      expect(toolResults.some((message) => message.toolName === "demo_extension_tool" && message.isError)).toBe(false);
    } finally {
      faux.unregister();
      if (previousWorkspace === undefined) delete process.env.PICLAW_WORKSPACE;
      else process.env.PICLAW_WORKSPACE = previousWorkspace;
      rmSync(tempRoot, { recursive: true, force: true });
    }
  }, 10_000);
});
