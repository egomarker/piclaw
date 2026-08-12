import { LocalAppProxyService } from "./service.js";

/** Shared process-wide registry used by routing, settings, lifecycle, and tools. */
export const localAppProxyService = new LocalAppProxyService();

export * from "./types.js";
export * from "./service.js";
export * from "./http-proxy.js";
export * from "./validation.js";
export * from "./urls.js";
