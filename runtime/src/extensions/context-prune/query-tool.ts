import { Type, type Static } from "typebox";
import type { AgentToolResult, ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { DEFAULT_MAX_BYTES, DEFAULT_MAX_LINES, truncateHead } from "@earendil-works/pi-coding-agent";
import type { ToolCallIndexer } from "./indexer.js";
import { CONTEXT_TREE_QUERY_TOOL_NAME } from "./types.js";

const QuerySchema = Type.Object({
  toolCallIds: Type.Array(Type.String({ description: "One or more short refs or full tool call IDs to retrieve." }), {
    description: "Short refs from a context-prune summary, or full toolCallIds.",
  }),
});

type QueryParams = Static<typeof QuerySchema>;

export function registerContextTreeQueryTool(pi: ExtensionAPI, indexer: ToolCallIndexer): void {
  pi.registerTool({
    name: CONTEXT_TREE_QUERY_TOOL_NAME,
    label: "Query Pruned Tool History",
    description:
      "Retrieve original full tool call outputs that were summarized and pruned from active context. Pass short refs listed in context-prune summary messages.",
    promptSnippet: "Retrieve original pruned tool outputs by short ref",
    promptGuidelines: [
      "When a context-prune summary is insufficient, call context_tree_query with the short refs listed in that summary to recover full original tool outputs.",
    ],
    parameters: QuerySchema,
    async execute(_toolCallId, params: QueryParams): Promise<AgentToolResult<unknown>> {
      const foundRecords: Record<string, unknown> = {};
      const blocks: string[] = [];

      for (const id of params.toolCallIds) {
        const record = indexer.getRecord(id);
        if (!record) {
          blocks.push(`## toolRef: ${id}\n(not found in context-prune index — it may not have been summarized yet)`);
          continue;
        }

        foundRecords[id] = record;
        const status = record.isError ? "ERROR" : "OK";
        const header = [
          `## toolRef: ${id}`,
          `Tool: ${record.toolName}`,
          `Args: ${JSON.stringify(record.args, null, 2)}`,
          `Status: ${status}`,
          `Turn: ${record.turnIndex}`,
          "",
        ].join("\n");

        const truncated = truncateHead(record.resultText, {
          maxLines: DEFAULT_MAX_LINES,
          maxBytes: DEFAULT_MAX_BYTES,
        });
        let body = truncated.content;
        if (truncated.truncated) body += `\n[Output truncated: ${truncated.outputLines}/${truncated.totalLines} lines shown]`;
        blocks.push(`${header}\n${body}`);
      }

      return {
        content: [{ type: "text", text: blocks.join("\n\n---\n\n") }],
        details: { results: foundRecords },
      };
    },
  });
}
