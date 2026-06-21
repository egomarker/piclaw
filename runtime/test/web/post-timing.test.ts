import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  buildPostTimeTooltip,
  extractAgentTimingBlock,
  formatAgentReplyDuration,
} from '../../web/src/components/post.ts';

test('formatAgentReplyDuration keeps reply timings compact', () => {
  expect(formatAgentReplyDuration(420)).toBe('420ms');
  expect(formatAgentReplyDuration(1420)).toBe('1.4s');
  expect(formatAgentReplyDuration(38_420)).toBe('38s');
  expect(formatAgentReplyDuration(62_400)).toBe('1m 02s');
  expect(formatAgentReplyDuration(3_720_000)).toBe('1h 02m');
  expect(formatAgentReplyDuration(null)).toBe(null);
});

test('buildPostTimeTooltip includes persisted agent timing when present', () => {
  const post = {
    timestamp: '2026-06-21T11:16:02.000Z',
    data: {
      content_blocks: [
        {
          type: 'agent_timing',
          started_at: '2026-06-21T11:15:23.580Z',
          completed_at: '2026-06-21T11:16:02.000Z',
          duration_ms: 38_420,
        },
      ],
    },
  };

  expect(extractAgentTimingBlock(post.data.content_blocks)?.duration_ms).toBe(38_420);
  const tooltip = buildPostTimeTooltip(post);
  expect(tooltip).toContain('Sent');
  expect(tooltip).toContain('Agent reply took 38s');
  expect(tooltip).toContain('Started');
});

test('terminal agent outcomes attach agent_timing content blocks', () => {
  const source = readFileSync(join('/workspace/piclaw', 'runtime/src/channels/web/handlers/agent.ts'), 'utf8');
  expect(source).toContain('type: "agent_timing"');
  expect(source).toContain('buildAgentTimingBlock(),');
});
