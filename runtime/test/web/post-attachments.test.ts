import { expect, test } from 'bun:test';

import {
  extractAttachmentRefs,
  filterResolvedAttachmentItems,
  resolveInlineAttachments,
} from '../../web/src/components/post.ts';

test('attachment refs in arbitrary prose do not suppress structured image previews', () => {
  const content = [
    'PNG graphs are ready:',
    '- attachment:14-day-weather.png',
    '- attachment:14-day-weather-2.png',
  ].join('\n');

  const { content: cleaned, attachments } = extractAttachmentRefs(content);
  expect(cleaned).toBe(content);
  expect(attachments).toEqual([]);

  const imageItems = [
    { id: 11, mimeType: 'image/png' },
    { id: 12, mimeType: 'image/png' },
  ];
  const { content: resolved, usedIds } = resolveInlineAttachments(cleaned, [
    { id: 11, name: '14-day-weather.png' },
    { id: 12, name: '14-day-weather-2.png' },
  ]);
  const { filteredImageItems, filteredFileIds } = filterResolvedAttachmentItems(imageItems, [], usedIds);

  expect(resolved).toContain('- 14-day-weather.png');
  expect(resolved).toContain('- 14-day-weather-2.png');
  expect([...usedIds]).toEqual([11, 12]);
  expect(filteredImageItems.map((item) => item.id)).toEqual([11, 12]);
  expect(filteredFileIds).toEqual([]);
});

test('inline attachment refs still suppress duplicate file cards', () => {
  const { usedIds } = resolveInlineAttachments('See [report](attachment:report.pdf)', [
    { id: 21, name: 'report.pdf' },
  ]);
  const { filteredImageItems, filteredFileIds } = filterResolvedAttachmentItems([], [21], usedIds);

  expect(filteredImageItems).toEqual([]);
  expect(filteredFileIds).toEqual([]);
});
