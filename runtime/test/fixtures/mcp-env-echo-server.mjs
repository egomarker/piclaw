import readline from 'node:readline';

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
const send = (payload) => process.stdout.write(`${JSON.stringify(payload)}\n`);

rl.on('line', (line) => {
  if (!line.trim()) return;
  const request = JSON.parse(line);
  if (request.method === 'initialize') {
    send({ jsonrpc: '2.0', id: request.id, result: {
      protocolVersion: request.params?.protocolVersion || '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'piclaw-env-echo', version: '1.0.0' },
    } });
    return;
  }
  if (request.method === 'tools/list') {
    send({ jsonrpc: '2.0', id: request.id, result: { tools: [{
      name: 'inspect_env',
      description: 'Return selected environment values for compatibility tests.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    }] } });
    return;
  }
  if (request.method === 'tools/call') {
    const details = {
      cwd: process.cwd(),
      braces: process.env.MCP_FROM_BRACES,
      envPrefix: process.env.MCP_FROM_ENV_PREFIX,
      adapterForm: process.env.MCP_FROM_ADAPTER_FORM,
      plain: process.env.MCP_PLAIN_LITERAL,
      escapedBang: process.env.MCP_ESCAPED_BANG,
      arg: process.argv[2],
    };
    send({ jsonrpc: '2.0', id: request.id, result: {
      content: [{ type: 'text', text: JSON.stringify(details) }],
      structuredContent: details,
    } });
    return;
  }
  if (request.id !== undefined) {
    send({ jsonrpc: '2.0', id: request.id, error: { code: -32601, message: 'Method not found' } });
  }
});
