import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import '../helpers.js';
import { importFresh, withTempWorkspaceEnv } from '../helpers.js';

test('saveCompactionSettings persists and applies compaction settings immediately', async () => {
  await withTempWorkspaceEnv('piclaw-compaction-settings-', {
    PICLAW_COMPACTION_TIMEOUT_MS: undefined,
    PICLAW_COMPACTION_BACKOFF_BASE_MS: undefined,
    PICLAW_COMPACTION_BACKOFF_MAX_MS: undefined,
    PICLAW_PROGRESS_WATCHDOG_ENABLED: undefined,
    PICLAW_PROGRESS_WATCHDOG_TIMEOUT_MS: undefined,
    PICLAW_TOOL_RESULT_COMPACTION_ENABLED: undefined,
  }, async (workspace) => {
    const db = await importFresh<typeof import('../../src/db.js')>('../src/db.js');
    db.initDatabase();
    const handler = await importFresh<typeof import('../../src/channels/web/handlers/compaction-settings.js')>(
      '../src/channels/web/handlers/compaction-settings.js',
    );

    const saved = await handler.saveCompactionSettings({
      compactionTimeoutSec: 240,
      compactionBackoffBaseMin: 12,
      compactionBackoffMaxMin: 180,
      compactionThresholdPercent: 75,
      compactionBackoffDecayFactor: 0.25,
      progressWatchdogEnabled: true,
      progressWatchdogTimeoutSec: 75,
      toolResultCompactionEnabled: false,
    });

    expect(saved).toMatchObject({
      compactionTimeoutSec: 240,
      compactionBackoffBaseMin: 12,
      compactionBackoffMaxMin: 180,
      compactionThresholdPercent: 75,
      compactionBackoffDecayFactor: 0.25,
      progressWatchdogEnabled: true,
      progressWatchdogTimeoutSec: 75,
      toolResultCompactionEnabled: false,
    });

    const persisted = JSON.parse(readFileSync(join(workspace.workspace, '.piclaw', 'config.json'), 'utf8'));
    expect(persisted).toMatchObject({
      compaction: {
        timeoutMs: 240000,
        backoffBaseMs: 720000,
        backoffMaxMs: 10800000,
        thresholdPercent: 75,
        backoffDecayFactor: 0.25,
        progressWatchdogEnabled: true,
        progressWatchdogTimeoutMs: 75000,
        toolResultCompactionEnabled: false,
      },
    });
  });
});

test('saveCompactionSettings can disable watchdog without clearing its timeout', async () => {
  await withTempWorkspaceEnv('piclaw-compaction-watchdog-disabled-', {
    PICLAW_COMPACTION_TIMEOUT_MS: undefined,
    PICLAW_COMPACTION_BACKOFF_BASE_MS: undefined,
    PICLAW_COMPACTION_BACKOFF_MAX_MS: undefined,
    PICLAW_PROGRESS_WATCHDOG_ENABLED: undefined,
    PICLAW_PROGRESS_WATCHDOG_TIMEOUT_MS: undefined,
    PICLAW_TOOL_RESULT_COMPACTION_ENABLED: undefined,
  }, async (workspace) => {
    const db = await importFresh<typeof import('../../src/db.js')>('../src/db.js');
    db.initDatabase();
    const handler = await importFresh<typeof import('../../src/channels/web/handlers/compaction-settings.js')>(
      '../src/channels/web/handlers/compaction-settings.js',
    );

    const saved = await handler.saveCompactionSettings({
      progressWatchdogEnabled: false,
      progressWatchdogTimeoutSec: 120,
    });

    expect(saved).toMatchObject({
      progressWatchdogEnabled: false,
      progressWatchdogTimeoutSec: 120,
    });

    const persisted = JSON.parse(readFileSync(join(workspace.workspace, '.piclaw', 'config.json'), 'utf8'));
    expect(persisted).toMatchObject({
      compaction: {
        progressWatchdogEnabled: false,
        progressWatchdogTimeoutMs: 120000,
      },
    });
  });
});

test('getCompactionSettingsData exposes active backoffs and tracked phases and reset clears them', async () => {
  await withTempWorkspaceEnv('piclaw-compaction-settings-state-', {
    PICLAW_PROGRESS_WATCHDOG_TIMEOUT_MS: '30',
    PICLAW_TOOL_RESULT_COMPACTION_ENABLED: undefined,
  }, async () => {
    const db = await importFresh<typeof import('../../src/db.js')>('../src/db.js');
    db.initDatabase();
    db.setChatCompactionBackoff('web:test-1', {
      failureCount: 2,
      lastFailedAt: '2026-04-29T11:00:00.000Z',
      backoffUntil: new Date(Date.now() + 10 * 60_000).toISOString(),
      lastErrorMessage: 'Compaction timed out',
    });
    db.setChatCompactionBackoff('web:test-expired', {
      failureCount: 1,
      lastFailedAt: '2026-04-29T10:00:00.000Z',
      backoffUntil: new Date(Date.now() - 60_000).toISOString(),
      lastErrorMessage: 'Expired suppression',
    });

    const watchdog = await importFresh<typeof import('../../src/runtime/progress-watchdog.js')>('../src/runtime/progress-watchdog.js');
    watchdog.beginTrackedPhase('web:test-1', 'prompt', { source: 'test' });

    const handler = await importFresh<typeof import('../../src/channels/web/handlers/compaction-settings.js')>(
      '../src/channels/web/handlers/compaction-settings.js',
    );

    const beforeReset = handler.getCompactionSettingsData();
    expect(typeof beforeReset.toolResultCompactionEnabled).toBe('boolean');
    expect(beforeReset.compactionBackoffs).toEqual([
      expect.objectContaining({ chatJid: 'web:test-1', failureCount: 2, lastErrorMessage: 'Compaction timed out' }),
    ]);
    expect(beforeReset.progressWatchdogPhases).toEqual([
      expect.objectContaining({ chatJid: 'web:test-1', phase: 'prompt' }),
    ]);

    const afterReset = handler.resetCompactionBackoff('web:test-1');
    expect(afterReset.compactionBackoffs).toEqual([]);

    watchdog.endTrackedPhase('web:test-1');
    watchdog.resetProgressWatchdogForTests();
  });
});
