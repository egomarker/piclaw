// Real stdio / Streamable HTTP MCP fixture. Logs contain fixture data only.
import { appendFileSync } from "node:fs";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { InitializeRequestSchema, isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const [mode, logPath, startupDelay = "0"] = process.argv.slice(2);
const log = (event, data = {}) => appendFileSync(logPath, `${JSON.stringify({ event, pid: process.pid, at: Date.now(), ...data })}\n`);
const servers = new Set();
const image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6M4sAAAAASUVORK5CYII=";
log("process_start", { mode });

function makeServer() {
  const server = new McpServer({ name: "piclaw-pi99-fixture", version: "1.0.0" });
  servers.add(server);
  let late;
  async function wait(delayMs, tag, extra) {
    log("slow_start", { tag, delayMs });
    return await new Promise((resolve, reject) => {
      let settled = false;
      const finish = (fn) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        clearInterval(progress);
        extra.signal.removeEventListener("abort", abort);
        fn();
      };
      const timer = setTimeout(() => finish(() => {
        log("slow_complete", { tag });
        resolve({ content: [{ type: "text", text: `complete:${tag}` }] });
      }), delayMs);
      // Repeated work/progress must not extend Piclaw's absolute deadline.
      let tick = 0;
      const progress = setInterval(() => {
        log("progress", { tag, tick: ++tick });
        if (extra._meta?.progressToken !== undefined) {
          void extra.sendNotification({ method: "notifications/progress", params: { progressToken: extra._meta.progressToken, progress: tick } }).catch(() => {});
        }
      }, 20);
      const abort = () => finish(() => {
        log("slow_abort", { tag, reason: String(extra.signal.reason ?? "") });
        reject(new Error("fixture request cancelled"));
      });
      extra.signal.addEventListener("abort", abort, { once: true });
      if (extra.signal.aborted) abort();
    });
  }
  server.registerTool("echo", {
    description: "Echo fixture input", inputSchema: { text: z.string() }, annotations: { readOnlyHint: true },
  }, async ({ text }) => {
    log("echo_call", { text });
    return { content: [{ type: "text", text: `echo:${text}` }], structuredContent: { echoed: text } };
  });
  server.registerTool("slow", {
    description: "Cancellable fixture work", inputSchema: { delayMs: z.number(), tag: z.string() },
  }, async ({ delayMs, tag }, extra) => wait(delayMs, tag, extra));
  server.registerTool("results", {
    description: "Fixture result variants", inputSchema: { kind: z.enum(["mixed", "structured", "error", "empty", "env"]) },
  }, async ({ kind }) => {
    if (kind === "error") return { isError: true, content: [{ type: "text", text: "fixture-tool-error" }] };
    if (kind === "mixed") return { content: [{ type: "text", text: "mixed:fixture" }, { type: "image", data: image, mimeType: "image/png" }], structuredContent: { answer: 42 } };
    if (kind === "structured") return { content: [], structuredContent: { answer: 42 } };
    if (kind === "empty") return { content: [] };
    const details = { braces: process.env.MCP_FROM_BRACES, envPrefix: process.env.MCP_FROM_ENV_PREFIX, adapterForm: process.env.MCP_FROM_ADAPTER_FORM, plain: process.env.MCP_PLAIN_LITERAL, escapedBang: process.env.MCP_ESCAPED_BANG };
    return { content: [{ type: "text", text: JSON.stringify(details) }], structuredContent: details };
  });
  server.registerTool("mutate", {
    description: "Change the live fixture tool list", inputSchema: { action: z.enum(["add", "update", "remove"]) },
  }, async ({ action }) => {
    if (action === "add") late = server.registerTool("late", {
      description: "Late fixture tool", inputSchema: { delayMs: z.number(), tag: z.string() },
    }, async ({ delayMs, tag }, extra) => wait(delayMs, tag, extra));
    if (action === "update") late.update({ description: "Late fixture tool updated" });
    if (action === "remove") { late.remove(); late = undefined; }
    log("tool_mutation", { action });
    return { content: [{ type: "text", text: action }] };
  });
  if (Number(startupDelay) > 0) {
    server.server.setRequestHandler(InitializeRequestSchema, async (request) => {
      log("initialize_wait");
      await new Promise((resolve) => setTimeout(resolve, Number(startupDelay)));
      return { protocolVersion: request.params.protocolVersion, capabilities: { tools: { listChanged: true } }, serverInfo: { name: "delayed-fixture", version: "1.0.0" } };
    });
  }
  return server;
}

let http;
if (mode === "stdio") {
  await makeServer().connect(new StdioServerTransport());
  log("transport_connected");
} else if (mode === "http") {
  const sessions = new Map();
  http = createServer(async (req, res) => {
    const authorized = req.headers.authorization === `Bearer ${process.env.MCP_HTTP_AUTH_TOKEN}`;
    const headerExpanded = req.headers["x-fixture-token"] === process.env.MCP_HTTP_AUTH_TOKEN;
    log("http_request", { method: req.method, authorized, headerExpanded });
    if (!authorized || !headerExpanded) { res.writeHead(401); res.end("fixture unauthorized"); return; }
    let body;
    if (req.method === "POST") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = JSON.parse(Buffer.concat(chunks).toString());
    }
    let transport = sessions.get(req.headers["mcp-session-id"]);
    if (!transport && isInitializeRequest(body)) {
      transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => randomUUID(), onsessioninitialized: (id) => sessions.set(id, transport) });
      await makeServer().connect(transport);
      log("http_initialize");
    }
    if (!transport) { res.writeHead(400); res.end("no fixture session"); return; }
    try { await transport.handleRequest(req, res, body); }
    catch { if (!res.headersSent) res.writeHead(500); res.end("fixture transport failed"); }
  });
  await new Promise((resolve) => http.listen(0, "127.0.0.1", resolve));
  log("http_listen", { url: `http://127.0.0.1:${http.address().port}/mcp` });
} else throw new Error("fixture mode must be stdio or http");

for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => {
  log("process_signal", { signal });
  void Promise.all([...servers].map((server) => server.close())).finally(() => {
    http?.close();
    process.exit(0);
  });
});
process.on("exit", (code) => log("process_exit", { code }));
process.on("unhandledRejection", (error) => log("unhandled_rejection", { message: String(error) }));
