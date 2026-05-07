import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import fs from 'node:fs';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { withChatContext } from '../../src/core/chat-context.js';
import { createTempWorkspace, importFresh } from '../helpers.js';

function makeFakeApi() {
  const tools = new Map<string, any>();
  return {
    api: {
      on() {},
      registerTool(tool: any) {
        tools.set(tool.name, tool);
      },
      registerCommand() {},
      registerShortcut() {},
      registerFlag() {},
      getFlag() { return undefined; },
      registerMessageRenderer() {},
      sendMessage() {},
      sendUserMessage() {},
      appendEntry() {},
      setSessionName() {},
      getSessionName() { return undefined; },
      setLabel() {},
      exec: async () => ({ exitCode: 0, stdout: '', stderr: '' }),
      getActiveTools: () => [],
      getAllTools: () => [],
      setActiveTools() {},
      getCommands: () => [],
      setModel: async () => true,
      getThinkingLevel: () => 'off' as const,
      setThinkingLevel() {},
      registerProvider() {},
      unregisterProvider() {},
    } as unknown as ExtensionAPI,
    tools,
  };
}

describe('open_workspace_file extension', () => {
  let ws: ReturnType<typeof createTempWorkspace>;

  beforeEach(() => {
    ws = createTempWorkspace('piclaw-open-workspace-file-');
    fs.writeFileSync(`${ws.workspace}/notes.md`, 'hello');
  });

  afterEach(() => {
    ws.cleanup();
    mock.restore();
  });

  async function getTool() {
    const module = await importFresh<typeof import('../src/extensions/open-workspace-file.js')>('../src/extensions/open-workspace-file.js');
    const fake = makeFakeApi();
    module.openWorkspaceFile(fake.api);
    return {
      tool: fake.tools.get('open_workspace_file')!,
      normalizeWorkspaceRelativePath: module.normalizeWorkspaceRelativePath,
    };
  }

  test('normalizes only workspace-relative file paths', async () => {
    const { normalizeWorkspaceRelativePath } = await getTool();
    expect(normalizeWorkspaceRelativePath('notes.md', ws.workspace)?.relativePath).toBe('notes.md');
    expect(normalizeWorkspaceRelativePath('./nested/../notes.md', ws.workspace)?.relativePath).toBe('notes.md');
    expect(normalizeWorkspaceRelativePath('../etc/passwd', ws.workspace)).toBeNull();
    expect(normalizeWorkspaceRelativePath('/etc/passwd', ws.workspace)).toBeNull();
    expect(normalizeWorkspaceRelativePath('piclaw://terminal', ws.workspace)).toBeNull();
  });

  test('rejects non-web chats', async () => {
    const { tool } = await getTool();
    const result = await withChatContext('whatsapp:test', 'whatsapp', () => tool.execute('x', {
      path: 'notes.md',
    }, undefined, undefined, {
      cwd: ws.workspace,
      hasUI: true,
      ui: {},
    }));

    expect(result.details.reason).toBe('unsupported_channel');
  });

  test('returns browser outcome for successful popout requests', async () => {
    const { tool } = await getTool();
    const custom = mock(async () => ({ ok: true, opened: true, target: 'popout' }));
    const result = await withChatContext('web:test', 'web', () => tool.execute('x', {
      path: 'notes.md',
      target: 'popout',
    }, undefined, undefined, {
      cwd: ws.workspace,
      hasUI: true,
      ui: { custom },
    }));

    expect(custom).toHaveBeenCalled();
    expect(result.details.ok).toBe(true);
    expect(result.details.target).toBe('popout');
  });

  test('surfaces insufficient screen space as a user-meaningful failure', async () => {
    const { tool } = await getTool();
    const result = await withChatContext('web:test', 'web', () => tool.execute('x', {
      path: 'notes.md',
      target: 'popout',
    }, undefined, undefined, {
      cwd: ws.workspace,
      hasUI: true,
      ui: {
        custom: async () => ({
          ok: false,
          opened: false,
          reason: 'insufficient_screen_space',
          viewport: { width: 900, height: 700 },
          minimum_viewport: { width: 1280, height: 820 },
        }),
      },
    }));

    expect(result.details.ok).toBe(false);
    expect(result.details.reason).toBe('insufficient_screen_space');
    expect(result.content[0].text).toContain('browser window is too small');
  });
});
