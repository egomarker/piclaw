---
name: remote-peer
description: Send prompts to paired remote piclaw peers, list peers, and manage incoming proposals (pending/accept/reject). Uses Ed25519 signing to authenticate requests over HTTP. Use when asked to message, query, or manage remote agents.
---

# Remote peer

Send signed prompts to paired remote piclaw peers and manage incoming proposals.

Canonical implementation: `runtime/skills/builtin/remote-peer/peer.ts`

This workspace skill is a convenience pointer. The runtime ships the TypeScript source of truth, and `list_scripts` discovers it.

## Usage

```bash
bun /workspace/piclaw/runtime/skills/builtin/remote-peer/peer.ts <command> [args]
```

## Commands

| Command | Example |
|---------|---------|
| `list` | `bun peer.ts list` |
| `send <peer> <prompt>` | `bun peer.ts send product-manager "What is your current task?"` |
| `pending` | `bun peer.ts pending` |
| `decide <id> accept\|reject` | `bun peer.ts decide abc123 accept` |
| `decide-all accept\|reject` | `bun peer.ts decide-all reject` |

See the packaged runtime skill at [`runtime/skills/builtin/remote-peer/SKILL.md`](/workspace/piclaw/runtime/skills/builtin/remote-peer/SKILL.md) for full documentation.
