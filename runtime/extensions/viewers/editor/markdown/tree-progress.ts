import {
    EditorView,
    StateEffect,
    ViewPlugin,
    ensureSyntaxTree,
    syntaxTree,
} from '#editor-vendor/codemirror';
import type { ViewUpdate } from '#editor-vendor/codemirror';

/**
 * Signals that Lezer's background parser has advanced enough that cached
 * live-preview decorations should rebuild. Piclaw still disables live preview
 * in Large Document Mode; this only prevents partial-tree raw Markdown pockets
 * inside documents that are allowed to use live preview.
 */
export const treeGrowthEffect = StateEffect.define<null>();

export const TREE_PROGRESS_GROWTH_THRESHOLD = 8 * 1024;
export const TREE_PROGRESS_TICK_BUDGET_MS = 30;

type IdleHandle = { kind: 'idle'; id: number } | { kind: 'raf'; id: number };

function scheduleIdle(callback: () => void): IdleHandle {
    const win = typeof window !== 'undefined' ? window : null;
    if (win && typeof win.requestIdleCallback === 'function') {
        return { kind: 'idle', id: win.requestIdleCallback(() => callback()) };
    }
    if (win && typeof win.requestAnimationFrame === 'function') {
        return { kind: 'raf', id: win.requestAnimationFrame(() => callback()) };
    }
    return { kind: 'raf', id: setTimeout(callback, 16) as unknown as number };
}

function cancelIdle(handle: IdleHandle): void {
    const win = typeof window !== 'undefined' ? window : null;
    if (handle.kind === 'idle' && win && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(handle.id);
    } else if (handle.kind === 'raf' && win && typeof win.cancelAnimationFrame === 'function') {
        win.cancelAnimationFrame(handle.id);
    } else {
        clearTimeout(handle.id);
    }
}

export function shouldSignalTreeGrowth(previousLength: number, nextLength: number, docLength: number): boolean {
    return nextLength >= docLength || nextLength >= previousLength + TREE_PROGRESS_GROWTH_THRESHOLD;
}

class TreeProgressPlugin {
    private lastTreeLength: number;
    private idleHandle: IdleHandle | null = null;
    private destroyed = false;

    constructor(private readonly view: EditorView) {
        this.lastTreeLength = syntaxTree(view.state).length;
        this.schedule();
    }

    update(update: ViewUpdate) {
        if (!update.docChanged) return;
        this.lastTreeLength = syntaxTree(update.state).length;
        this.schedule();
    }

    destroy() {
        this.destroyed = true;
        if (this.idleHandle !== null) {
            cancelIdle(this.idleHandle);
            this.idleHandle = null;
        }
    }

    private schedule() {
        if (this.idleHandle !== null) return;
        this.idleHandle = scheduleIdle(() => {
            this.idleHandle = null;
            if (!this.destroyed) this.tick();
        });
    }

    private tick() {
        const state = this.view.state;
        const docLength = state.doc.length;
        if (this.lastTreeLength >= docLength) return;

        const ensured = ensureSyntaxTree(state, docLength, TREE_PROGRESS_TICK_BUDGET_MS);
        const nextLength = (ensured ?? syntaxTree(state)).length;

        if (shouldSignalTreeGrowth(this.lastTreeLength, nextLength, docLength)) {
            const previousLength = this.lastTreeLength;
            this.lastTreeLength = nextLength;
            try {
                this.view.dispatch({ effects: treeGrowthEffect.of(null) });
            } catch {
                this.lastTreeLength = previousLength;
                return;
            }
        }

        if (nextLength < docLength) this.schedule();
    }
}

export const treeProgressPlugin = ViewPlugin.fromClass(TreeProgressPlugin);
