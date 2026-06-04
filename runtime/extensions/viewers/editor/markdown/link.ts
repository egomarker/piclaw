/**
 * link.ts — Link and image decorations.
 *
 * Links: replace markdown syntax with clickable link widget.
 * Images: show inline image widget with optional caption.
 * Reference links: resolve [text][label], [text][], and [text] from
 * LinkReference definitions and render them as normal safe link widgets.
 *
 * Lezer structure:
 *   Inline link       → LinkMark("[") + content + LinkMark("](") + URL + LinkMark(")")
 *   Reference link    → LinkMark("[") + content + LinkMark("]") + LinkLabel("[ref]")
 *   Shortcut ref link → LinkMark("[") + content + LinkMark("]")
 *   LinkReference    → LinkLabel("[ref]") + LinkMark(":") + URL + LinkTitle?
 *   Image            → LinkMark("![") + content + LinkMark("](") + URL + LinkMark(")")
 */
import { syntaxTree } from '#editor-vendor/codemirror';
import { registerDecorator, Decoration, WidgetType, pushSafeReplace } from './live-preview.js';
import type { DecorationEntry, SyntaxNode, EditorView } from './live-preview.js';

interface ReferenceLinkTarget {
    url: string;
    title: string;
}

const referenceMapCache = new WeakMap<object, Map<string, ReferenceLinkTarget>>();

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

function stripReferenceLabelBrackets(raw: string): string {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) return trimmed.slice(1, -1);
    return trimmed;
}

export function normalizeReferenceLabel(raw: string): string {
    return stripReferenceLabelBrackets(raw)
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
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

function getReferenceLinks(view: EditorView): Map<string, ReferenceLinkTarget> {
    const doc = view.state.doc;
    const cached = referenceMapCache.get(doc as unknown as object);
    if (cached) return cached;

    const references = new Map<string, ReferenceLinkTarget>();
    syntaxTree(view.state).iterate({
        enter(nodeRef) {
            if (nodeRef.type.name !== 'LinkReference') return;
            const node = nodeRef.node;
            let labelNode: SyntaxNode | null = null;
            let urlNode: SyntaxNode | null = null;
            let titleNode: SyntaxNode | null = null;

            for (let child = node.firstChild; child; child = child.nextSibling) {
                if (child.type.name === 'LinkLabel' && !labelNode) labelNode = child;
                else if (child.type.name === 'URL') urlNode = child;
                else if (child.type.name === 'LinkTitle') titleNode = child;
            }

            if (!labelNode || !urlNode) return;
            const label = normalizeReferenceLabel(doc.sliceString(labelNode.from, labelNode.to));
            if (!label || references.has(label)) return;
            references.set(label, {
                url: doc.sliceString(urlNode.from, urlNode.to),
                title: titleNode ? normalizeLinkTitle(doc.sliceString(titleNode.from, titleNode.to)) : '',
            });
        },
    });

    referenceMapCache.set(doc as unknown as object, references);
    return references;
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

function resolveReferenceTarget(node: SyntaxNode, view: EditorView, text: string): ReferenceLinkTarget | null {
    let labelNode: SyntaxNode | null = null;
    for (let child = node.firstChild; child; child = child.nextSibling) {
        if (child.type.name === 'LinkLabel') {
            labelNode = child;
            break;
        }
    }

    const rawLabel = labelNode ? view.state.doc.sliceString(labelNode.from, labelNode.to) : text;
    const normalizedLabel = normalizeReferenceLabel(rawLabel === '[]' ? text : rawLabel);
    if (!normalizedLabel) return null;
    return getReferenceLinks(view).get(normalizedLabel) || null;
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

    if (marks.length < 2) return [];

    const openMark = marks[0];
    const secondMark = marks[1];
    const textFrom = openMark.to;
    const textTo = secondMark.from;
    const text = view.state.doc.sliceString(textFrom, textTo);
    const directUrl = urlNode ? view.state.doc.sliceString(urlNode.from, urlNode.to) : '';
    const directTitle = titleNode
        ? normalizeLinkTitle(view.state.doc.sliceString(titleNode.from, titleNode.to))
        : '';
    const resolved = urlNode ? { url: directUrl, title: directTitle } : resolveReferenceTarget(node, view, text);
    if (!resolved) return [];

    const entries: DecorationEntry[] = [];
    pushSafeReplace(entries, view.state.doc, node.from, node.to, {
        widget: new LinkWidget(text, resolved.url, resolved.title),
    });
    return entries;
}

function linkReferenceDecorator(node: SyntaxNode, _view: EditorView): DecorationEntry[] {
    return [{
        from: node.from,
        to: node.to,
        decoration: Decoration.mark({ class: 'cm-md-link-reference-def' }),
    }];
}

function imageDecorator(node: SyntaxNode, view: EditorView): DecorationEntry[] {
    const entries: DecorationEntry[] = [];
    pushSafeReplace(entries, view.state.doc, node.from, node.to);
    return entries;
}

registerDecorator('Link', linkDecorator);
registerDecorator('LinkReference', linkReferenceDecorator);
registerDecorator('Image', imageDecorator);
