# Web notification delivery policy

PiClaw uses a per-**device**, per-**chat** delivery coordinator to choose between a local in-page notification and server-side Web Push for a finished agent reply.

## Rule

For a given **browser profile + chat_jid** pair, with notifications enabled:

- **The reply's chat is visible** → **no notification** in that browser profile.
- **The reply's chat is not visible and there is a stored subscription** → **Web Push only**, whether the chat is hidden, open in another tab, or closed.
- **The reply's chat is not visible and there is no stored subscription** → **local notification** if a live tab for that chat receives the reply and can show browser notifications.

The rule is the same on iPad and desktop. Browser visibility and the stored subscription determine the route, not the user agent.

## Why routing uses `chat_jid`

PiClaw can have multiple chats running at once. A user may be actively viewing one thread while other threads continue working in the background.

Notification routing keys off the specific `chat_jid` that produced the reply:

- If you are actively viewing chat **A**, replies in chat **A** should stay quiet on that device.
- If chat **B** finishes while no live client for **B** exists on that device, PiClaw should still notify you for **B** even if chat **A** is currently visible.

Replies from non-active threads still notify on that device.

## Local notification election

Multiple hidden tabs or windows on the same device can still be live for the same chat. To avoid duplicate local notifications, the client elects exactly one hidden tab/window per **device + chat** to show the local notification.

If any tab/window for that same chat is visible, hidden tabs stay silent. The elected tab shows an alert only if the server confirms there is no stored subscription for its browser profile. If that status is unknown, the tab stays silent rather than risk duplicating a push in flight.

## Web Push suppression

A Web Push subscription's device ID identifies the browser profile. The server suppresses Web Push only if that profile has recent **visible** presence for the reply's `chat_jid`. Hidden tabs never block Web Push; a tab showing another chat does not block it either.

## Presence model

The client publishes lightweight presence updates containing:

- `device_id`
- `client_id`
- `chat_jid`
- `visibility_state`
- `has_focus`

Presence is refreshed periodically and expires quickly if the page disappears without clean shutdown.

## Notification title debug labels

By default, PiClaw does **not** append source markers like `[Local]` or `[Web Push]` to notification titles.

If you want those markers while debugging delivery behavior, set:

- `PICLAW_WEB_NOTIFICATION_DEBUG_LABELS=1`

When enabled, local browser notifications and service-worker Web Push notifications both append the source label to the notification title.

## Server-side Web Push diagnostics

Set [`domains.web.pushDeliveryDiagnostics`](configuration.md#web-push-delivery-diagnostics) to `true` and restart to log reply Web Push outcomes at `info` level (`operation: "web.push.reply_delivery"`). This is off by default and independent of title labels.

- `skipped`: no send was attempted. The reason can distinguish a visible same-chat client, a circuit breaker, and other dispatch skips.
- `failed`: PiClaw could not send, or the relay returned an HTTP error. The record includes the status and an allowlisted relay error code (for example, `403` / `BadJwtToken`) when available, or a category such as `timeout` or `network_error`.
- `accepted`: the relay accepted the request. For example, Apple HTTP `201` does **not** confirm service-worker receipt or that the notification appeared on the device.

Records include the stored reply ID and, for per-subscription outcomes, a relay category. They do not contain message text, subscription URLs or keys, device IDs, or user agents.

## Practical examples

### Phone visible on chat A, chat B finishes

- chat A is visible on the phone
- no live phone client exists for chat B
- result: **Web Push may still fire for chat B**

### Subscribed laptop and iPad both hide chat A, chat A finishes

- result: **Web Push only** on both. Neither device depends on its hidden tab continuing to run.

### Two hidden tabs for chat A on the same laptop without a subscription

- both are live, neither is visible
- result: exactly **one** hidden tab shows the local notification
