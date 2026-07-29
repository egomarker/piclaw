// @ts-nocheck

const ADDON_ID = "ungit";
const CONFIG_API = `/agent/addons/api/${ADDON_ID}/config`;
const TAB_PREFIX = "piclaw://ungit/";
const CONFIG_CHANGED_EVENT = "piclaw:ungit-config-changed";
const STYLE_ID = "piclaw-ungit-pane-style";
const SAME_ORIGIN_PROXY_URL = "/ungit/";
const RELATIVE_URL_ORIGIN = "http://piclaw.invalid";

export const UNGIT_ZOOM_PERCENTAGES = Object.freeze([30, 40, 50, 60, 70, 80, 90, 100]);
export const DEFAULT_UNGIT_ZOOM_PERCENT = 60;

export function resolveUngitZoomLayout(value = DEFAULT_UNGIT_ZOOM_PERCENT) {
  const requestedPercent = Number(value);
  const percent = UNGIT_ZOOM_PERCENTAGES.includes(requestedPercent)
    ? requestedPercent
    : DEFAULT_UNGIT_ZOOM_PERCENT;
  const scale = percent / 100;
  return { percent, scale, viewportPercent: 100 / scale };
}

export const DEFAULT_UNGIT_WEB_CONFIG = Object.freeze({
  baseUrl: "http://127.0.0.1:8448/",
  workspaceRoot: "/workspace",
  hideHeader: true,
  proxyEnabled: true,
});

const preactHtm = globalThis.__piclawPreactHtm || globalThis.__piclawPreact || null;
const html = preactHtm?.html;
const useState = preactHtm?.useState;
const useEffect = preactHtm?.useEffect;
const useCallback = preactHtm?.useCallback;
const HAS_SETTINGS_RUNTIME = Boolean(html && useState && useEffect && useCallback);

let cachedConfig = null;
let configRequest = null;

function normalizeBaseUrl(value) {
  const input = typeof value === "string" ? value.trim() : "";
  if (!input) return DEFAULT_UNGIT_WEB_CONFIG.baseUrl;
  try {
    const url = new URL(input);
    if (url.protocol !== "http:" && url.protocol !== "https:") return DEFAULT_UNGIT_WEB_CONFIG.baseUrl;
    url.hash = "";
    return url.href;
  } catch {
    return DEFAULT_UNGIT_WEB_CONFIG.baseUrl;
  }
}

export function normalizeUngitWebConfig(value = {}) {
  return {
    baseUrl: normalizeBaseUrl(value?.baseUrl),
    workspaceRoot: typeof value?.workspaceRoot === "string" && value.workspaceRoot.trim()
      ? value.workspaceRoot.trim()
      : DEFAULT_UNGIT_WEB_CONFIG.workspaceRoot,
    hideHeader: value?.hideHeader !== false,
    proxyEnabled: value?.proxyEnabled !== false,
  };
}

export function normalizeWorkspaceRelativePath(value) {
  const input = typeof value === "string" ? value.trim().replace(/\\/g, "/") : "";
  if (!input || input === ".") return ".";
  const segments = input.replace(/^\/+/, "").split("/").filter((segment) => segment && segment !== ".");
  if (segments.some((segment) => segment === "..")) {
    throw new Error(`Workspace path escapes the workspace root: ${value}`);
  }
  return segments.join("/") || ".";
}

function trimWorkspaceRoot(value) {
  const root = String(value || DEFAULT_UNGIT_WEB_CONFIG.workspaceRoot).trim();
  if (root === "/" || root === "\\" || /^[a-z]:[\\/]$/i.test(root)) return root;
  return root.replace(/[\\/]+$/, "") || DEFAULT_UNGIT_WEB_CONFIG.workspaceRoot;
}

export function resolveUngitRepositoryPath(workspacePath, workspaceRoot = DEFAULT_UNGIT_WEB_CONFIG.workspaceRoot) {
  const relativePath = normalizeWorkspaceRelativePath(workspacePath);
  const root = trimWorkspaceRoot(workspaceRoot);
  if (relativePath === ".") return root;
  const windowsRoot = /^[a-z]:[\\/]/i.test(root) && root.includes("\\") && !root.includes("/");
  const separator = windowsRoot ? "\\" : "/";
  const relative = windowsRoot ? relativePath.replace(/\//g, "\\") : relativePath;
  return root.endsWith(separator) ? `${root}${relative}` : `${root}${separator}${relative}`;
}

export function encodeUngitPath(value) {
  return encodeURIComponent(String(value || "")).replace(/%2F/gi, "/");
}

export function buildUngitUrl(workspacePath, options = DEFAULT_UNGIT_WEB_CONFIG) {
  const config = normalizeUngitWebConfig(options);
  const repositoryPath = resolveUngitRepositoryPath(workspacePath, config.workspaceRoot);
  const url = new URL(config.proxyEnabled ? SAME_ORIGIN_PROXY_URL : config.baseUrl, RELATIVE_URL_ORIGIN);
  if (config.hideHeader) url.searchParams.set("noheader", "true");
  else url.searchParams.delete("noheader");
  url.hash = `/repository?path=${encodeUngitPath(repositoryPath)}`;
  return config.proxyEnabled ? `${url.pathname}${url.search}${url.hash}` : url.href;
}

export function buildUngitTabPath(workspacePath) {
  return `${TAB_PREFIX}${encodeURIComponent(normalizeWorkspaceRelativePath(workspacePath))}`;
}

export function parseUngitTabPath(tabPath) {
  const input = typeof tabPath === "string" ? tabPath.trim() : "";
  if (!input.startsWith(TAB_PREFIX)) return null;
  try {
    return normalizeWorkspaceRelativePath(decodeURIComponent(input.slice(TAB_PREFIX.length)) || ".");
  } catch {
    return null;
  }
}

async function requestUngitConfig(options = {}) {
  const response = await fetch(CONFIG_API, {
    method: options.method || "GET",
    credentials: "same-origin",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.error || `Unable to load Ungit configuration (HTTP ${response.status}).`);
  }
  const config = normalizeUngitWebConfig(payload?.config || payload);
  cachedConfig = config;
  return config;
}

export async function loadUngitWebConfig(force = false) {
  if (!force && cachedConfig) return cachedConfig;
  if (!force && configRequest) return configRequest;
  configRequest = requestUngitConfig().catch((error) => {
    console.warn("[ungit] config API unavailable; using defaults", error);
    cachedConfig = normalizeUngitWebConfig(DEFAULT_UNGIT_WEB_CONFIG);
    return cachedConfig;
  }).finally(() => {
    configRequest = null;
  });
  return configRequest;
}

async function saveUngitWebConfig(config) {
  return requestUngitConfig({ method: "POST", body: normalizeUngitWebConfig(config) });
}

function injectStyles(ownerDocument = document) {
  if (!ownerDocument?.head || ownerDocument.getElementById(STYLE_ID)) return;
  const style = ownerDocument.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .ungit-pane { position:relative; width:100%; height:100%; min-width:0; min-height:0; overflow:hidden; background:var(--bg-primary,#111827); }
    .ungit-pane iframe { display:block; width:100%; height:100%; border:0; background:#fff; transform-origin:top left; }
    .ungit-pane-status { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:24px; color:var(--text-secondary,#94a3b8); font:13px/1.5 var(--font-family-ui,system-ui,sans-serif); text-align:center; pointer-events:none; z-index:2; }
    .ungit-pane-zoom { position:absolute; top:7px; right:44px; z-index:3; height:28px; min-width:68px; padding:0 6px; border:1px solid color-mix(in srgb,var(--border-color,#334155) 80%,transparent); border-radius:6px; background:color-mix(in srgb,var(--bg-primary,#111827) 88%,transparent); color:var(--text-secondary,#94a3b8); font:12px/1 var(--font-family-ui,system-ui,sans-serif); cursor:pointer; opacity:.42; }
    .ungit-pane-open-external { position:absolute; top:7px; right:9px; z-index:3; width:28px; height:28px; display:flex; align-items:center; justify-content:center; padding:0; border:1px solid color-mix(in srgb,var(--border-color,#334155) 80%,transparent); border-radius:6px; background:color-mix(in srgb,var(--bg-primary,#111827) 88%,transparent); color:var(--text-secondary,#94a3b8); cursor:pointer; opacity:.34; }
    .ungit-pane:hover .ungit-pane-zoom, .ungit-pane-zoom:focus-visible, .ungit-pane:hover .ungit-pane-open-external, .ungit-pane-open-external:focus-visible { opacity:1; color:var(--accent-color,#3b82f6); }
    .ungit-pane-open-external svg { width:15px; height:15px; }
  `;
  ownerDocument.head.appendChild(style);
}

class UngitPaneInstance {
  constructor(container, context = {}) {
    this.container = container;
    this.ownerDocument = container.ownerDocument || document;
    this.ownerWindow = this.ownerDocument.defaultView || window;
    this.workspacePath = parseUngitTabPath(context?.path);
    this.disposed = false;
    this.frameUrl = null;
    this.loadTimer = 0;

    injectStyles(this.ownerDocument);
    this.root = this.ownerDocument.createElement("div");
    this.root.className = "ungit-pane";
    this.status = this.ownerDocument.createElement("div");
    this.status.className = "ungit-pane-status";
    this.status.textContent = "Opening Ungit…";
    this.iframe = this.ownerDocument.createElement("iframe");
    this.iframe.title = `Ungit — ${this.workspacePath || "workspace"}`;
    this.iframe.setAttribute("allow", "clipboard-read; clipboard-write");
    this.iframe.setAttribute("referrerpolicy", "no-referrer");
    this.zoomPicker = this.ownerDocument.createElement("select");
    this.zoomPicker.className = "ungit-pane-zoom";
    this.zoomPicker.title = "Ungit zoom";
    this.zoomPicker.setAttribute("aria-label", "Ungit zoom");
    for (const percent of UNGIT_ZOOM_PERCENTAGES) {
      const option = this.ownerDocument.createElement("option");
      option.value = String(percent);
      option.textContent = `${percent}%`;
      this.zoomPicker.appendChild(option);
    }
    this.zoomPicker.addEventListener("change", () => this.applyZoom(this.zoomPicker.value));
    this.applyZoom(DEFAULT_UNGIT_ZOOM_PERCENT);
    this.openExternal = this.ownerDocument.createElement("button");
    this.openExternal.type = "button";
    this.openExternal.className = "ungit-pane-open-external";
    this.openExternal.title = "Open Ungit in a new browser tab";
    this.openExternal.setAttribute("aria-label", "Open Ungit in a new browser tab");
    this.openExternal.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>';
    this.openExternal.addEventListener("click", () => {
      if (this.frameUrl) this.ownerWindow.open(this.frameUrl, "_blank", "noopener,noreferrer");
    });
    this.iframe.addEventListener("load", () => {
      if (this.disposed || !this.frameUrl) return;
      this.status.style.display = "none";
      if (this.loadTimer) this.ownerWindow.clearTimeout(this.loadTimer);
      this.loadTimer = 0;
    });
    this.iframe.addEventListener("error", () => {
      if (!this.disposed) this.status.textContent = "Unable to load Ungit. Use the ↗ button to open it directly.";
    });
    this.root.append(this.iframe, this.status, this.zoomPicker, this.openExternal);
    container.appendChild(this.root);
    this.configChangeListener = () => void this.load(true);
    this.ownerWindow.addEventListener(CONFIG_CHANGED_EVENT, this.configChangeListener);
    void this.load();
  }

  applyZoom(value) {
    const layout = resolveUngitZoomLayout(value);
    this.zoomPicker.value = String(layout.percent);
    this.iframe.style.width = `${layout.viewportPercent}%`;
    this.iframe.style.height = `${layout.viewportPercent}%`;
    this.iframe.style.transform = `scale(${layout.scale})`;
  }

  async load(forceConfig = false) {
    if (!this.workspacePath) {
      this.status.textContent = "Invalid Ungit workspace path.";
      return;
    }
    this.status.style.display = "flex";
    this.status.textContent = "Opening Ungit…";
    const config = await loadUngitWebConfig(forceConfig);
    if (this.disposed) return;
    this.frameUrl = buildUngitUrl(this.workspacePath, config);
    this.iframe.src = this.frameUrl;
    if (this.loadTimer) this.ownerWindow.clearTimeout(this.loadTimer);
    this.loadTimer = this.ownerWindow.setTimeout(() => {
      if (!this.disposed && this.status.style.display !== "none") {
        this.status.textContent = "Ungit is still loading. Confirm that it is running, or use the ↗ button.";
      }
    }, 10_000);
  }

  getContent() { return undefined; }
  isDirty() { return false; }
  focus() { this.iframe?.focus?.(); }
  resize() {}

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    if (this.loadTimer) this.ownerWindow.clearTimeout(this.loadTimer);
    this.ownerWindow.removeEventListener(CONFIG_CHANGED_EVENT, this.configChangeListener);
    if (this.iframe) this.iframe.src = "about:blank";
    this.root?.remove?.();
  }
}

function renderGitBranchIcon() {
  if (!html) return "Git";
  return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="5" r="2"></circle><circle cx="6" cy="19" r="2"></circle><circle cx="18" cy="7" r="2"></circle><path d="M6 7v10"></path><path d="M8 17c5 0 8-3 8-8"></path></svg>`;
}

export const ungitPaneExtension = {
  id: "ungit",
  label: "Ungit",
  icon: "git-branch",
  capabilities: ["git"],
  placement: "tabs",
  canHandle(context) {
    return parseUngitTabPath(context?.path) ? 10_000 : false;
  },
  mount(container, context) {
    return new UngitPaneInstance(container, context);
  },
};

export const ungitWorkspaceRowAction = {
  id: "ungit.open-repository",
  label: "Open in Ungit",
  order: 100,
  icon: renderGitBranchIcon,
  canHandle(target) {
    return target?.type === "dir";
  },
  onActivate(context) {
    const tabPath = buildUngitTabPath(context.path);
    const label = context.path === "." ? "Git: workspace" : `Git: ${context.name}`;
    context.openTab(tabPath, { label, paneOverrideId: "ungit" });
  },
};

function UngitSettingsPane() {
  if (!HAS_SETTINGS_RUNTIME) return null;
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setMessage("");
    try {
      const config = await requestUngitConfig();
      setDraft(config);
    } catch (error) {
      setMessage(String(error?.message || error));
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const save = useCallback(async () => {
    setSaving(true);
    setMessage("");
    try {
      const config = await saveUngitWebConfig(draft || DEFAULT_UNGIT_WEB_CONFIG);
      setDraft(config);
      globalThis.dispatchEvent?.(new CustomEvent(CONFIG_CHANGED_EVENT, { detail: config }));
      setMessage("Saved. Open Ungit tabs were reloaded.");
    } catch (error) {
      setMessage(String(error?.message || error));
    } finally {
      setSaving(false);
    }
  }, [draft]);

  if (!draft) return html`<div style="padding:0.5rem 0;color:var(--text-secondary)">${message || "Loading Ungit settings…"}</div>`;

  const rowStyle = { display: "flex", alignItems: "center", gap: "0.65rem", margin: "0.6rem 0" };
  const labelStyle = { width: "130px", flex: "0 0 130px", color: "var(--text-secondary)", fontSize: "0.82rem" };
  const inputStyle = { flex: 1, minWidth: 0, padding: "7px 9px", border: "1px solid var(--border-color)", borderRadius: "6px", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.84rem" };
  let previewUrl = "";
  try { previewUrl = buildUngitUrl(".", draft); } catch {}

  return html`
    <div style="padding:0.5rem 0;max-width:720px">
      <h4 style="margin:0.4rem 0 0.7rem">Ungit workspace integration</h4>
      <p style="margin:0 0 0.8rem;color:var(--text-secondary);font-size:0.8rem;line-height:1.45">
        Folder-row Git buttons open the selected directory in an iframe-backed Ungit tab.
      </p>
      <label style=${{ ...rowStyle, alignItems: "flex-start" }}>
        <span style=${labelStyle}>Connection</span>
        <span style="font-size:0.82rem;line-height:1.45"><input type="checkbox" checked=${draft.proxyEnabled}
          onChange=${(event) => setDraft({ ...draft, proxyEnabled: event.target.checked })} disabled=${saving} /> Use the same-origin proxy at <code>/ungit/</code>
          <br /><small style="color:var(--text-secondary)">Expects Ungit on 127.0.0.1:8448 with <code>--rootPath=/ungit</code>.</small>
        </span>
      </label>
      <label style=${rowStyle}>
        <span style=${labelStyle}>Direct Ungit URL</span>
        <input style=${inputStyle} type="url" value=${draft.baseUrl} placeholder="http://127.0.0.1:8448/"
          onInput=${(event) => setDraft({ ...draft, baseUrl: event.target.value })} disabled=${saving || draft.proxyEnabled} />
      </label>
      <label style=${rowStyle}>
        <span style=${labelStyle}>Workspace root</span>
        <input style=${inputStyle} value=${draft.workspaceRoot} placeholder="/workspace"
          onInput=${(event) => setDraft({ ...draft, workspaceRoot: event.target.value })} disabled=${saving} />
      </label>
      <label style=${{ ...rowStyle, alignItems: "flex-start" }}>
        <span style=${labelStyle}>Embedded layout</span>
        <span style="font-size:0.82rem"><input type="checkbox" checked=${draft.hideHeader}
          onChange=${(event) => setDraft({ ...draft, hideHeader: event.target.checked })} disabled=${saving} /> Hide the Ungit header</span>
      </label>
      <div style="margin:0.2rem 0 0.8rem 140px;color:var(--text-secondary);font-size:0.74rem;line-height:1.4">
        The direct URL is used only when the proxy is disabled. The workspace root is the path visible to the Ungit process. Preview: <code style="word-break:break-all">${previewUrl}</code>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <button onClick=${save} disabled=${saving || (!draft.proxyEnabled && !draft.baseUrl.trim()) || !draft.workspaceRoot.trim()}>${saving ? "Saving…" : "Save"}</button>
        <button onClick=${load} disabled=${saving}>Reset draft</button>
        ${previewUrl ? html`<a href=${previewUrl} target="_blank" rel="noreferrer">Open workspace in Ungit ↗</a>` : null}
      </div>
      ${message ? html`<div style=${{ marginTop: "0.75rem", color: /unable|error|failed/i.test(message) ? "var(--danger-color,#dc2626)" : "var(--accent-color,#2563eb)", fontSize: "0.8rem" }}>${message}</div>` : null}
    </div>
  `;
}

function registerUngitSettingsPane(api) {
  if (!HAS_SETTINGS_RUNTIME || typeof api?.registerSettingsPane !== "function") return false;
  api.registerSettingsPane({
    id: ADDON_ID,
    label: "Ungit",
    icon: renderGitBranchIcon(),
    component: UngitSettingsPane,
    order: 92,
  });
  return true;
}

export function registerUngitAddon(api = globalThis.__piclaw_web) {
  if (!api || typeof api.registerPane !== "function") return false;
  const paneRegistered = api.registerPane(ungitPaneExtension) !== false;
  const actionRegistered = typeof api.registerWorkspaceRowAction === "function"
    ? typeof api.registerWorkspaceRowAction(ungitWorkspaceRowAction) === "function"
    : false;
  registerUngitSettingsPane(api);
  if (!actionRegistered) console.warn("[ungit] Piclaw workspace row-action API is unavailable");
  return paneRegistered && actionRegistered;
}

try {
  registerUngitAddon();
} catch (error) {
  console.warn("[ungit] browser integration registration failed", error);
}
