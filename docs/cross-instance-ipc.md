# Cross-instance IPC (experimental)

> **Status:** experimental. Implemented behind `PICLAW_REMOTE_INTEROP_ENABLED` and disabled by default.

Cross-instance IPC lets one piclaw instance call another through signed, consent-driven HTTP endpoints.

---

## 1) Design

Cross-instance IPC requires explicit pairing and is disabled until an operator enables it. The current implementation targets small groups of known instances on controlled networks.

Default behaviour:

- **Operator-mediated** mode queues inbound proposals for review.
- The runtime notifies `web:default`; `/pair inbox`, `/pair approve`, and `/pair reject` manage the queue.
- The proposal endpoint returns `human_required` until an operator decides.
- **Short-circuit** execution is optional and requires a peer in `short-circuit` mode with the `full` profile, plus `PICLAW_REMOTE_SHORT_CIRCUIT_ENABLED=1`.

Pairing does not grant unconditional remote code execution.

---

## 2) Feature flag & configuration

Remote interop is **disabled by default**. Set `PICLAW_REMOTE_INTEROP_ENABLED=1`
to serve `/api/remote/*` endpoints. When disabled, the router returns `404` for
remote interop routes.

Optional configuration:

- `PICLAW_REMOTE_INTEROP_ALLOW_HTTP=1` – allow `http://` callback URLs (testing only).
- `PICLAW_REMOTE_INTEROP_ALLOW_PRIVATE_NETWORK=1` – skip callback hostname and address checks after scheme validation. Docker/LAN development only.
- `PICLAW_REMOTE_SHORT_CIRCUIT_ENABLED=1` – allow short-circuit execution if the peer
  is configured with `mode=short-circuit` and `profile=full`.
- `PICLAW_REMOTE_INSTANCE_NAME` – display name in metadata.
- `PICLAW_REMOTE_INTEROP_DECISION_MODEL` – label for the mediation model (metadata only).

---

## 3) Threat Model

### Adversaries

1. On-path attacker (MITM, replay, tamper)
2. Scanner/flooder (pairing spam, endpoint abuse)
3. Malicious/compromised paired peer
4. Social engineering via deceptive names/fingerprints
5. Compromised private key
6. Resource exhaustion attacker (LLM/tool budget starvation)

### Trust boundaries

- Local user/operator
- Local runtime + policy engine
- Remote runtime + policy engine
- Network transport
- Remote proposal queue and agent execution path

### Security goals

- Cryptographic peer authentication
- Replay resistance
- Explicit operator consent for trust
- Least-privilege authorization
- Abuse resilience (rate/queue/budget controls)
- Revocation + auditability

### Non-goals

- Transitive trust across peers
- Anonymous federation
- Automatic broad trust due to network location alone

---

## 4) Identity and Peer Model

Each instance has a stable Ed25519 identity.

| Field | Definition |
|---|---|
| `public_key` | Ed25519 public key |
| `private_key` | Ed25519 private key in the local identity file; creation applies mode `0600` where supported |
| `instance_id` | `base64url(sha256(public_key))` |
| `instance_name` | Display-only label |
| `fingerprint` | Human-verifiable short form |

### Rules

- `instance_id` is key-derived (not user-chosen).
- Display names are not security identifiers.
- Pairing requests are accepted or denied by request ID. Known peers are revoked or reconfigured by immutable instance ID or fingerprint.

---

## 5) Pairing Protocol (Consent + Proof)

### Step A — Request

Initiator sends `POST /api/remote/pair-request` with:

- `instance_id`, `public_key`, `display_name`
- callback URL
- protocol version (`1`)
- nonce + expiry

### Step B — Review

Receiver stores request as `pending_inbound` and prompts operator with:

- callback origin (protocol + host derived from `callback_url`)
- source address (client IP, when available)
- instance ID
- full fingerprint
- display name (if provided)

Mode and permissions are not set during pairing — they default to
`mediated` / `restricted` and can be changed later via `/pair mode` and
`/pair permissions`.

### Step C — URL Control Proof

Receiver verifies initiator controls claimed URL via signed challenge callback.

Callback request (receiver → initiator `callback_url`):

```json
{
  "request_id": "pair_123",
  "challenge": "nonce_from_pair_request",
  "receiver_instance_id": "...",
  "receiver_public_key": "...",
  "receiver_fingerprint": "...",
  "timestamp": "2026-03-06T12:34:56Z"
}
```

Callback response (initiator → receiver):

```json
{
  "request_id": "pair_123",
  "challenge": "nonce_from_pair_request",
  "instance_id": "<initiator_instance_id>",
  "signature": "<base64url(ed25519(request_id\nchallenge\nreceiver_instance_id))>"
}
```

Receiver validates the signature using the initiator `public_key` from the
pair request before accepting.

### Step D — Accept / Deny / Block

- **accept**: signed confirmation, peer record created
- **deny**: reject request (retry allowed)
- **block**: deny + suppress future attempts under policy

### Step E — Confirm

The receiver verifies the signed URL-ownership challenge in Step C. After operator acceptance, the receiver sends a signed `pair-confirm`; the initiator verifies that request against its pending outbound record and marks the peer as paired.

### Anti-spoof constraints

- The acceptance command uses the pending request ID, not a display name.
- Pairing notices show the immutable instance ID and fingerprint for operator review.
- No short authentication string (SAS) comparison or separate fingerprint-confirmation prompt is implemented.

### Peer identifiers

Command lookup rules differ by surface:

- `/ask` accepts an exact instance ID, fingerprint, or case-insensitive display name. The database returns the first display-name match; duplicate names are not rejected, and names containing spaces cannot be addressed by the current command parser.
- `/pair` management commands use a request ID for pending pairing requests and an exact instance ID or fingerprint for known peers.
- The `remote-peer` CLI accepts an exact display name, exact ID, fingerprint, or instance-ID prefix. It returns the first match and does not check prefix uniqueness.

After lookup, signed requests use the full `instance_id` and stored `public_key`. Display names are labels, not security identities.

---

## 6) Interaction modes

### Default: operator-mediated mode

Inbound prompts enter a review queue instead of running immediately.

Flow:

1. A peer sends a signed request to `/api/remote/proposal`.
2. The runtime verifies the peer, signature, replay nonce, hop count, size, profile, and rate limit.
3. The runtime stores a pending proposal and notifies `web:default`.
4. The endpoint returns `decision: "human_required"` with a `negotiation_id`.
5. An operator reviews `/pair inbox` and runs `/pair approve <proposal_id>` or `/pair reject <proposal_id> [reason]`.
6. Approval runs the prompt through the local agent pool. The runtime stores the result and sends a signed callback when the peer has a reachable base URL.

### Policy authority

Deterministic checks and the local operator control execution. `PICLAW_REMOTE_INTEROP_DECISION_MODEL` currently labels response metadata; it does not select an automatic decision model.

### Optional: short-circuit mode

Enabled explicitly per peer by human operator.

- Bypasses negotiation step for eligible request types.
- Executes directly under pre-approved scope profile.
- Still requires full signature, replay, budget, and authorization checks.

Use cases: low-latency trusted automation between tightly controlled peers.

---

## 7) Request Authentication Protocol

Pair confirmation and all paired-peer operation requests use signed canonical payloads. The initial pair request is unsigned; the URL-ownership callback returns a signed challenge proof in its response body.

### Required headers

| Header | Purpose |
|---|---|
| `X-Instance-Id` | Sender identity |
| `X-Trust-Epoch` | Peer trust epoch |
| `X-Timestamp` | Request time |
| `X-Nonce` | Unique request nonce |
| `X-Sig-Version` | Signature/canonicalization version |
| `X-Signature` | Ed25519 signature |

### Canonical payload (v1)

```text
METHOD + "\n" +
PATH_WITH_QUERY + "\n" +
CONTENT_TYPE + "\n" +
SHA256(BODY_BYTES) + "\n" +
X-Timestamp + "\n" +
X-Nonce + "\n" +
X-Instance-Id + "\n" +
X-Sig-Version + "\n" +
X-Trust-Epoch
```

### Verification sequence

1. Lookup peer by `X-Instance-Id` and require `status=paired`
2. Require the request instance ID to match the stored peer
3. Validate signature version and timestamp skew
4. Validate the peer `trust_epoch`
5. Reject a reused nonce in the per-peer replay cache
6. Rebuild the canonical payload and verify the Ed25519 signature
7. Apply endpoint rate, mode, profile, size, hop, time, and tool checks
8. Execute or queue the request

---

## 8) API Shape (Experimental)

| Endpoint | Purpose | Auth |
|---|---|---|
| `POST /api/remote/pair-request` | initiate pairing | validated unauth input |
| `POST /api/remote/pair-confirm` | complete pairing | signed canonical request |
| `POST /api/remote/pair-callback` | prove control of the initiator callback URL | pending outbound request + challenge; signed proof in response |
| `GET /api/remote/ping` | health/metadata | signed |
| `POST /api/remote/proposal` | default mediated inbound prompt | signed |
| `POST /api/remote/execute` | optional short-circuit direct exec | signed + mode gate |
| `POST /api/remote/result` | push execution result callback | signed |
| `POST /api/remote/revoke` | revoke relationship | signed |

All POST endpoints require `Content-Type: application/json`.

### Proposal response envelope

The current proposal endpoint always queues valid requests for operator review:

```json
{
  "decision": "human_required",
  "reason": "Proposal queued for review.",
  "negotiation_id": "proposal_123",
  "remote_mode": "mediated",
  "decision_model": null
}
```

### Execute response envelope

```json
{
  "decision": "accept_execute",
  "result": "Disk usage: /workspace 18%",
  "usage": {
    "duration_ms": 950,
    "tool_calls": null
  },
  "scope_applied": {
    "profile": "full"
  }
}
```

### Result callback envelope (`POST /api/remote/result`)

Pushed by the executing peer back to the requesting peer after a
mediated proposal is approved and executed (or rejected).

```json
{
  "negotiation_id": "neg_123",
  "decision": "accept_execute",
  "result": "The answer is 42.",
  "usage": { "duration_ms": 1200 }
}
```

Or for a rejection:

```json
{
  "negotiation_id": "neg_123",
  "decision": "deny",
  "reason": "Rejected by operator."
}
```

---

## 9) Authorization and Scope

Pairing grants identity trust, not blanket execution rights.

### Permission profiles

| Profile | Allowed |
|---|---|
| `read-only` | ping/status only — no tool execution or proposals permitted |
| `non-mutating` | all tools classified as read-only (no side-effects) |
| `restricted` (default) | proposal channel with the fixed denylist described below |
| `full` | no remote tool-ceiling filter |
| `custom` | deferred; currently uses the same denylist as `restricted` |

**`read-only`** is the most conservative profile: the peer can only ping and
check status. Proposals and execution are rejected at the endpoint level.

**`non-mutating`** allows the peer to run any tool whose capability kind is
`read-only` in the tool-capabilities registry (e.g. `read`, `find`, `grep`,
`ls`, `list_tools`). Mutating tools are blocked by the tool ceiling filter.

### Restricted baseline

The `restricted` and deferred `custom` profiles use a fixed denylist. They block:

- shell execution
- file write/edit/delete
- keychain access
- SQL introspection
- model/provider switching
- scheduler/task creation
- process exit and tool-set self-activation
- editor-opening tools and heavy background automation

Other registered tools remain available unless another runtime check blocks them. The `restricted` profile is not an explicit allowlist.

---

## 10) Abuse Resistance

### Implemented controls

- endpoint rate limits keyed by source, instance ID, or peer as appropriate
- one concurrent short-circuit execute request per peer and four globally
- request and response size caps
- maximum tool calls and execution time per request
- hop-count rejection

Daily token/time budgets, queue priority for local traffic, and circuit breakers are not implemented.

### Loop prevention (agent-to-agent)

The runtime enforces `X-Request-Hop` and rejects requests above the configured limit. `/ask` also sends `X-Request-Chain-Id` for correlation, but the receiver does not currently enforce it. The `remote-peer` CLI sends only the hop header.

---

## 11) SSRF and URL Safety

Pairing callback URLs are untrusted input. The validator currently:

- requires `https` unless `PICLAW_REMOTE_INTEROP_ALLOW_HTTP=1`
- rejects localhost, `.local`, loopback, private, link-local, carrier-grade NAT, and benchmark ranges
- resolves hostnames and rejects any private or loopback result
- uses a five-second timeout for the ownership callback

`PICLAW_REMOTE_INTEROP_ALLOW_PRIVATE_NETWORK=1` bypasses hostname and address checks for development. Redirect limits, DNS re-resolution at connection time, and domain allowlists are not implemented.

---

## 12) Revocation, Rotation, Recovery

### Revocation

`/pair revoke <instance_id|fingerprint>` sends a best-effort signed revocation to the peer, then marks the local peer `revoked`. Signed endpoints reject peers whose status is no longer `paired`.

### Trust epoch

Each peer has `trust_epoch`; requests with stale trust context are rejected.

### Key rotation

The protocol does not silently replace a paired public key. Key rotation requires revocation and a new pairing.

### Compromise runbook

1. revoke compromised peer/key
2. block source if needed
3. rotate local identity key
4. re-pair trusted peers
5. audit and backfill incident timeline

---

## 13) Logging, Privacy, Retention

The runtime appends remote audit rows with peer ID, endpoint, decision, status, error, and timestamp. The audit table excludes raw prompts. Proposals and results are stored in their operational tables.

Retention cleanup and configurable redaction rules for remote audit data are not implemented.

---

## 14) Minimum secure defaults

These values describe the current implementation unless marked as missing.

| Control | Default |
|---|---|
| feature flag | disabled |
| default mode | `mediated` |
| default peer profile | `restricted` |
| timestamp skew | ±90s |
| nonce replay TTL | 5 min |
| nonce cache size | 10k per peer; oldest inserted nonce is evicted at the bound |
| pending pair request TTL | 1h from the built-in `/pair request` client; receivers accept expiries up to 24h |
| pair-request rate | 3 / 10 min / source + ID |
| pair-confirm rate | 6 / 10 min / source + ID |
| proposal rate | 12 / min / peer |
| ping rate | 60 / min / peer |
| execute rate | 6 / min / peer |
| revoke rate | 6 / min / peer |
| short-circuit execute concurrency | 1 / peer, 4 global; operator-approved proposal execution does not use this counter |
| max prompt size | 32 KB |
| max response size | 256 KB |
| max tool calls | 8 (restricted), 32 (full) |
| max execution timeout | 60s (restricted), 180s (full) |
| request hop limit | 3 |
| audit retention | no cleanup policy implemented |

---

## 15) Command UX

```text
/pair request <url>
/pair accept <request_id>
/pair deny <request_id>
/pair block <request_id|instance_id|fingerprint>
/pair revoke <instance_id|fingerprint>
/pair list
/pair list revoked
/pair inbox
/pair history [page]
/pair approve <proposal_id>
/pair reject <proposal_id> [reason]
/pair permissions <instance_id> <profile>
/pair mode <instance_id> <mediated|short-circuit>
/ask <instance_id|fingerprint|exact-name> <prompt>
```

| Command | Description |
|---|---|
| `/pair request <url>` | Initiate pairing with a remote piclaw instance |
| `/pair accept <id>` | Accept an inbound pair request |
| `/pair deny <id>` | Deny an inbound pair request |
| `/pair block <id>` | Deny and block peer |
| `/pair revoke <id>` | Revoke a pairing (local + best-effort remote notify) |
| `/pair list` | Show paired peers and pending inbound pair requests |
| `/pair list revoked` | Show revoked peers |
| `/pair inbox` | Show pending proposals awaiting review |
| `/pair history [page]` | Show inbound mediated proposals with status and outcome (50 per page) |
| `/pair approve <id>` | Approve and execute a pending proposal |
| `/pair reject <id> [reason]` | Reject a proposal, optionally with reason |
| `/pair permissions <id> <profile>` | Set capability profile (`read-only`, `non-mutating`, `restricted`, `full`) |
| `/pair mode <id> <mode>` | Set interaction mode (`mediated`, `short-circuit`) |
| `/ask <id> <prompt>` | Send a prompt to a paired peer (signed HTTP request) |

Prompts can also be sent through the `remote-peer` skill CLI:
`peer.ts send <exact-name|instance-id|instance-id-prefix|fingerprint> <prompt>`.
The CLI returns the first matching paired peer and does not reject ambiguous names or prefixes.

The UI lists immutable IDs or fingerprints and warns before applying `full` or `short-circuit`. These commands currently apply the change immediately without a second confirmation step.

---

## 16) Implementation status

| Area | State |
|---|---|
| identity + key storage | implemented; IDs derive from Ed25519 public keys |
| pairing + peer state | implemented with URL ownership proof and operator acceptance |
| signature verification | implemented with versioned canonicalization and nonce replay cache |
| tool policy | implemented; `restricted` uses a denylist and `custom` falls back to it |
| mediated queue | implemented with operator review in `web:default` |
| short-circuit mode | implemented behind global and per-peer gates |
| capacity controls | endpoint rate limits, size/time/tool limits, and execute concurrency implemented; budgets, queue priority, and circuit breakers missing |
| revocation | implemented with trust-epoch checks and best-effort peer notification; key rotation requires re-pairing |
| observability | audit rows implemented; redaction policy, retention cleanup, and alerts missing |

---

## 17) Security checklist

- [x] canonical signature spec implemented and versioned
- [x] nonce replay cache enforced per peer
- [x] pairing acceptance uses request ID; peer revocation uses immutable ID/fingerprint
- [x] URL ownership challenge implemented in pairing
- [x] pair-callback endpoint hardened (validates nonce + request_id against outbound records)
- [x] baseline callback URL checks for scheme, hostname, resolved address, and private ranges
- [x] deterministic tool ceiling: `toolCeilingFilter` constrains initial and dynamically activated tools; `restricted` uses a denylist and deferred `custom` falls back to it
- [x] mediated mode defaults to an operator-reviewed queue with notifications in `web:default`
- [x] short-circuit mode explicit opt-in only
- [ ] daily budgets, local-traffic queue priority, and abuse circuit breakers; endpoint rate limits and execute concurrency caps are implemented
- [x] loop/hop prevention implemented
- [x] trust-epoch revocation checks in request path
- [x] HTTPS required for callbacks by default; `PICLAW_REMOTE_INTEROP_ALLOW_HTTP=1` is an explicit development override
- [ ] audit redaction and retention controls; basic audit rows are implemented

### Remaining work

- add redirect limits and DNS re-resolution at callback connection time
- replace the `restricted` denylist with an explicit allowlist if stronger isolation is required; implement the deferred `custom` profile
- add a dedicated mediated-channel UI or automatic decision workflow if operator review in `web:default` is insufficient
- add daily budgets, local-traffic queue priority, and abuse circuit breakers
- remove or separately gate the explicit HTTP development override if deployments require TLS without exception
- add audit redaction rules, retention cleanup, and alerts
- add a second confirmation step before applying `full` or `short-circuit`

---

## 18) Diagram

See [`cross-instance-ipc-design.svg`](cross-instance-ipc-design.svg).

The diagram reflects the security gates and default mode described here.
