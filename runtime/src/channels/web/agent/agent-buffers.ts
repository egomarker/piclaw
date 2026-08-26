/**
 * channels/web/agent-buffers.ts – in-memory thought/draft buffers and panel expansion state.
 */

/** Web UI panel keys that can store streamed model buffers. */
export type WebAgentPanel = "thought" | "draft";

/** Classification used to keep commentary drafts out of terminal fallback/recovery. */
export type WebDraftKind = "answer" | "commentary";

/** In-memory buffer payload tracked per model turn and panel. */
export interface WebAgentBufferEntry {
  text: string;
  totalLines: number;
  updatedAt: number;
  kind?: WebDraftKind;
}

const DEFAULT_BUFFER_LIMIT = 50;

/** Stores bounded thought/draft buffers plus per-turn panel expansion state. */
export class AgentBuffers {
  private thoughtBuffers = new Map<string, WebAgentBufferEntry>();
  private draftBuffers = new Map<string, WebAgentBufferEntry>();
  private expandedPanels = new Map<string, { thought: boolean; draft: boolean }>();

  constructor(private readonly limit = DEFAULT_BUFFER_LIMIT) {}

  setPanelExpanded(turnId: string, panel: WebAgentPanel, expanded: boolean): void {
    if (!turnId) return;
    const current = this.expandedPanels.get(turnId) ?? { thought: false, draft: false };
    current[panel] = expanded;
    if (!current.thought && !current.draft) {
      this.expandedPanels.delete(turnId);
    } else {
      this.expandedPanels.set(turnId, current);
    }
  }

  isPanelExpanded(turnId: string, panel: WebAgentPanel): boolean {
    return this.expandedPanels.get(turnId)?.[panel] ?? false;
  }

  updateBuffer(turnId: string, panel: WebAgentPanel, text: string, totalLines: number, kind?: WebDraftKind): void {
    if (!turnId) return;
    const target = panel === "draft" ? this.draftBuffers : this.thoughtBuffers;
    target.set(turnId, { text, totalLines, updatedAt: Date.now(), ...(panel === "draft" && kind ? { kind } : {}) });
    this.prune(target);
  }

  getBuffer(turnId: string, panel: WebAgentPanel): WebAgentBufferEntry | undefined {
    return panel === "draft" ? this.draftBuffers.get(turnId) : this.thoughtBuffers.get(turnId);
  }

  private prune(map: Map<string, WebAgentBufferEntry>): void {
    if (map.size <= this.limit) return;
    const entries = Array.from(map.entries()).sort((a, b) => a[1].updatedAt - b[1].updatedAt);
    for (let i = 0; i < entries.length - this.limit; i += 1) {
      map.delete(entries[i][0]);
    }
  }
}
