import { expect, test } from 'bun:test';

import {
  buildMarkdownImageText,
  buildPastedImageFilename,
  formatPasteImageTimestamp,
  getPastedImageExtension,
  getWorkspaceDirectoryForEditorPath,
  isSupportedPastedImageFile,
} from '../../extensions/viewers/editor/paste-image.ts';

test('pasted editor images are targeted alongside the current file', () => {
  expect(getWorkspaceDirectoryForEditorPath('notes/project.md')).toBe('notes');
  expect(getWorkspaceDirectoryForEditorPath('project.md')).toBe('');
  expect(getWorkspaceDirectoryForEditorPath('/notes/project.md')).toBe('notes');
});

test('pasted editor image filenames use the note stem timestamp and safe suffix', () => {
  const now = new Date(2026, 5, 8, 19, 33, 51);
  expect(formatPasteImageTimestamp(now)).toBe('20260608-193351');
  expect(buildPastedImageFilename(
    'notes/Meeting Notes.md',
    { type: 'image/png', name: 'image.png' },
    { now, suffix: 'abc-123' },
  )).toBe('Meeting-Notes-20260608-193351-abc-123.png');
  expect(buildPastedImageFilename(
    'notes/sketch.markdown',
    { type: 'image/jpeg', name: 'clipboard' },
    { now, suffix: '1' },
  )).toBe('sketch-20260608-193351-1.jpg');
});

test('pasted editor image filtering supports common clipboard image formats only', () => {
  expect(getPastedImageExtension({ type: 'image/png', name: 'clipboard' })).toBe('png');
  expect(getPastedImageExtension({ type: '', name: 'photo.jpeg' })).toBe('jpg');
  expect(isSupportedPastedImageFile({ type: 'image/webp', name: 'image' })).toBe(true);
  expect(isSupportedPastedImageFile({ type: 'image/svg+xml', name: 'vector.svg' })).toBe(false);
  expect(isSupportedPastedImageFile({ type: 'text/plain', name: 'note.txt' })).toBe(false);
});

test('pasted editor image markdown insertion is plain relative markdown', () => {
  expect(buildMarkdownImageText('Meeting-Notes-20260608-193351.png')).toBe('![pasted image](Meeting-Notes-20260608-193351.png)');
  expect(buildMarkdownImageText('x.png', 'screen [clip]')).toBe('![screen clip](x.png)');
});
