# Thinking persistence

Persist model reasoning traces ("thinking" or "extended thinking" blocks)
in the messages database so they survive page reloads and can be reopened from
the chat timeline.

**Default: OFF.** This feature is opt-in because durable storage of reasoning
traces has privacy and security implications beyond regular chat messages.
Read the [Privacy & security](#privacy--security) section before you enable
it.

---

## Quick start

Enable via environment variable:

```bash
export PICLAW_WEB_PERSIST_THINKING=1
piclaw                                # restart the runtime
```

After enabling, any agent turn whose model emits thinking blocks
(Claude 4+ models when extended thinking is on) will:

1. Save the thinking text to a new `thinking_content` SQLite table keyed by the
   message rowid.
2. Add a `thinking_ref` content block to the persisted agent message.
3. The web UI renders a collapsible "Thought for Ns" pill under the message;
   clicking it lazy-loads the full trace from `/agent/thinking`.

When the feature is off, the live `Thinking...` panel still streams during
a turn, but PiClaw does not write anything to the database.

---

## Configuration

| Variable | Default | What |
|---|---|---|
| `PICLAW_WEB_PERSIST_THINKING` | `0` | Enable capture-and-persist. Accepts `1`/`true`/`yes`. |
| `PICLAW_WEB_PERSIST_THINKING_MAX_CHARS` | `100000` | Hard cap on stored characters per turn. Values ≤ 0 fall back to the default. Truncation is UTF-16 surrogate-safe (emoji at the boundary get dropped, not half-stored). |

Both settings are also readable from the JSON `web` config block under the
keys `persistThinking` and `persistThinkingMaxChars` (or the same names in
snake_case).

PiClaw checks the resolved setting on each turn. A running process only sees
new environment variable values after restart.

---

## What is stored

For each agent turn whose model produces thinking, the `thinking_content` row
holds:

| Column | Type | Meaning |
|---|---|---|
| `message_id` | TEXT (PK) | The rowid of the parent `messages` row, stringified. |
| `text` | TEXT | The accumulated thinking text from all `thinking` blocks in the turn, joined with `\n\n---\n\n`. |
| `lines` | INTEGER | Total line count (sum across blocks). |
| `duration_ms` | INTEGER | Wall-clock time spent in `thinking_*` events (sum across blocks). |
| `model` | TEXT \| NULL | The model id at the time of capture (e.g. `github-copilot/claude-opus-4.6-1m`). |
| `truncated` | INTEGER (0/1) | `1` if the text was clipped by `PICLAW_WEB_PERSIST_THINKING_MAX_CHARS`. |
| `created_at` | TEXT | UTC ISO timestamp (defaults to `datetime('now')`). Indexed for retention queries. |

A `thinking_ref` content block is attached to the parent message:

```json
{ "type": "thinking_ref", "lines": 42, "duration_ms": 17300 }
```

The block carries only the metrics so the timeline can render the pill
without fetching the full text. The text loads lazily on first expand via
`GET /agent/thinking?message_id=N&chat_jid=...`.

### Summarized thinking

Starting with Claude 4 (Opus 4.6, Opus 4.7, Sonnet 4.6, etc.), Anthropic
returns **summarized thinking** by default — a condensed reformulation of the
model's internal reasoning, processed by a separate summarizer model. The
underlying pi-ai provider sets `thinking: { type: "adaptive", display: "summarized" }`,
so what reaches PiClaw is already the summary, not the raw internal reasoning.

Practical implications:

- The 100 KB default cap is far above typical summaries. Production traffic
  through the GitHub Copilot enterprise proxy averages about 3 KB.
- `duration_ms` reflects wall-clock time of the full original thinking phase,
  even though the stored text is the summary.
- Older models (pre-Claude 4) or models accessed with full thinking enabled
  (requires Anthropic sales contact) would store more verbose content. The
  same cap protects against runaway size.

### Excluded contexts

- **Dream sessions** (`chat_jid LIKE 'dream:%'`) skip persistence entirely.
  Dream is an internal compaction/memory process; persisting its thinking
  would bloat the DB without user value.
- **Intermediate turns** (the tool-call rounds before a turn's final agent
  reply) do not get thinking_ref blocks. Only the terminal agent reply
  carries the pill, with the accumulated thinking from the whole turn.

---

## Privacy & security

Reasoning traces are categorically more sensitive than regular conversation
content because:

1. **They can leak the user's prompt verbatim.** "Leaky Thoughts: Large
   Reasoning Models Are Not Private Thinkers" (Bagdasarian et al., EMNLP
   2025, [arXiv:2506.15674](https://arxiv.org/abs/2506.15674)) shows
   reasoning traces frequently contain the full user input and intermediate
   personal-data inferences, and that prompt injections can extract data
   through the reasoning channel.
2. **Persisting them durably enlarges the attack surface.** When thinking
   was ephemeral (in-memory only) it was gone the moment the page reloaded.
   With this feature on, thinking traces travel with the database — backups,
   Syncthing replication, exports, and forensic recovery all see them.
3. **No encryption at rest.** Stored as plain TEXT in SQLite alongside
   messages. Encrypted-at-rest filesystems (LUKS, FileVault, BitLocker)
   are the only barrier.

### Mitigations in place

- Opt-in (default off)
- Per-turn character cap (`PICLAW_WEB_PERSIST_THINKING_MAX_CHARS`)
- Dream sessions excluded
- Single-user assumption (PiClaw is not multi-tenant)
- Endpoint scoped to chat_jid: `/agent/thinking` requires both `message_id`
  AND `chat_jid`, plus the parent message must be a bot reply carrying a
  `thinking_ref` block. Returns 404 uniformly for any validation failure
  (no enumeration oracle).

### Recommended if you enable this

- Don't sync the `messages.db` file across machines unless you trust every
  receiver with reasoning traces.
- Run periodic purges if you don't need long-term thinking history (see
  [Cleanup & retention](#cleanup--retention)).
- Evaluate the threat model for the deployment. A shared service exposes
  reasoning traces to more users and systems than a single-user local install.

---

## Cleanup & retention

PiClaw deletes thinking content whenever it deletes the parent message.
These code paths perform that cleanup:

| Path | Trigger |
|---|---|
| `deleteMessageByRowId` | Delete a single message from the timeline UI |
| `deleteThreadByRowId` | Delete a thread (parent + replies) |
| `rollbackChatRunWithError` | A run errored; partial bot output is rolled back |
| `rollbackInflightRun` | Crash recovery rolls back partial output from a killed run |
| `permanentDeleteArchivedBranch` | An archived branch is permanently purged |
| `reapDreamArtifacts` × 2 | Stale dream sweep (full or exclude-current) |
| `cleanupDreamChat` | A specific dream chat is finalized/cleaned |

There is no SQLite FK CASCADE — `thinking_content.message_id` is TEXT and
`messages` has a composite PK, so cascades cannot be declared. Cleanup is
manual at every site, consistent with how `message_media` is handled.

### Bulk purge

For retention-style purges (older than N days, full wipe, per-chat wipe), use
the bundled script:

```bash
# Preview without deleting
bun run runtime/scripts/purge-thinking-content.ts --older-than-days 30 --dry-run

# Apply
bun run runtime/scripts/purge-thinking-content.ts --older-than-days 30

# Wipe everything
bun run runtime/scripts/purge-thinking-content.ts --all

# Only one chat
bun run runtime/scripts/purge-thinking-content.ts --chat-jid web:default

# Reclaim disk space after a large purge
bun run runtime/scripts/purge-thinking-content.ts --all --vacuum
```

PiClaw can stay running. SQLite WAL mode lets the runtime keep reading while
the script holds a brief write transaction.

### Or hand-written SQL

If you prefer raw SQL, the equivalents are:

```sql
-- Wipe everything
DELETE FROM thinking_content;

-- Older than 30 days (uses idx_thinking_content_created_at)
DELETE FROM thinking_content WHERE created_at < datetime('now', '-30 days');

-- One specific chat
DELETE FROM thinking_content
WHERE message_id IN (
  SELECT CAST(rowid AS TEXT) FROM messages WHERE chat_jid = 'web:default'
);

-- Reclaim space
VACUUM;
```

### Disabling the feature

Unsetting `PICLAW_WEB_PERSIST_THINKING` (or setting it to `0`) stops new
captures after the next restart. Existing `thinking_ref` pills on old
messages still render, and clicking them still loads the historical content.
Disabling the feature stops capture; it does not remove stored traces from the
UI.

To remove old pills from existing messages, either:
- Delete the messages (deletes the pill via `content_blocks`)
- Manually rewrite `content_blocks` to drop `thinking_ref` entries (no
  built-in tool)
- Purge `thinking_content` rows: pills still render but clicking returns
  404, which the UI renders as "Could not load reasoning trace."

---

## Operational notes

### Storage growth

Observed in production (single-user instance, GitHub Copilot enterprise proxy,
Claude Opus 4.6 1M): **0.28%** of bot messages had a thinking row, averaging
~3 KB each. At that rate a busy chat accumulates ~20 KB/day. The 100 KB cap
ensures even pathological cases stay bounded.

### Retry / recovery handling

If the agent's internal recovery loop retries after a transient failure
(rate-limit, network blip), the pending thinking buffer is cleared on the
`recovery_start` event so the failed attempt's reasoning is not concatenated
with the successful attempt's. Only the final attempt's thinking is persisted.

A log entry at info level (`operation: persist_thinking.discard_on_recovery`)
records the discarded character count.

### Race-window safety

The `thinking_content` row is INSERTed BEFORE the SSE `agent_response` (or
`agent_followup_consumed`) broadcast. A fast client that fetches
`/agent/thinking` immediately on receiving the broadcast cannot race the
INSERT and get 404. This is enforced by the `onMessageStored` callback wired
into `storeAgentTurn`.

### Redacted thinking

Anthropic occasionally returns `redacted_thinking` blocks where the actual
reasoning is replaced with an opaque payload and a placeholder string
(`"[Reasoning redacted]"`). pi-ai surfaces these as normal `thinking` blocks
to the streaming handler, so the placeholder string ends up in stored
thinking. `duration_ms` still reflects the thinking interval, but the stored
text is not useful. This is a known limitation.

---

## API reference

### `GET /agent/thinking`

Query parameters (both required):

- `message_id` — the rowid of the parent message
- `chat_jid` — the chat the message belongs to

Returns 200 with JSON `{ text, lines, duration_ms, model, truncated }` if and
only if:
- `chat_jid` and `message_id` both present
- A message with that rowid exists in that chat
- The message is a bot reply (`is_bot_message = 1`)
- The message's `content_blocks` contains a `thinking_ref` block
- A `thinking_content` row exists for that message rowid

Any other case returns `404 {"error":"Not found"}` (uniform, no oracle).

Returns `400 {"error":"Missing message_id or chat_jid"}` if either parameter
is absent.

Behind the same auth gate as all other `/agent/*` routes.

---

## See also

- Configuration: [configuration.md](configuration.md)
- Database schema: see `runtime/src/db/connection.ts` `createSchema()`
- Issues tracker (downstream): `projects/pr655-thinking-persistence/ISSUES-tracker.md`
- Upstream PR: https://github.com/rcarmo/piclaw/pull/655
