# PiClaw Adaptive Card Templates

These templates target the current PiClaw web runtime.

All examples assume:
- `schema_version: "1.5"`
- top-level block `type: "adaptive_card"`
- `state: "active"` unless noted otherwise
- a short matching fallback message

---

## 1. Approval card

### Best for
- approve / reject / revise
- simple gating decision
- persistent decision UI in the timeline

### Fallback message

```text
Approval requested.
```

### Content block

```json
{
  "type": "adaptive_card",
  "card_id": "approval-request",
  "schema_version": "1.5",
  "state": "active",
  "fallback_text": "Approval requested.",
  "payload": {
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [
      {
        "type": "TextBlock",
        "text": "Approval requested",
        "weight": "Bolder",
        "size": "Medium"
      },
      {
        "type": "TextBlock",
        "text": "Choose how to proceed.",
        "wrap": true
      },
      {
        "type": "FactSet",
        "facts": [
          { "title": "Change", "value": "Deploy queued fixes" },
          { "title": "Impact", "value": "Web UI only" }
        ]
      }
    ],
    "actions": [
      { "type": "Action.Submit", "title": "Approve", "data": { "decision": "approve" } },
      { "type": "Action.Submit", "title": "Reject", "data": { "decision": "reject" } },
      { "type": "Action.Submit", "title": "Revise", "data": { "decision": "revise" } }
    ]
  }
}
```

---

## 2. Choice card

### Best for
- choosing one of a few options
- collecting a small structured decision

### Fallback message

```text
Choose the next action.
```

### Content block

```json
{
  "type": "adaptive_card",
  "card_id": "next-action-choice",
  "schema_version": "1.5",
  "state": "active",
  "fallback_text": "Choose the next action.",
  "payload": {
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [
      {
        "type": "TextBlock",
        "text": "Choose the next action",
        "weight": "Bolder",
        "size": "Medium"
      },
      {
        "type": "Input.ChoiceSet",
        "id": "next_action",
        "label": "Action",
        "style": "expanded",
        "choices": [
          { "title": "Ship now", "value": "ship" },
          { "title": "Review first", "value": "review" },
          { "title": "Create ticket", "value": "ticket" }
        ]
      }
    ],
    "actions": [
      { "type": "Action.Submit", "title": "Submit", "data": { "kind": "next-action" } }
    ]
  }
}
```

---

## 3. Link card

### Best for
- a compact set of important links
- explicit operator actions like docs / release / dashboard

### Fallback message

```text
Relevant links.
```

### Content block

```json
{
  "type": "adaptive_card",
  "card_id": "relevant-links",
  "schema_version": "1.5",
  "state": "active",
  "fallback_text": "Relevant links.",
  "payload": {
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [
      {
        "type": "TextBlock",
        "text": "Relevant links",
        "weight": "Bolder",
        "size": "Medium"
      },
      {
        "type": "TextBlock",
        "text": "Open one of the linked resources.",
        "wrap": true
      }
    ],
    "actions": [
      { "type": "Action.OpenUrl", "title": "Release", "url": "https://github.com/rcarmo/piclaw/releases" },
      { "type": "Action.OpenUrl", "title": "Docs", "url": "https://github.com/rcarmo/piclaw" }
    ]
  }
}
```

---

## 4. Status / receipt card

### Best for
- completion receipts
- a compact structured result summary
- persistent status that should be easier to scan than markdown

### Fallback message

```text
Operation completed.
```

### Content block

```json
{
  "type": "adaptive_card",
  "card_id": "operation-completed",
  "schema_version": "1.5",
  "state": "completed",
  "completed_at": "2026-03-15T12:00:00.000Z",
  "last_submission": {
    "title": "Acknowledge",
    "data": { "status": "completed" }
  },
  "fallback_text": "Operation completed.",
  "payload": {
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [
      {
        "type": "TextBlock",
        "text": "Operation completed",
        "weight": "Bolder",
        "size": "Medium"
      },
      {
        "type": "FactSet",
        "facts": [
          { "title": "Status", "value": "Success" },
          { "title": "Scope", "value": "Web UI" },
          { "title": "Tests", "value": "Passed" }
        ]
      }
    ]
  }
}
```

---

## 5. Keep-active form card

### Best for
- iterative forms
- repeated submissions without immediately locking the card

### Fallback message

```text
Provide the requested values.
```

### Content block

```json
{
  "type": "adaptive_card",
  "card_id": "iterative-form",
  "schema_version": "1.5",
  "state": "active",
  "submit_behavior": "keep_active",
  "fallback_text": "Provide the requested values.",
  "payload": {
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [
      {
        "type": "TextBlock",
        "text": "Provide the requested values",
        "weight": "Bolder",
        "size": "Medium"
      },
      {
        "type": "Input.Text",
        "id": "title",
        "label": "Title",
        "placeholder": "Short label"
      },
      {
        "type": "Input.Toggle",
        "id": "confirm",
        "title": "Keep card active after submit",
        "value": "yes"
      }
    ],
    "actions": [
      { "type": "Action.Submit", "title": "Save", "data": { "kind": "iterative-form" } }
    ]
  }
}
```

---

## Recommended prompt shortcuts

### Ask for an approval card

```text
Return a PiClaw-compatible approval Adaptive Card for the web UI.
Use one concise fallback message and one adaptive_card content block.
Keep it compact, use schema_version 1.5, and only use Action.Submit.
```

### Ask for a choice card

```text
Return a PiClaw-compatible choice Adaptive Card for the web UI.
Use a single ChoiceSet plus one submit action.
Keep the submission payload flat and explicit.
```

### Ask for a link card

```text
Return a PiClaw-compatible link Adaptive Card for the web UI.
Use Action.OpenUrl buttons only, with a concise fallback message.
```

---

## Authoring notes

- Keep card IDs descriptive and stable within the current interaction.
- Keep fallback text short and human-readable.
- Prefer simple bodies and few actions.
- If markdown is clearer, use markdown instead of a card.
