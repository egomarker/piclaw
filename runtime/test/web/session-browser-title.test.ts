import { afterEach, expect, test } from "bun:test";

import { formatSessionBrowserTitle } from "../../web/src/ui/browser-title.js";
import {
  updateActiveSessionHandle,
  updateAgentDisplayName,
} from "../../web/static/visual/frontend/src/api/agent-identity.js";

const originalDocument = (globalThis as any).document;

afterEach(() => {
  (globalThis as any).document = { title: "" };
  updateActiveSessionHandle(null);
  updateAgentDisplayName("PiClaw");
  (globalThis as any).document = originalDocument;
});

const cases: Array<[unknown, unknown, string]> = [
  ["Smith", "research", "Smith - @research"],
  [" Smith ", "@research", "Smith - @research"],
  ["Smith", "", "Smith"],
  ["", null, "PiClaw"],
];

test("browser title appends the active session handle", () => {
  for (const [agentName, sessionHandle, expected] of cases) {
    expect(formatSessionBrowserTitle(agentName, sessionHandle)).toBe(expected);
  }
});

test("Visual title reacts to agent and session changes", () => {
  (globalThis as any).document = { title: "" };

  updateAgentDisplayName("Smith");
  expect(document.title).toBe("Smith");

  updateActiveSessionHandle("research");
  expect(document.title).toBe("Smith - @research");

  updateActiveSessionHandle("renamed");
  expect(document.title).toBe("Smith - @renamed");

  updateActiveSessionHandle(null);
  expect(document.title).toBe("Smith");
});

