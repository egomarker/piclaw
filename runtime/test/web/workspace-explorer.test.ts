import { expect, test } from 'bun:test';

import {
  buildWorkspaceRowActionTarget,
  getWorkspaceTouchStartIntent,
  mergeWorkspaceTreeUpdates,
} from '../../web/src/components/workspace-explorer.ts';

function createRowTarget(options: { path?: string; type?: string; isDragHandle?: boolean; isRowAction?: boolean } = {}) {
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
      if (selector === '.workspace-row-action, .workspace-folder-upload') {
        return options.isRowAction ? this : null;
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

test('workspace touch start ignores add-on row actions', () => {
  const intent = getWorkspaceTouchStartIntent({
    target: createRowTarget({ path: '/workspace/repo', type: 'dir', isRowAction: true }),
    touches: [{ clientX: 1, clientY: 2 }],
  });

  expect(intent).toBeNull();
});

test('workspace row action targets normalize tree metadata for add-ons', () => {
  expect(buildWorkspaceRowActionTarget({ path: 'projects/demo', type: 'dir' }, 2)).toEqual({
    path: 'projects/demo',
    name: 'demo',
    type: 'dir',
    depth: 2,
  });
  expect(buildWorkspaceRowActionTarget({ path: '.', name: '', type: 'dir' }, -1)).toEqual({
    path: '.',
    name: 'workspace',
    type: 'dir',
    depth: 0,
  });
});

test('workspace touch start ignores rows that are being renamed', () => {
  const intent = getWorkspaceTouchStartIntent({
    target: createRowTarget({ path: '/workspace/demo.md', type: 'file' }),
    touches: [{ clientX: 1, clientY: 2 }],
  }, '/workspace/demo.md');

  expect(intent).toBeNull();
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
