import { useState, useCallback, useRef, useEffect } from "preact/hooks";
import { renderThinkingMarkdown } from "../../utils/markdown-pipeline";
import { getChatJid } from "../../api/chat-jid";
import { CopyButton } from "../CopyButton";

interface ThinkingVisibilityPillProps {
  messageId: number;
  /** Optional explicit chat scope. If omitted, falls back to getChatJid()
   *  because the visual UI's Interaction shape does not include chat_jid. */
  chatJid?: string;
  lines: number;
  durationMs: number;
}

/** Format duration: <1s → "120ms", ≥1s → "3s", ≥60s → "1m 12s" */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

/**
 * Collapsible pill that shows persisted model reasoning traces.
 * Lazy-loads content from /agent/thinking on first expand.
 * Mirrors the classic UI's ThinkingVisibilityPill behaviour.
 */
export function ThinkingVisibilityPill({ messageId, chatJid, lines, durationMs }: ThinkingVisibilityPillProps) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fetchedDuration, setFetchedDuration] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const next = !expanded;
    setExpanded(next);
    if (next && !text && !loading && !error) {
      setLoading(true);
      // Fall back to the active chat scope if the caller didn't pass one
      // explicitly. Required after R2 endpoint validation tightening.
      const effectiveChatJid = chatJid || getChatJid();
      const url = `/agent/thinking?message_id=${encodeURIComponent(messageId)}&chat_jid=${encodeURIComponent(effectiveChatJid)}`;
      fetch(url)
        .then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((d: { text?: string; duration_ms?: number }) => {
          if (d?.text) setText(d.text);
          else setError(true);
          if (d?.duration_ms) setFetchedDuration(d.duration_ms);
        })
        .catch(err => {
          console.warn("[visual] Failed to load thinking content:", err);
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [expanded, text, loading, error, messageId, chatJid]);

  // Render markdown into the detail container
  useEffect(() => {
    if (!expanded || !detailRef.current || !text) return;
    try {
      detailRef.current.innerHTML = renderThinkingMarkdown(text);
    } catch {
      detailRef.current.textContent = text;
    }
  }, [text, expanded]);

  const durationFromApi = fetchedDuration || 0;
  const ms = durationFromApi || durationMs || 0;
  const label = ms > 0 ? `Thought for ${formatDuration(ms)}` : `Thinking · ${lines} line${lines !== 1 ? "s" : ""}`;
  // Stable detail id so the disclosure button can declare aria-controls.
  const detailId = `thinking-visibility-pill__detail-${messageId}`;

  return (
    <div className="thinking-visibility-pill">
      <div className="thinking-visibility-pill__controls">
        <button
          type="button"
          className="thinking-visibility-pill__header"
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls={detailId}
          aria-label={`${expanded ? "Collapse" : "Expand"} reasoning trace, ${label}`}
        >
          <span className="thinking-visibility-pill__toggle" aria-hidden="true">
            {expanded ? "▾" : "▸"}
          </span>
          <span className="thinking-visibility-pill__label">{label}</span>
        </button>
        {expanded && text && (
          <CopyButton
            text={text}
            className="thinking-visibility-pill__copy"
            title="Copy reasoning trace"
          >
            ⧉
          </CopyButton>
        )}
      </div>
      {expanded && (
        <div
          id={detailId}
          className="thinking-visibility-pill__detail"
          role="region"
          aria-live="polite"
          aria-label="Reasoning trace"
        >
          {loading && (
            <span className="thinking-visibility-pill__loading">Loading reasoning trace…</span>
          )}
          {error && (
            <span className="thinking-visibility-pill__error">Could not load reasoning trace.</span>
          )}
          <div ref={detailRef} className="thinking-visibility-pill__content" />
        </div>
      )}
    </div>
  );
}
