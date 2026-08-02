import { html, useEffect, useState } from '../vendor/preact-htm.js';
import { normalizeHandle } from '../ui/branch-lifecycle.js';

export function formatRunningChatSessionHandle(chat: any): string {
  return normalizeHandle(chat?.agent_name) || 'Unnamed session';
}

export function resolveRunningChatSessions(chats: unknown): any[] {
  const seen = new Set<string>();
  const running: any[] = [];
  for (const chat of Array.isArray(chats) ? chats : []) {
    const chatJid = typeof chat?.chat_jid === 'string' ? chat.chat_jid.trim() : '';
    if (!chatJid || seen.has(chatJid) || chat?.is_active !== true || chat?.archived_at) continue;
    seen.add(chatJid);
    running.push(chat);
  }
  return running;
}

export function ChatSessionContextMenu({
  loadActiveChats,
  currentChatJid,
  onSwitchChat,
  onClose,
}: {
  loadActiveChats?: () => Promise<{ chats?: unknown[] } | unknown[]>;
  currentChatJid?: string | null;
  onSwitchChat?: (chatJid: string) => void;
  onClose?: () => void;
}) {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error'; chats: any[] }>({
    status: 'loading',
    chats: [],
  });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', chats: [] });
    Promise.resolve()
      .then(() => {
        if (typeof loadActiveChats !== 'function') throw new Error('Active session loader is unavailable.');
        return loadActiveChats();
      })
      .then((payload: any) => {
        if (cancelled) return;
        const chats = resolveRunningChatSessions(Array.isArray(payload) ? payload : payload?.chats);
        setState({ status: 'ready', chats });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ status: 'error', chats: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [loadActiveChats, requestVersion]);

  const normalizedCurrentChatJid = typeof currentChatJid === 'string' ? currentChatJid.trim() : '';
  const selectChat = (chatJid: string) => {
    onClose?.();
    if (!chatJid || chatJid === normalizedCurrentChatJid) return;
    onSwitchChat?.(chatJid);
  };

  return html`
    <div class="chat-session-menu" data-testid="chat-session-menu">
      <div class="chat-session-menu-title">Running sessions</div>
      ${state.status === 'loading' && html`
        <div class="chat-session-menu-status" data-testid="chat-session-menu-loading" role="status">Loading sessions…</div>
      `}
      ${state.status === 'error' && html`
        <div class="chat-session-menu-status chat-session-menu-error" role="alert">Couldn’t load running sessions.</div>
        <button
          type="button"
          class="chat-session-menu-retry"
          onClick=${(event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            setRequestVersion((version: number) => version + 1);
          }}
        >Retry</button>
      `}
      ${state.status === 'ready' && state.chats.length === 0 && html`
        <div class="chat-session-menu-status" data-testid="chat-session-menu-empty" role="status">No sessions are running.</div>
      `}
      ${state.status === 'ready' && state.chats.map((chat) => {
        const chatJid = String(chat.chat_jid || '').trim();
        const current = Boolean(normalizedCurrentChatJid && chatJid === normalizedCurrentChatJid);
        const statusLabel = typeof chat.activity_label === 'string' && chat.activity_label.trim()
          ? chat.activity_label.trim()
          : 'Active';
        const label = formatRunningChatSessionHandle(chat);
        return html`
          <button
            key=${chatJid}
            type="button"
            class=${`chat-session-menu-item${current ? ' current' : ''}`}
            data-testid="chat-session-menu-item"
            data-chat-jid=${chatJid}
            aria-current=${current ? 'page' : undefined}
            title=${current ? `Current session: ${label}` : `Switch to ${label}`}
            onClick=${() => selectChat(chatJid)}
          >
            <span class="chat-session-menu-label">${label}</span>
            <span class="chat-session-menu-meta">
              <span>${statusLabel}</span>
              ${current && html`<span class="chat-session-menu-current" aria-label="Current session">✓</span>`}
            </span>
          </button>
        `;
      })}
    </div>
  `;
}
