---
name: adaptive-cards-authoring
description: Author Adaptive Cards for the current PiClaw web environment. Use when you need a prompt pattern, supported payload shape, or reusable card templates for structured web interactions.
distribution: public
---

# Adaptive Cards Authoring

Use this skill when a **web-only, structured interaction** is clearer as a card than as plain markdown.

## Good fits

- approval / reject / revise flows
- choosing one of a few next actions
- short structured data capture
- persistent status or completion receipts
- link collections where explicit buttons are clearer than inline links

Avoid cards when markdown is clearer, the interaction is long-form, or the action semantics are not supported.

## PiClaw payload shape

Emit a normal message with a concise fallback plus one `adaptive_card` content block:

```json
{
  "type": "adaptive_card",
  "card_id": "approval-123",
  "schema_version": "1.5",
  "state": "active",
  "fallback_text": "Approval requested.",
  "payload": {
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [
      { "type": "TextBlock", "text": "Approval requested", "weight": "Bolder", "size": "Medium" }
    ],
    "actions": [
      { "type": "Action.Submit", "title": "Approve", "data": { "decision": "approve" } }
    ]
  }
}
```

PiClaw currently supports:

- timeline rendering via `content_blocks`
- actions: `Action.Submit`, `Action.OpenUrl`
- states: `active`, `completed`, `cancelled`, `failed`
- agent-owned posting via `send_adaptive_card`

Do **not** rely on `Action.ShowCard`, `Action.ToggleVisibility`, complex refresh/auth flows, or non-web card delivery unless you are explicitly extending core support.

## Authoring rules

1. Keep `schema_version` / `payload.version` at `1.5` unless there is a specific reason otherwise.
2. Keep `content` and `fallback_text` short and human-readable.
3. Prefer simple primitives: `TextBlock`, `FactSet`, `Input.*`, `ChoiceSet`, `Toggle`.
4. Keep button labels short and explicit.
5. Use `Action.Submit` for structured decisions and `Action.OpenUrl` for external links.
6. Keep submission payloads small, flat, and readable.
7. Assume cards are web-only unless you also provide a graceful markdown fallback.
8. Prefer one clear card over a dense wall of controls.
9. Keep critical meaning visible in the fallback message too.

## Prompt pattern

```text
Use an Adaptive Card for this response because the interaction is structured and web-only.

Constraints:
- Target the current PiClaw web runtime
- Emit a concise fallback message plus one adaptive_card content block
- Use schema version 1.5
- Only use supported actions: Action.Submit and/or Action.OpenUrl
- Keep the card compact and readable in a narrow pane
- Keep submission payloads small and explicit
- If a card would be worse than markdown, say so and return markdown instead

Task:
<describe the approval / choice / form interaction>
```

For more deterministic output, ask for:

1. a fallback message string
2. exactly one `adaptive_card` content block JSON object

## Templates and implementation notes

- Reuse `templates.md` for concrete card patterns instead of inventing ad hoc ones.
- If you are implementing card emission in PiClaw itself, prefer `send_adaptive_card`.
- If you need low-level posting, use message `content_blocks` or `messages` with `action: "post"`.
