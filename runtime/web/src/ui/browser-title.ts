/** Build the browser title for the active Piclaw agent and optional session handle. */
export function formatSessionBrowserTitle(agentName: unknown, sessionHandle?: unknown): string {
  const resolvedAgentName = typeof agentName === 'string' && agentName.trim() ? agentName.trim() : 'PiClaw';
  const resolvedSessionHandle = typeof sessionHandle === 'string'
    ? sessionHandle.trim().replace(/^@+/, '').trim()
    : '';
  return resolvedSessionHandle ? `${resolvedAgentName} - @${resolvedSessionHandle}` : resolvedAgentName;
}
