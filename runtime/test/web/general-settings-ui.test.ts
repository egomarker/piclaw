import { expect, test } from "bun:test";

import { writeSettingsClipboardText } from "../../web/src/components/settings/general.js";

test("general settings falls back to execCommand when the Clipboard API rejects", async () => {
  const calls: string[] = [];
  const textarea = {
    value: "",
    style: {} as Record<string, string>,
    setAttribute: () => {},
    focus: () => calls.push("focus"),
    select: () => calls.push("select"),
  };
  const body = {
    appendChild: () => calls.push("append"),
    removeChild: () => calls.push("remove"),
  };
  const originalDebug = console.debug;
  const debugCalls: unknown[][] = [];
  console.debug = (...args: unknown[]) => { debugCalls.push(args); };

  try {
    const copied = await writeSettingsClipboardText("secret", {
      navigator: { clipboard: { writeText: async () => { throw new Error("denied"); } } },
      document: {
        body,
        createElement: () => textarea,
        execCommand: (command: string) => {
          calls.push(command);
          return command === "copy";
        },
      },
    });

    expect(copied).toBe(true);
    expect(textarea.value).toBe("secret");
    expect(calls).toEqual(["append", "focus", "select", "copy", "remove"]);
    expect(debugCalls).toHaveLength(1);
    expect(String(debugCalls[0]?.[0])).toContain("falling back to execCommand");
  } finally {
    console.debug = originalDebug;
  }
});
