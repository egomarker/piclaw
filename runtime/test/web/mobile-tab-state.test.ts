import { expect, test } from 'bun:test';

import {
  MOBILE_CHAT_TAB_ID,
  composeMobileTabStripTabs,
  resolveMobileSurfaceAfterClose,
} from '../../web/src/ui/mobile-tab-state.js';

function tab(id: string) {
  return {
    id,
    label: id,
    path: id,
    dirty: false,
    pinned: false,
  };
}

test('Mobile adds a permanent leftmost Chat tab only when pane tabs exist', () => {
  const empty: ReturnType<typeof tab>[] = [];
  expect(composeMobileTabStripTabs(empty, true)).toBe(empty);

  const panes = [tab('one'), tab('two')];
  const mobileTabs = composeMobileTabStripTabs(panes, true);
  expect(mobileTabs.map((item) => item.id)).toEqual([MOBILE_CHAT_TAB_ID, 'one', 'two']);
  expect(mobileTabs[0]).toMatchObject({
    label: 'Chat',
    closable: false,
    contextMenu: false,
  });
  expect(composeMobileTabStripTabs(panes, false)).toBe(panes);
});

test('Mobile close selection prefers the immediate right tab, then left, then Chat', () => {
  const panes = [tab('one'), tab('two'), tab('three')];
  expect(resolveMobileSurfaceAfterClose(panes, 'one')).toBe('two');
  expect(resolveMobileSurfaceAfterClose(panes, 'two')).toBe('three');
  expect(resolveMobileSurfaceAfterClose(panes, 'three')).toBe('two');
  expect(resolveMobileSurfaceAfterClose([tab('only')], 'only')).toBe(MOBILE_CHAT_TAB_ID);
});
