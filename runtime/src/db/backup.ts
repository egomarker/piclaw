import Database from "bun:sqlite";
import { existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";

export interface SqliteBackupManifest {
  sourcePath: string;
  destinationPath: string;
  createdAt: string;
  sourceBytes: number;
  backupBytes: number;
  integrityCheck: string;
  applicationId: number;
  userVersion: number;
  tableCount: number;
  indexCount: number;
  triggerCount: number;
  viewCount: number;
}

function pragmaNumber(database: Database, pragma: "application_id" | "user_version"): number {
  const row = database.prepare(`PRAGMA ${pragma}`).get() as Record<string, unknown> | undefined;
  const value = row?.[pragma];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function schemaCounts(database: Database): Pick<SqliteBackupManifest, "tableCount" | "indexCount" | "triggerCount" | "viewCount"> {
  const rows = database.prepare(`
    SELECT type, COUNT(*) AS count
    FROM sqlite_master
    WHERE name NOT LIKE 'sqlite_%'
    GROUP BY type
  `).all() as Array<{ type: string; count: number }>;
  const counts = new Map(rows.map((row) => [row.type, row.count]));
  return {
    tableCount: counts.get("table") ?? 0,
    indexCount: counts.get("index") ?? 0,
    triggerCount: counts.get("trigger") ?? 0,
    viewCount: counts.get("view") ?? 0,
  };
}

export function verifySqliteBackup(path: string): Omit<SqliteBackupManifest, "sourcePath" | "destinationPath" | "createdAt" | "sourceBytes"> {
  const database = new Database(path, { readonly: true, strict: true });
  try {
    const integrityRow = database.prepare("PRAGMA integrity_check").get() as { integrity_check?: string } | undefined;
    const integrityCheck = String(integrityRow?.integrity_check ?? "");
    if (integrityCheck !== "ok") throw new Error(`SQLite backup integrity check failed: ${integrityCheck || "no result"}`);
    return {
      backupBytes: statSync(path).size,
      integrityCheck,
      applicationId: pragmaNumber(database, "application_id"),
      userVersion: pragmaNumber(database, "user_version"),
      ...schemaCounts(database),
    };
  } finally {
    database.close();
  }
}

/**
 * Create a transactionally consistent SQLite snapshot, including committed WAL data.
 * Existing destinations are never overwritten. The source connection stays caller-owned.
 */
export function createVerifiedSqliteBackup(
  source: Database,
  sourcePath: string,
  destinationPath: string,
): SqliteBackupManifest {
  const sourceResolved = resolve(sourcePath);
  const destinationResolved = resolve(destinationPath);
  if (sourceResolved === destinationResolved) throw new Error("SQLite backup destination must differ from source.");
  if (existsSync(destinationResolved)) throw new Error(`SQLite backup destination already exists: ${destinationResolved}`);
  mkdirSync(dirname(destinationResolved), { recursive: true });

  const sourceMetadata = {
    applicationId: pragmaNumber(source, "application_id"),
    userVersion: pragmaNumber(source, "user_version"),
    ...schemaCounts(source),
  };
  try {
    source.prepare("VACUUM INTO ?").run(destinationResolved);
    const verified = verifySqliteBackup(destinationResolved);
    for (const key of ["applicationId", "userVersion", "tableCount", "indexCount", "triggerCount", "viewCount"] as const) {
      if (verified[key] !== sourceMetadata[key]) {
        throw new Error(`SQLite backup verification mismatch for ${key}: source=${sourceMetadata[key]} backup=${verified[key]}`);
      }
    }
    return {
      sourcePath: sourceResolved,
      destinationPath: destinationResolved,
      createdAt: new Date().toISOString(),
      sourceBytes: statSync(sourceResolved).size,
      ...verified,
    };
  } catch (error) {
    rmSync(destinationResolved, { force: true });
    throw error;
  }
}
