---
title: Atomic live-preview parity
tags: [piclaw, editor, atomic-port]
status: draft
---

# H1 Heading Fold Target

Intro paragraph with **bold**, _italic_, ~~strike~~, `inline code`, #tag, and [safe link](https://example.com "Example").

## H2 Child Heading

> [!warning]- Collapsed warning
> Body line hidden when collapsed but editable when active.
> - [ ] Nested task inside callout

> Regular blockquote
> with continuation and **strong text**.

![Alt image](https://example.com/image.png "Image title")

```ts
export function demo(value: string) {
  return value.toUpperCase();
}
```

| Left | Center | Right |
|:-----|:------:|------:|
| a    | b      | c     |
| pipe | x \| y | z     |

Footnote reference[^note] and unresolved reference[^missing].

[^note]: Footnote definition with back-reference.

---

### Long/viewport sentinel

This section is used by browser tests to scroll into late parsed content on tablet/mobile viewports.
