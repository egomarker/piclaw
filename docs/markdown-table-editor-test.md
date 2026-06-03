# Markdown Table Editor Test Page

Use this page to manually exercise the normalized WYSIWYG table editor prototype.

Checklist:

- Edit a cell and confirm Markdown source normalizes.
- Use Tab / Shift-Tab to move between cells.
- Use `+ row` / `- row` and `+ col` / `- col` toolbar buttons.
- Use `←` / `↔` / `→` to change active column alignment.
- Right-click a cell and use the context menu for the same row/column/alignment actions.
- Use Shift-Tab to move backward and Tab from the final cell to append a row.
- Paste multi-line text into the middle of a cell and confirm it flattens to one line without moving the caret unexpectedly.
- Type a literal `|` in the middle of a cell and confirm it serializes as `\\|`.
- Try accented/IME composition input and confirm serialization only happens after composition completes.

## Basic table

| Name | Count | Notes |
| --- | ---: | :--- |
| Alpha | 10 | plain cell |
| Beta | 20 | contains escaped pipe: a\|b |
| Gamma | 30 | edit me |

## Adjacent paragraph

Backspace at the table boundary should select the whole table before destructive deletion.

## Empty cells and uneven rows

| Key | Value | Extra |
| --- | --- | --- |
| empty |  | kept |
| short | only two |
| long | middle | tail |

## Typing helpers nearby

- [ ] Task item
- [x] Done item

```ts
const tableEditor = true;
```
