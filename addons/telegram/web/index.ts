const ADDON_ID = "telegram";
const API_BASE = `/agent/addons/api/${ADDON_ID}`;

const preactHtm = (globalThis).__piclawPreactHtm || (globalThis).__piclawPreact || null;
const html = preactHtm?.html;
const useState = preactHtm?.useState;
const useEffect = preactHtm?.useEffect;
const useCallback = preactHtm?.useCallback;

function defaultForm() {
  return {
    enabled: false,
    botToken: "",
    allowedChatIdsText: "",
    pollingTimeoutSeconds: 30,
    triggerMode: "always",
    unauthorizedMode: "reply_not_authorized",
  };
}

function normalizeChatIdsText(value) {
  return String(value || "")
    .split(/\r?\n|,/g)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .join("\n");
}

function TelegramSettingsPane() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState(defaultForm());
  const [runtime, setRuntime] = useState({
    hasBotToken: false,
    maskedBotToken: "",
    connected: false,
    botId: null,
    botUsername: null,
    lastError: null,
    lastEventAt: null,
    restartRequired: true,
  });
  const [clearBotToken, setClearBotToken] = useState(false);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/config`, { credentials: "same-origin" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
      setForm({
        enabled: data?.enabled === true,
        botToken: "",
        allowedChatIdsText: Array.isArray(data?.allowedChatIds) ? data.allowedChatIds.join("\n") : "",
        pollingTimeoutSeconds: Number.isFinite(data?.pollingTimeoutSeconds) ? data.pollingTimeoutSeconds : 30,
        triggerMode: data?.triggerMode === "mention_or_command" ? "mention_or_command" : "always",
        unauthorizedMode: data?.unauthorizedMode === "ignore" ? "ignore" : "reply_not_authorized",
      });
      setRuntime({
        hasBotToken: Boolean(data?.hasBotToken),
        maskedBotToken: typeof data?.botToken === "string" ? data.botToken : "",
        connected: data?.connected === true,
        botId: Number.isFinite(data?.botId) ? data.botId : null,
        botUsername: typeof data?.botUsername === "string" && data.botUsername.trim() ? data.botUsername.trim() : null,
        lastError: typeof data?.lastError === "string" && data.lastError.trim() ? data.lastError.trim() : null,
        lastEventAt: typeof data?.lastEventAt === "string" && data.lastEventAt.trim() ? data.lastEventAt.trim() : null,
        restartRequired: data?.restartRequired !== false,
      });
      setClearBotToken(false);
      setStatus(null);
    } catch (error) {
      setStatus({ tone: "error", text: String(error?.message || error || "Failed to load Telegram settings.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  const saveConfig = useCallback(async () => {
    setSaving(true);
    setStatus({ tone: "info", text: "Saving Telegram settings…" });
    try {
      const payload = {
        enabled: form.enabled,
        pollingTimeoutSeconds: Number.isFinite(Number(form.pollingTimeoutSeconds)) ? Number(form.pollingTimeoutSeconds) : 30,
        allowedChatIdsText: normalizeChatIdsText(form.allowedChatIdsText),
        triggerMode: form.triggerMode,
        unauthorizedMode: form.unauthorizedMode,
        ...(form.botToken.trim() ? { botToken: form.botToken.trim() } : {}),
        ...(clearBotToken && !form.botToken.trim() ? { clearBotToken: true } : {}),
      };
      const response = await fetch(`${API_BASE}/config`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
      setStatus({ tone: "success", text: data?.restartRequired === false ? "Telegram settings saved." : "Telegram settings saved. Restart piclaw to apply runtime changes." });
      await loadConfig();
    } catch (error) {
      setStatus({ tone: "error", text: String(error?.message || error || "Failed to save Telegram settings.") });
    } finally {
      setSaving(false);
    }
  }, [clearBotToken, form, loadConfig]);

  if (loading) {
    return html`<div class="settings-section"><p class="settings-hint">Loading Telegram settings…</p></div>`;
  }

  return html`
    <div class="settings-section">
      <h3>Telegram</h3>
      <p class="settings-hint">Allowlisted direct chats only. Restart piclaw after changing runtime settings.</p>

      ${status ? html`
        <div class=${status.tone === "error" ? "settings-addon-error" : "settings-hint"} role="status">
          ${status.text}
        </div>
      ` : null}

      <div class="settings-row">
        <label>Enabled</label>
        <input
          type="checkbox"
          checked=${form.enabled}
          disabled=${saving}
          onChange=${() => setForm((previous) => ({ ...previous, enabled: !previous.enabled }))}
        />
      </div>

      <div class="settings-row" style="align-items:flex-start; gap:12px;">
        <label style="padding-top:8px;">Bot token</label>
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:8px;">
          <input
            type="password"
            value=${form.botToken}
            disabled=${saving}
            placeholder=${runtime.hasBotToken && !clearBotToken
              ? `Saved token: ${runtime.maskedBotToken || "configured"}`
              : "123456:AA..."}
            onInput=${(event) => {
              const value = event?.target?.value || "";
              setForm((previous) => ({ ...previous, botToken: value }));
              if (value.trim()) setClearBotToken(false);
            }}
          />
          <div class="settings-hint" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <span>${runtime.hasBotToken && !clearBotToken ? `Stored: ${runtime.maskedBotToken || "configured"}` : "No token stored."}</span>
            ${runtime.hasBotToken ? html`
              <button
                type="button"
                disabled=${saving}
                onClick=${() => {
                  setClearBotToken(true);
                  setForm((previous) => ({ ...previous, botToken: "" }));
                }}
              >Clear saved token</button>
            ` : null}
          </div>
        </div>
      </div>

      <div class="settings-row" style="align-items:flex-start; gap:12px;">
        <label style="padding-top:8px;">Allowed chat IDs</label>
        <textarea
          rows="4"
          disabled=${saving}
          placeholder="One Telegram user chat ID per line"
          value=${form.allowedChatIdsText}
          onInput=${(event) => setForm((previous) => ({ ...previous, allowedChatIdsText: event?.target?.value || "" }))}
        ></textarea>
      </div>

      <div class="settings-row">
        <label>Trigger mode</label>
        <select
          value=${form.triggerMode}
          disabled=${saving}
          onChange=${(event) => setForm((previous) => ({ ...previous, triggerMode: event?.target?.value === "mention_or_command" ? "mention_or_command" : "always" }))}
        >
          <option value="always">Respond to every message</option>
          <option value="mention_or_command">Mention or slash command only</option>
        </select>
      </div>

      <div class="settings-row">
        <label>Unauthorized behavior</label>
        <select
          value=${form.unauthorizedMode}
          disabled=${saving}
          onChange=${(event) => setForm((previous) => ({ ...previous, unauthorizedMode: event?.target?.value === "ignore" ? "ignore" : "reply_not_authorized" }))}
        >
          <option value="reply_not_authorized">Reply “not authorized”</option>
          <option value="ignore">Ignore unauthorized chats</option>
        </select>
      </div>

      <div class="settings-row">
        <label>Polling timeout (seconds)</label>
        <input
          type="number"
          min="5"
          max="120"
          step="1"
          value=${String(form.pollingTimeoutSeconds)}
          disabled=${saving}
          onInput=${(event) => setForm((previous) => ({ ...previous, pollingTimeoutSeconds: event?.target?.value || "30" }))}
        />
      </div>

      <div class="settings-row" style="align-items:flex-start; gap:12px;">
        <label style="padding-top:4px;">Runtime status</label>
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:4px;">
          <div><strong>${runtime.connected ? "Connected" : "Disconnected"}</strong></div>
          ${runtime.botUsername || runtime.botId ? html`<div class="settings-hint">Bot: ${runtime.botUsername ? `@${runtime.botUsername}` : ""}${runtime.botUsername && runtime.botId ? " · " : ""}${runtime.botId ? `id ${runtime.botId}` : ""}</div>` : null}
          ${runtime.lastEventAt ? html`<div class="settings-hint">Last event: ${runtime.lastEventAt}</div>` : null}
          ${runtime.lastError ? html`<div class="settings-addon-error">${runtime.lastError}</div>` : null}
          ${runtime.restartRequired ? html`<div class="settings-hint">Runtime changes take effect after restart.</div>` : null}
        </div>
      </div>

      <div class="settings-row" style="justify-content:flex-end; gap:8px;">
        <button type="button" disabled=${saving} onClick=${() => void loadConfig()}>Reload</button>
        <button type="button" disabled=${saving} onClick=${() => void saveConfig()}>${saving ? "Saving…" : "Save"}</button>
      </div>
    </div>
  `;
}

if (html && useState && useEffect && useCallback) {
  const registry = globalThis.__piclawSettingsPaneRegistry || globalThis.__piclaw_web;
  registry?.registerSettingsPane?.({
    id: ADDON_ID,
    label: "Telegram",
    icon: html`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3L3.8 10.1c-.9.4-.9 1.7.1 2l4.7 1.5 1.5 4.7c.3 1 1.6 1 2-.1L21 3z"/><path d="M8.5 13.5l4.5 4.5"/></svg>`,
    component: TelegramSettingsPane,
    order: 210,
    searchable: true,
    searchPlaceholder: "Search Telegram settings",
  });
  registry?.notifySettingsPanesChanged?.();
}

export {};
