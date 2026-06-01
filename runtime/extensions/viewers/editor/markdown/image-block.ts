import {
    Decoration,
    EditorView,
    StateField,
    WidgetType,
    ensureSyntaxTree,
    syntaxTree,
} from '#editor-vendor/codemirror';
import type { DecorationSet, Extension, Range, Transaction } from '#editor-vendor/codemirror';
import type { SyntaxNode } from '@lezer/common';
import { normalizeLinkHref } from './link.js';
import { treeGrowthEffect, treeProgressPlugin } from './tree-progress.js';

const imageDimensionCache = new Map<string, { width: number; height: number }>();

export function parseMarkdownImageSource(raw: string): { alt: string; url: string } | null {
    const match = raw.match(/^!\[([^\]]*)\]\(([^\s)"']+)(?:\s+["'][^)]*["'])?\)$/);
    if (!match) return null;
    const [, alt, url] = match;
    if (!url) return null;
    return { alt, url };
}

class ImageBlockWidget extends WidgetType {
    constructor(readonly url: string, readonly alt: string) {
        super();
    }

    eq(other: ImageBlockWidget): boolean {
        return this.url === other.url && this.alt === other.alt;
    }

    toDOM(view: EditorView): HTMLElement {
        const wrapper = document.createElement('figure');
        wrapper.className = 'cm-md-image-wrap cm-md-image-block';

        const img = document.createElement('img');
        img.className = 'cm-md-image';
        img.alt = this.alt;
        img.loading = 'lazy';
        img.decoding = 'async';

        const href = normalizeLinkHref(this.url);
        if (href) {
            img.src = href;
            const cached = imageDimensionCache.get(href);
            if (cached) {
                img.width = cached.width;
                img.height = cached.height;
            } else {
                img.addEventListener('load', () => {
                    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        imageDimensionCache.set(href, {
                            width: img.naturalWidth,
                            height: img.naturalHeight,
                        });
                    }
                });
            }
        } else {
            img.removeAttribute('src');
            img.classList.add('cm-md-image-invalid');
        }

        img.addEventListener('mousedown', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const pos = view.posAtDOM(wrapper);
            if (pos < 0) return;
            view.focus();
            view.dispatch({ selection: { anchor: Math.max(0, pos - 1) }, scrollIntoView: false });
        });
        img.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!href) return;
            window.open(href, '_blank', 'noopener,noreferrer');
        });
        img.onerror = () => {
            img.remove();
            const fallback = document.createElement('span');
            fallback.className = 'cm-md-image-fallback';
            fallback.textContent = this.alt ? `[Image: ${this.alt}]` : '[Image unavailable]';
            wrapper.appendChild(fallback);
        };

        wrapper.appendChild(img);

        if (this.alt.trim()) {
            const caption = document.createElement('figcaption');
            caption.className = 'cm-md-image-caption';
            caption.textContent = this.alt;
            wrapper.appendChild(caption);
        }

        return wrapper;
    }

    ignoreEvent(event: Event): boolean {
        return event.type === 'mousedown' || event.type === 'click';
    }
}

function imageIsInsideTable(node: SyntaxNode): boolean {
    for (let parent = node.parent; parent; parent = parent.parent) {
        if (parent.name === 'Table') return true;
    }
    return false;
}

function buildImageBlocks(state: any): DecorationSet {
    const ranges: Range<Decoration>[] = [];
    const tree = ensureSyntaxTree(state, state.doc.length, 120) ?? syntaxTree(state);

    tree.iterate({
        enter(node) {
            if (node.name !== 'Image') return;
            if (imageIsInsideTable(node.node)) return;

            const parsed = parseMarkdownImageSource(state.doc.sliceString(node.from, node.to));
            if (!parsed) return;

            const line = state.doc.lineAt(node.from);
            ranges.push(Decoration.widget({
                widget: new ImageBlockWidget(parsed.url, parsed.alt),
                block: true,
                side: 1,
            }).range(line.to));
        },
    });

    return Decoration.set(ranges, true);
}

function changeAffectsImages(transaction: Transaction, existing: DecorationSet): boolean {
    let affected = false;
    transaction.changes.iterChanges((fromA, toA) => {
        if (affected) return;
        existing.between(fromA, toA, () => {
            affected = true;
            return false;
        });
    });
    if (affected) return true;

    transaction.changes.iterChanges((_fromA, _toA, fromB, toB) => {
        if (affected) return;
        const startLine = transaction.state.doc.lineAt(fromB);
        const endLine = toB > startLine.to ? transaction.state.doc.lineAt(toB) : startLine;
        for (let lineNo = startLine.number; lineNo <= endLine.number; lineNo++) {
            if (transaction.state.doc.line(lineNo).text.includes('![')) {
                affected = true;
                break;
            }
        }
    });

    return affected;
}

const imageBlockField = StateField.define<DecorationSet>({
    create: (state) => buildImageBlocks(state),
    update(decorations, transaction) {
        for (const effect of transaction.effects) {
            if (effect.is(treeGrowthEffect)) return buildImageBlocks(transaction.state);
        }
        if (!transaction.docChanged) return decorations;
        const mapped = decorations.map(transaction.changes);
        if (!changeAffectsImages(transaction, decorations)) return mapped;
        return buildImageBlocks(transaction.state);
    },
    provide: (field) => EditorView.decorations.from(field),
});

export function imageBlocks(): Extension {
    return [imageBlockField, treeProgressPlugin];
}
