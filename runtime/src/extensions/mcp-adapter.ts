/**
 * Piclaw's sole pi-mcp-adapter factory. Tool decoration uses the public
 * registration API; startup belongs to the SDK's real session_start context.
 * The adapter continues to own transport, native timeouts, reload, and shutdown.
 */
import type { ExtensionFactory } from "@earendil-works/pi-coding-agent";
import { withMcpToolDeadlines } from "./mcp-timeout-patch.js";

// The adapter ships TypeScript rather than declarations. Keep its source graph
// outside Piclaw's compiler settings; validate this public boundary with real SDK tests.
type AdapterModule = {
  createMcpAdapter(options: { initializeOnLoad: boolean }): ExtensionFactory;
};
const ADAPTER_PACKAGE = "pi-mcp-adapter";

export const mcpAdapterExtension: ExtensionFactory = async (pi) => {
  const { createMcpAdapter } = await import(ADAPTER_PACKAGE) as AdapterModule;
  await createMcpAdapter({ initializeOnLoad: false })(withMcpToolDeadlines(pi));
};
