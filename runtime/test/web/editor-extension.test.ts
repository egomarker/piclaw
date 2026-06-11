/**
 * test/web/editor-extension.test.ts — Tests for the standalone editor extension.
 *
 * Tests the StandaloneEditorInstance lifecycle, the LazyEditorInstance proxy,
 * and the editor pane extension registration.
 *
 * Since these are browser-dependent components (CodeMirror, DOM), tests
 * focus on the public API contract using lightweight mocks.
 */

import { expect, test, describe, mock } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";
import "../helpers.js";

// ── Inline types (browser modules can't be imported in bun test) ────

interface PaneContext {
    path?: string;
    content?: string;
    mtime?: string;
    size?: number;
    mode: "edit" | "view";
}

interface PaneInstance {
    getContent(): string | undefined;
    isDirty(): boolean;
    setContent?(content: string, mtime: string): void;
    focus(): void;
    resize?(): void;
    dispose(): void;
    onDirtyChange?(cb: (dirty: boolean) => void): void;
    onSaveRequest?(cb: (content: string) => void): void;
    onClose?(cb: () => void): void;
}

// ── Editor loader contract tests ────────────────────────────────

describe("Editor loader extension contract", () => {

    // Replicate the extension definition inline (no DOM needed for contract)
    const editorExtDef = {
        id: "editor",
        label: "Editor",
        icon: "edit",
        capabilities: ["edit"],
        placement: "tabs",

        canHandle(context: PaneContext): boolean | number {
            if (!context.path) return false;
            return 1;
        },
    };

    test("has correct id and placement", () => {
        expect(editorExtDef.id).toBe("editor");
        expect(editorExtDef.placement).toBe("tabs");
    });

    test("canHandle returns false for no path", () => {
        expect(editorExtDef.canHandle({ mode: "edit" })).toBe(false);
    });

    test("canHandle returns 1 (low priority) for any file path", () => {
        expect(editorExtDef.canHandle({ path: "foo.ts", mode: "edit" })).toBe(1);
        expect(editorExtDef.canHandle({ path: "bar.md", mode: "edit" })).toBe(1);
        expect(editorExtDef.canHandle({ path: ".gitignore", mode: "edit" })).toBe(1);
    });

    test("capabilities include edit", () => {
        expect(editorExtDef.capabilities).toContain("edit");
    });
});

// ── Status footer contract tests ─────────────────────────────────

describe("Editor status footer", () => {
    test("renders the Reference button after Save using existing footer button styling", () => {
        const source = readFileSync(join(import.meta.dir, "../../extensions/viewers/editor/editor-extension.ts"), "utf8");
        expect(source).toContain("referenceBtn.className = 'editor-status-button editor-reference-btn'");
        expect(source).toContain("referenceBtn.textContent = 'Reference'");
        expect(source.indexOf("actionsDiv.appendChild(saveBtn);")).toBeGreaterThan(source.indexOf("actionsDiv.appendChild(vimBtn);"));
        expect(source.indexOf("actionsDiv.appendChild(referenceBtn);")).toBeGreaterThan(source.indexOf("actionsDiv.appendChild(saveBtn);"));
    });
});

// ── LazyEditorInstance proxy contract tests ──────────────────────

describe("LazyEditorInstance proxy", () => {

    /**
     * Simplified version of LazyEditorInstance that doesn't require
     * dynamic import or DOM — just tests the proxy/queue pattern.
     */
    class TestLazyProxy {
        real: PaneInstance | null = null;
        disposed = false;
        queuedDirtyCb: ((dirty: boolean) => void) | null = null;
        queuedSaveCb: ((content: string) => void) | null = null;
        queuedCloseCb: (() => void) | null = null;

        getContent(): string | undefined {
            return this.real?.getContent();
        }

        isDirty(): boolean {
            return this.real?.isDirty() || false;
        }

        dispose(): void {
            this.disposed = true;
            if (this.real) {
                this.real.dispose();
                this.real = null;
            }
        }

        onDirtyChange(cb: (dirty: boolean) => void): void {
            this.queuedDirtyCb = cb;
            if (this.real?.onDirtyChange) this.real.onDirtyChange(cb);
        }

        onSaveRequest(cb: (content: string) => void): void {
            this.queuedSaveCb = cb;
            if (this.real?.onSaveRequest) this.real.onSaveRequest(cb);
        }

        onClose(cb: () => void): void {
            this.queuedCloseCb = cb;
            if (this.real?.onClose) this.real.onClose(cb);
        }

        /** Simulate the real instance becoming available. */
        _setReal(instance: PaneInstance): void {
            this.real = instance;
            if (this.queuedDirtyCb && instance.onDirtyChange) {
                instance.onDirtyChange(this.queuedDirtyCb);
            }
            if (this.queuedSaveCb && instance.onSaveRequest) {
                instance.onSaveRequest(this.queuedSaveCb);
            }
            if (this.queuedCloseCb && instance.onClose) {
                instance.onClose(this.queuedCloseCb);
            }
        }
    }

    /** Minimal mock PaneInstance. */
    function createMockInstance(): PaneInstance & { _dirtyCb?: any; _saveCb?: any; _closeCb?: any } {
        let dirty = false;
        let content = "hello";
        let disposed = false;
        const inst: any = {
            getContent: () => disposed ? undefined : content,
            isDirty: () => dirty,
            setContent: (c: string) => { content = c; dirty = false; },
            focus: () => {},
            dispose: () => { disposed = true; },
            onDirtyChange: (cb: any) => { inst._dirtyCb = cb; },
            onSaveRequest: (cb: any) => { inst._saveCb = cb; },
            onClose: (cb: any) => { inst._closeCb = cb; },
        };
        return inst;
    }

    test("returns undefined/false before real instance", () => {
        const proxy = new TestLazyProxy();
        expect(proxy.getContent()).toBeUndefined();
        expect(proxy.isDirty()).toBe(false);
    });

    test("proxies to real instance after set", () => {
        const proxy = new TestLazyProxy();
        const real = createMockInstance();
        proxy._setReal(real);
        expect(proxy.getContent()).toBe("hello");
        expect(proxy.isDirty()).toBe(false);
    });

    test("replays queued callbacks to real instance", () => {
        const proxy = new TestLazyProxy();
        const dirtyCb = mock(() => {});
        const saveCb = mock(() => {});
        const closeCb = mock(() => {});

        // Register before real is available
        proxy.onDirtyChange(dirtyCb);
        proxy.onSaveRequest(saveCb);
        proxy.onClose(closeCb);

        const real = createMockInstance();
        proxy._setReal(real);

        // Verify callbacks were replayed
        expect(real._dirtyCb).toBe(dirtyCb);
        expect(real._saveCb).toBe(saveCb);
        expect(real._closeCb).toBe(closeCb);
    });

    test("dispose cleans up real instance", () => {
        const proxy = new TestLazyProxy();
        const real = createMockInstance();
        proxy._setReal(real);
        proxy.dispose();

        expect(proxy.disposed).toBe(true);
        expect(proxy.real).toBeNull();
        expect(real.getContent()).toBeUndefined(); // real was disposed
    });

    test("dispose before real loads is safe", () => {
        const proxy = new TestLazyProxy();
        proxy.dispose();
        expect(proxy.disposed).toBe(true);
    });

    test("callbacks registered after real is set go directly", () => {
        const proxy = new TestLazyProxy();
        const real = createMockInstance();
        proxy._setReal(real);

        const cb = mock(() => {});
        proxy.onDirtyChange(cb);
        expect(real._dirtyCb).toBe(cb);
    });
});

// ── Tab orchestration (use-editor-state) contract ───────────────

describe("Editor tab orchestration", () => {

    /**
     * Simplified TabStore for testing tab operations.
     * Matches the real TabStore interface.
     */
    class TestTabStore {
        private tabs: Map<string, { id: string; path: string; label: string; dirty: boolean; pinned: boolean }> = new Map();
        private activeId: string | null = null;
        private mru: string[] = [];

        open(path: string): void {
            if (this.tabs.has(path)) {
                this.activate(path);
                return;
            }
            const label = path.split("/").pop() || path;
            this.tabs.set(path, { id: path, path, label, dirty: false, pinned: false });
            this.activate(path);
        }

        close(id: string): void {
            const tab = this.tabs.get(id);
            if (tab?.pinned) return;
            this.tabs.delete(id);
            this.mru = this.mru.filter((m) => m !== id);
            if (this.activeId === id) {
                this.activeId = this.mru[0] || null;
            }
        }

        activate(id: string): void {
            if (!this.tabs.has(id)) return;
            this.activeId = id;
            this.mru = [id, ...this.mru.filter((m) => m !== id)];
        }

        getActiveId(): string | null { return this.activeId; }

        get(id: string) { return this.tabs.get(id) || null; }

        getTabs() { return Array.from(this.tabs.values()); }

        setDirty(id: string, dirty: boolean): void {
            const tab = this.tabs.get(id);
            if (tab) tab.dirty = dirty;
        }

        hasUnsaved(): boolean {
            return Array.from(this.tabs.values()).some((t) => t.dirty);
        }

        rename(oldId: string, newId: string): void {
            const tab = this.tabs.get(oldId);
            if (!tab) return;
            this.tabs.delete(oldId);
            tab.id = newId;
            tab.path = newId;
            tab.label = newId.split("/").pop() || newId;
            this.tabs.set(newId, tab);
            if (this.activeId === oldId) this.activeId = newId;
            this.mru = this.mru.map((m) => (m === oldId ? newId : m));
        }
    }

    test("open creates tab and activates it", () => {
        const store = new TestTabStore();
        store.open("foo.ts");
        expect(store.getActiveId()).toBe("foo.ts");
        expect(store.getTabs()).toHaveLength(1);
    });

    test("opening same path activates existing tab", () => {
        const store = new TestTabStore();
        store.open("foo.ts");
        store.open("bar.ts");
        store.open("foo.ts");
        expect(store.getActiveId()).toBe("foo.ts");
        expect(store.getTabs()).toHaveLength(2);
    });

    test("close removes tab and falls back to MRU", () => {
        const store = new TestTabStore();
        store.open("a.ts");
        store.open("b.ts");
        store.open("c.ts");
        store.activate("a.ts"); // MRU: [a, c, b]
        store.close("a.ts");
        expect(store.getActiveId()).toBe("c.ts"); // MRU fallback
    });

    test("dirty tracking works", () => {
        const store = new TestTabStore();
        store.open("foo.ts");
        expect(store.hasUnsaved()).toBe(false);
        store.setDirty("foo.ts", true);
        expect(store.hasUnsaved()).toBe(true);
        expect(store.get("foo.ts")?.dirty).toBe(true);
    });

    test("rename updates tab id and path", () => {
        const store = new TestTabStore();
        store.open("old.ts");
        store.rename("old.ts", "new.ts");
        expect(store.get("new.ts")).not.toBeNull();
        expect(store.get("old.ts")).toBeNull();
        expect(store.getActiveId()).toBe("new.ts");
    });
});
