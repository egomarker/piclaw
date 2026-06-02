import {
    Decoration,
    EditorView,
    StateField,
    WidgetType,
    syntaxTree,
} from '#editor-vendor/codemirror';
import type { DecorationSet, EditorState, Extension, Range, Transaction } from '#editor-vendor/codemirror';
import type { SyntaxNode } from '@lezer/common';
import { normalizeLinkHref } from './link.js';
import { treeGrowthEffect } from './tree-progress.js';

export type TableAlign = 'left' | 'center' | 'right';

export interface EditableTableModel {
    header: string[];
    alignments: TableAlign[];
    rows: string[][];
}

function stripOuterPipes(line: string): string {
    let value = line.trim();
    if (value.startsWith('|')) value = value.slice(1);
    if (value.endsWith('|')) value = value.slice(0, -1);
    return value;
}

export function splitMarkdownTableRow(line: string): string[] {
    const value = stripOuterPipes(line);
    const cells: string[] = [];
    let buffer = '';
    for (let index = 0; index < value.length; index++) {
        const char = value[index];
        if (char === '\\' && index + 1 < value.length) {
            const next = value[index + 1];
            buffer += next === '|' ? '|' : char + next;
            index++;
            continue;
        }
        if (char === '|') {
            cells.push(buffer.trim());
            buffer = '';
            continue;
        }
        buffer += char;
    }
    cells.push(buffer.trim());
    return cells;
}

export function parseTableAlignments(line: string): TableAlign[] {
    return splitMarkdownTableRow(line).map((cell) => {
        const value = cell.trim();
        const starts = value.startsWith(':');
        const ends = value.endsWith(':');
        if (starts && ends) return 'center';
        if (ends) return 'right';
        return 'left';
    });
}

function delimiterForAlignment(align: TableAlign | undefined): string {
    if (align === 'center') return ':---:';
    if (align === 'right') return '---:';
    return '---';
}

export function escapeMarkdownTableCell(value: string): string {
    return value
        .replace(/\r?\n/g, ' ')
        .replace(/\|/g, '\\|')
        .trim();
}

function normalizeRow(row: readonly string[], width: number): string[] {
    const normalized = row.slice(0, width).map((cell) => cell ?? '');
    while (normalized.length < width) normalized.push('');
    return normalized;
}

export function normalizeTableModel(model: EditableTableModel): EditableTableModel {
    const width = Math.max(1, model.header.length, ...model.rows.map((row) => row.length));
    const header = normalizeRow(model.header, width).map((cell, index) => cell || `Column ${index + 1}`);
    const alignments = normalizeRow(model.alignments, width).map((align) => {
        if (align === 'center' || align === 'right') return align;
        return 'left';
    }) as TableAlign[];
    const rows = model.rows.map((row) => normalizeRow(row, width));
    return { header, alignments, rows };
}

export function parseMarkdownTableLines(lines: readonly string[]): EditableTableModel | null {
    if (lines.length < 2) return null;
    const header = splitMarkdownTableRow(lines[0]);
    const alignments = parseTableAlignments(lines[1]);
    if (header.length === 0 || alignments.length === 0) return null;
    const rows = lines.slice(2).filter((line) => line.trim()).map(splitMarkdownTableRow);
    return normalizeTableModel({ header, alignments, rows });
}

export function serializeMarkdownTable(model: EditableTableModel): string {
    const normalized = normalizeTableModel(model);
    const header = `| ${normalized.header.map(escapeMarkdownTableCell).join(' | ')} |`;
    const delimiter = `| ${normalized.alignments.map(delimiterForAlignment).join(' | ')} |`;
    const rows = normalized.rows.map((row) => `| ${row.map(escapeMarkdownTableCell).join(' | ')} |`);
    return [header, delimiter, ...rows].join('\n');
}

export function insertTableRow(model: EditableTableModel, afterBodyRow: number): EditableTableModel {
    const normalized = normalizeTableModel(model);
    const width = normalized.header.length;
    const rows = normalized.rows.map((row) => row.slice());
    const insertAt = Math.max(0, Math.min(rows.length, afterBodyRow + 1));
    rows.splice(insertAt, 0, new Array(width).fill(''));
    return { ...normalized, rows };
}

export function deleteTableRow(model: EditableTableModel, bodyRow: number): EditableTableModel {
    const normalized = normalizeTableModel(model);
    if (normalized.rows.length <= 1) return normalized;
    const rows = normalized.rows.filter((_, index) => index !== bodyRow);
    return { ...normalized, rows };
}

export function insertTableColumn(model: EditableTableModel, afterColumn: number): EditableTableModel {
    const normalized = normalizeTableModel(model);
    const insertAt = Math.max(0, Math.min(normalized.header.length, afterColumn + 1));
    const header = normalized.header.slice();
    header.splice(insertAt, 0, `Column ${insertAt + 1}`);
    const alignments = normalized.alignments.slice();
    alignments.splice(insertAt, 0, 'left');
    const rows = normalized.rows.map((row) => {
        const next = row.slice();
        next.splice(insertAt, 0, '');
        return next;
    });
    return normalizeTableModel({ header, alignments, rows });
}

export function deleteTableColumn(model: EditableTableModel, column: number): EditableTableModel {
    const normalized = normalizeTableModel(model);
    if (normalized.header.length <= 1) return normalized;
    const removeAt = Math.max(0, Math.min(normalized.header.length - 1, column));
    const header = normalized.header.filter((_, index) => index !== removeAt);
    const alignments = normalized.alignments.filter((_, index) => index !== removeAt);
    const rows = normalized.rows.map((row) => row.filter((_, index) => index !== removeAt));
    return normalizeTableModel({ header, alignments, rows });
}

export function setTableColumnAlignment(
    model: EditableTableModel,
    column: number,
    alignment: TableAlign,
): EditableTableModel {
    const normalized = normalizeTableModel(model);
    const target = Math.max(0, Math.min(normalized.header.length - 1, column));
    const alignments = normalized.alignments.slice();
    alignments[target] = alignment;
    return { ...normalized, alignments };
}

function tableNodeLines(state: EditorState, node: SyntaxNode): string[] {
    const doc = state.doc;
    const startLine = doc.lineAt(node.from).number;
    const endPos = Math.max(node.from, Math.min(node.to, doc.length) - 1);
    const endLine = doc.lineAt(endPos).number;
    const lines: string[] = [];
    for (let lineNo = startLine; lineNo <= endLine; lineNo++) {
        lines.push(doc.line(lineNo).text);
    }
    return lines;
}

function modelShape(model: EditableTableModel): string {
    const normalized = normalizeTableModel(model);
    return `${normalized.header.length}:${normalized.rows.length}:${normalized.alignments.join(',')}`;
}

let pendingTableFocus: { from: number; row: number; col: number } | null = null;

function insertPlainTextIntoCell(cell: HTMLElement, text: string): void {
    const doc = cell.ownerDocument;
    const selection = doc.getSelection();
    if (!selection || selection.rangeCount === 0 || !cell.contains(selection.anchorNode)) {
        cell.textContent = `${cell.textContent ?? ''}${text}`;
        return;
    }
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const node = doc.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

export type TableCellInlineToken =
    | { type: 'text'; text: string }
    | { type: 'strong'; delimiter: '**' | '__'; children: TableCellInlineToken[] }
    | { type: 'emphasis'; delimiter: '*' | '_'; children: TableCellInlineToken[] }
    | { type: 'strike'; children: TableCellInlineToken[] }
    | { type: 'code'; text: string }
    | { type: 'link'; children: TableCellInlineToken[]; url: string };

export function parseTableCellInlineMarkdown(raw: string): TableCellInlineToken[] {
    const tokens: TableCellInlineToken[] = [];
    let buffer = '';
    let index = 0;
    const flush = () => {
        if (!buffer) return;
        tokens.push({ type: 'text', text: buffer });
        buffer = '';
    };

    while (index < raw.length) {
        if (raw[index] === '\\' && index + 1 < raw.length && /[!-/:-@[-`{-~]/.test(raw[index + 1])) {
            buffer += raw[index + 1];
            index += 2;
            continue;
        }
        const match = matchTableCellInlineToken(raw, index);
        if (match) {
            flush();
            tokens.push(match.token);
            index = match.end;
            continue;
        }
        buffer += raw[index];
        index++;
    }

    flush();
    return tokens;
}

function matchTableCellInlineToken(raw: string, from: number): { token: TableCellInlineToken; end: number } | null {
    const rest = raw.slice(from);
    let match = rest.match(/^`([^`\n]+?)`/);
    if (match) return { token: { type: 'code', text: match[1] }, end: from + match[0].length };

    match = rest.match(/^\*\*([\s\S]+?)\*\*/);
    if (match) return { token: { type: 'strong', delimiter: '**', children: parseTableCellInlineMarkdown(match[1]) }, end: from + match[0].length };
    match = rest.match(/^__([\s\S]+?)__/);
    if (match) return { token: { type: 'strong', delimiter: '__', children: parseTableCellInlineMarkdown(match[1]) }, end: from + match[0].length };
    match = rest.match(/^~~([\s\S]+?)~~/);
    if (match) return { token: { type: 'strike', children: parseTableCellInlineMarkdown(match[1]) }, end: from + match[0].length };
    match = rest.match(/^\[([^\]\n]+)\]\(([^\s)"'\n]+)\)/);
    if (match) return { token: { type: 'link', children: parseTableCellInlineMarkdown(match[1]), url: match[2] }, end: from + match[0].length };
    match = rest.match(/^\*([^*\n]+?)\*/);
    if (match) return { token: { type: 'emphasis', delimiter: '*', children: parseTableCellInlineMarkdown(match[1]) }, end: from + match[0].length };
    const previous = from > 0 ? raw[from - 1] : '';
    if (!/\w/.test(previous)) {
        match = rest.match(/^_([^_\n]+?)_/);
        if (match) return { token: { type: 'emphasis', delimiter: '_', children: parseTableCellInlineMarkdown(match[1]) }, end: from + match[0].length };
    }
    return null;
}

function appendTableCellTokens(parent: Node, tokens: readonly TableCellInlineToken[], doc: Document): void {
    for (const token of tokens) parent.appendChild(renderTableCellToken(token, doc));
}

function markSpan(doc: Document, text: string): HTMLElement {
    const element = doc.createElement('span');
    element.className = 'cm-md-table-cell-mark';
    element.textContent = text;
    return element;
}

function renderTableCellToken(token: TableCellInlineToken, doc: Document): Node {
    if (token.type === 'text') return doc.createTextNode(token.text);
    if (token.type === 'code') {
        const code = doc.createElement('code');
        code.className = 'cm-md-table-cell-code';
        code.appendChild(doc.createTextNode(token.text));
        return code;
    }

    const wrap = doc.createElement('span');
    if (token.type === 'strong') {
        wrap.className = 'cm-md-table-cell-strong-wrap';
        wrap.appendChild(markSpan(doc, token.delimiter));
        const inner = doc.createElement('span');
        inner.className = 'cm-md-table-cell-strong';
        appendTableCellTokens(inner, token.children, doc);
        wrap.appendChild(inner);
        wrap.appendChild(markSpan(doc, token.delimiter));
        return wrap;
    }
    if (token.type === 'emphasis') {
        wrap.className = 'cm-md-table-cell-em-wrap';
        wrap.appendChild(markSpan(doc, token.delimiter));
        const inner = doc.createElement('span');
        inner.className = 'cm-md-table-cell-em';
        appendTableCellTokens(inner, token.children, doc);
        wrap.appendChild(inner);
        wrap.appendChild(markSpan(doc, token.delimiter));
        return wrap;
    }
    if (token.type === 'strike') {
        wrap.className = 'cm-md-table-cell-strike-wrap';
        wrap.appendChild(markSpan(doc, '~~'));
        const inner = doc.createElement('span');
        inner.className = 'cm-md-table-cell-strike';
        appendTableCellTokens(inner, token.children, doc);
        wrap.appendChild(inner);
        wrap.appendChild(markSpan(doc, '~~'));
        return wrap;
    }

    wrap.className = 'cm-md-table-cell-link-wrap';
    const href = normalizeLinkHref(token.url);
    if (href) wrap.dataset.href = href;
    wrap.appendChild(markSpan(doc, '['));
    const inner = doc.createElement('span');
    inner.className = 'cm-md-table-cell-link';
    appendTableCellTokens(inner, token.children, doc);
    wrap.appendChild(inner);
    wrap.appendChild(markSpan(doc, ']'));
    wrap.appendChild(markSpan(doc, '('));
    const urlMark = markSpan(doc, token.url);
    urlMark.classList.add('cm-md-table-cell-link-url');
    wrap.appendChild(urlMark);
    wrap.appendChild(markSpan(doc, ')'));
    return wrap;
}

function renderDecoratedTableCell(cell: HTMLElement, raw: string): void {
    cell.dataset.raw = raw;
    cell.replaceChildren();
    appendTableCellTokens(cell, parseTableCellInlineMarkdown(raw), cell.ownerDocument);
}

class EditableTableWidget extends WidgetType {
    private currentTo: number;
    private composing = false;

    constructor(
        private readonly from: number,
        to: number,
        private model: EditableTableModel,
    ) {
        super();
        this.currentTo = to;
    }

    eq(other: EditableTableWidget): boolean {
        return modelShape(this.model) === modelShape(other.model);
    }

    toDOM(view: EditorView): HTMLElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'cm-md-editable-table-wrap';
        wrapper.setAttribute('data-table-editor', 'normalized');

        const toolbar = document.createElement('div');
        toolbar.className = 'cm-md-editable-table-toolbar';
        wrapper.appendChild(toolbar);

        const contextMenu = document.createElement('div');
        contextMenu.className = 'cm-md-editable-table-context-menu';
        contextMenu.hidden = true;
        contextMenu.setAttribute('role', 'menu');
        wrapper.appendChild(contextMenu);

        const table = document.createElement('table');
        table.className = 'cm-md-editable-table';
        wrapper.appendChild(table);

        let activeRow = 1;
        let activeCol = 0;

        const focusCell = (row: number, col: number) => {
            const next = table.querySelector<HTMLElement>(`[data-row="${row}"][data-col="${col}"]`);
            if (!next) return;
            next.focus();
            const selection = window.getSelection();
            if (!selection) return;
            const range = document.createRange();
            range.selectNodeContents(next);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        };

        const commitModel = (nextModel: EditableTableModel, focus?: { row: number; col: number }) => {
            if (this.composing) return;
            this.model = normalizeTableModel(nextModel);
            const markdown = serializeMarkdownTable(this.model);
            const to = Math.max(this.from, Math.min(this.currentTo, view.state.doc.length));
            if (focus) pendingTableFocus = { from: this.from, row: focus.row, col: focus.col };
            view.dispatch({ changes: { from: this.from, to, insert: markdown } });
            this.currentTo = this.from + markdown.length;
            if (focus) requestAnimationFrame(() => focusCell(focus.row, focus.col));
        };

        const commitFromDom = () => commitModel(readModelFromTable(table, this.model.alignments));

        const rebuildLocalDom = () => {
            table.replaceChildren();
            buildTableDom(table, this.model, renderCell);
        };

        const mutate = (nextModel: EditableTableModel, row: number, col: number) => {
            this.model = normalizeTableModel(nextModel);
            activeRow = Math.max(0, Math.min(row, this.model.rows.length));
            activeCol = Math.max(0, Math.min(col, this.model.header.length - 1));
            rebuildLocalDom();
            commitModel(this.model, { row: activeRow, col: activeCol });
        };

        const hideContextMenu = () => { contextMenu.hidden = true; };
        const actionAddRow = () => {
            const bodyRow = Math.max(0, activeRow - 1);
            mutate(insertTableRow(readModelFromTable(table, this.model.alignments), bodyRow), activeRow + 1, activeCol);
        };
        const actionDeleteRow = () => {
            const bodyRow = Math.max(0, activeRow - 1);
            mutate(deleteTableRow(readModelFromTable(table, this.model.alignments), bodyRow), Math.max(1, activeRow - 1), activeCol);
        };
        const actionAddColumn = () => {
            mutate(insertTableColumn(readModelFromTable(table, this.model.alignments), activeCol), activeRow, activeCol + 1);
        };
        const actionDeleteColumn = () => {
            mutate(deleteTableColumn(readModelFromTable(table, this.model.alignments), activeCol), activeRow, Math.max(0, activeCol - 1));
        };
        const actionAlignLeft = () => {
            mutate(setTableColumnAlignment(readModelFromTable(table, this.model.alignments), activeCol, 'left'), activeRow, activeCol);
        };
        const actionAlignCenter = () => {
            mutate(setTableColumnAlignment(readModelFromTable(table, this.model.alignments), activeCol, 'center'), activeRow, activeCol);
        };
        const actionAlignRight = () => {
            mutate(setTableColumnAlignment(readModelFromTable(table, this.model.alignments), activeCol, 'right'), activeRow, activeCol);
        };

        const button = (parent: HTMLElement, label: string, title: string, action: () => void, className = 'cm-md-editable-table-button') => {
            const element = document.createElement('button');
            element.type = 'button';
            element.className = className;
            element.textContent = label;
            element.title = title;
            element.addEventListener('mousedown', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
            element.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                action();
                hideContextMenu();
            });
            parent.appendChild(element);
        };

        for (const [label, title, action] of [
            ['+ row', 'Insert row below active cell', actionAddRow],
            ['- row', 'Delete active body row', actionDeleteRow],
            ['+ col', 'Insert column right of active cell', actionAddColumn],
            ['- col', 'Delete active column', actionDeleteColumn],
            ['←', 'Align active column left', actionAlignLeft],
            ['↔', 'Align active column center', actionAlignCenter],
            ['→', 'Align active column right', actionAlignRight],
        ] as const) {
            button(toolbar, label, title, action);
            button(contextMenu, label, title, action, 'cm-md-editable-table-menu-button');
        }

        const renderCell = (tag: 'th' | 'td', text: string, row: number, col: number) => {
            const cell = document.createElement(tag);
            const align = this.model.alignments[col] || 'left';
            cell.className = `cm-md-editable-table-cell cm-md-editable-table-cell-${align}`;
            cell.contentEditable = 'true';
            cell.spellcheck = false;
            renderDecoratedTableCell(cell, text);
            cell.dataset.row = String(row);
            cell.dataset.col = String(col);
            const markActive = () => {
                activeRow = Number(cell.dataset.row || '0');
                activeCol = Number(cell.dataset.col || '0');
            };
            cell.addEventListener('focus', markActive);
            cell.addEventListener('mousedown', markActive);
            cell.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                event.stopPropagation();
                markActive();
                const rect = wrapper.getBoundingClientRect();
                contextMenu.style.left = `${Math.max(0, event.clientX - rect.left)}px`;
                contextMenu.style.top = `${Math.max(0, event.clientY - rect.top)}px`;
                contextMenu.hidden = false;
            });
            cell.addEventListener('compositionstart', () => { this.composing = true; });
            const syncRawFromDom = () => { cell.dataset.raw = cell.textContent ?? ''; };
            cell.addEventListener('compositionend', () => { this.composing = false; syncRawFromDom(); commitFromDom(); });
            cell.addEventListener('input', () => { syncRawFromDom(); commitFromDom(); });
            cell.addEventListener('paste', (event) => {
                event.preventDefault();
                const text = event.clipboardData?.getData('text/plain') ?? '';
                insertPlainTextIntoCell(cell, text.replace(/\r?\n/g, ' '));
                syncRawFromDom();
                commitFromDom();
            });
            cell.addEventListener('keydown', (event) => {
                if (event.key === 'Tab') {
                    event.preventDefault();
                    event.stopPropagation();
                    const cells = Array.from(table.querySelectorAll<HTMLElement>('[data-row][data-col]'));
                    const index = cells.indexOf(cell);
                    const nextIndex = event.shiftKey ? index - 1 : index + 1;
                    const next = cells[nextIndex];
                    if (next) {
                        next.focus();
                    } else if (!event.shiftKey) {
                        const nextModel = readModelFromTable(table, this.model.alignments);
                        const nextBodyRow = nextModel.rows.length;
                        mutate(insertTableRow(nextModel, nextModel.rows.length - 1), nextBodyRow + 1, 0);
                    }
                    return;
                }
                if (event.key === 'Enter') {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
            return cell;
        };

        buildTableDom(table, this.model, renderCell);
        if (pendingTableFocus && pendingTableFocus.from === this.from) {
            const focus = pendingTableFocus;
            pendingTableFocus = null;
            requestAnimationFrame(() => focusCell(focus.row, focus.col));
        }
        return wrapper;
    }

    ignoreEvent(event: Event): boolean {
        return event.type === 'beforeinput'
            || event.type === 'input'
            || event.type === 'keydown'
            || event.type === 'keyup'
            || event.type === 'paste'
            || event.type.startsWith('composition')
            || event.type === 'mousedown'
            || event.type === 'click'
            || event.type === 'contextmenu';
    }
}

function buildTableDom(
    table: HTMLTableElement,
    model: EditableTableModel,
    renderCell: (tag: 'th' | 'td', text: string, row: number, col: number) => HTMLTableCellElement,
): void {
    const normalized = normalizeTableModel(model);
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    normalized.header.forEach((cell, col) => headerRow.appendChild(renderCell('th', cell, 0, col)));
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    normalized.rows.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, col) => tr.appendChild(renderCell('td', cell, rowIndex + 1, col)));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}

function readCellRaw(cell: HTMLTableCellElement): string {
    return cell.dataset.raw ?? cell.textContent ?? '';
}

function readModelFromTable(table: HTMLTableElement, alignments: readonly TableAlign[]): EditableTableModel {
    const header = Array.from(table.querySelectorAll<HTMLTableCellElement>('thead th'))
        .map(readCellRaw);
    const rows = Array.from(table.querySelectorAll<HTMLTableRowElement>('tbody tr'))
        .map((row) => Array.from(row.querySelectorAll<HTMLTableCellElement>('td'))
            .map(readCellRaw));
    return normalizeTableModel({ header, alignments: Array.from(alignments), rows });
}

function buildEditableTableDecorations(state: EditorState): DecorationSet {
    const ranges: Range<Decoration>[] = [];
    syntaxTree(state).iterate({
        enter(node) {
            if (node.name !== 'Table') return;
            const lines = tableNodeLines(state, node.node);
            const model = parseMarkdownTableLines(lines);
            if (!model) return;
            ranges.push(Decoration.replace({
                widget: new EditableTableWidget(node.from, node.to, model),
                block: true,
            }).range(node.from, node.to));
        },
    });
    return Decoration.set(ranges, true);
}

function transactionTouchesTable(transaction: Transaction, decorations: DecorationSet): boolean {
    let touches = false;
    transaction.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
        if (touches) return;
        decorations.between(Math.max(0, fromA - 1), Math.min(transaction.startState.doc.length, toA + 1), () => {
            touches = true;
            return false;
        });
        if (touches) return;
        const insertedText = inserted.toString();
        if (insertedText.includes('|')) {
            touches = true;
            return;
        }
        const startLine = transaction.state.doc.lineAt(Math.max(0, Math.min(fromB, transaction.state.doc.length)));
        const endLine = transaction.state.doc.lineAt(Math.max(0, Math.min(toB, transaction.state.doc.length)));
        for (let lineNo = startLine.number; lineNo <= endLine.number; lineNo++) {
            if (transaction.state.doc.line(lineNo).text.includes('|')) {
                touches = true;
                break;
            }
        }
    });
    return touches;
}

const editableTableField = StateField.define<DecorationSet>({
    create: (state) => buildEditableTableDecorations(state),
    update(decorations, transaction) {
        if (!transaction.docChanged) {
            // Rebuild when the parser discovers new Table nodes (tree growth)
            const hasTreeGrowth = transaction.effects.some((effect) => effect.is(treeGrowthEffect));
            if (hasTreeGrowth) return buildEditableTableDecorations(transaction.state);
            return decorations;
        }
        const mapped = decorations.map(transaction.changes);
        if (!transactionTouchesTable(transaction, decorations)) return mapped;
        return buildEditableTableDecorations(transaction.state);
    },
    provide: (field) => EditorView.decorations.from(field),
});

export function editableTables(): Extension {
    return editableTableField;
}
