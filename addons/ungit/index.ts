import { loadUngitConfig, saveUngitConfig, UNGIT_ADDON_ID } from "./storage.ts";

type AddonConfigApiRegistrar = (
  addonId: string,
  action: string,
  handlers: {
    get?: (payload: unknown, req: Request) => unknown | Promise<unknown>;
    set?: (payload: unknown, req: Request) => unknown | Promise<unknown>;
  },
  extensionPath?: string,
) => "created" | "updated";

function configResponse() {
  return {
    ...loadUngitConfig(),
    restartRequired: false,
  };
}

const registerAddonConfigApi = (globalThis as Record<string, unknown>).__piclaw_registerAddonConfigApi as AddonConfigApiRegistrar | undefined;
if (typeof registerAddonConfigApi === "function") {
  registerAddonConfigApi(UNGIT_ADDON_ID, "config", {
    get: async () => configResponse(),
    set: async (payload) => {
      const body = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
      saveUngitConfig({
        ...(typeof body.baseUrl === "string" ? { baseUrl: body.baseUrl } : {}),
        ...(typeof body.workspaceRoot === "string" ? { workspaceRoot: body.workspaceRoot } : {}),
        ...(typeof body.hideHeader === "boolean" ? { hideHeader: body.hideHeader } : {}),
      });
      return configResponse();
    },
  }, import.meta.dir);
}

export default function ungitAddon(): void {
  // Browser integration is registered by web/index.ts.
}
