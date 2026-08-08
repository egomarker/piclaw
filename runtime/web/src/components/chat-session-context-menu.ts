import { html, useEffect, useState } from '../vendor/preact-htm.js';
import { normalizeHandle } from '../ui/branch-lifecycle.js';

export function formatRunningChatSessionHandle(chat: any): string {
  return normalizeHandle(chat?.agent_name) || 'Unnamed session';
}

export const RECENT_SESSION_WINDOW_MINUTES = 120;
export const RECENT_SESSION_WINDOW_MS = RECENT_SESSION_WINDOW_MINUTES * 60_000;

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

export function resolveRecentChatSessions(
  chats: unknown,
  activeChats: unknown = [],
  nowMs = Date.now(),
): any[] {
  const activeChatJids = new Set(
    resolveRunningChatSessions(activeChats)
      .map((chat) => String(chat?.chat_jid || '').trim())
      .filter(Boolean),
  );
  const recentByChatJid = new Map<string, any>();

  for (const chat of Array.isArray(chats) ? chats : []) {
    const chatJid = typeof chat?.chat_jid === 'string' ? chat.chat_jid.trim() : '';
    const activityAtMs = Date.parse(typeof chat?.last_activity_at === 'string' ? chat.last_activity_at : '');
    const ageMs = Math.max(0, nowMs - activityAtMs);
    if (
      !chatJid
      || activeChatJids.has(chatJid)
      || chat?.archived_at
      || !Number.isFinite(activityAtMs)
      || ageMs >= RECENT_SESSION_WINDOW_MS
    ) continue;

    const previous = recentByChatJid.get(chatJid);
    if (previous && Date.parse(previous.last_activity_at) >= activityAtMs) continue;
    recentByChatJid.set(chatJid, {
      ...chat,
      chat_jid: chatJid,
      activity_minutes: Math.floor(ageMs / 60_000),
    });
  }

  return [...recentByChatJid.values()].sort((a, b) => {
    const activityDelta = Date.parse(b.last_activity_at) - Date.parse(a.last_activity_at);
    return activityDelta || String(a.chat_jid).localeCompare(String(b.chat_jid));
  });
}

export function ChatSessionContextMenu({
  loadActiveChats,
  currentChatJid,
  onSwitchChat,
  onClose,
}: {
  loadActiveChats?: () => Promise<{ chats?: unknown[]; recent_chats?: unknown[] } | unknown[]>;
  currentChatJid?: string | null;
  onSwitchChat?: (chatJid: string) => void;
  onClose?: () => void;
}) {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState<{
    status: 'loading' | 'ready' | 'error';
    activeChats: any[];
    recentChats: any[];
  }>({
    status: 'loading',
    activeChats: [],
    recentChats: [],
  });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', activeChats: [], recentChats: [] });
    Promise.resolve()
      .then(() => {
        if (typeof loadActiveChats !== 'function') throw new Error('Active session loader is unavailable.');
        return loadActiveChats();
      })
      .then((payload: any) => {
        if (cancelled) return;
        const activeChats = resolveRunningChatSessions(Array.isArray(payload) ? payload : payload?.chats);
        const recentChats = resolveRecentChatSessions(
          Array.isArray(payload) ? [] : payload?.recent_chats,
          activeChats,
        );
        setState({ status: 'ready', activeChats, recentChats });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ status: 'error', activeChats: [], recentChats: [] });
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
  const renderSessionRow = (chat: any, statusLabel: string, section: 'active' | 'recent') => {
    const chatJid = String(chat.chat_jid || '').trim();
    const current = Boolean(normalizedCurrentChatJid && chatJid === normalizedCurrentChatJid);
    const label = formatRunningChatSessionHandle(chat);
    return html`
      <button
        key=${`${section}:${chatJid}`}
        type="button"
        class=${`chat-session-menu-item${current ? ' current' : ''}`}
        data-testid="chat-session-menu-item"
        data-session-section=${section}
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
  };

  return html`
    <div class="chat-session-menu" data-testid="chat-session-menu">
      <div class="chat-session-menu-title">Active sessions</div>
      ${state.status === 'loading' && html`
        <div class="chat-session-menu-status" data-testid="chat-session-menu-loading" role="status">Loading sessions…</div>
      `}
      ${state.status === 'error' && html`
        <div class="chat-session-menu-status chat-session-menu-error" role="alert">Couldn’t load sessions.</div>
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
      ${state.status === 'ready' && state.activeChats.length === 0 && html`
        <div class="chat-session-menu-status" data-testid="chat-session-menu-empty" role="status">No sessions are active.</div>
      `}
      ${state.status === 'ready' && state.activeChats.map((chat) => renderSessionRow(
        chat,
        typeof chat.activity_label === 'string' && chat.activity_label.trim()
          ? chat.activity_label.trim()
          : 'Active',
        'active',
      ))}
      ${state.status === 'ready' && html`
        <div class="chat-session-menu-title chat-session-menu-recent-title">Recent sessions</div>
        ${state.recentChats.length === 0
          ? html`<div class="chat-session-menu-status" data-testid="chat-session-menu-recent-empty" role="status">No recent sessions.</div>`
          : state.recentChats.map((chat) => renderSessionRow(chat, `${chat.activity_minutes} min`, 'recent'))}
      `}
    </div>
  `;
}
