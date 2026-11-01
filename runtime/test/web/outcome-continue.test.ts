import { expect, test } from 'bun:test';

import { CONTINUE_PROMPT, buildContinuePrompt } from '../../web/src/ui/outcome-continue.js';

test('buildContinuePrompt sends the bare continue prompt when no note is given', () => {
  expect(CONTINUE_PROMPT).toBe('please continue');
  expect(buildContinuePrompt()).toBe('please continue');
  expect(buildContinuePrompt('')).toBe('please continue');
  expect(buildContinuePrompt('   ')).toBe('please continue');
  expect(buildContinuePrompt(null)).toBe('please continue');
  expect(buildContinuePrompt(42)).toBe('please continue');
});

test('buildContinuePrompt appends a trimmed note after a period', () => {
  expect(buildContinuePrompt('skip the intro')).toBe('please continue. skip the intro');
  expect(buildContinuePrompt('  skip the intro  ')).toBe('please continue. skip the intro');
  expect(buildContinuePrompt('use the staging branch\n')).toBe('please continue. use the staging branch');
});
