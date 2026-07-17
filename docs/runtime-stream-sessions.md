# Runtime stream sessions

Piclaw exposes a runtime-owned stream/session primitive for add-ons that need long-lived output or interactive attach semantics.

This is the runtime side of issue [#429](https://github.com/rcarmo/piclaw/issues/429). It is intentionally transport-agnostic: Proxmox, Portainer, SSH, or future infra add-ons own their protocol details and publish lifecycle/output frames through the shared session registry.

## When to use it

Use runtime stream sessions when a workflow is not a bounded request/response tool call:

| Workflow shape | Use |
|---|---|
| one-off API call, list/inspect/update operation | normal `request` or `workflow` tool |
| bounded command with complete output | normal tool result, possibly with tool-output handle |
| follow-mode logs, event streams, interactive attach, console sessions | runtime stream session |
| browser-mounted terminal/VNC pane | existing pane/session service, optionally bridged to runtime stream sessions later |

## Runtime API

Installed runtime/add-on code can access the API through:

```ts
const runtime = globalThis.__piclaw_runtime;
```

The registry is at:

```ts
runtime.streamSessions
```

### Open a session

```ts
const session = runtime.streamSessions.open({
  chatJid: "web:default",
  kind: "portainer.logs.follow",
  label: "Follow container logs",
  toolName: "portainer",
  metadata: {
    endpoint_id: 2,
    container: "gitea",
  },
  timeoutMs: 10 * 60 * 1000,
  onCancel(reason, snapshot) {
    // Tear down the upstream protocol stream here.
  },
  onCleanup(snapshot) {
    // Release sockets, timers, temp files, or remote handles here.
  },
});
```

### Publish output

```ts
session.write("container started\n", { kind: "stdout" });
session.write("waiting for health check", { kind: "status" });
session.write("stderr line\n", { kind: "stderr" });
```

Frames are retained in bounded in-memory history. Large frames are truncated per session limits so a noisy stream cannot grow process memory without bound.

### Complete, fail, or cancel

```ts
session.complete("remote stream ended");
session.fail(new Error("upstream disconnected"));
runtime.streamSessions.cancel(session.id, "user abort");
```

Every handle exposes an `AbortSignal`:

```ts
session.signal.addEventListener("abort", () => {
  // Stop local readers or remote streams.
});
```

## Query and subscribe

```ts
const active = runtime.streamSessions.list({ status: "active" });
const byTool = runtime.streamSessions.list({ toolName: "portainer" });
const snapshot = runtime.streamSessions.get(session.id);

const unsubscribe = runtime.streamSessions.subscribe((event) => {
  // event.type: created | frame | completed | failed | cancelled | timed_out | removed
  // event.session: current snapshot
  // event.frame: present for frame events
});
```

## Lifecycle guarantees

The registry provides:

- stable session IDs
- open/completed/failed/cancelled/timed-out states
- incremental framed output
- bounded frame retention
- cancellation via `AbortSignal`
- timeout-driven cancellation
- cleanup hooks
- best-effort cancellation of active sessions during Piclaw graceful shutdown

The registry does not hardcode any Proxmox, Portainer, Docker, SSH, VNC, or SPICE protocol logic.

## Pilot uses in infra add-ons

Initial pilot targets:

- `portainer.logs.follow` — follow a Docker log stream and publish stdout frames
- `portainer.exec.attach` — interactive Docker exec/attach with input/output frames
- `proxmox.console.*` — VNC/SPICE/serial/termproxy adapters that publish lifecycle and connection frames

Keep bounded workflows as normal request/response tools. For example, `container.logs` with a fixed tail remains a normal Portainer workflow; only follow-mode logs need a runtime stream session.

## Related files

- `runtime/src/addons/runtime-stream-sessions.ts`
- `runtime/src/addons/runtime-contributions.ts`
- `runtime/test/addons/runtime-contributions.test.ts`
- `docs/settings-and-addons.md`
