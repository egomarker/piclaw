import "@earendil-works/pi-coding-agent";

declare module "@earendil-works/pi-coding-agent" {
  interface AgentSessionRuntime {
    session: import("@earendil-works/pi-coding-agent").AgentSession;
    cwd: string;
    diagnostics: unknown[];
    modelFallbackMessage?: string;
    extensionsResult?: unknown;
    services?: unknown;
    dispose(): Promise<void>;
  }
}

export {};
