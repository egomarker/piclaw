import { homedir } from "node:os";
import { join, resolve } from "node:path";

const PICLAW_AGENT_DIR_ENV = "PICLAW_PI_AGENT_DIR";
const UPSTREAM_AGENT_DIR_ENV = "PI_CODING_AGENT_DIR";

/** Resolve Piclaw's single canonical Pi agent directory. */
export function getPiclawAgentDir(env: NodeJS.ProcessEnv = process.env): string {
  const configured = env[PICLAW_AGENT_DIR_ENV]?.trim() || env[UPSTREAM_AGENT_DIR_ENV]?.trim();
  return resolve(configured || join(homedir(), ".pi", "agent"));
}

/** Keep Earendil's upstream path resolver aligned with Piclaw before runtime imports. */
export function syncUpstreamAgentDirEnv(env: NodeJS.ProcessEnv = process.env): string {
  const agentDir = getPiclawAgentDir(env);
  env[PICLAW_AGENT_DIR_ENV] = agentDir;
  env[UPSTREAM_AGENT_DIR_ENV] = agentDir;
  return agentDir;
}
