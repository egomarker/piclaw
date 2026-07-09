/**
 * db/tasks.ts – CRUD operations for the `scheduled_tasks` and `task_run_logs` tables.
 *
 * Scheduled tasks are created via IPC (ipc.ts) or agent-control commands and
 * executed by the task scheduler (task-scheduler.ts). This module provides all
 * database access for managing task definitions and their execution history.
 *
 * Consumers:
 *   - task-scheduler.ts calls getDueTasks() and updateTaskAfterRun() each cycle.
 *   - ipc.ts calls createTask() when processing a schedule IPC file.
 *   - agent-control/handlers/info.ts reads tasks for `/tasks` / `/task info`.
 *   - agent-control/handlers/control.ts calls updateTask() / deleteTask() for
 *     `/task pause`, `/task resume`, `/task delete`.
 *   - extensions/scheduled-tasks.ts surfaces task info in the agent prompt.
 */

import type { ScheduledTask, TaskRunLog } from "../types.js";
import { getDb } from "./connection.js";

type SqlBinding = string | number | bigint | boolean | Uint8Array | null;

/**
 * Insert a new scheduled task into the database.
 * Called by ipc.ts when a `schedule` IPC file is processed.
 */
export function createTask(task: Omit<ScheduledTask, "last_run" | "last_result">): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO scheduled_tasks (
      id, chat_jid, prompt, model, task_kind, command, cwd, timeout_sec, notify_on_complete,
      schedule_type, schedule_value, next_run, status, created_at
    )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    task.id,
    task.chat_jid,
    task.prompt,
    task.model ?? null,
    task.task_kind ?? "agent",
    task.command ?? null,
    task.cwd ?? null,
    task.timeout_sec ?? null,
    task.notify_on_complete === false || task.notify_on_complete === 0 ? 0 : 1,
    task.schedule_type,
    task.schedule_value,
    task.next_run,
    task.status,
    task.created_at
  );
}

/** Fetch a single scheduled task by its ID. */
export function getTaskById(id: string): ScheduledTask | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM scheduled_tasks WHERE id = ?").get(id) as ScheduledTask | undefined;
}

/**
 * Partially update a scheduled task. Only the fields present in `updates`
 * are modified; all others are left unchanged.
 */
export function updateTask(
  id: string,
  updates: Partial<Pick<ScheduledTask,
    "prompt" | "model" | "task_kind" | "command" | "cwd" | "timeout_sec" | "notify_on_complete" |
    "schedule_type" | "schedule_value" | "next_run" | "status">
  >
): void {
  const fields: string[] = [];
  const values: SqlBinding[] = [];

  if (updates.prompt !== undefined) { fields.push("prompt = ?"); values.push(updates.prompt); }
  if (updates.model !== undefined) { fields.push("model = ?"); values.push(updates.model); }
  if (updates.task_kind !== undefined) { fields.push("task_kind = ?"); values.push(updates.task_kind); }
  if (updates.command !== undefined) { fields.push("command = ?"); values.push(updates.command); }
  if (updates.cwd !== undefined) { fields.push("cwd = ?"); values.push(updates.cwd); }
  if (updates.timeout_sec !== undefined) { fields.push("timeout_sec = ?"); values.push(updates.timeout_sec); }
  if (updates.notify_on_complete !== undefined) { fields.push("notify_on_complete = ?"); values.push(updates.notify_on_complete === false || updates.notify_on_complete === 0 ? 0 : 1); }
  if (updates.schedule_type !== undefined) { fields.push("schedule_type = ?"); values.push(updates.schedule_type); }
  if (updates.schedule_value !== undefined) { fields.push("schedule_value = ?"); values.push(updates.schedule_value); }
  if (updates.next_run !== undefined) { fields.push("next_run = ?"); values.push(updates.next_run); }
  if (updates.status !== undefined) { fields.push("status = ?"); values.push(updates.status); }

  if (fields.length === 0) return;

  values.push(id);
  const db = getDb();
  db.prepare(`UPDATE scheduled_tasks SET ${fields.join(", ")} WHERE id = ?`).run(...values);
}

/**
 * Delete a scheduled task and all its run logs.
 * Called by agent-control `/task delete` handler.
 */
export function deleteTask(id: string): void {
  const db = getDb();
  db.prepare("DELETE FROM task_run_logs WHERE task_id = ?").run(id);
  db.prepare("DELETE FROM scheduled_tasks WHERE id = ?").run(id);
}

/**
 * Return all active tasks whose next_run timestamp is in the past (i.e. due).
 * Called by task-scheduler.ts on each poll cycle.
 */
export function getDueTasks(): ScheduledTask[] {
  const db = getDb();
  const now = new Date().toISOString();
  return db
    .prepare(
      `SELECT * FROM scheduled_tasks
       WHERE status = 'active' AND next_run IS NOT NULL AND next_run <= ?
       ORDER BY next_run`
    )
    .all(now) as ScheduledTask[];
}

/**
 * Update a task after execution: set next_run, last_run, last_result, and
 * mark as 'completed' if next_run is null (one-shot tasks).
 */
export function updateTaskAfterRun(id: string, nextRun: string | null, lastResult: string): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE scheduled_tasks
     SET next_run = ?, last_run = ?, last_result = ?, status = CASE WHEN ? IS NULL THEN 'completed' ELSE status END
     WHERE id = ?`
  ).run(nextRun, now, lastResult, nextRun, id);
}

/** Record a single execution of a scheduled task for audit / display. */
export function logTaskRun(log: TaskRunLog): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO task_run_logs (task_id, run_at, duration_ms, status, result, error)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(log.task_id, log.run_at, log.duration_ms, log.status, log.result, log.error);
}

/** Fetch all run logs for a task, ordered chronologically. */
export function getTaskRunLogs(taskId: string): TaskRunLog[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM task_run_logs WHERE task_id = ? ORDER BY run_at")
    .all(taskId) as TaskRunLog[];
}
