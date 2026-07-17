# Session recordings and playback

Piclaw can capture an opt-in, redacted chat/session trace and replay it in a playback-only UI for deterministic screen recordings.

## Management UI

Open **Settings → Recordings** to:

- start/stop recording the current chat
- include an initial timeline snapshot
- select `redacted`, `metadata`, or `full` capture mode
- add extra redacted keys or regex patterns
- preview redaction behavior before recording
- replay recordings in a standalone playback page
- export traces as JSON, JSONL, or self-contained HTML
- delete saved recordings

## Recording API

All endpoints are authenticated web routes.

| Endpoint | Method | Purpose |
|---|---:|---|
| `/agent/recordings` | `GET` | List saved recordings and currently active recordings |
| `/agent/recordings/start` | `POST` | Start recording a chat |
| `/agent/recordings/stop` | `POST` | Stop a recording by `id` or `chat_jid` |
| `/agent/recordings/active?chat_jid=...` | `GET` | Return the active recording for a chat |
| `/agent/recordings/redact-preview` | `POST` | Preview redaction for a sample payload |
| `/agent/recordings/<id>` | `GET` | Return `{ meta, events }` for playback/export |
| `/agent/recordings/<id>/export?format=json\|jsonl\|html` | `GET` | Download an export artifact |
| `/agent/recordings/<id>` | `DELETE` | Delete a saved recording |
| `/recordings/playback?id=<id>` | `GET` | Open the standalone playback-only UI |

Start a recording:

```bash
curl -X POST /agent/recordings/start \
  -H 'Content-Type: application/json' \
  -d '{
    "chat_jid":"web:default",
    "title":"Demo",
    "mode":"redacted",
    "include_timeline_snapshot":true,
    "redaction":{"keys":["customer_id"],"patterns":["ACME-[0-9]+"]}
  }'
```

Stop it:

```bash
curl -X POST /agent/recordings/stop \
  -H 'Content-Type: application/json' \
  -d '{"chat_jid":"web:default"}'
```

Export standalone HTML:

```text
/agent/recordings/<id>/export?format=html
```

## Trace format

Recordings are stored under Piclaw runtime data as JSONL:

```text
.piclaw/data/session-recordings/<recording-id>/meta.json
.piclaw/data/session-recordings/<recording-id>/trace.jsonl
```

Each trace event includes:

- `version`
- `recording_id`
- `seq`
- `kind`
- `chat_jid`
- `at`
- `t_ms`
- `data`
- optional `redactions`

Current event kinds include:

- `recording_started`
- `recording_stopped`
- `fixture_note`
- `user_input`
- `assistant_output`
- `tool_activity`
- `status`
- `timeline_message`
- `sse_event`

## Privacy and redaction

| Mode | Behavior |
|---|---|
| `redacted` | Default. Stores event payloads with likely secrets, secret-looking values, data URLs, and configured custom keys/patterns redacted. Long strings are truncated. |
| `metadata` | Stores shape/length metadata instead of string/object payload contents. |
| `full` | Stores full payloads. Use only for trusted local traces. |

Redaction controls are per recording and are stored in `meta.json` so exported artifacts remain auditable. Use `redact-preview` or the Settings UI preview before recording sensitive demos.

## Standalone playback page

Open:

```text
/recordings/playback?id=<recording-id>
```

The page can also load a static JSON/JSONL fixture via:

```text
/recordings/playback?src=/path/to/trace.json
```

or by dragging a JSON/JSONL trace file onto the page. HTML exports embed the trace and do not need a Piclaw server.

The playback page is playback-only: it does not execute tools or mutate chat state. The hosted page reads saved traces from `/agent/recordings`; exported HTML and static fixtures need no Piclaw server. Playback controls include play, pause, reset, step, and speed.
