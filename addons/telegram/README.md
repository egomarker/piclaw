# Telegram add-on

Telegram Bot API transport for Piclaw.

## Scope

- allowlisted 1:1 chats only
- no groups
- no forum topics
- inbound: text, photo, document
- outbound: text, image, file

## Local dev install

From the target workspace:

```sh
cd /workspace/.pi/extensions
bun add file:/workspace/piclaw/addons/telegram
```

Then restart Piclaw.

## Configuration

Use the **Settings → Telegram** pane after the add-on is installed, or set env vars:

- `PICLAW_TELEGRAM_ENABLED`
- `PICLAW_TELEGRAM_BOT_TOKEN`
- `PICLAW_TELEGRAM_ALLOWED_CHAT_IDS`
- `PICLAW_TELEGRAM_TRIGGER_MODE`
- `PICLAW_TELEGRAM_UNAUTHORIZED_MODE`
- `PICLAW_TELEGRAM_POLLING_TIMEOUT`

`PICLAW_TELEGRAM_ALLOWED_CHAT_IDS` accepts comma- or newline-separated chat IDs.

## Trigger modes

- `always`
- `mention_or_command`

## Unauthorized modes

- `reply_not_authorized`
- `ignore`
