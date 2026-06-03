import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import '../helpers.js';
import { importFresh, withTempWorkspaceEnv } from '../helpers.js';

test('saveGeneralSettings persists and applies general settings immediately', async () => {
  await withTempWorkspaceEnv('piclaw-general-settings-', {
    PICLAW_WEB_COMPOSE_UPLOAD_LIMIT_MB: undefined,
    PICLAW_WEB_WORKSPACE_UPLOAD_LIMIT_MB: undefined,
  }, async (workspace) => {
    const handler = await importFresh<typeof import('../../src/channels/web/handlers/general-settings.js')>(
      '../src/channels/web/handlers/general-settings.js',
    );

    const saved = await handler.saveGeneralSettings({
      assistantName: 'Smith',
      assistantAvatar: 'https://example.test/assistant.png',
      userName: 'Rui',
      userAvatar: 'https://example.test/user.png',
      sessionAutoRotate: false,
      sessionMaxSizeMb: 48,
      webTerminalEnabled: false,
      composeUploadLimitMb: 24,
      workspaceUploadLimitMb: 256,
      toolUseBudget: 23,
      uiTheme: 'dracula',
      uiTint: '#7c3aed',
    });

    expect(saved).toMatchObject({
      assistantName: 'Smith',
      assistantAvatar: 'https://example.test/assistant.png',
      userName: 'Rui',
      userAvatar: 'https://example.test/user.png',
      sessionAutoRotate: false,
      sessionMaxSizeMb: 48,
      webTerminalEnabled: false,
      composeUploadLimitMb: 24,
      workspaceUploadLimitMb: 256,
      toolUseBudget: 23,
      uiTheme: 'dracula',
      uiTint: '#7c3aed',
    });
    expect(saved.instanceTotp.configured).toBe(false);
    expect(handler.getGeneralSettingsData()).toMatchObject(saved);
    expect(handler.buildGeneralSettingsProfileUpdate(saved, 'test-version')).toMatchObject({
      agent_id: 'default',
      agent_name: 'Smith',
      agent_avatar: '/avatar/agent?v=test-version',
      user_name: 'Rui',
      user_avatar: '/avatar/user?v=test-version',
      user_avatar_background: null,
    });

    const persisted = JSON.parse(readFileSync(join(workspace.workspace, '.piclaw', 'config.json'), 'utf8'));
    expect(persisted).toMatchObject({
      assistant: {
        assistantName: 'Smith',
        assistantAvatar: 'https://example.test/assistant.png',
      },
      user: {
        userName: 'Rui',
        userAvatar: 'https://example.test/user.png',
      },
      sessionAutoRotate: false,
      sessionMaxSizeMb: 48,
      turnMaxToolUseMessages: 23,
      web: {
        terminalEnabled: false,
        composeUploadLimitMb: 24,
        workspaceUploadLimitMb: 256,
      },
      ui: {
        theme: 'dracula',
        tint: '#7c3aed',
      },
    });
  });
});

test('saveGeneralSettings prepares uploaded avatar data for immediate /avatar serving', async () => {
  await withTempWorkspaceEnv('piclaw-general-settings-avatar-', {}, async () => {
    const handler = await importFresh<typeof import('../../src/channels/web/handlers/general-settings.js')>(
      '../src/channels/web/handlers/general-settings.js',
    );
    const avatar = await importFresh<typeof import('../../src/channels/web/media/avatar-service.js')>(
      '../src/channels/web/media/avatar-service.js',
    );

    const svgData = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22%3E%3Crect width=%221%22 height=%221%22 fill=%22red%22/%3E%3C/svg%3E';
    const saved = await handler.saveGeneralSettings({ userAvatar: svgData });
    expect(saved.userAvatar).toBe(svgData);

    const response = await avatar.buildAvatarResponse('user', saved.userAvatar, new Request('http://localhost/avatar/user'));
    expect(response?.status).toBe(200);
    expect(response?.headers.get('Cache-Control')).toBe('no-store');
    expect(response?.headers.get('Content-Type')?.startsWith('image/')).toBe(true);
    expect(handler.buildGeneralSettingsProfileUpdate(saved, 'avatar-test').user_avatar).toBe('/avatar/user?v=avatar-test');
  });
});
