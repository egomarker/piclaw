# UX bug regression catalog

Extracted from 198 `fix(web/editor/vnc/css/zen)` commits since March 2026. Each entry maps a commit message to a testable regression scenario. Convert these scenarios to Gherkin after the user story interview.

## Compose & Queue

| Bug | Regression scenario |
|-----|---------------------|
| Cursor rollback on already-processing errors | User sends while agent is processing; cursor should NOT jump back |
| Queue cancel button steered instead of removing | Cancel should remove from queue, not steer the agent |
| Stop button too small / wrong theme | Stop button must be visible and themed as danger/warning |
| Queue state overwrite by stale SSE | Queue display must survive SSE reconnect without flickering |
| Slash typeahead best match by prefix | `/mod` should highlight `/model`, not `/modify` |
| Keep send button on the right | Send button must always be rightmost in compose |
| Allow pulling back steering queue items | User can edit a queued message before it's delivered |
| Mobile compose jumps | Compose box stable on iOS keyboard open/close |

## Timeline & Rendering

| Bug | Regression scenario |
|-----|---------------------|
| Cross-session timeline merge on switch | Switching sessions must show only target session messages |
| Double timeline render from duplicate import | Timeline renders exactly once on load |
| BodyPortal DOM multiplication | Settings/popovers do not duplicate DOM nodes |
| First-column collapse in markdown tables | All table columns render with minimum width |
| Bunched table columns | Tables use display:table layout |
| Code copy control position | Copy button pinned to code block corner |
| External links open in new tab | href to external domain → target="_blank" |
| Outcome pills render after timestamps | Outcome pill positioned after the timestamp, not before |

## Session Management

| Bug | Regression scenario |
|-----|---------------------|
| Block session swipe on message content | Horizontal swipe on message text does NOT switch session |
| Exclude Apple Pencil from swipe | Pen input ignored for navigation gestures |
| Session popup focus on current | Opening session list highlights active session |
| Sort archived sessions separately | Archived sessions appear below active ones |
| Alphabetical sort, active first | Sessions sorted A-Z with current session at top |
| Allow archiving non-default root | Archive button available on non-default sessions |
| Session name broadcast via SSE | Rename propagates to all connected clients |

## Settings Dialog

| Bug | Regression scenario |
|-----|---------------------|
| Open race (multiple attempts) | Rapid Cmd+, presses open exactly one dialog |
| Lazy load timing | Settings shows loading shell, then content. No blank frame. |
| Second+ open instant (cached) | Closing and reopening settings is instant |
| Stepper field accepts typed numbers | User can type "128000" in number field, not just click arrows |
| General settings auto-save | Changing a field persists without explicit save button |

## Editor

| Bug | Regression scenario |
|-----|---------------------|
| Editor flicker on deps change | Switching files does not cause visible flicker |
| Preview flicker + splitter | Markdown preview stable during resize |
| Confirm before closing dirty tabs | Closing unsaved tab shows confirmation |
| Stale "Loading" text | Editor never shows Loading after file is rendered |
| Activate tabs on press | Clicking a tab activates it immediately (not on release) |

## Panes & Popouts

| Bug | Regression scenario |
|-----|---------------------|
| VNC iPad touch stuck | Touch/pen input does not get stuck on iPad |
| Popout handoff retry | Failed popout recovers automatically |
| Terminal reattach on return | Returning from popout shows terminal content |
| Preserve editor state in popout | Editor cursor/scroll preserved across popout |
| Viewer pane stability | Opening office/HTML viewers does not crash pane system |

## SSE & Reconnect

| Bug | Regression scenario |
|-----|---------------------|
| iOS resume SSE reconnect | Backgrounding then foregrounding reconnects within 5s |
| Delta resync after reconnect | Messages sent during disconnect appear after reconnect |
| Auto-reload cascades disabled | Version drift shows notice, does NOT auto-reload in loop |
| Active status restored on reconnect | Agent status indicator correct after reconnect |

## Favicon / Branding

| Bug | Regression scenario |
|-----|---------------------|
| Safari WebP favicon not supported | Favicon renders as PNG in Safari |
| Favicon cache bypass | Changing avatar updates favicon without hard refresh |

## Mobile / iPad

| Bug | Regression scenario |
|-----|---------------------|
| Apple Pencil excluded from swipe | Pencil strokes don't trigger navigation |
| iOS webapp voice fallback | Speech input works in PWA mode |
| Force SSE reconnect on iOS resume | App recovers from iOS background |
| Session swipe restored on iPad | Finger swipe works for session switching (not blocked by content) |
