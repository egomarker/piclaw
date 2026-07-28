import { afterEach, expect, test } from 'bun:test';

import { getAttachmentPreviewKind, getAttachmentPreviewLabel } from '../../web/src/ui/attachment-preview.js';
import { paneRegistry } from '../../web/src/panes/index.js';
import {
  buildAddonAttachmentPreviewFrameUrl,
  createAddonWebApi,
  getAddonAttachmentPreviewNote,
  installAddonWebApi,
  registerAddonAttachmentPreview,
  registerAddonPane,
  registerAddonSettingsPane,
  registerAddonWorkspaceRowAction,
  registerAddonStandaloneTabUrlResolver,
  resolveAddonStandaloneTabUrl,
  resetAddonWebRegistriesForTests,
} from '../../web/src/ui/addon-web-extensions.ts';
import { getRegisteredSettingsPanes } from '../../web/src/components/settings/pane-registry.js';
import { getWorkspaceRowActions, subscribeWorkspaceRowActions } from '../../web/src/ui/workspace-row-actions.ts';

afterEach(() => {
  resetAddonWebRegistriesForTests();
});

test('addon web API exposes the current chat jid to add-on settings panes', () => {
  const runtimeWindow = {
    __piclawCurrentChatJid: 'web:branch-123',
    location: { href: 'http://localhost/?chat_jid=web%3Adefault' },
  } as any;
  const api = createAddonWebApi(runtimeWindow);
  expect(api.getCurrentChatJid()).toBe('web:branch-123');

  runtimeWindow.__piclawCurrentChatJid = '';
  runtimeWindow.location.href = 'http://localhost/?chat_jid=web%3Abranch-456';
  expect(api.getCurrentChatJid()).toBe('web:branch-456');

  runtimeWindow.location.href = 'http://localhost/';
  expect(api.getCurrentChatJid()).toBe('web:default');
});

test('installed browser API publishes the workspace row action registrar and compatibility alias', () => {
  const runtimeWindow = {
    location: { href: 'http://localhost/', origin: 'http://localhost' },
    dispatchEvent() {},
  } as any;
  const api = installAddonWebApi(runtimeWindow);
  expect(runtimeWindow.__piclaw_web).toBe(api);
  expect(runtimeWindow.__piclaw_web.registerWorkspaceRowAction).toBe(registerAddonWorkspaceRowAction);
  expect(runtimeWindow.__piclaw_registerWorkspaceRowAction).toBe(registerAddonWorkspaceRowAction);
});

test('addon web registries support workspace panes, settings panes, standalone URLs, attachment previews, and row actions', () => {
  registerAddonPane({
    id: 'example-addon-pane',
    label: 'Example Addon Pane',
    capabilities: ['edit'],
    placement: 'tabs',
    canHandle: () => 60,
    mount() {
      return {
        getContent() { return undefined; },
        isDirty() { return false; },
        focus() {},
        dispose() {},
      };
    },
  });
  registerAddonSettingsPane({
    id: 'example-addon-settings',
    label: 'Example Addon Settings',
    icon: '⚙️',
    component() { return null; },
    order: 210,
  });
  registerAddonStandaloneTabUrlResolver((path, { hasPopOutTab } = {}) => {
    if (!/\.example$/i.test(String(path || '')) || hasPopOutTab) return null;
    return '/example-addon/view?path=' + encodeURIComponent(path);
  });
  registerAddonWorkspaceRowAction({
    id: 'example-folder-action',
    label: 'Open example',
    order: 25,
    canHandle: (target) => target.type === 'dir',
    onActivate() {},
  });
  registerAddonAttachmentPreview({
    id: 'example-preview',
    label: 'Example add-on preview',
    match(contentType, filename) {
      return String(contentType || '').toLowerCase() === 'application/x-example' || /\.example$/i.test(String(filename || ''));
    },
    buildFrameUrl(mediaId, filename) {
      return `/example-addon/view?media=${encodeURIComponent(String(mediaId))}&name=${encodeURIComponent(filename || 'sample.example')}`;
    },
    note: 'Example add-on preview note.',
  });

  expect(paneRegistry.get('example-addon-pane')).toBeTruthy();
  expect(getRegisteredSettingsPanes().some((pane) => pane.id === 'example-addon-settings')).toBe(true);
  expect(getWorkspaceRowActions({ path: '.', name: 'workspace', type: 'dir', depth: 0 }).map((action) => action.id)).toEqual(['example-folder-action']);
  expect(getWorkspaceRowActions({ path: 'README.md', name: 'README.md', type: 'file', depth: 1 })).toEqual([]);
  expect(resolveAddonStandaloneTabUrl('/workspace/sample.example', { hasPopOutTab: false })).toBe('/example-addon/view?path=%2Fworkspace%2Fsample.example');
  expect(resolveAddonStandaloneTabUrl('/workspace/sample.example', { hasPopOutTab: true })).toBeNull();
  expect(getAttachmentPreviewKind('application/x-example', 'sample.example')).toBe('example-preview');
  expect(getAttachmentPreviewLabel('example-preview')).toBe('Example add-on preview');
  expect(buildAddonAttachmentPreviewFrameUrl('example-preview', 7, 'sample.example')).toContain('/example-addon/view?media=7');
  expect(getAddonAttachmentPreviewNote('example-preview')).toContain('Example add-on preview note.');
});

test('workspace row actions sort, replace safely, notify subscribers, and expose through the browser API', () => {
  let notifications = 0;
  const unsubscribe = subscribeWorkspaceRowActions(() => { notifications += 1; });
  const api = createAddonWebApi(null);
  expect(typeof api.registerWorkspaceRowAction).toBe('function');

  const disposeLater = api.registerWorkspaceRowAction({
    id: 'later',
    label: 'Later',
    order: 200,
    onActivate() {},
  });
  const disposeOriginal = api.registerWorkspaceRowAction({
    id: 'replaceable',
    label: 'Original',
    order: 100,
    onActivate() {},
  });
  const disposeReplacement = api.registerWorkspaceRowAction({
    id: 'replaceable',
    label: 'Replacement',
    order: 50,
    onActivate() {},
  });

  const target = { path: '.', name: 'workspace', type: 'dir' as const, depth: 0 };
  expect(getWorkspaceRowActions(target).map((action) => action.label)).toEqual(['Replacement', 'Later']);
  disposeOriginal();
  expect(getWorkspaceRowActions(target).map((action) => action.label)).toEqual(['Replacement', 'Later']);
  disposeReplacement();
  disposeLater();
  expect(getWorkspaceRowActions(target)).toEqual([]);
  expect(notifications).toBe(5);
  unsubscribe();
});
