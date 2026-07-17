---
name: mcp-adapter
description: Use the bundled pi-mcp-adapter to connect MCP servers through .pi/mcp.json.
distribution: public
---

# MCP Adapter

Use `pi-mcp-adapter` to expose MCP servers to the agent through one `mcp` tool plus `/mcp` commands.

## Config locations

Preferred project-local config:

```bash
/workspace/.pi/mcp.json
```

Starter example:

```bash
cp /workspace/.pi/mcp.json.example /workspace/.pi/mcp.json
```

The adapter also understands the global Pi config at:

```bash
/config/.pi/agent/mcp.json
```

Use the project-local file when you want MCP servers tied to the current workspace.

## Minimal example

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "bunx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
      "lifecycle": "lazy"
    }
  }
}
```

## Common workflows

### List MCP status / tools

```text
mcp({})
```

### Search for a tool

```text
mcp({ search: "read file" })
```

### Describe a tool

```text
mcp({ describe: "filesystem_read_file" })
```

### Call a tool

```text
mcp({ tool: "filesystem_read_file", args: "{\"path\":\"./README.md\"}" })
```

`args` must be a JSON string.

### Interactive commands

```text
/mcp
/mcp tools
/mcp reconnect
/mcp reconnect filesystem
/mcp-auth <server>
```

## Notes

- MCP servers are lazy by default and connect on first use.
- After editing `.pi/mcp.json`, restart the session or reload Pi so the adapter re-reads config.
- Prefer `directTools` only for small, high-value tool sets. Keep large MCP servers behind the `mcp` proxy.
