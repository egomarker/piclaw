/**
 * live-preview.ts — Core cursor-aware decoration engine for Markdown live preview.
 *
 * Walks the visible syntax tree and applies decorations to Markdown nodes.
 * When the cursor is inside a node's line, that node shows raw Markdown.
 * When the cursor is elsewhere, formatting marks are hidden and content
 * is rendered with visual styles.
 *
 * Each Markdown feature registers a "decorator" function that receives
 * a syntax node and returns decorations. The engine orchestrates calling
 * them and managing the cursor-aware visibility logic.
 */
import {
    EditorView,
    Decoration,
    ViewPlugin,
    WidgetType,
    RangeSet,
    syntaxTree,
} from '#editor-vendor/codemirror';
import type { DecorationSet, ViewUpdate } from '@codemirror/view';
import type { Range } from '@codemirror/state';
import type { SyntaxNode } from '@lezer/common';
import { isAlwaysDecoratedNode, usesBlockCursorGate } from './cursor-gating.js';

// ── Types ───────────────────────────────────────────────────────

export interface DecorationEntry {
    from: number;
    to: number;
    decoration: Decoration;
}

/**
 * A decorator function receives a node and the document text,
 * and returns decorations to apply when the cursor is NOT on that line.
 */
export type NodeDecorator = (
    node: SyntaxNode,
    view: EditorView,
) => DecorationEntry[];

// ── Decorator registry ──────────────────────────────────────────

const decorators = new Map<string, NodeDecorator>();

/**
 * Register a decorator for a specific lezer node type name.
 */
export function registerDecorator(nodeType: string, decorator: NodeDecorator): void {
    decorators.set(nodeType, decorator);
}

// ── Utility: check if cursor is in a range ──────────────────────

export function cursorInRange(view: EditorView, from: number, to: number): boolean {
    const sel = view.state.selection;
    for (const range of sel.ranges) {
        if (range.head >= from && range.head <= to) return true;
        const selFrom = Math.min(range.anchor, range.head);
        const selTo = Math.max(range.anchor, range.head);
        if (selFrom <= to && selTo >= from) return true;
    }
    return false;
}

// ── ViewPlugin ──────────────────────────────────────────────────

export function getSelectionLineSignature(view: Pick<EditorView, 'state'>): string {
    const doc = view.state.doc;
    return view.state.selection.ranges
        .map((range) => {
            const anchor = Math.max(0, Math.min(range.anchor, doc.length));
            const head = Math.max(0, Math.min(range.head, doc.length));
            return `${doc.lineAt(anchor).from}:${doc.lineAt(head).from}`;
        })
        .join('|');
}

const LIVE_PREVIEW_DEBOUNCE_MS = 300;

class LivePreviewPlugin {
    decorations: DecorationSet;
    private selectionLineSignature: string;
    private rebuildTimer: ReturnType<typeof setTimeout> | null = null;
    private view: EditorView;

    constructor(view: EditorView) {
        this.view = view;
        this.selectionLineSignature = getSelectionLineSignature(view);
        this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) {
        this.view = update.view;
        const nextSelectionLineSignature = getSelectionLineSignature(update.view);
        const selectionLineChanged = nextSelectionLineSignature !== this.selectionLineSignature;
        this.selectionLineSignature = nextSelectionLineSignature;

        const needsRebuild =
            update.docChanged ||
            update.viewportChanged ||
            (update.selectionSet && selectionLineChanged);

        if (!needsRebuild) return;

        if (update.docChanged) {
            // During typing: debounce the expensive rebuild.
            // Return stale decorations for this frame — rebuild after idle.
            if (this.rebuildTimer !== null) clearTimeout(this.rebuildTimer);
            this.rebuildTimer = setTimeout(() => {
                this.rebuildTimer = null;
                this.decorations = this.buildDecorations(this.view);
                // Force CM to pick up the new decorations
                this.view.dispatch({ effects: [] });
            }, LIVE_PREVIEW_DEBOUNCE_MS);
        } else {
            // Viewport/selection changes: rebuild immediately (no typing lag)
            if (this.rebuildTimer !== null) { clearTimeout(this.rebuildTimer); this.rebuildTimer = null; }
            this.decorations = this.buildDecorations(update.view);
        }
    }

    destroy() {
        if (this.rebuildTimer !== null) { clearTimeout(this.rebuildTimer); this.rebuildTimer = null; }
    }

    private buildDecorations(view: EditorView): DecorationSet {
        const tree = syntaxTree(view.state);
        const entries: DecorationEntry[] = [];
        const doc = view.state.doc;
        const cursorHead = view.state.selection.main.head;
        const cursorLine = doc.lineAt(cursorHead);

        for (const { from, to } of view.visibleRanges) {
            tree.iterate({
                from,
                to,
                enter(node) {
                    const nodeTypeName = node.type.name;
                    const decorator = decorators.get(nodeTypeName);
                    if (!decorator) return;

                    const isFrontmatter = nodeTypeName === 'FrontMatter';
                    const isBlock = usesBlockCursorGate(nodeTypeName);
                    const alwaysDecorate = isAlwaysDecoratedNode(nodeTypeName);

                    if (!isFrontmatter && !alwaysDecorate) {
                        if (isBlock) {
                            // For block nodes: check if cursor's LINE is inside the block.
                            // Use line-level granularity so only the active line shows raw MD,
                            // not the entire multi-line block.
                            if (cursorLine.from >= node.from && cursorLine.from <= node.to) {
                                return;
                            }
                        } else {
                            // For inline nodes: check if cursor is on the same line.
                            const checkFrom = doc.lineAt(node.from).from;
                            const safeTo = Math.max(node.from, Math.min(node.to, doc.length));
                            const checkTo = doc.lineAt(safeTo).to;
                            if (cursorInRange(view, checkFrom, checkTo)) return;
                        }
                    }

                    const decos = decorator(node.node, view);
                    entries.push(...decos);

                    // Code-font: add line decorations for code block lines
                    // (merged from code-font.ts to avoid a second tree walk)
                    if (nodeTypeName === 'FencedCode' || nodeTypeName === 'CodeBlock') {
                        const startLine = doc.lineAt(node.from).number;
                        const endPos = Math.max(node.from, Math.min(node.to, doc.length) - 1);
                        const endLine = doc.lineAt(endPos).number;
                        for (let ln = startLine; ln <= endLine; ln++) {
                            const line = doc.line(ln);
                            entries.push({
                                from: line.from,
                                to: line.from,
                                decoration: Decoration.line({ class: 'cm-md-code-raw-line' }),
                            });
                        }
                    }
                },
            });
        }

        // Convert entries to Range<Decoration> and use RangeSet.of()
        // which handles sorting automatically (unlike RangeSetBuilder).
        const ranges: Range<Decoration>[] = [];
        for (const entry of entries) {
            if (entry.from > entry.to) continue; // skip invalid (but allow point decos: from === to)
            try {
                if (entry.from === entry.to) {
                    // Point decoration (e.g. Decoration.line())
                    ranges.push(entry.decoration.range(entry.from));
                } else {
                    ranges.push(entry.decoration.range(entry.from, entry.to));
                }
            } catch (error) {
                console.warn('[editor/live-preview] skipped invalid decoration range', {
                    from: entry.from,
                    to: entry.to,
                    error: error instanceof Error ? error.message : String(error || 'Unknown error'),
                });
            }
        }

        return RangeSet.of(ranges, true);
    }
}

/**
 * The ViewPlugin for live preview. Import and add to extensions array.
 */
export const livePreviewPlugin = ViewPlugin.fromClass(LivePreviewPlugin, {
    decorations: (v) => v.decorations,
});

// ── Re-exports for decorator implementations ───────────────────

export { Decoration, WidgetType };
export type { EditorView, SyntaxNode };
