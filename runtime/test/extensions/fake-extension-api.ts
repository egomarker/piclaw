import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

interface ListedTool {
  name: string;
  description?: string;
  promptSnippet?: string;
  parameters?: unknown;
  aliases?: string[];
  promptGuidelines?: string[];
  examples?: unknown[];
  jdoc?: Record<string, unknown>;
  jdocs?: Record<string, unknown>;
  discoveryDoc?: Record<string, unknown>;
  structuredDoc?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

interface CreateFakeExtensionApiOptions {
  allTools?: ListedTool[];
  activeTools?: string[];
}

/**
 * Build a minimal ExtensionAPI test double and capture registered tools.
 */
export function createFakeExtensionApi(options: CreateFakeExtensionApiOptions = {}) {
  const tools = new Map<string, any>();
  const handlers: Array<{ event: string; handler: (...args: any[]) => any }> = [];
  let allTools = [...(options.allTools ?? [])];
  let activeTools = [...(options.activeTools ?? [])];

  const api = {
    on(event: string, handler: (...args: any[]) => any) { handlers.push({ event, handler }); },
    registerTool(tool: any) { tools.set(tool.name, tool); },
    registerCommand() {},
    registerShortcut() {},
    registerFlag() {},
    getFlag() { return undefined; },
    registerMessageRenderer() {},
    sendMessage() {},
    sendUserMessage() {},
    appendEntry() {},
    setSessionName() {},
    getSessionName() { return undefined; },
    setLabel() {},
    exec: async () => ({ exitCode: 0, stdout: "", stderr: "" }),
    getActiveTools: () => activeTools,
    getAllTools: () => allTools,
    setActiveTools(next: string[]) { activeTools = [...next]; },
    getCommands: () => [],
    setModel: async () => true,
    getThinkingLevel: () => "off" as any,
    setThinkingLevel() {},
    registerProvider() {},
    unregisterProvider() {},
  } as unknown as ExtensionAPI;

  return {
    api,
    tools,
    handlers,
    setAllTools(next: ListedTool[]) {
      allTools = [...next];
    },
    setActiveTools(next: string[]) {
      activeTools = [...next];
    },
  };
}
