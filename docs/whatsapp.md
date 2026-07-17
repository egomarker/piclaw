# WhatsApp integration

The web UI is the primary interface. WhatsApp is an **opt-in secondary channel** for chat-style access from mobile devices. It shares the same agent pool, SQLite store, and session state as the web UI.

## Prerequisites

- A WhatsApp account you can scan a QR code or request a pairing code from
- `PICLAW_WHATSAPP_ENABLED=1` (or `WHATSAPP_ENABLED=1`) to explicitly opt in
- `WHATSAPP_PHONE`/`PICLAW_WHATSAPP_PHONE` set to your international number (no `+` or spaces)
- Piclaw accessible with persistent storage (the Baileys session is stored in
  `/workspace/.piclaw/data/sessions/`)

## Enabling

Set explicit enablement plus your phone number as environment variables:

```bash
PICLAW_WHATSAPP_ENABLED=1
PICLAW_WHATSAPP_PHONE=1234567890
```

Or in `/workspace/.piclaw/config.json`:

```json
{
  "whatsapp": {
    "enabled": true,
    "phoneNumber": "1234567890"
  }
}
```

A legacy top-level `whatsappPhone` value is still read, but it no longer enables
WhatsApp by itself. If `PICLAW_WHATSAPP_ENABLED`/`WHATSAPP_ENABLED` is not set
(or config `whatsapp.enabled` is not `true`), Piclaw skips all WhatsApp
connection attempts. A no-op stub is used internally so the web UI and other
channels work normally without reconnect noise.

## Pairing

On first start with a phone number configured, Piclaw will request a pairing code
and log it. Enter the code in WhatsApp → Settings → Linked devices → Link with
phone number.

You can also scan a QR code if Piclaw logs one instead.

```bash
docker logs piclaw | grep -E 'QR|pairing'
```

## Triggering the agent

Piclaw only responds when the trigger name appears at the start of a message:

```
@PiClaw what is the weather today?
```

The trigger name matches `assistantName` in config. To set a custom name:

```json
{
  "assistant": {
    "assistantName": "PiClaw"
  }
}
```

Or via environment variable:

```bash
PICLAW_ASSISTANT_NAME=MyBot
```

## Session persistence

WhatsApp state (auth keys, session identifiers) is stored via the Baileys library
in `/workspace/.piclaw/data/` as part of Piclaw's normal persistent data. Reconnects
after a container restart usually work without re-scanning.

If you need to reset the WhatsApp session:

```bash
rm -rf /workspace/.piclaw/data/sessions/whatsapp*
```

Then restart Piclaw and pair again.

## Limitations

- WhatsApp is a secondary channel. Complex web-only features (file upload, Adaptive
  Cards, timeline widgets, draw.io, VNC) are not available over WhatsApp.
- Messages sent from the Piclaw WhatsApp account on other devices may be reflected
  into the agent context depending on the Baileys version.
- Rate-limiting and WhatsApp ToS apply. Do not use high-frequency automation flows
  over this channel.
- The WhatsApp channel is not compatible with suspendable or serverless hosting
  targets because Baileys requires a persistent long-lived connection.

## Disabling

Leave `PICLAW_WHATSAPP_ENABLED`/`WHATSAPP_ENABLED` unset or set it to `0`/`false`.
The Baileys-backed channel module is lazy-loaded only after explicit enablement,
so default web-first installs skip the WhatsApp startup/import cost.

## See also

- [Architecture](architecture.md) — how WhatsApp shares the agent pool with the web UI
- [Runtime flows](runtime-flows.md) — message routing and turn state machine
- [Configuration](configuration.md) — full environment variable reference
