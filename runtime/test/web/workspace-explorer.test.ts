import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  WORKSPACE_DRAG_GHOST_VIEWPORT_PADDING_PX,
  WORKSPACE_TOUCH_DRAG_DELAY_MS,
  WORKSPACE_TOUCH_DRAG_GHOST_GAP_PX,
  WORKSPACE_TOUCH_DRAG_MOVE_TOLERANCE_PX,
  buildWorkspaceMoveConfirmationMessage,
  confirmWorkspaceEntryMove,
  getWorkspaceTouchStartIntent,
  hasWorkspaceTouchDragMoved,
  mergeWorkspaceTreeUpdates,
  resolveWorkspaceDragGhostPosition,
  shouldFocusWorkspaceTreeAfterActivation,
} from '../../web/src/components/workspace-explorer.ts';

function createRowTarget(options: { path?: string; type?: string; isDragHandle?: boolean } = {}) {
  const row = {
    dataset: {
      path: options.path ?? '/workspace/demo.md',
      type: options.type ?? 'file',
    },
  };
  return {
    closest(selector: string) {
      if (selector === '.workspace-node-icon, .workspace-label-text') {
        return options.isDragHandle ? this : null;
      }
      return selector === '.workspace-row' ? row : null;
    },
    classList: {
      contains(token: string) {
        return token === 'workspace-drag-handle' ? Boolean(options.isDragHandle) : false;
      },
    },
  };
}

test('workspace header places the terminal tab button between create and refresh', () => {
  const source = readFileSync(join(import.meta.dir, '../../web/src/components/workspace-explorer.ts'), 'utf8');
  const actionsStart = source.indexOf('<div class="workspace-header-actions">');
  const actionsEnd = source.indexOf('\n                </div>', actionsStart);
  expect(actionsStart).toBeGreaterThan(-1);
  expect(actionsEnd).toBeGreaterThan(actionsStart);

  const actions = source.slice(actionsStart, actionsEnd);
  const createIndex = actions.indexOf('class="workspace-create"');
  const terminalIndex = actions.indexOf('class="workspace-open-terminal"');
  const refreshIndex = actions.indexOf('class="workspace-refresh"');
  expect(createIndex).toBeGreaterThan(-1);
  expect(terminalIndex).toBeGreaterThan(createIndex);
  expect(refreshIndex).toBeGreaterThan(terminalIndex);
  expect(actions).toContain('showTerminalHeaderAction && onOpenTerminalTab');
  expect(actions).toContain('title=${t(\'menu.openTerminal\')}');
  expect(actions).toContain('<polyline points="4.5 5.25 7 7.75 4.5 10.25" />');
});

test('workspace touch start only prepares drag state and does not arm file deletion', () => {
  const intent = getWorkspaceTouchStartIntent({
    target: createRowTarget({ path: '/workspace/demo.md', type: 'file' }),
    touches: [{ clientX: 24, clientY: 36 }],
  });

  expect(intent).toEqual({
    type: 'file',
    path: '/workspace/demo.md',
    dragPath: null,
    startX: 24,
    startY: 36,
  });
});

test('workspace touch start still enables drag mode from explicit drag handles', () => {
  const intent = getWorkspaceTouchStartIntent({
    target: createRowTarget({ path: '/workspace/demo.md', type: 'file', isDragHandle: true }),
    touches: [{ clientX: 10, clientY: 15 }],
  });

  expect(intent?.dragPath).toBe('/workspace/demo.md');
});

test('workspace touch drag uses a long-press delay and movement tolerance', () => {
  expect(WORKSPACE_TOUCH_DRAG_DELAY_MS).toBe(500);
  expect(WORKSPACE_TOUCH_DRAG_MOVE_TOLERANCE_PX).toBe(8);
  expect(hasWorkspaceTouchDragMoved(10, 15, 18, 23)).toBe(false);
  expect(hasWorkspaceTouchDragMoved(10, 15, 19, 15)).toBe(true);
  expect(hasWorkspaceTouchDragMoved(10, 15, 10, 24)).toBe(true);
});

test('workspace touch drag ghost is centered above the finger and clamped to the viewport', () => {
  expect(WORKSPACE_TOUCH_DRAG_GHOST_GAP_PX).toBe(50);
  expect(WORKSPACE_DRAG_GHOST_VIEWPORT_PADDING_PX).toBe(8);
  expect(resolveWorkspaceDragGhostPosition({
    clientX: 160,
    clientY: 240,
    ghostWidth: 80,
    ghostHeight: 28,
    viewportWidth: 320,
    inputType: 'touch',
  })).toEqual({ x: 120, y: 162 });
  expect(resolveWorkspaceDragGhostPosition({
    clientX: 20,
    clientY: 40,
    ghostWidth: 80,
    ghostHeight: 28,
    viewportWidth: 320,
    inputType: 'touch',
  })).toEqual({ x: 8, y: 8 });
  expect(resolveWorkspaceDragGhostPosition({
    clientX: 310,
    clientY: 240,
    ghostWidth: 80,
    ghostHeight: 28,
    viewportWidth: 320,
    inputType: 'touch',
  })).toEqual({ x: 232, y: 162 });
});

test('workspace mouse drag ghost keeps its existing lower-right offset', () => {
  expect(resolveWorkspaceDragGhostPosition({
    clientX: 160,
    clientY: 240,
    ghostWidth: 80,
    ghostHeight: 28,
    viewportWidth: 320,
    inputType: 'mouse',
  })).toEqual({ x: 172, y: 252 });
});

test('workspace touch start ignores rows that are being renamed', () => {
  const intent = getWorkspaceTouchStartIntent({
    target: createRowTarget({ path: '/workspace/demo.md', type: 'file' }),
    touches: [{ clientX: 1, clientY: 2 }],
  }, '/workspace/demo.md');

  expect(intent).toBeNull();
});

test('Mobile Workspace does not force tree focus after touch activation', () => {
  expect(shouldFocusWorkspaceTreeAfterActivation({
    mobileInterface: true,
    lastTouchActivationAt: 10_000,
    now: 10_250,
  })).toBe(false);
  expect(shouldFocusWorkspaceTreeAfterActivation({
    mobileInterface: true,
    event: { sourceCapabilities: { firesTouchEvents: true } },
  })).toBe(false);
  expect(shouldFocusWorkspaceTreeAfterActivation({
    mobileInterface: true,
    event: { pointerType: 'touch' },
  })).toBe(false);
});

test('Workspace preserves focus for Classic and non-touch Mobile activation', () => {
  expect(shouldFocusWorkspaceTreeAfterActivation({
    mobileInterface: false,
    event: { pointerType: 'touch' },
    lastTouchActivationAt: 10_000,
    now: 10_250,
  })).toBe(true);
  expect(shouldFocusWorkspaceTreeAfterActivation({
    mobileInterface: true,
    event: { pointerType: 'mouse' },
    lastTouchActivationAt: 10_000,
    now: 11_001,
  })).toBe(true);
});

test('workspace move confirmation describes file and folder destinations', () => {
  expect(buildWorkspaceMoveConfirmationMessage('notes/report.md', 'archive', 'file')).toBe(
    'Move file "report.md" from "notes" to "archive"?',
  );
  expect(buildWorkspaceMoveConfirmationMessage('projects/demo', '.', 'dir')).toBe(
    'Move folder "demo" from "projects" to the workspace root?',
  );
});

test('workspace move confirmation supports localized labels and root copy', () => {
  const messages: Record<string, string> = {
    'workspace.moveConfirm': 'MOVER {entry} {name}: {source} -> {target}',
    'workspace.root': 'RAIZ',
    'workspace.file': 'FICHEIRO',
    'workspace.folder': 'PASTA',
  };
  const translate = (key: string, values: Record<string, string> = {}) => Object.entries(values)
    .reduce((text, [name, value]) => text.replace(`{${name}}`, value), messages[key] || key);

  expect(buildWorkspaceMoveConfirmationMessage('projects/demo', '.', 'dir', translate)).toBe(
    'MOVER PASTA demo: "projects" -> RAIZ',
  );
});

test('workspace move confirmation respects cancel and confirm responses', () => {
  const prompts: string[] = [];
  const cancel = confirmWorkspaceEntryMove('notes/report.md', 'archive', 'file', (message: string) => {
    prompts.push(message);
    return false;
  });
  const confirm = confirmWorkspaceEntryMove('projects/demo', '.', 'dir', (message: string) => {
    prompts.push(message);
    return true;
  });

  expect(cancel).toBe(false);
  expect(confirm).toBe(true);
  expect(prompts).toEqual([
    'Move file "report.md" from "notes" to "archive"?',
    'Move folder "demo" from "projects" to the workspace root?',
  ]);
});

test('workspace root updates preserve descendants loaded beyond the watcher depth', () => {
  const previous = {
    path: '.', type: 'dir', children: [{
      path: 'notes', type: 'dir', children: [{
        path: 'notes/days', type: 'dir', children: [{
          path: 'notes/days/2026', type: 'dir', children: [{
            path: 'notes/days/2026/07', type: 'dir', children: [
              { path: 'notes/days/2026/07/09.md', type: 'file' },
            ],
          }],
        }],
      }],
    }],
  };
  const watcherRoot = {
    path: '.', type: 'dir', children: [{
      path: 'notes', type: 'dir', children: [{
        path: 'notes/days', type: 'dir', children: [{
          path: 'notes/days/2026', type: 'dir', children: [{
            path: 'notes/days/2026/07', type: 'dir',
          }],
        }],
      }],
    }],
  };

  const merged = mergeWorkspaceTreeUpdates(previous, [{ path: '.', root: watcherRoot, truncated: false }]);

  expect(merged.children[0].children[0].children[0].children[0].children).toEqual([
    { path: 'notes/days/2026/07/09.md', type: 'file' },
  ]);
});

test('truncated workspace updates defer replacement until a targeted reload', () => {
  const previous = {
    path: '.', type: 'dir', children: [
      { path: 'a', type: 'dir', children: [] },
      { path: 'b', type: 'dir', children: [] },
      { path: 'c', type: 'dir', children: [] },
    ],
  };
  const partialRoot = {
    path: '.', type: 'dir', children: [
      { path: 'a', type: 'dir', children: [] },
    ],
  };

  const merged = mergeWorkspaceTreeUpdates(previous, [{ path: '.', root: partialRoot, truncated: true }]);

  expect(merged).toBe(previous);
  expect(merged.children.map((child) => child.path)).toEqual(['a', 'b', 'c']);
});
