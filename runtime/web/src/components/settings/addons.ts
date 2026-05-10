import { html, useState, useEffect, useCallback } from '../../vendor/preact-htm.js';

export function AddonsSection({ setStatus, filter = '' }) {
    const [addons, setAddons] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(null);
    const [restartRequired, setRestartRequired] = useState(false);
    const [platformInfo, setPlatformInfo] = useState({ runtime: '', windowsNative: false });
    const [catalogSources, setCatalogSources] = useState([]);
    const [failedSources, setFailedSources] = useState([]);

    // Read developer overrides from localStorage
    function devParams() {
        const params = new URLSearchParams();
        try {
            const primaryCatalogUrl = (localStorage.getItem('piclaw_addons_catalog_url') || '').trim();
            const additionalCatalogUrls = (localStorage.getItem('piclaw_addons_catalog_urls') || '')
                .split(/\r?\n/)
                .map(v => v.trim())
                .filter(Boolean);
            const ru = localStorage.getItem('piclaw_addons_repo_url');
            // All custom URLs are sent as catalog_url params; the server always
            // includes the default catalog and merges these on top.
            if (primaryCatalogUrl) params.append('catalog_url', primaryCatalogUrl);
            for (const extraUrl of additionalCatalogUrls) params.append('catalog_url', extraUrl);
            if (ru) params.set('repo_url', ru);
        } catch (e) { void e; }
        const qs = params.toString();
        return qs ? `?${qs}` : '';
    }

    const loadAddons = useCallback(async () => {
        try {
            const [addonsResp, settingsResp] = await Promise.all([
                fetch(`/agent/addons${devParams()}`),
                fetch('/agent/settings-data'),
            ]);
            const data = await addonsResp.json();
            if (data.error) throw new Error(data.error);
            setAddons(data.addons || []);
            setCatalogSources(data.sources || []);
            setFailedSources(data.failed_sources || []);

            const settingsData = await settingsResp.json().catch(() => ({}));
            const runtimePlatform = typeof settingsData?.runtimePlatform === 'string' ? settingsData.runtimePlatform : '';
            setPlatformInfo({
                runtime: runtimePlatform,
                windowsNative: runtimePlatform === 'win32',
            });
        } catch (e) { setAddons(null); setStatus?.(String(e.message || e), 'error'); }
        finally { setLoading(false); }
    }, [setStatus]);
    useEffect(() => { loadAddons(); }, []);

    const installAddon = useCallback(async (slug) => {
        if (busy) return;
        setBusy({ slug, action: 'install' });
        setStatus?.(`Installing ${slug}\u2026`, 'info');
        try {
            const resp = await fetch(`/agent/addons/install${devParams()}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
            const data = await resp.json();
            if (data.error) { setStatus?.(data.error, 'error'); return; }
            setRestartRequired(true);
            const summary = [data.message, data.warning].filter(Boolean).join(' ');
            setStatus?.(summary || 'Add-on installed.', 'success'); await loadAddons();
        } catch (e) { setStatus?.(String(e.message || e), 'error'); }
        finally { setBusy(null); }
    }, [busy, loadAddons, setStatus]);

    const uninstallAddon = useCallback(async (slug) => {
        if (busy) return;
        setBusy({ slug, action: 'remove' });
        setStatus?.(`Removing ${slug}\u2026`, 'info');
        try {
            const resp = await fetch(`/agent/addons/uninstall${devParams()}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
            const data = await resp.json();
            if (data.error) { setStatus?.(data.error, 'error'); return; }
            setRestartRequired(true);
            const summary = [data.message, data.warning].filter(Boolean).join(' ');
            setStatus?.(summary || 'Add-on removed.', 'success'); await loadAddons();
        } catch (e) { setStatus?.(String(e.message || e), 'error'); }
        finally { setBusy(null); }
    }, [busy, loadAddons, setStatus]);

    const restartRuntime = useCallback(async () => {
        if (busy) return;
        setBusy({ slug: null, action: 'restart' });
        setStatus?.('Restarting piclaw\u2026', 'info');
        try {
            const resp = await fetch('/agent/addons/restart', { method: 'POST' });
            const data = await resp.json();
            if (data.error) { setStatus?.(data.error, 'error'); setBusy(null); return; }
            setStatus?.(data.message || 'Restarting piclaw\u2026', 'success');
            setRestartRequired(false);
            // Poll until backend is back, then refresh the addon list
            const pollUntilReady = async (maxAttempts = 30, intervalMs = 2000) => {
                for (let i = 0; i < maxAttempts; i++) {
                    await new Promise(r => setTimeout(r, intervalMs));
                    try {
                        const probe = await fetch('/agent/addons', { signal: AbortSignal.timeout(3000) });
                        if (probe.ok) {
                            await loadAddons();
                            setBusy(null);
                            setStatus?.('Restart complete \u2014 add-ons refreshed.', 'success');
                            return;
                        }
                    } catch (e) { void e; /* backend not ready yet */ }
                }
                setBusy(null);
                setStatus?.('Backend did not return in time. Reload the page manually.', 'warning');
            };
            void pollUntilReady();
        } catch (e) {
            setStatus?.(String(e.message || e), 'error');
            setBusy(null);
        }
    }, [busy, setStatus, loadAddons]);

    if (loading) return html`<div class="settings-loading">Fetching add-ons\u2026</div>`;
    if (!addons) return html`<div class="settings-section"><p class="settings-hint">Could not load add-ons.</p></div>`;

    const lf = filter.toLowerCase();
    const filtered = lf ? addons.filter(a => a.slug.toLowerCase().includes(lf) || (a.description || '').toLowerCase().includes(lf) || (a.tags || []).some(t => t.toLowerCase().includes(lf))) : addons;
    const busySlug = busy?.slug || null;
    const busyLabel = busy
        ? (busy.action === 'remove'
            ? `Removing ${busy.slug}\u2026`
            : busy.action === 'restart'
                ? 'Restarting piclaw\u2026'
                : `Installing ${busy.slug}\u2026`)
        : '';

    return html`
        <div class=${`settings-section settings-addon-panel${busy ? ' busy' : ''}`} aria-busy=${busy ? 'true' : 'false'}>
            <div class="settings-addon-toolbar">
                <div>
                    <p class="settings-hint">
                        ${catalogSources.length <= 1
                            ? html`Catalog from <a href="https://github.com/rcarmo/piclaw-addons" target="_blank">rcarmo/piclaw-addons</a>.`
                            : html`${catalogSources.length} catalog sources merged.`}
                        ${' '}Package-first install via Bun; restart required after install/uninstall.
                    </p>
                    ${failedSources.length > 0 && html`
                        <div class="settings-addon-error" role="alert">
                            Failed to fetch ${failedSources.length} catalog source${failedSources.length > 1 ? 's' : ''}:
                            ${failedSources.map(u => html` <code style="font-size:0.82em;word-break:break-all">${u}</code>`)}
                        </div>
                    `}
                    ${catalogSources.length > 1 && html`
                        <details class="settings-hint" style="margin-top:4px">
                            <summary style="cursor:pointer">Active catalog sources (${catalogSources.length})</summary>
                            <ul style="margin:4px 0 0 16px;font-size:0.82em">
                                ${catalogSources.map(u => html`<li style="word-break:break-all"><code>${u}</code></li>`)}
                            </ul>
                        </details>
                    `}
                    ${platformInfo.windowsNative && html`
                        <div class="settings-addon-error" role="alert">
                            Native Windows add-on installs are higher risk: Bun package installs, symlink cleanup, locked files, and restart timing can all be less predictable than in Linux/WSL. Prefer WSL or a container when possible.
                        </div>
                    `}
                </div>
            </div>
            <div class="settings-addon-list">
                ${busy && html`
                    <div class="settings-addon-panel-overlay" role="status" aria-live="polite" aria-label=${busyLabel}>
                        <div class="settings-addon-panel-overlay-card">
                            <div class="settings-spinner"></div>
                            <span>${busyLabel}</span>
                        </div>
                    </div>
                `}
                ${filtered.map(a => {
                    const hasSkills = (a.skills || []).length > 0;
                    const isExtension = a.type === 'extension';
                    const typeLabel = hasSkills && isExtension ? 'extension + skill' : hasSkills ? 'skill' : 'extension';
                    const typeCls = hasSkills && !isExtension ? 'settings-tag-skill' : '';
                    const homepage = typeof a.homepage === 'string' && a.homepage.trim() ? a.homepage.trim() : '';
                    return html`
                    <div class=${`settings-addon-card${a.installed ? ' installed' : ''}`}>
                        <div class="settings-addon-card-header">
                            ${homepage
                                ? html`<a class="settings-addon-name-link" href=${homepage} target="_blank" rel="noopener noreferrer">${a.slug}</a>`
                                : html`<strong>${a.slug}</strong>`}
                            <span class=${`settings-tag settings-tag-type ${typeCls}`}>${typeLabel}</span>
                            <span class="settings-addon-version">${a.installed ? (a.installedVersion || '?') : (a.version || '')}</span>
                            ${a.installKind && html`<span class="settings-tag">${a.installKind}</span>`}
                            ${a.hasUpdate && html`<span class="settings-tag settings-tag-skill">\u2191 ${a.version}</span>`}
                            <div class="settings-addon-actions">
                                ${a.installed ? html`
                                    ${a.hasUpdate && html`<button class="settings-addon-btn settings-addon-btn-upgrade" disabled=${Boolean(busy)} onClick=${() => installAddon(a.slug)}>${busySlug === a.slug ? '\u2026' : 'Update'}</button>`}
                                    <button class="settings-addon-btn settings-addon-btn-remove" disabled=${Boolean(busy)} onClick=${() => uninstallAddon(a.slug)}>${busySlug === a.slug ? '\u2026' : 'Remove'}</button>
                                ` : html`
                                    <button class="settings-addon-btn settings-addon-btn-install" disabled=${Boolean(busy)} onClick=${() => installAddon(a.slug)}>${busySlug === a.slug ? '\u2026' : 'Install'}</button>
                                `}
                            </div>
                        </div>
                        <div class="settings-addon-card-body">${a.description}</div>
                        <div class="settings-addon-card-footer">
                            <div class="settings-addon-tags">${(a.tags || []).map(t => html`<span class="settings-tag">${t}</span>`)}${(a.skills || []).map(s => html`<span class="settings-tag settings-tag-skill">\ud83d\udcdd ${s}</span>`)}</div>
                        </div>
                    </div>
                `; })}
                ${filtered.length === 0 && html`<p class="settings-hint">No add-ons match "${filter}"</p>`}
            </div>
            ${restartRequired && html`
                <div class="settings-addon-restart-notice" role="status" aria-live="polite">
                    <span>Extension changes are installed but inactive until piclaw restarts.</span>
                    <button class="settings-addon-btn settings-addon-btn-restart-now" type="button" disabled=${Boolean(busy)} onClick=${restartRuntime}>Restart Now</button>
                </div>
            `}
        </div>
    `;
}
