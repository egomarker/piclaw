export type WorkspaceRowActionTargetType = 'file' | 'dir';

export interface WorkspaceRowActionTarget {
  path: string;
  name: string;
  type: WorkspaceRowActionTargetType;
  depth: number;
}

export interface WorkspaceRowActionTabOptions {
  label?: string;
  paneOverrideId?: string;
}

export interface WorkspaceRowActionActivationContext extends WorkspaceRowActionTarget {
  openTab: (path: string, options?: WorkspaceRowActionTabOptions) => void;
}

export interface WorkspaceRowActionDefinition {
  id: string;
  label: string;
  icon?: unknown | ((target: WorkspaceRowActionTarget) => unknown);
  order?: number;
  canHandle?: (target: WorkspaceRowActionTarget) => boolean;
  onActivate: (context: WorkspaceRowActionActivationContext) => unknown | Promise<unknown>;
}

type WorkspaceRowActionListener = () => void;

const workspaceRowActions = new Map<string, WorkspaceRowActionDefinition>();
const workspaceRowActionListeners = new Set<WorkspaceRowActionListener>();

function notifyWorkspaceRowActionListeners(): void {
  for (const listener of [...workspaceRowActionListeners]) {
    try {
      listener();
    } catch (error) {
      console.warn('[addon-web] workspace row action listener failed:', error);
    }
  }
}

export function registerWorkspaceRowAction(definition: WorkspaceRowActionDefinition): () => void {
  const id = typeof definition?.id === 'string' ? definition.id.trim() : '';
  const label = typeof definition?.label === 'string' ? definition.label.trim() : '';
  if (!id || !label || typeof definition?.onActivate !== 'function') return () => {};

  const normalized = { ...definition, id, label };
  workspaceRowActions.set(id, normalized);
  notifyWorkspaceRowActionListeners();

  return () => {
    if (workspaceRowActions.get(id) !== normalized) return;
    workspaceRowActions.delete(id);
    notifyWorkspaceRowActionListeners();
  };
}

export function getWorkspaceRowActions(target: WorkspaceRowActionTarget): WorkspaceRowActionDefinition[] {
  const resolved: WorkspaceRowActionDefinition[] = [];
  for (const definition of workspaceRowActions.values()) {
    try {
      if (!definition.canHandle || definition.canHandle(target)) resolved.push(definition);
    } catch (error) {
      console.warn(`[addon-web] workspace row action matcher failed for "${definition.id}":`, error);
    }
  }
  return resolved.sort((left, right) => {
    const orderDifference = (left.order ?? 500) - (right.order ?? 500);
    return orderDifference || left.id.localeCompare(right.id);
  });
}

export function subscribeWorkspaceRowActions(listener: WorkspaceRowActionListener): () => void {
  if (typeof listener !== 'function') return () => {};
  workspaceRowActionListeners.add(listener);
  return () => {
    workspaceRowActionListeners.delete(listener);
  };
}

export function resetWorkspaceRowActionsForTests(): void {
  const hadActions = workspaceRowActions.size > 0;
  workspaceRowActions.clear();
  if (hadActions) notifyWorkspaceRowActionListeners();
  workspaceRowActionListeners.clear();
}
