import { html, useCallback, useEffect, useMemo, useState } from '../../vendor/preact-htm.js';
import { getLocalApps, updateLocalApp } from '../../api.js';
import { useTranslation } from '../../utils/i18n.js';

const EMPTY_FORM = {
    name: '',
    slug: '',
    port: '',
    upstreamBasePath: '/',
    healthPath: '/',
    enabled: true,
};

function formatExpiry(value) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

function healthClass(health) {
    if (health?.state === 'reachable' && Number(health.statusCode || 0) < 400) return 'healthy';
    if (health?.state === 'reachable') return 'warning';
    if (health?.state === 'unreachable') return 'error';
    return 'unknown';
}

function healthLabel(app, tr) {
    const health = app?.health || {};
    if (health.state === 'reachable' && Number(health.statusCode || 0) < 400) return tr('settings.localApps.healthy');
    if (health.state === 'reachable') return tr('settings.localApps.reachableStatus', { status: health.statusCode || '?' });
    if (health.state === 'unreachable') return tr('settings.localApps.unreachable');
    return tr('settings.localApps.unknown');
}

export function LocalAppsSection({ filter = '', setStatus }) {
    const { t: tr } = useTranslation();
    const [apps, setApps] = useState([]);
    const [servingEnabled, setServingEnabled] = useState(true);
    const [configError, setConfigError] = useState('');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const payload = await getLocalApps();
            setApps(Array.isArray(payload.apps) ? payload.apps : []);
            setServingEnabled(payload.servingEnabled !== false);
            setConfigError(payload.configError || '');
        } catch (e) {
            setError(e?.message || tr('settings.localApps.loadFailed'));
        } finally {
            setLoading(false);
        }
    }, [tr]);

    useEffect(() => { load(); }, [load]);

    const lf = String(filter || '').trim().toLowerCase();
    const filtered = useMemo(() => lf ? apps.filter(app => [
        app.name,
        app.slug,
        app.publicPath,
        app.port,
        app.kind,
        app.ownerChatJid,
        app.health?.state,
    ].some(value => String(value || '').toLowerCase().includes(lf))) : apps, [apps, lf]);

    const updateForm = (field, value) => setForm(current => ({ ...current, [field]: value }));

    const resetForm = useCallback(() => {
        setEditingId('');
        setForm(EMPTY_FORM);
    }, []);

    const beginEdit = useCallback((app) => {
        if (app.kind !== 'persistent') return;
        setEditingId(app.id);
        setForm({
            name: app.name || '',
            slug: app.slug || '',
            port: String(app.port || ''),
            upstreamBasePath: app.upstreamBasePath || '/',
            healthPath: app.healthPath || '/',
            enabled: app.enabled !== false,
        });
    }, []);

    const save = useCallback(async (event) => {
        event?.preventDefault?.();
        if (busy) return;
        setBusy(editingId || 'create');
        setStatus?.(tr('settings.localApps.saving'), 'info');
        try {
            const payload = {
                name: form.name,
                slug: form.slug || undefined,
                port: Number(form.port),
                upstreamBasePath: form.upstreamBasePath || '/',
                healthPath: form.healthPath || '/',
                enabled: form.enabled !== false,
            };
            if (editingId) await updateLocalApp('update', { id: editingId, patch: payload });
            else await updateLocalApp('create', { app: payload });
            setStatus?.(editingId ? tr('settings.localApps.updated') : tr('settings.localApps.created'), 'success');
            resetForm();
            await load();
        } catch (e) {
            setStatus?.(e?.message || tr('settings.localApps.saveFailed'), 'error');
        } finally {
            setBusy('');
        }
    }, [busy, editingId, form, load, resetForm, setStatus, tr]);

    const runAction = useCallback(async (action, app) => {
        if (!app || busy) return;
        if (action === 'remove' && !window.confirm(tr('settings.localApps.confirmRemove', { name: app.name }))) return;
        setBusy(app.id);
        try {
            if (action === 'toggle') {
                await updateLocalApp('update', { id: app.id, patch: { enabled: app.enabled === false } });
            } else {
                await updateLocalApp(action, { id: app.id });
            }
            if (editingId === app.id && action === 'remove') resetForm();
            setStatus?.(action === 'probe' ? tr('settings.localApps.tested') : tr('settings.localApps.actionComplete'), 'success');
            await load();
        } catch (e) {
            setStatus?.(e?.message || tr('settings.localApps.actionFailed'), 'error');
        } finally {
            setBusy('');
        }
    }, [busy, editingId, load, resetForm, setStatus, tr]);

    const copyUrl = useCallback(async (app) => {
        const value = new URL(app.publicPath, window.location.origin).toString();
        try {
            await navigator.clipboard.writeText(value);
            setStatus?.(tr('settings.localApps.copied'), 'success');
        } catch {
            window.prompt(tr('settings.localApps.copyPrompt'), value);
        }
    }, [setStatus, tr]);

    return html`
        <div class="settings-section settings-local-apps-section">
            <div class="settings-local-app-warning" role="note">
                <strong>${tr('settings.localApps.trustedTitle')}</strong>
                <span>${tr('settings.localApps.trustedWarning')}</span>
            </div>

            ${!servingEnabled && html`<div class="settings-error-state">${tr('settings.localApps.authRequired')}</div>`}
            ${configError && html`<div class="settings-error-state">${tr('settings.localApps.configError', { error: configError })}</div>`}
            ${error && html`<div class="settings-error-state">${error}</div>`}

            <form class="settings-local-app-form" onSubmit=${save}>
                <div class="settings-local-app-form-heading">
                    <strong>${editingId ? tr('settings.localApps.editTitle') : tr('settings.localApps.addTitle')}</strong>
                    ${editingId && html`<button type="button" onClick=${resetForm}>${tr('settings.localApps.cancel')}</button>`}
                </div>
                <div class="settings-local-app-form-grid">
                    <label><span>${tr('settings.localApps.name')}</span><input required maxlength="80" value=${form.name} onInput=${e => updateForm('name', e.target.value)} /></label>
                    <label><span>${tr('settings.localApps.slug')}</span><input placeholder="hello-world" value=${form.slug} onInput=${e => updateForm('slug', e.target.value)} /></label>
                    <label><span>${tr('settings.localApps.port')}</span><input required type="number" min="1024" max="65535" value=${form.port} onInput=${e => updateForm('port', e.target.value)} /></label>
                    <label><span>${tr('settings.localApps.upstreamPath')}</span><input required value=${form.upstreamBasePath} onInput=${e => updateForm('upstreamBasePath', e.target.value)} /></label>
                    <label><span>${tr('settings.localApps.healthPath')}</span><input required value=${form.healthPath} onInput=${e => updateForm('healthPath', e.target.value)} /></label>
                    <label class="settings-local-app-enabled"><input type="checkbox" checked=${form.enabled} onChange=${e => updateForm('enabled', e.target.checked)} /><span>${tr('settings.localApps.enabled')}</span></label>
                </div>
                <button class="settings-local-app-primary" type="submit" disabled=${Boolean(busy) || !servingEnabled}>${editingId ? tr('settings.localApps.save') : tr('settings.localApps.add')}</button>
            </form>

            <div class="settings-local-app-toolbar">
                <strong>${tr('settings.localApps.registered', { count: apps.length })}</strong>
                <button onClick=${load} disabled=${loading || Boolean(busy)}>${tr('settings.localApps.refresh')}</button>
            </div>

            ${loading && html`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>${tr('settings.localApps.loading')}</span></div>`}
            ${!loading && apps.length === 0 && html`<div class="settings-empty-state"><strong>${tr('settings.localApps.none')}</strong><p>${tr('settings.localApps.noneHint')}</p></div>`}
            ${!loading && apps.length > 0 && html`
                <div class="settings-local-app-list">
                    ${filtered.map(app => html`
                        <article class=${`settings-local-app-card${app.enabled === false ? ' disabled' : ''}`}>
                            <div class="settings-local-app-card-head">
                                <div>
                                    <strong>${app.name}</strong>
                                    <code>${app.publicPath}</code>
                                </div>
                                <div class="settings-local-app-badges">
                                    <span class=${`settings-local-app-health ${healthClass(app.health)}`}>${healthLabel(app, tr)}</span>
                                    <span>${app.kind === 'lease' ? tr('settings.localApps.temporary') : tr('settings.localApps.persistent')}</span>
                                    ${app.enabled === false && html`<span>${tr('settings.localApps.disabled')}</span>`}
                                </div>
                            </div>
                            <div class="settings-local-app-meta">
                                <span>${tr('settings.localApps.loopbackPort', { port: app.port })}</span>
                                <span>${tr('settings.localApps.basePath', { path: app.upstreamBasePath })}</span>
                                ${app.ownerChatJid && html`<span>${tr('settings.localApps.owner', { owner: app.ownerChatJid })}</span>`}
                                ${app.expiresAt && html`<span>${tr('settings.localApps.expires', { when: formatExpiry(app.expiresAt) })}</span>`}
                                ${app.health?.error && html`<span class="settings-local-app-health-error">${app.health.error}</span>`}
                            </div>
                            <div class="settings-local-app-actions">
                                <button onClick=${() => window.open(app.publicPath, '_blank', 'noopener,noreferrer')} disabled=${app.enabled === false}>${tr('settings.localApps.open')}</button>
                                <button onClick=${() => copyUrl(app)}>${tr('settings.localApps.copy')}</button>
                                <button onClick=${() => runAction('probe', app)} disabled=${busy === app.id}>${tr('settings.localApps.test')}</button>
                                ${app.kind === 'persistent' && html`
                                    <button onClick=${() => beginEdit(app)}>${tr('settings.localApps.edit')}</button>
                                    <button onClick=${() => runAction('toggle', app)} disabled=${busy === app.id}>${app.enabled === false ? tr('settings.localApps.enable') : tr('settings.localApps.disable')}</button>
                                `}
                                ${app.kind === 'lease' && html`<button onClick=${() => runAction('promote', app)} disabled=${busy === app.id}>${tr('settings.localApps.promote')}</button>`}
                                <button class="danger" onClick=${() => runAction('remove', app)} disabled=${busy === app.id}>${tr('settings.localApps.remove')}</button>
                            </div>
                        </article>
                    `)}
                    ${filtered.length === 0 && html`<p class="settings-hint">${tr('settings.localApps.noMatch', { filter })}</p>`}
                </div>
            `}
        </div>
    `;
}

export const __localAppsSettingsTest = { formatExpiry, healthClass, healthLabel };
