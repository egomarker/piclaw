import type { ExtensionAPI, ExtensionFactory } from "@earendil-works/pi-coding-agent";

import "../helpers.ts";
import { builtinExtensionFactories } from "../../src/extensions/index.js";

interface RegisteredBeforeAgentStartHandler {
  extensionName: string;
  handler: (event: {
    type: "before_agent_start";
    prompt: string;
    images: unknown[];
    systemPrompt: string;
  }) => Promise<{ systemPrompt?: string; message?: unknown } | void>;
}

interface RegisteredContextHandler {
  extensionName: string;
  handler: (event: {
    type: "context";
    messages: Array<Record<string, unknown>>;
  }) => Promise<{ messages?: Array<Record<string, unknown>> } | void>;
}

interface RegistrationSnapshot {
  beforeAgentStart: RegisteredBeforeAgentStartHandler[];
  contextHandlers: RegisteredContextHandler[];
  tools: string[];
  commands: string[];
}

export interface ExtensionHookDeterminismAuditResult {
  ok: boolean;
  before_agent_start_hooks: number;
  context_hooks: number;
  hook_order: string[];
  context_hook_order: string[];
  tool_order: string[];
  command_order: string[];
  final_system_prompt: string;
  context_messages: Array<Record<string, unknown>>;
  repeated_match: boolean;
  fresh_match: boolean;
  detail?: string;
}

function createRegistrationSnapshot(factories: ExtensionFactory[]): RegistrationSnapshot {
  const beforeAgentStart: RegisteredBeforeAgentStartHandler[] = [];
  const contextHandlers: RegisteredContextHandler[] = [];
  const tools: string[] = [];
  const commands: string[] = [];

  for (const factory of factories) {
    const extensionName = factory.name || "anonymous_extension";
    const api: ExtensionAPI = {
      on(event, handler) {
        if (event === "before_agent_start") {
          beforeAgentStart.push({ extensionName, handler: handler as RegisteredBeforeAgentStartHandler["handler"] });
        }
        if (event === "context") {
          contextHandlers.push({ extensionName, handler: handler as RegisteredContextHandler["handler"] });
        }
      },
      registerTool(def) {
        tools.push(`${extensionName}:${def.name}`);
      },
      registerCommand(name) {
        commands.push(`${extensionName}:${name}`);
      },
      getAllTools() {
        return [];
      },
      getThinkingLevel() {
        return "off";
      },
    } as ExtensionAPI;

    factory(api);
  }

  return { beforeAgentStart, contextHandlers, tools, commands };
}

async function emitBeforeAgentStart(snapshot: RegistrationSnapshot) {
  let systemPrompt = "Base system prompt";
  const hookOrder: string[] = [];

  for (const entry of snapshot.beforeAgentStart) {
    hookOrder.push(entry.extensionName);
    const result = await entry.handler({
      type: "before_agent_start",
      prompt: "Audit prompt",
      images: [],
      systemPrompt,
    });
    if (result && typeof result === "object" && "systemPrompt" in result && typeof result.systemPrompt === "string") {
      systemPrompt = result.systemPrompt;
    }
  }

  return {
    hookOrder,
    systemPrompt,
  };
}

async function emitContext(snapshot: RegistrationSnapshot) {
  let messages: Array<Record<string, unknown>> = [
    {
      role: "user",
      content: [
        { type: "text", text: "hello" },
        { type: "image", source: { media_type: "image/svg+xml" } },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "tool_result",
          content: [
            { type: "image", source: { media_type: "application/pdf" } },
            { type: "text", text: "kept" },
          ],
        },
      ],
    },
  ];
  const hookOrder: string[] = [];

  for (const entry of snapshot.contextHandlers) {
    hookOrder.push(entry.extensionName);
    const result = await entry.handler({
      type: "context",
      messages,
    });
    if (result && typeof result === "object" && Array.isArray(result.messages)) {
      messages = result.messages;
    }
  }

  return {
    hookOrder,
    messages,
  };
}

export async function runExtensionHookDeterminismAudit(): Promise<ExtensionHookDeterminismAuditResult> {
  const first = createRegistrationSnapshot(builtinExtensionFactories);
  const second = createRegistrationSnapshot(builtinExtensionFactories);

  const firstBeforeRun = await emitBeforeAgentStart(first);
  const repeatedBeforeRun = await emitBeforeAgentStart(first);
  const freshBeforeRun = await emitBeforeAgentStart(second);

  const firstContextRun = await emitContext(first);
  const repeatedContextRun = await emitContext(first);
  const freshContextRun = await emitContext(second);

  const repeatedMatch = JSON.stringify({ before: firstBeforeRun, context: firstContextRun }) === JSON.stringify({ before: repeatedBeforeRun, context: repeatedContextRun });
  const freshMatch = JSON.stringify({ before: firstBeforeRun, context: firstContextRun }) === JSON.stringify({ before: freshBeforeRun, context: freshContextRun })
    && JSON.stringify(first.tools) === JSON.stringify(second.tools)
    && JSON.stringify(first.commands) === JSON.stringify(second.commands)
    && JSON.stringify(first.beforeAgentStart.map((entry) => entry.extensionName)) === JSON.stringify(second.beforeAgentStart.map((entry) => entry.extensionName))
    && JSON.stringify(first.contextHandlers.map((entry) => entry.extensionName)) === JSON.stringify(second.contextHandlers.map((entry) => entry.extensionName));

  const ok = repeatedMatch && freshMatch;
  const detail = ok
    ? undefined
    : JSON.stringify({
        firstBeforeRun,
        repeatedBeforeRun,
        freshBeforeRun,
        firstContextRun,
        repeatedContextRun,
        freshContextRun,
        firstTools: first.tools,
        secondTools: second.tools,
        firstCommands: first.commands,
        secondCommands: second.commands,
      });

  return {
    ok,
    before_agent_start_hooks: first.beforeAgentStart.length,
    context_hooks: first.contextHandlers.length,
    hook_order: firstBeforeRun.hookOrder,
    context_hook_order: firstContextRun.hookOrder,
    tool_order: first.tools,
    command_order: first.commands,
    final_system_prompt: firstBeforeRun.systemPrompt,
    context_messages: firstContextRun.messages,
    repeated_match: repeatedMatch,
    fresh_match: freshMatch,
    detail,
  };
}
