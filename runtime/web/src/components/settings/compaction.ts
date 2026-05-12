/**
 * settings/compaction.ts — Compaction and watchdog settings pane.
 */
import { html, useState, useEffect, useCallback, useMemo, useRef } from '../../vendor/preact-htm.js';
import { NumberStepper } from './number-stepper.js';

function normalizeCompactionSettings(data: Record<string, any> = {}) {
    return {
        compactionTimeoutSec: data.compactionTimeoutSec ?? 180,
        compactionBackoffBaseMin: data.compactionBackoffBaseMin ?? 15,
        compactionBackoffMaxMin: data.compactionBackoffMaxMin ?? 360,
        compactionThresholdPercent: data.compactionThresholdPercent ?? 75,
        compactionBackoffDecayFactor: data.compactionBackoffDecayFactor ?? 0.5,
        toolResultCompactionEnabled: Boolean(data.toolResultCompactionEnabled ?? true),
        toolResultSemanticSummaryEnabled: Boolean(data.toolResultSemanticSummaryEnabled ?? true),
        toolResultSemanticSummaryMaxInputChars: data.toolResultSemanticSummaryMaxInputChars ?? 12000,
        toolResultSemanticSummaryMaxTokens: data.toolResultSemanticSummaryMaxTokens ?? 320,
        toolResultSemanticSummaryTimeoutSec: data.toolResultSemanticSummaryTimeoutSec ?? 12,
        progressWatchdogEnabled: Boolean(data.progressWatchdogEnabled ?? false),
        progressWatchdogTimeoutSec: data.progressWatchdogTimeoutSec ?? 120,
        compactionBackoffs: Array.isArray(data.compactionBackoffs) ? data.compactionBackoffs : [],
        progressWatchdogPhases: Array.isArray(data.progressWatchdogPhases) ? data.progressWatchdogPhases : [],
    };
}

function formatIso(value) {
    const raw = String(value || '').trim();
    if (!raw) return '—';
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return raw;
    return parsed.toLocaleString();
}

export function CompactionSection({ settingsData, setStatus, mergeSettingsData }) {
    const [compactionTimeoutSec, setCompactionTimeoutSec] = useState(180);
    const [compactionBackoffBaseMin, setCompactionBackoffBaseMin] = useState(15);
    const [compactionBackoffMaxMin, setCompactionBackoffMaxMin] = useState(360);
    const [compactionThresholdPercent, setCompactionThresholdPercent] = useState(75);
    const [compactionBackoffDecayFactor, setCompactionBackoffDecayFactor] = useState(0.5);
    const [toolResultCompactionEnabled, setToolResultCompactionEnabled] = useState(true);
    const [toolResultSemanticSummaryEnabled, setToolResultSemanticSummaryEnabled] = useState(true);
    const [toolResultSemanticSummaryMaxInputChars, setToolResultSemanticSummaryMaxInputChars] = useState(12000);
    const [toolResultSemanticSummaryMaxTokens, setToolResultSemanticSummaryMaxTokens] = useState(320);
    const [toolResultSemanticSummaryTimeoutSec, setToolResultSemanticSummaryTimeoutSec] = useState(12);
    const [progressWatchdogEnabled, setProgressWatchdogEnabled] = useState(false);
    const [progressWatchdogTimeoutSec, setProgressWatchdogTimeoutSec] = useState(120);
    const [compactionBackoffs, setCompactionBackoffs] = useState([]);
    const [progressWatchdogPhases, setProgressWatchdogPhases] = useState([]);
    const [appliedHint, setAppliedHint] = useState(false);
    const savedSnapshotRef = useRef('');
    const saveTimerRef = useRef(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    const applyIncoming = useCallback((data) => {
        const next = normalizeCompactionSettings(data);
        setCompactionTimeoutSec(next.compactionTimeoutSec);
        setCompactionBackoffBaseMin(next.compactionBackoffBaseMin);
        setCompactionBackoffMaxMin(next.compactionBackoffMaxMin);
        setCompactionThresholdPercent(next.compactionThresholdPercent);
        setCompactionBackoffDecayFactor(next.compactionBackoffDecayFactor);
        setToolResultCompactionEnabled(next.toolResultCompactionEnabled);
        setToolResultSemanticSummaryEnabled(next.toolResultSemanticSummaryEnabled);
        setToolResultSemanticSummaryMaxInputChars(next.toolResultSemanticSummaryMaxInputChars);
        setToolResultSemanticSummaryMaxTokens(next.toolResultSemanticSummaryMaxTokens);
        setToolResultSemanticSummaryTimeoutSec(next.toolResultSemanticSummaryTimeoutSec);
        setProgressWatchdogEnabled(next.progressWatchdogEnabled);
        setProgressWatchdogTimeoutSec(next.progressWatchdogTimeoutSec);
        setCompactionBackoffs(next.compactionBackoffs);
        setProgressWatchdogPhases(next.progressWatchdogPhases);
        savedSnapshotRef.current = JSON.stringify({
            compactionTimeoutSec: next.compactionTimeoutSec,
            compactionBackoffBaseMin: next.compactionBackoffBaseMin,
            compactionBackoffMaxMin: next.compactionBackoffMaxMin,
            compactionThresholdPercent: next.compactionThresholdPercent,
            compactionBackoffDecayFactor: next.compactionBackoffDecayFactor,
            toolResultCompactionEnabled: next.toolResultCompactionEnabled,
            toolResultSemanticSummaryEnabled: next.toolResultSemanticSummaryEnabled,
            toolResultSemanticSummaryMaxInputChars: next.toolResultSemanticSummaryMaxInputChars,
            toolResultSemanticSummaryMaxTokens: next.toolResultSemanticSummaryMaxTokens,
            toolResultSemanticSummaryTimeoutSec: next.toolResultSemanticSummaryTimeoutSec,
            progressWatchdogEnabled: next.progressWatchdogEnabled,
            progressWatchdogTimeoutSec: next.progressWatchdogTimeoutSec,
        });
    }, []);

    useEffect(() => {
        applyIncoming(settingsData || {});
    }, [settingsData, applyIncoming]);

    const currentSnapshot = useMemo(() => JSON.stringify({
        compactionTimeoutSec,
        compactionBackoffBaseMin,
        compactionBackoffMaxMin,
        compactionThresholdPercent,
        compactionBackoffDecayFactor,
        toolResultCompactionEnabled,
        toolResultSemanticSummaryEnabled,
        toolResultSemanticSummaryMaxInputChars,
        toolResultSemanticSummaryMaxTokens,
        toolResultSemanticSummaryTimeoutSec,
        progressWatchdogEnabled,
        progressWatchdogTimeoutSec,
    }), [
        compactionTimeoutSec,
        compactionBackoffBaseMin,
        compactionBackoffMaxMin,
        compactionThresholdPercent,
        compactionBackoffDecayFactor,
        toolResultCompactionEnabled,
        toolResultSemanticSummaryEnabled,
        toolResultSemanticSummaryMaxInputChars,
        toolResultSemanticSummaryMaxTokens,
        toolResultSemanticSummaryTimeoutSec,
        progressWatchdogEnabled,
        progressWatchdogTimeoutSec,
    ]);

    useEffect(() => {
        if (currentSnapshot === savedSnapshotRef.current) return;
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(async () => {
            if (!mountedRef.current) return;
            const active = document.activeElement;
            if (active && active.closest?.('.settings-number-stepper')) return;
            try {
                setStatus?.('Saving compaction settings…', 'info');
                const response = await fetch('/agent/settings/compaction', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: currentSnapshot,
                });
                const payload = await response.json().catch(() => ({}));
                if (!mountedRef.current) return;
                if (!response.ok || !payload?.ok || !payload?.settings) {
                    setStatus?.(payload?.error || 'Failed to save compaction settings.', 'error');
                    return;
                }
                savedSnapshotRef.current = currentSnapshot;
                mergeSettingsData?.(payload.settings);
                applyIncoming({ ...(settingsData || {}), ...(payload.settings || {}) });
                setStatus?.('Compaction settings saved.', 'success');
                setAppliedHint(true);
                setTimeout(() => {
                    if (mountedRef.current) {
                        setAppliedHint(false);
                        setStatus?.(null);
                    }
                }, 4000);
            } catch (error) {
                console.warn('[settings/compaction] Failed to persist compaction settings.', error);
                if (mountedRef.current) setStatus?.('Failed to save compaction settings.', 'error');
            }
        }, 800);
        return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
    }, [currentSnapshot, mergeSettingsData, setStatus, applyIncoming, settingsData]);

    const resetBackoff = useCallback(async (chatJid) => {
        try {
            setStatus?.(`Clearing compaction suppression for ${chatJid}…`, 'info');
            const response = await fetch('/agent/settings/compaction/reset-backoff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatJid }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok || !payload?.ok || !payload?.settings) {
                setStatus?.(payload?.error || 'Failed to clear compaction suppression.', 'error');
                return;
            }
            mergeSettingsData?.(payload.settings);
            applyIncoming({ ...(settingsData || {}), ...(payload.settings || {}) });
            setStatus?.(`Cleared compaction suppression for ${chatJid}.`, 'success');
        } catch (error) {
            console.warn('[settings/compaction] Failed to clear compaction suppression.', error);
            setStatus?.('Failed to clear compaction suppression.', 'error');
        }
    }, [applyIncoming, mergeSettingsData, setStatus, settingsData]);

    return html`
        <div class="settings-section">
            ${appliedHint && html`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Compaction settings applied. Existing turns keep their current timers; new turns use the updated values.
                </div>
            `}

            <h3>Automatic compaction</h3>
            <div class="settings-row">
                <label>Enable tool-result compaction</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${toolResultCompactionEnabled} onChange=${e => setToolResultCompactionEnabled(Boolean(e.target.checked))} />
                    <span class="settings-hint" style="margin:0">When disabled, large tool results stay inline and are not externalized into searchable tool-output handles.</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Semantic summaries for compacted tool results</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${toolResultSemanticSummaryEnabled} onChange=${e => setToolResultSemanticSummaryEnabled(Boolean(e.target.checked))} />
                    <span class="settings-hint" style="margin:0">When enabled, compacted outputs include a semantic summary generated with the active model (preview fallback on failure).</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Semantic summary input limit (chars)</label>
                <${NumberStepper}
                    label="semantic summary input limit"
                    value=${toolResultSemanticSummaryMaxInputChars}
                    min=${500}
                    max=${200000}
                    fallback=${12000}
                    width="100px"
                    disabled=${!toolResultSemanticSummaryEnabled}
                    onChange=${setToolResultSemanticSummaryMaxInputChars}
                />
                <span class="settings-hint" style="margin:0">Maximum characters sampled from full tool output for semantic summarization.</span>
            </div>
            <div class="settings-row">
                <label>Semantic summary output max tokens</label>
                <${NumberStepper}
                    label="semantic summary max tokens"
                    value=${toolResultSemanticSummaryMaxTokens}
                    min=${64}
                    max=${4096}
                    fallback=${320}
                    width="90px"
                    disabled=${!toolResultSemanticSummaryEnabled}
                    onChange=${setToolResultSemanticSummaryMaxTokens}
                />
                <span class="settings-hint" style="margin:0">Upper bound for generated summary length.</span>
            </div>
            <div class="settings-row">
                <label>Semantic summary timeout (sec)</label>
                <${NumberStepper}
                    label="semantic summary timeout"
                    value=${toolResultSemanticSummaryTimeoutSec}
                    min=${1}
                    max=${300}
                    fallback=${12}
                    width="90px"
                    disabled=${!toolResultSemanticSummaryEnabled}
                    onChange=${setToolResultSemanticSummaryTimeoutSec}
                />
                <span class="settings-hint" style="margin:0">Abort semantic summary generation after this timeout and fall back to preview compaction.</span>
            </div>
            <div class="settings-row">
                <label>Compaction threshold (%)</label>
                <${NumberStepper}
                    label="compaction threshold"
                    value=${compactionThresholdPercent}
                    min=${10}
                    max=${95}
                    fallback=${75}
                    width="80px"
                    onChange=${setCompactionThresholdPercent}
                />
                <span class="settings-hint" style="margin:0">auto-compact when context exceeds this % of window</span>
            </div>
            <div class="settings-row">
                <label>Compaction timeout (sec)</label>
                <${NumberStepper}
                    label="compaction timeout"
                    value=${compactionTimeoutSec}
                    min=${1}
                    max=${3600}
                    fallback=${180}
                    width="90px"
                    onChange=${setCompactionTimeoutSec}
                />
                <span class="settings-hint" style="margin:0">Abort a stuck pre-prompt/manual compaction instead of hanging forever.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff base (min)</label>
                <${NumberStepper}
                    label="compaction backoff base"
                    value=${compactionBackoffBaseMin}
                    min=${1}
                    max=${24 * 60}
                    fallback=${15}
                    width="90px"
                    onChange=${setCompactionBackoffBaseMin}
                />
                <span class="settings-hint" style="margin:0">First suppression window after a compaction failure.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff max (min)</label>
                <${NumberStepper}
                    label="compaction backoff max"
                    value=${compactionBackoffMaxMin}
                    min=${1}
                    max=${7 * 24 * 60}
                    fallback=${360}
                    width="90px"
                    onChange=${setCompactionBackoffMaxMin}
                />
                <span class="settings-hint" style="margin:0">Upper bound for exponential suppression after repeated failures.</span>
            </div>

            <div class="settings-row">
                <label>Backoff decay factor</label>
                <${NumberStepper}
                    label="backoff decay factor"
                    value=${Math.round(compactionBackoffDecayFactor * 100)}
                    min=${10}
                    max=${100}
                    fallback=${50}
                    width="80px"
                    onChange=${v => setCompactionBackoffDecayFactor(v / 100)}
                />
                <span class="settings-hint" style="margin:0">% — halves backoff after each successful compaction</span>
            </div>

            <h3 style="margin-top:20px">Stall watchdog</h3>
            <div class="settings-row">
                <label>Enable watchdog</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${progressWatchdogEnabled} onChange=${e => setProgressWatchdogEnabled(Boolean(e.target.checked))} />
                    <span class="settings-hint" style="margin:0">Disabled by default. When enabled, a helper process terminates the runtime if an active phase stops heartbeating.</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Watchdog timeout (sec)</label>
                <${NumberStepper}
                    label="watchdog timeout"
                    value=${progressWatchdogTimeoutSec}
                    min=${0}
                    max=${3600}
                    fallback=${120}
                    width="90px"
                    disabled=${!progressWatchdogEnabled}
                    onChange=${setProgressWatchdogTimeoutSec}
                />
                <span class="settings-hint" style="margin:0">How long an active phase can go without a heartbeat before the watchdog kills the runtime.</span>
            </div>

            <h3 style="margin-top:20px">Active compaction suppressions</h3>
            ${compactionBackoffs.length === 0 ? html`
                <p class="settings-hint">No chats are currently under compaction backoff.</p>
            ` : html`
                <div class="settings-table-wrapper">
                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th>Chat</th>
                                <th>Failures</th>
                                <th>Suppressed until</th>
                                <th>Last error</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${compactionBackoffs.map((entry) => html`
                                <tr>
                                    <td><code>${entry.chatJid}</code></td>
                                    <td>${entry.failureCount}</td>
                                    <td>${formatIso(entry.backoffUntil)}</td>
                                    <td title=${entry.lastErrorMessage || ''}>${entry.lastErrorMessage || '—'}</td>
                                    <td>
                                        <button class="settings-secondary-btn" onClick=${() => resetBackoff(entry.chatJid)}>
                                            Clear
                                        </button>
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            `}

            <h3 style="margin-top:20px">Live watchdog phases</h3>
            ${progressWatchdogPhases.length === 0 ? html`
                <p class="settings-hint">No active tracked phases right now.</p>
            ` : html`
                <div class="settings-table-wrapper">
                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th>Chat</th>
                                <th>Phase</th>
                                <th>Started</th>
                                <th>Last heartbeat</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${progressWatchdogPhases.map((entry) => html`
                                <tr>
                                    <td><code>${entry.chatJid}</code></td>
                                    <td>${entry.phase}</td>
                                    <td>${formatIso(entry.startedAt)}</td>
                                    <td>${formatIso(entry.lastProgressAt)}</td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `;
}
