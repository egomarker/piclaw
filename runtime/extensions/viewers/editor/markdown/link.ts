/**
 * link.ts — Link and image decorations.
 *
 * Links: replace markdown syntax with clickable link widget.
 * Images: show inline image widget with optional caption.
 *
 * Lezer structure:
 *   Link  → LinkMark("[") + content + LinkMark("](") + URL + LinkMark(")")
 *   Image → LinkMark("![") + content + LinkMark("](") + URL + LinkMark(")")
 */
import { registerDecorator, WidgetType, pushSafeReplace } from './live-preview.js';
import type { DecorationEntry, SyntaxNode, EditorView } from './live-preview.js';

export function normalizeLinkHref(raw: string): string | null {
    const value = raw.trim();
    if (!value) return null;

    // Allow anchors and site-relative links as-is.
    if (value.startsWith('#') || value.startsWith('/')) return value;

    try {
        const baseHref = typeof window !== 'undefined' ? window.location.href : 'http://localhost/';
        const parsed = new URL(value, baseHref);
        const allowed = new Set(['http:', 'https:', 'mailto:', 'tel:', 'file:']);
        if (!allowed.has(parsed.protocol)) return null;
        return parsed.href;
    } catch {
        return null;
    }
}

function normalizeLinkTitle(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if ((trimmed.startsWith('"') && trimmed.endsWith('"'))
        || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.slice(1, -1).trim();
    }
    return trimmed;
}

class LinkWidget extends WidgetType {
    text: string;
    rawUrl: string;
    title: string;

    constructor(text: string, rawUrl: string, title = '') {
        super();
        this.text = text;
        this.rawUrl = rawUrl;
        this.title = title;
    }

    toDOM(): HTMLElement {
        const anchor = document.createElement('a');
        anchor.className = 'cm-md-link cm-md-link-widget';
        anchor.textContent = this.text || this.rawUrl;

        const href = normalizeLinkHref(this.rawUrl);
        if (href) {
            anchor.href = href;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
        } else {
            anchor.href = '#';
            anchor.classList.add('cm-md-link-invalid');
        }

        anchor.title = this.title || this.rawUrl;

        // Keep editor focus stable; open links intentionally on click.
        anchor.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!href) return;
            window.open(href, '_blank', 'noopener,noreferrer');
        });

        return anchor;
    }

    eq(other: LinkWidget): boolean {
        return this.text === other.text
            && this.rawUrl === other.rawUrl
            && this.title === other.title;
    }

    ignoreEvent(): boolean {
        return false;
    }
}

function linkDecorator(node: SyntaxNode, view: EditorView): DecorationEntry[] {
    const marks: SyntaxNode[] = [];
    let urlNode: SyntaxNode | null = null;
    let titleNode: SyntaxNode | null = null;

    for (let child = node.firstChild; child; child = child.nextSibling) {
        if (child.type.name === 'LinkMark') marks.push(child);
        else if (child.type.name === 'URL') urlNode = child;
        else if (child.type.name === 'LinkTitle') titleNode = child;
    }

    if (marks.length < 2 || !urlNode) return [];

    const openMark = marks[0];
    const secondMark = marks[1];

    const textFrom = openMark.to;
    const textTo = secondMark.from;
    const text = view.state.doc.sliceString(textFrom, textTo);
    const url = view.state.doc.sliceString(urlNode.from, urlNode.to);
    const title = titleNode
        ? normalizeLinkTitle(view.state.doc.sliceString(titleNode.from, titleNode.to))
        : '';

    const entries: DecorationEntry[] = [];
    pushSafeReplace(entries, view.state.doc, node.from, node.to, {
        widget: new LinkWidget(text, url, title),
    });
    return entries;
}

function imageDecorator(node: SyntaxNode, view: EditorView): DecorationEntry[] {
    const entries: DecorationEntry[] = [];
    pushSafeReplace(entries, view.state.doc, node.from, node.to);
    return entries;
}

registerDecorator('Link', linkDecorator);
registerDecorator('Image', imageDecorator);
