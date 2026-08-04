import { afterEach, expect, test } from 'bun:test';
import { EventEmitter } from 'node:events';

import {
  beginTrackedPhase,
  endTrackedPhase,
  flushProgressWatchdogState,
  heartbeatTrackedPhase,
  registerProgressWatchdogAborter,
  resetProgressWatchdogForTests,
  scanForStalls,
  setProgressWatchdogTerminationHook,
  setProgressWatchdogTimeoutForTests,
} from '../../src/runtime/progress-watchdog.js';
import { evaluateProgressWatchdogSnapshot } from '../../src/runtime/progress-watchdog-monitor.js';
import {
  resetProgressWatchdogSupervisorForTests,
  setProgressWatchdogMonitorSpawnForTests,
  setProgressWatchdogSupervisorEnvironmentForTests,
  startExternalProgressWatchdogMonitor,
  stopExternalProgressWatchdogMonitor,
} from '../../src/runtime/progress-watchdog-supervisor.js';

let restoreSupervisorEnv: (() => void) | null = null;
let restoreTerminationHook: (() => void) | null = null;
let restoreTimeoutOverride: (() => void) | null = null;

afterEach(async () => {
  restoreSupervisorEnv?.();
  restoreSupervisorEnv = null;
  restoreTerminationHook?.();
  restoreTerminationHook = null;
  restoreTimeoutOverride?.();
  restoreTimeoutOverride = null;
  await stopExternalProgressWatchdogMonitor();
  resetProgressWatchdogSupervisorForTests();
  resetProgressWatchdogForTests();
});

class FakeStdin extends EventEmitter {
  destroyed = false;
  writableEnded = false;
  writes: string[] = [];

  once(event: string, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  write(chunk: string): boolean {
    this.writes.push(String(chunk));
    return true;
  }

  end(): void {
    this.writableEnded = true;
    this.emit('close');
  }
}

class FakeChild extends EventEmitter {
  pid = 4242;
  exitCode: number | null = null;
  killed = false;
  killSignals: string[] = [];
  stdin = new FakeStdin();

  constructor() {
    super();
    this.stdin.on('close', () => {
      if (this.exitCode !== null) return;
      this.exitCode = 0;
      this.emit('exit', 0, null);
    });
  }

  once(event: string, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  unref(): void {
    // noop for tests
  }

  kill(signal: string): boolean {
    this.killSignals.push(signal);
    this.killed = true;
    this.exitCode = 0;
    this.emit('exit', 0, signal);
    return true;
  }
}

test('startExternalProgressWatchdogMonitor skips spawning when disabled', () => {
  restoreSupervisorEnv = setProgressWatchdogSupervisorEnvironmentForTests({
    disabled: true,
  });
  restoreTimeoutOverride = setProgressWatchdogTimeoutForTests(30);
  const calls: any[] = [];
  setProgressWatchdogMonitorSpawnForTests((command, args, options) => {
    calls.push({ command, args, options });
    return new FakeChild() as any;
  });

  expect(startExternalProgressWatchdogMonitor()).toBe(false);
  expect(calls).toEqual([]);
});

test('startExternalProgressWatchdogMonitor spawns a helper process with a heartbeat pipe when enabled', async () => {
  restoreSupervisorEnv = setProgressWatchdogSupervisorEnvironmentForTests({
    disabled: false,
    dbInMemory: false,
  });
  restoreTimeoutOverride = setProgressWatchdogTimeoutForTests(45);
  const calls: any[] = [];
  const child = new FakeChild();
  beginTrackedPhase('web:test', 'prompt', { source: 'test' });
  setProgressWatchdogMonitorSpawnForTests((command, args, options) => {
    calls.push({ command, args, options });
    return child as any;
  });

  expect(startExternalProgressWatchdogMonitor()).toBe(true);
  expect(calls).toHaveLength(1);
  expect(calls[0].command).toBe(process.execPath);
  expect(calls[0].args).not.toContain('--state');
  expect(calls[0].args).toContain('--parent-pid');
  expect(calls[0].options.stdio).toEqual(['pipe', 'ignore', 'ignore']);
  expect(child.stdin.writes).not.toHaveLength(0);
  expect(JSON.parse(child.stdin.writes[0].trim())).toEqual(expect.objectContaining({
    pid: process.pid,
    timeoutMs: 45,
    entries: [expect.objectContaining({ chatJid: 'web:test', phase: 'prompt' })],
  }));

  await stopExternalProgressWatchdogMonitor();
  expect(child.stdin.writableEnded).toBe(true);
  expect(child.killSignals).toEqual([]);
});

test('successful soft abort clears the stale snapshot without interrupting a healthy chat', async () => {
  const originalDateNow = Date.now;
  const previousEscalate = process.env.PICLAW_PROGRESS_WATCHDOG_ESCALATE_ON_STALL;
  let now = 1_000_000;
  Date.now = () => now;
  process.env.PICLAW_PROGRESS_WATCHDOG_ESCALATE_ON_STALL = 'false';

  try {
    restoreSupervisorEnv = setProgressWatchdogSupervisorEnvironmentForTests({
      disabled: false,
      dbInMemory: false,
    });
    restoreTimeoutOverride = setProgressWatchdogTimeoutForTests(1_000);
    const terminations: string[] = [];
    restoreTerminationHook = setProgressWatchdogTerminationHook((stall) => {
      terminations.push(stall.chatJid);
    });

    const child = new FakeChild();
    setProgressWatchdogMonitorSpawnForTests(() => child as any);

    let staleAbortCount = 0;
    let healthyAbortCount = 0;
    beginTrackedPhase('telegram:stale', 'prompt', { source: 'test' });
    registerProgressWatchdogAborter('telegram:stale', async () => {
      staleAbortCount += 1;
      endTrackedPhase('telegram:stale');
    });
    beginTrackedPhase('web:healthy', 'prompt', { source: 'test' });
    registerProgressWatchdogAborter('web:healthy', async () => {
      healthyAbortCount += 1;
    });

    expect(startExternalProgressWatchdogMonitor()).toBe(true);

    now += 1_001;
    heartbeatTrackedPhase('web:healthy', 'streaming', { eventType: 'message_update' });
    flushProgressWatchdogState();
    expect(scanForStalls(now).map((stall) => stall.chatJid)).toEqual(['telegram:stale']);
    await Bun.sleep(0);

    expect(staleAbortCount).toBe(1);
    expect(healthyAbortCount).toBe(0);
    expect(terminations).toEqual([]);

    now = 1_061_001;
    heartbeatTrackedPhase('web:healthy', 'streaming', { eventType: 'message_update' });
    flushProgressWatchdogState();
    const latestSnapshot = JSON.parse(child.stdin.writes.at(-1)!.trim());

    expect(latestSnapshot.entries.map((entry: { chatJid: string }) => entry.chatJid)).toEqual(['web:healthy']);
    expect(evaluateProgressWatchdogSnapshot(latestSnapshot, now).stalledEntry).toBeNull();
    expect(child.killSignals).toEqual([]);
  } finally {
    Date.now = originalDateNow;
    if (previousEscalate === undefined) delete process.env.PICLAW_PROGRESS_WATCHDOG_ESCALATE_ON_STALL;
    else process.env.PICLAW_PROGRESS_WATCHDOG_ESCALATE_ON_STALL = previousEscalate;
  }
});
