---
name: reload
description: Reinstall piclaw from workspace source, then gracefully restart the managed process. Use after making code changes to piclaw.
distribution: public
---

# Reload Piclaw

Install the workspace build, then let the active service manager start a new process after graceful shutdown.

> ⚠️ In the container runtime, install to `/usr/local/lib/bun/install/global/node_modules/piclaw`. Do **not** deploy to `/home/agent/.bun/...`; the service may keep running another installation.

## Agent-driven workflow

1. Build, pack, and install without restarting:

   ```bash
   cd /workspace/piclaw && make local-install
   ```

2. Use `session_status` to check for other active sessions.
3. If another session is working, report it and wait for approval. A restart interrupts that work.
4. Finish all build, verification, and reporting work.
5. Call `exit_process` with a concise, non-empty `reason` as the last tool action. It posts a visible restart notice to the active chat, then schedules graceful shutdown. Supervisor restarts supervised containers; other installs need their service manager to start the process again.

`make restart` is an intentional no-op guard. It prevents an active agent turn from killing its own response.

## Manual shell workflow

Outside an agent turn, install and restart as separate commands:

```bash
cd /workspace/piclaw && make local-install
systemctl --user restart piclaw.service
```

Use the service manager configured for that host. Container installs commonly use Supervisor; host-native installs commonly use `systemd --user`.

## Build commands

Build Piclaw without installing:

```bash
cd /workspace/piclaw && make build-piclaw
```

Build only the vendor bundle:

```bash
cd /workspace/piclaw && make vendor
```

## Notes

- `make local-install` is install-only.
- `exit_process` requires a non-empty `reason`; it has no delay parameter.
- Bun and Piclaw are installed globally under `/usr/local/lib/bun` in the container layout.
