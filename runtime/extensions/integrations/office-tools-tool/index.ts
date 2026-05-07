import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import { registerToolStatusHintProvider } from "../../../src/tool-status-hints.js";

const OFFICE_TOOLS_STATUS_ICON_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 3h10l4 4v14H4z"></path><path d="M14 3v5h4"></path><path d="M7 13h10"></path><path d="M7 17h10"></path></svg>`;
let cachedModule: Promise<typeof import("../office-tools/index.ts")> | null = null;

function readTrimmedString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

async function loadModule(): Promise<typeof import("../office-tools/index.ts")> {
  if (!cachedModule) cachedModule = import("../office-tools/index.ts");
  return await cachedModule;
}

registerToolStatusHintProvider({
  id: "office_tools",
  buildHints: ({ toolName, args }) => {
    if (toolName !== "office_read" && toolName !== "office_write") return null;
    const record = args && typeof args === "object" ? args as Record<string, unknown> : null;
    const path = readTrimmedString(record?.path);
    if (!path) return null;
    const mode = toolName === "office_read" ? "Office read" : "Office write";
    return {
      key: toolName,
      icon_svg: OFFICE_TOOLS_STATUS_ICON_SVG,
      label: path,
      title: `${mode} • ${path}`,
      kind: "file",
    };
  },
});

export default function register(pi: ExtensionAPI) {
  pi.registerTool({
    name: "office_read",
    label: "Read Office Document",
    description:
      "Read a Microsoft Office document (.docx, .xlsx, .pptx) and return its content as Markdown. " +
      "OOXML only; legacy .doc/.xls/.ppt formats are rejected.",
    promptSnippet: "office_read: extract a .docx, .xlsx, or .pptx file to Markdown for inspection.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Workspace path to the Office document (.docx, .xlsx, or .pptx)" },
      },
      required: ["path"],
    },
    async execute(_id, params, _signal, _onUpdate, ctx) {
      const mod = await loadModule();
      return await mod.executeOfficeRead(params, ctx as { cwd?: string } | undefined);
    },
  });

  pi.registerTool({
    name: "office_write",
    label: "Write Office Document",
    description:
      "Generate a Microsoft Office document (.docx, .xlsx, .pptx) or PDF (.pdf) from Markdown content.",
    promptSnippet: "office_write: generate a .docx, .xlsx, .pptx, or .pdf file from Markdown content.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Workspace output path (.docx, .xlsx, .pptx, or .pdf)" },
        markdown: { type: "string", description: "Markdown content to convert" },
      },
      required: ["path", "markdown"],
    },
    async execute(_id, params, signal, _onUpdate, ctx) {
      const mod = await loadModule();
      return await mod.executeOfficeWrite(params, signal, ctx as { cwd?: string } | undefined);
    },
  });
}
