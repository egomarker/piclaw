import { html, useEffect, useState } from '../../vendor/preact-htm.js';
import { getAgentModels } from '../../api.js';
import { useTranslation } from '../../utils/i18n.js';

type PruneModelSettings = { model: string; hasEnvironmentModel: boolean };
type ModelOption = { provider: string; id: string };
const endpoint = '/agent/settings/context-prune';

async function fetchPruneModelSettings(init?: RequestInit): Promise<PruneModelSettings> {
    const response = await fetch(endpoint, init);
    const payload = await response.json();
    if (!response.ok || !payload?.ok || typeof payload.settings?.model !== 'string') {
        throw new Error('Could not read context prune settings');
    }
    return payload.settings;
}

export function ContextPruneModelSection() {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<PruneModelSettings | null>(null);
    const [model, setModel] = useState('');
    const [available, setAvailable] = useState<string[]>([]);
    const [catalogueFailed, setCatalogueFailed] = useState(false);
    const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'saved' | 'loadFailed' | 'saveFailed'>('loading');

    useEffect(() => {
        const controller = new AbortController();
        void fetchPruneModelSettings({ signal: controller.signal }).then(data => {
            if (controller.signal.aborted) return;
            setSettings(data);
            setModel(data.model);
            setStatus('ready');
        }).catch(() => {
            if (!controller.signal.aborted) setStatus('loadFailed');
        });
        void getAgentModels().then((data: { model_options?: ModelOption[] }) => {
            if (controller.signal.aborted) return;
            if (!Array.isArray(data?.model_options)) {
                setCatalogueFailed(true);
                return;
            }
            setAvailable(Array.from(new Set(data.model_options.map(({ provider, id }) => `${provider}/${id}`))));
        }).catch(() => {
            if (!controller.signal.aborted) setCatalogueFailed(true);
        });
        return () => controller.abort();
    }, []);

    async function save() {
        setStatus('saving');
        try {
            const data = await fetchPruneModelSettings({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model }),
            });
            setSettings(data);
            setModel(data.model);
            setStatus('saved');
        } catch {
            setStatus('saveFailed');
        }
    }

    return html`
        <h3 id="contextPruneModelHeading">${t('settings.pruneModel.label')}</h3>
        <div class="settings-row" style="flex-wrap:wrap">
            <select id="contextPruneModel" aria-labelledby="contextPruneModelHeading" aria-describedby="contextPruneModelHint"
                style="min-width:0;max-width:100%" disabled=${!settings || status === 'saving'} value=${model} onChange=${e => {
                    setModel(e.target.value);
                    setStatus('ready');
                }}>
                <option value="">${t(settings?.hasEnvironmentModel ? 'settings.pruneModel.deploymentEnv' : 'settings.pruneModel.deploymentSession')}</option>
                ${settings?.model && !available.includes(settings.model) && html`<option value=${settings.model}>${settings.model}</option>`}
                ${available.map(id => html`<option key=${id} value=${id}>${id}</option>`)}
            </select>
            <button type="button" class="settings-secondary-btn" disabled=${!settings || model === settings.model || status === 'saving'} onClick=${save}>${t('settings.pruneModel.save')}</button>
        </div>
        <p id="contextPruneModelHint" class="settings-hint">${t('settings.pruneModel.hint')}</p>
        ${catalogueFailed && html`<p class="settings-hint" role="status">${t('settings.pruneModel.catalogueFailed')}</p>`}
        ${status !== 'ready' && html`<p class="settings-hint" role="status">${t(`settings.pruneModel.${status}`)}</p>`}
    `;
}
