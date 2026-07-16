# Observability

PiClaw supports structured observability through a log-sink contract that any add-on can use to export traces, metrics, and exceptions to external backends without modifying the runtime.

## How it works

The runtime emits structured JSON log records to stdout/stderr via `createLogger()`. Every record with an `operation` field is a telemetry-grade event:

```typescript
interface LogRecord {
  ts: string;             // ISO timestamp
  level: string;          // "debug" | "info" | "warn" | "error"
  module: string;         // e.g. "agent-pool.run-orchestrator"
  message: string;        // human-readable description
  operation?: string;     // machine-readable key — the stable contract
  chatJid?: string;       // canonical actor identity for agent analytics
  turnId?: string;        // stable per-turn correlation key
  sessionLeafId?: string; // optional runtime/fork leaf identity
  userId?: string;        // browser correlation id (if supplied by web UI)
  sessionId?: string;     // browser correlation id (if supplied by web UI)
  clientId?: string;      // browser/tab correlation id (if supplied by web UI)
  [key: string]: unknown; // additional context (model, durationMs, classifier, etc.)
}
```

## Log sink API

Any code running in the piclaw process can subscribe to structured log records:

```typescript
import { addLogSink, removeLogSink, type LogSink, type LogRecord } from "piclaw/runtime/src/utils/logger.js";

const mySink: LogSink = (record: LogRecord) => {
  if (record.operation === "run_agent.complete") {
    // create a span, push a metric, etc.
  }
};

addLogSink(mySink);     // start receiving records
removeLogSink(mySink);  // stop
```

- Sinks receive every log record after it has been written to stdout/stderr.
- Sink callbacks must not throw — errors are silently swallowed.
- The `operation` field is the stable key. Match on it. Everything else is context.
- If no sink is registered, there is zero overhead beyond the normal JSON logging.

## Why this design

- **The runtime never imports OTel.** It just logs structured records.
- **Any add-on** can subscribe and interpret those records however it wants — OTel spans, Datadog, Prometheus, a local SQLite store, or nothing.
- **No coupling.** The runtime doesn't know what's listening. The add-on doesn't need runtime code changes.
- **Turn correlation is first-class.** `turnId` is the preferred join key; `chatJid` remains the actor key and fallback pairing key.
- **Agent-centric identity.** For observability, the canonical actor is the chat/agent JID, not the browser user.

## Operation reference

### Agent turn lifecycle

| Operation | Level | Key fields | Emitted when |
|---|---|---|---|
| `run_agent.prompt` | info | `chatJid`, `turnId`, `model`, `promptLength` | Agent turn starts |
| `run_agent.prompt_resolved` | info | `chatJid`, `turnId`, `promptDurationMs`, `sessionIsStreaming` | `session.prompt()` resolves |
| `run_agent.complete` | info | `chatJid`, `turnId`, `model`, `durationMs`, `outputChars`, `recoveryAttemptsUsed` | Turn finishes successfully |
| `run_agent` | error | `chatJid`, `turnId`, `model`, `durationMs`, `errorMessage` | Turn fails fatally |
| `run_agent.attempt_failed` | warn | `chatJid`, `turnId`, `errorText`, `classifier`, `recoveryStrategy` | Recovery attempt fails |
| `run_agent.no_terminal_reply` | warn | `chatJid`, `turnId`, `detail`, `hadToolActivity`, `blankTurnDelta` | Provider stopped without a reply |
| `run_agent.blank_turn_delta` | warn | `chatJid`, `turnId`, `detail`, `blankTurnDelta` | Session delta contains only user messages |
| `run_agent.recovery_compact` | info | `chatJid`, `turnId` | Compaction triggered during recovery |
| `run_agent.tool_use_budget_abort` | warn | `chatJid`, `turnId`, `assistantToolUseMessageCount`, `toolUseMessageBudget` | Tool budget exceeded |

### Model lifecycle

| Operation | Level | Key fields | Emitted when |
|---|---|---|---|
| `model.response.start` | info | `chatJid`, `turnId`, `model`, `sequence`, `phase?` | A model response segment starts |
| `model.response.end` | info | `chatJid`, `turnId`, `model`, `sequence`, `durationMs`, `stopReason`, `usage` | A model response segment ends |

### Tool calls

| Operation | Level | Key fields | Emitted when |
|---|---|---|---|
| `tool.call.start` | info | `chatJid`, `turnId`, `toolName`, `toolCallId` | Tool execution begins |
| `tool.call.end` | info | `chatJid`, `turnId`, `toolName`, `toolCallId`, `isError`, `durationMs` | Tool execution finishes |

### Web channel

| Operation | Level | Key fields | Emitted when |
|---|---|---|---|
| `handle_agent_message` | info | `chatJid`, `mode`, `isStreaming`, `contentPreview` | User message received |
| `process_chat.select_message` | info | `chatJid`, `processingMessageId`, `pendingMessageCount` | Message selected for processing |
| `process_chat.finalize_successful_run` | info | `chatJid`, cursor state | Turn persisted and finalized |
| `process_chat.no_output_recovery_stalled` | warn | `chatJid`, `title`, `recovery` | Turn ended without output during recovery |
| `process_chat.no_output_blank_failed` | warn | `chatJid`, `hadDraft`, `recovery` | Turn produced no output at all |

### Session lifecycle

| Operation | Level | Key fields | Emitted when |
|---|---|---|---|
| `get_or_create.create_main_session` | info | `chatJid`, `poolSize` | New session created |
| `evict_idle.main_session` | info | `chatJid` | Idle session evicted |
| `evict_idle.side_session` | info | `chatJid` | Side session evicted |
| `memory_pressure.mode_change` | info | `rssBytes`, threshold | Memory pressure toggled |

### Compaction and rotation

| Operation | Level | Key fields | Emitted when |
|---|---|---|---|
| `maybe_auto_compact_session_before_prompt` | info | `chatJid`, `contextTokens`, `contextWindow` | Pre-prompt compaction triggered |
| `smart_compaction.source_prepared` | debug | `method`, source/event counts | Local Selective/Pipelined source prepared after any remote pre-pass fallback |
| `smart_compaction.pipeline_planned` | debug | `method`, source/group/unit counts, dispositions, coverage, audit ledger | Pipelined ledger validated |
| `smart_compaction.completed` | debug | `method`, execution, token estimates, reductions, model/chunk counts, duration | Local compaction completed |
| `smart_compaction.output_invalid` / `smart_compaction.progressive_output_invalid` | debug | `schema`, `stopReason`, `validationFailure`, retry count | Model output rejected before persistence |
| `remote_compaction.attempt` / `remote_compaction.completed` | debug/info | provider/model identifiers, counts, usage, duration | Provider-native compaction attempted/completed |
| `remote_compaction.fallback` | info | `outcome`, local method, provider/model, reason | Provider-native failure continued safely into the captured local method |
| `maybe_auto_rotate_session` | info | `chatJid`, `previousSize`, `trigger` | Session file auto-rotated |

### Dream

| Operation | Level | Key fields | Emitted when |
|---|---|---|---|
| `dream.complete` | info | `chatJid`, `mode`, `days`, `durationMs` | Dream maintenance finishes |
| `acquire_dream_lock.reap_stale` | warn | `path`, `ownerPid` | Stale Dream lock reaped |
| `run_dream_agent_turn.fallback_refresh` | warn | `chatJid`, `error`, `recovery` | Dream model pass failed |

## First-party add-on: `@rcarmo/piclaw-addon-observability`

The observability add-on uses this log-sink contract to export telemetry to Azure Application Insights and local Graphite. See the [add-on README](https://github.com/rcarmo/piclaw-addons/tree/main/addons/observability) for configuration, schema details, browser telemetry, and Kusto queries.

Ready-to-import/query artifacts in this repo:
- `docs/azure/app-insights-agent-kusto-queries.md`
- `docs/azure/app-insights-agent-observability-workbook-template.json`

### What it produces

| Source | Output |
|---|---|
| `run_agent.prompt` → terminal record | `agent.turn` span |
| `model.response.start/end` | `model.call` child spans |
| `tool.call.start/end` | `tool.call` child spans |
| `run_agent.attempt_failed` | `provider.error` spans + recovery metrics |
| `dream.complete` | `dream` span |
| browser SSE/fetch translation | `customEvents` keyed by `chatJid` (`agent.turn.*`, `agent.followup.*`, `agent.steer.*`, `agent.message.sent`) |
| Graphite | `agent.turn.*`, `tool.<name>.*`, `provider.error.*`, `session.*`, `dream.duration_ms` |

### Identity mapping

The first-party add-on is intentionally **agent-centric**:

| Concept | Mapping |
|---|---|
| Primary actor | `chatJid` |
| Primary transaction | `turnId` |
| Runtime session / fork identity | `sessionLeafId` when available |
| Browser correlation | `userId`, `sessionId`, `clientId` headers from the web UI |

`chatJid` is stamped as:
- `piclaw.chat_jid`
- `piclaw.actor.kind = chat_jid`
- `piclaw.actor.id = <chatJid>`
- `enduser.id = <chatJid>` for App Insights views that expect a user field

The raw browser identifiers are still preserved separately as:
- `piclaw.browser_user_id`
- `piclaw.browser_session_id`
- `piclaw.browser_client_id`

## Writing a custom observability add-on

Any add-on can implement the same pattern:

1. `require("piclaw/runtime/src/utils/logger.js")` to get `addLogSink` / `removeLogSink`
2. Register a sink on `session_start`, remove it on `session_shutdown`
3. Match on `record.operation` to decide what to export
4. Pair turns by `turnId` first, with `chatJid` as fallback
5. Treat `chatJid` as the actor key for agent analytics
6. Use `tool.call.*` and `model.response.*` for child spans

The runtime guarantees:

- Every `run_agent.prompt` will eventually be followed by `run_agent.complete` or `run_agent` (error) for the same turn unless the process crashes.
- `tool.call.start` / `tool.call.end` pairs are emitted for every tool execution within a turn.
- `model.response.start` / `model.response.end` pairs are emitted for observable model segments.
- `dream.complete` fires once per Dream maintenance pass.
- All warn/error records with an `operation` field represent actionable events.
