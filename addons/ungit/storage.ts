export const UNGIT_ADDON_ID = "ungit";

export interface UngitConfig {
  baseUrl: string;
  workspaceRoot: string;
  hideHeader: boolean;
  proxyEnabled: boolean;
  defaultZoomPercent: number;
}

export const DEFAULT_UNGIT_CONFIG: UngitConfig = {
  baseUrl: "http://127.0.0.1:8448/",
  workspaceRoot: "/workspace",
  hideHeader: true,
  proxyEnabled: true,
  defaultZoomPercent: 60,
};

const ALLOWED_ZOOM_PERCENTAGES = new Set([30, 40, 50, 60, 70, 80, 90, 100]);

type ExtensionKvStore = {
  get<T = unknown>(extensionId: string, key: string, scope?: string, scopeKey?: string): T | null;
  set(extensionId: string, key: string, value: unknown, scope?: string, scopeKey?: string): void;
};

function getKvStore(): ExtensionKvStore | null {
  return (globalThis as {
    __piclawRuntimeInterop?: {
      getExtensionKvStore?: () => ExtensionKvStore;
    };
  }).__piclawRuntimeInterop?.getExtensionKvStore?.() ?? null;
}

function normalizeBaseUrl(value: unknown): string {
  const input = typeof value === "string" ? value.trim() : "";
  if (!input) return DEFAULT_UNGIT_CONFIG.baseUrl;
  try {
    const url = new URL(input);
    if (url.protocol !== "http:" && url.protocol !== "https:") return DEFAULT_UNGIT_CONFIG.baseUrl;
    url.hash = "";
    return url.href;
  } catch {
    return DEFAULT_UNGIT_CONFIG.baseUrl;
  }
}

function normalizeWorkspaceRoot(value: unknown): string {
  const input = typeof value === "string" ? value.trim() : "";
  if (!input || input.includes("\0")) return DEFAULT_UNGIT_CONFIG.workspaceRoot;
  return input;
}

function normalizeDefaultZoomPercent(value: unknown): number {
  const percent = Number(value);
  return ALLOWED_ZOOM_PERCENTAGES.has(percent) ? percent : DEFAULT_UNGIT_CONFIG.defaultZoomPercent;
}

export function normalizeUngitConfig(value: Partial<UngitConfig> | null | undefined): UngitConfig {
  return {
    baseUrl: normalizeBaseUrl(value?.baseUrl),
    workspaceRoot: normalizeWorkspaceRoot(value?.workspaceRoot),
    hideHeader: value?.hideHeader !== false,
    proxyEnabled: value?.proxyEnabled !== false,
    defaultZoomPercent: normalizeDefaultZoomPercent(value?.defaultZoomPercent),
  };
}

export function loadUngitConfig(): UngitConfig {
  const stored = getKvStore()?.get<Partial<UngitConfig>>(UNGIT_ADDON_ID, "config", "global") ?? null;
  return normalizeUngitConfig(stored);
}

export function saveUngitConfig(value: Partial<UngitConfig>): UngitConfig {
  const next = normalizeUngitConfig({ ...loadUngitConfig(), ...value });
  getKvStore()?.set(UNGIT_ADDON_ID, "config", next, "global");
  return next;
}
