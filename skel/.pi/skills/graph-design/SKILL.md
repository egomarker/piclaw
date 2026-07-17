---
name: graph-design
description: Design, audit, and redraw inline SVG architecture and flow diagrams using source verification and a consistent orthogonal-routing visual language.
distribution: public
---

# Graph Design

Use this skill to create, fix, or audit inline SVG diagrams in source-authored documentation.

It covers Markdown, READMEs, docs pages, workitems, and other files that embed architecture or flow diagrams.

## Scope

Applies to:

- inline SVG diagrams embedded in Markdown or HTML source files
- architecture and flow redraws for docs pages or project summaries
- diagram consistency audits across multiple files
- arrow routing, label placement, spacing, and dark/light behavior
- source verification when diagrams describe a real system

## Non-negotiable routing rule

> **Default to orthogonal arrows.**
> **When an orthogonal arrow turns, the corner must be rounded.**
>
> Do **not** use hard-corner elbow polylines as the default style.
> Do **not** use diagonals unless the diagram genuinely benefits from them.

If the flow is horizontal/vertical, draw it horizontally/vertically.
If the path bends, make it a softened right-angle turn with a consistent radius.

## Canonical workflow

1. Read the source document that owns the diagram.
2. Read upstream docs/repo/README when the diagram represents a real system.
3. Verify the surrounding copy matches reality before drawing.
4. Edit the source Markdown/HTML/SVG block, not generated output.
5. Run the project build/preview command if one exists.
6. Verify the rendered output in its final context.
7. If publishing is in scope, commit/push/tag only after the rendered result is checked.

## Source of truth

- The source document is canonical.
- Generated HTML/site output is a build artifact.
- Do not hand-maintain generated output.
- If the diagram and page text disagree, fix the source first.

## Core principles

### 1. Source accuracy over aesthetics

Do not invent architecture.

When the diagram represents a real system:

- read the upstream source/docs first
- verify components and flow direction
- prefer real boundaries over generic boxes
- confirm nouns like parser, cache, relay, renderer, wrapper, orchestrator, state file, queue, model, or gateway before drawing them

Things that should be source-verified before drawing:

- cloud resource topology
- request/response direction
- storage and state boundaries
- runtime or protocol choices
- generated artifacts and output targets

### 2. Keep diagrams simple

Prefer a small number of boxes with a clear story.

Most good diagrams show only:

- inputs
- the main coordinator/transform
- outputs
- persistent state if it matters
- one or two important protocols

Avoid turning every diagram into a subsystem map.

### 3. Match the surrounding story

The diagram should reinforce the nearby text:

- title/tagline
- summary/about section
- how-it-works description
- key features or constraints

If the diagram implies something the text does not support, either:

- fix the text from source, or
- remove the implication from the diagram

## Visual language

Use the document or site’s established SVG theme if one already exists.

When authoring or normalizing an inline SVG diagram, prefer:

- transparent background
- explicit dark/light support when the host document supports both
- reusable classes for node families and text styles
- shared arrow markers instead of one-off markers per edge

### Suggested class vocabulary

If the source does not already have a house style, these classes work well:

- `.box`
- `.box-accent`
- `.box-green`
- `.box-warm`
- `.box-purple`
- `.label`
- `.sub`

Typical meanings:

- `box-accent`: primary subject / main app / orchestrator
- `box-green`: positive output / running target / success sink
- `box-warm`: input / config / storage / secondary artifact
- `box-purple`: helper state / model / library / internal subsystem
- `box`: neutral node

Consistency matters more than rigid semantics.

## Layout rules

### Preferred shapes

Use rounded rectangles for nodes.

- `rx="8"` is a strong default
- `rx="6"` is also fine
- keep corner radius consistent within a figure

### Preferred flow directions

Prefer one of these structures:

- left → center → right
- top → middle → bottom
- left → center with split outputs to upper-right/lower-right

Avoid zig-zag storytelling unless the system really needs it.

### Spacing

- leave clear gaps between columns/rows
- keep enough vertical separation for labels and arrows
- avoid footer captions colliding with connectors
- widen the viewBox rather than cramming text

### Box sizing

- prefer consistent widths within a column
- give labels enough room to breathe
- split labels into title/subtext rather than shrinking everything

## Text rules

### Label hierarchy

Use:

- `.label` for the main component name
- `.sub` for explanation, protocol, scope, or implementation detail

### Wrap long text manually

SVG does not wrap text well.

Instead:

- split long labels into multiple `<text>` lines
- move secondary detail into `.sub`
- shorten wording where possible

### Keep wording concrete

Prefer concrete nouns like:

- `State file`
- `Local cache`
- `JSON export`
- `PTY session`
- `Reader app`
- `DNS query`

Avoid vague labels like:

- `processor`
- `engine`
- `system`
- `backend magic`

## Required arrow rules

### 1. Arrows must exist when the story is a flow

If the diagram is about movement, requests, transforms, or state updates, arrows are not optional.

Common required flows:

- input → processor
- processor → output
- request → response
- app → state store
- state update downward into a file/store/cache

### 2. Arrows must land on sensible box edges

Start and end arrows on node edges, not empty space.

Prefer:

- horizontal connectors between columns
- vertical connectors between stacked boxes

### 3. **Arrows should be orthogonal**

Default to horizontal and vertical routing.

Use:

- a straight `<line>` for direct horizontal/vertical links
- an orthogonal `<path>` when the route needs a turn

Avoid diagonals unless they clearly improve the story.

### 4. **Orthogonal turns must have rounded corners**

This is a hard rule for normal architecture and flow diagrams.

Do **not** use hard-corner elbow polylines as the default style.
Do **not** leave right-angle corners visually sharp.

Preferred approaches:

- explicit rounded elbow paths using `Q` or arc segments at the turn
- consistent rounded joins that preserve the same orthogonal route

Guidelines:

- use the same corner radius for comparable turns
- keep the radius modest so the route still reads as a right-angle path
- end arrowheads on a final straight segment so direction stays obvious
- do not round so aggressively that the arrow appears to enter the wrong side of a node

### 5. Avoid awkward diagonals and splines

Do not default to freeform curves.

In most documentation diagrams:

- orthogonal routing is clearer than diagonals
- rounded elbows are clearer than spline-heavy curves

### 6. Differentiate important flows when useful

A common convention is:

- accent arrow for the primary request/input path
- neutral arrow for secondary/state/output flow

But consistency beats over-encoding.

### 7. Bidirectional flows should be explicit

If the system is truly request/response, draw both directions.

Examples:

- client request → gateway → target service
- target response → gateway → client

Do not collapse bidirectional behavior into one ambiguous arrow.

## Common diagram patterns

### A. Single transform

Use for exporters, converters, wrappers, or generators.

Pattern:

- input box
- main tool box
- output box(es)

### B. Coordinator plus helper state

Use for apps that maintain a cache, state model, or session state.

Pattern:

- client/frontend
- coordinator/server
- helper state below or beside it
- runtime target on the right

### C. One source, multiple outputs

Use when a tool emits multiple artifacts or execution targets.

Pattern:

- source on the left
- tool or model group in the center
- multiple output targets on the right

### D. Request/response bridge

Use for relays, gateways, resolvers, and proxies.

Pattern:

- source on the left
- bridge in the middle
- destination on the right
- top arrows for requests, bottom arrows for responses

## Known pitfalls

### Do not bulk-rewrite blindly

Large SVG rewrites often break:

- markers
- path routing
- text alignment
- tag validity

For bulk edits:

- rebuild afterward
- inspect final rendered output
- spot-check more than one page
- prefer incremental edits when semantics matter

### Do not trust automated layout alone

Automation can help normalize spacing, but it often:

- drops arrows
- creates awkward routes
- preserves the wrong semantics
- emits hard-corner orthogonal connectors

Manual review is required.

### Do not imply nonexistent components

Avoid inventing:

- parser/cache layers that are not real
- runtimes that are not used
- stale protocol names
- outputs that do not exist

### Do not preserve a bad old diagram just because it already exists

If the old diagram is wrong, redraw from source.

## Audit checklist

When reviewing an existing diagram, check:

- Does it match the surrounding copy?
- Does it match upstream docs/source?
- Are arrows present where flow requires them?
- Do arrows terminate on node edges?
- Are arrows **orthogonal by default**?
- Are orthogonal turns **rounded, not hard-cornered**?
- Are labels readable at normal width?
- Does any text need manual wrapping?
- Are dark/light styles still intact?
- Does the rendered output still contain the intended SVG?

## Verification

After editing:

1. run the project’s build/preview command if available
2. open the rendered output where users will actually see it
3. inspect arrowheads, rounded turns, labels, and theme behavior
4. confirm the source document is still the only maintained copy

## Related guidance

If the workspace also includes visual-generation guidance, follow it alongside this skill:

- `visual-artifact-generator` for rendering workflow and output format choices
- `visual-design` for palette, typography, spacing, and diagram polish
