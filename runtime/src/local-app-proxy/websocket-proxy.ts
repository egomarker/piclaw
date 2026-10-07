import { createHash, randomBytes } from "node:crypto";
import { createConnection, type Socket } from "node:net";
import type { ServerWebSocket, ServerWebSocketSendStatus } from "bun";

import { createLogger } from "../utils/logger.js";
import { buildLocalAppUpstreamHeaders } from "./http-proxy.js";
import type { ResolvedLocalApp } from "./types.js";
import { buildLocalAppUpstreamUrl } from "./urls.js";

const log = createLogger("local-app-proxy.websocket");

const UPSTREAM_HANDSHAKE_TIMEOUT_MS = 10_000;
const CLOSE_GRACE_MS = 1_000;
const MAX_HANDSHAKE_BYTES = 64 * 1024;
const MAX_MESSAGE_BYTES = 16 * 1024 * 1024;
const MAX_BUFFERED_BYTES = 16 * 1024 * 1024;
const MAX_PENDING_PINGS = 32;
const WEBSOCKET_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const textDecoder = new TextDecoder("utf-8", { fatal: true });

interface UpstreamHandlers {
  message(data: string | Buffer, binary: boolean): void;
  ping(data: Buffer): void;
  pong(data: Buffer): void;
  close(code: number, reason: string): void;
  error(error: Error): void;
}

export interface LocalAppSocketData {
  kind: "local-app";
  appId: string;
  bridge: LocalAppWebSocketBridge;
}

export interface PreparedLocalAppWebSocket {
  data: LocalAppSocketData;
  headers?: HeadersInit;
}

interface QueuedBrowserEvent {
  type: "message" | "ping" | "pong";
  data: string | Buffer;
  binary?: boolean;
  bytes: number;
}

class LocalAppWebSocketHandshakeError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "LocalAppWebSocketHandshakeError";
  }
}

function headerHasToken(value: string | null, token: string): boolean {
  if (!value) return false;
  return value
    .split(",")
    .some((entry) => entry.trim().toLowerCase() === token.toLowerCase());
}

function parseProtocols(value: string | null): string[] {
  if (!value) return [];
  const protocols: string[] = [];
  const seen = new Set<string>();
  for (const raw of value.split(",")) {
    const protocol = raw.trim();
    if (!protocol || !/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(protocol)) {
      throw new LocalAppWebSocketHandshakeError("Invalid WebSocket protocol header.", 400);
    }
    if (!seen.has(protocol)) {
      seen.add(protocol);
      protocols.push(protocol);
    }
  }
  return protocols;
}

function isValidCloseCode(code: number): boolean {
  if (code >= 3000 && code <= 4999) return true;
  return code >= 1000
    && code <= 1014
    && code !== 1004
    && code !== 1005
    && code !== 1006;
}

function truncateCloseReason(reason: string): string {
  const bytes = Buffer.from(reason);
  if (bytes.byteLength <= 123) return reason;
  let end = 123;
  while (end > 0 && (bytes[end] & 0xc0) === 0x80) end -= 1;
  return bytes.subarray(0, end).toString("utf8");
}

function encodeClosePayload(code: number, reason: string): Buffer {
  const safeCode = isValidCloseCode(code) ? code : 1002;
  const safeReason = truncateCloseReason(reason);
  const reasonBytes = Buffer.from(safeReason);
  const payload = Buffer.allocUnsafe(2 + reasonBytes.byteLength);
  payload.writeUInt16BE(safeCode, 0);
  reasonBytes.copy(payload, 2);
  return payload;
}

function encodeClientFrame(opcode: number, payloadLike: string | Buffer): Buffer {
  const payload = typeof payloadLike === "string" ? Buffer.from(payloadLike) : payloadLike;
  const payloadLength = payload.byteLength;
  let headerLength = 2 + 4;
  if (payloadLength >= 126 && payloadLength <= 0xffff) headerLength += 2;
  else if (payloadLength > 0xffff) headerLength += 8;

  const frame = Buffer.allocUnsafe(headerLength + payloadLength);
  frame[0] = 0x80 | opcode;
  let offset = 2;
  if (payloadLength < 126) {
    frame[1] = 0x80 | payloadLength;
  } else if (payloadLength <= 0xffff) {
    frame[1] = 0x80 | 126;
    frame.writeUInt16BE(payloadLength, 2);
    offset += 2;
  } else {
    frame[1] = 0x80 | 127;
    frame.writeBigUInt64BE(BigInt(payloadLength), 2);
    offset += 8;
  }

  const mask = randomBytes(4);
  mask.copy(frame, offset);
  offset += 4;
  for (let index = 0; index < payloadLength; index += 1) {
    frame[offset + index] = payload[index] ^ mask[index % 4];
  }
  return frame;
}

function parseHandshakeHeaders(block: string): { status: number; headers: Headers } {
  const lines = block.split("\r\n");
  const statusLine = lines.shift() || "";
  const match = /^HTTP\/1\.[01]\s+(\d{3})(?:\s|$)/i.exec(statusLine);
  if (!match) throw new LocalAppWebSocketHandshakeError("Invalid response from local app WebSocket.", 502);

  const headers = new Headers();
  for (const line of lines) {
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon <= 0) throw new LocalAppWebSocketHandshakeError("Invalid response from local app WebSocket.", 502);
    headers.append(line.slice(0, colon).trim(), line.slice(colon + 1).trim());
  }
  return { status: Number(match[1]), headers };
}

class RawUpstreamWebSocket {
  private socket: Socket | null = null;
  private handshakeBuffer = Buffer.alloc(0);
  private frameBuffer = Buffer.alloc(0);
  private fragmentOpcode: 0x1 | 0x2 | null = null;
  private fragments: Buffer[] = [];
  private fragmentBytes = 0;
  private open = false;
  private closing = false;
  private closed = false;
  private handshakeSettled = false;
  private selectedProtocol: string | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly target: URL,
    private readonly headers: Headers,
    private readonly offeredProtocols: string[],
    private readonly handlers: UpstreamHandlers,
  ) {}

  get protocol(): string | null {
    return this.selectedProtocol;
  }

  async connect(): Promise<void> {
    if (this.socket) throw new Error("Upstream WebSocket is already connecting.");
    const port = Number(this.target.port || 80);
    const key = randomBytes(16).toString("base64");
    const expectedAccept = createHash("sha1")
      .update(`${key}${WEBSOCKET_GUID}`)
      .digest("base64");

    await new Promise<void>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
        timer = null;
        fail(new LocalAppWebSocketHandshakeError("The local app WebSocket did not respond in time.", 504));
      }, UPSTREAM_HANDSHAKE_TIMEOUT_MS);

      const cleanupHandshake = () => {
        if (timer) clearTimeout(timer);
        timer = null;
      };

      const fail = (error: Error) => {
        if (this.handshakeSettled) return;
        this.handshakeSettled = true;
        this.closing = true;
        cleanupHandshake();
        this.socket?.destroy();
        reject(error);
      };

      const socket = createConnection({
        host: this.target.hostname,
        port,
      });
      this.socket = socket;
      socket.setNoDelay(true);

      socket.once("connect", () => {
        try {
          socket.write(this.buildHandshakeRequest(key));
        } catch (error) {
          fail(error instanceof Error ? error : new Error(String(error)));
        }
      });

      socket.on("data", (chunk: Buffer) => {
        if (!this.open) {
          this.handshakeBuffer = Buffer.concat([this.handshakeBuffer, chunk]);
          if (this.handshakeBuffer.byteLength > MAX_HANDSHAKE_BYTES) {
            fail(new LocalAppWebSocketHandshakeError("The local app WebSocket returned oversized headers.", 502));
            return;
          }
          const boundary = this.handshakeBuffer.indexOf("\r\n\r\n");
          if (boundary < 0) return;

          try {
            const headerBlock = this.handshakeBuffer.subarray(0, boundary).toString("latin1");
            const remaining = this.handshakeBuffer.subarray(boundary + 4);
            this.handshakeBuffer = Buffer.alloc(0);
            const response = parseHandshakeHeaders(headerBlock);
            this.validateHandshake(response.status, response.headers, expectedAccept);
            this.open = true;
            this.handshakeSettled = true;
            cleanupHandshake();
            resolve();
            if (remaining.byteLength > 0) this.acceptFrameBytes(remaining);
          } catch (error) {
            fail(error instanceof Error ? error : new Error(String(error)));
          }
          return;
        }
        this.acceptFrameBytes(chunk);
      });

      socket.once("error", (error) => {
        if (!this.handshakeSettled) {
          fail(new LocalAppWebSocketHandshakeError("Unable to reach the local app WebSocket.", 502));
          return;
        }
        if (!this.closed && !this.closing) this.handlers.error(error);
      });

      socket.once("close", () => {
        cleanupHandshake();
        this.closed = true;
        this.open = false;
        if (this.closeTimer) clearTimeout(this.closeTimer);
        this.closeTimer = null;
        if (!this.handshakeSettled) {
          fail(new LocalAppWebSocketHandshakeError("The local app closed the WebSocket handshake.", 502));
        } else if (!this.closing) {
          this.handlers.error(new Error("The local app WebSocket closed unexpectedly."));
        }
      });
    });
  }

  sendMessage(data: string | Buffer, binary: boolean): void {
    const bytes = typeof data === "string" ? Buffer.byteLength(data) : data.byteLength;
    if (bytes > MAX_MESSAGE_BYTES) throw new Error("WebSocket message is too large.");
    this.writeFrame(binary ? 0x2 : 0x1, data);
  }

  sendPing(data: Buffer): void {
    this.writeControlFrame(0x9, data);
  }

  sendPong(data: Buffer): void {
    this.writeControlFrame(0xa, data);
  }

  close(code = 1000, reason = ""): void {
    if (this.closed) return;
    if (!this.closing && this.open) {
      this.closing = true;
      try {
        this.writeFrame(0x8, encodeClosePayload(code, reason));
      } catch {
        this.terminate();
        return;
      }
      this.closeTimer = setTimeout(() => this.terminate(), CLOSE_GRACE_MS);
      return;
    }
    this.terminate();
  }

  terminate(): void {
    if (this.closed) return;
    this.closing = true;
    this.closed = true;
    this.open = false;
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.closeTimer = null;
    this.socket?.destroy();
  }

  pause(): void {
    this.socket?.pause();
  }

  resume(): void {
    this.socket?.resume();
  }

  private buildHandshakeRequest(key: string): string {
    const path = `${this.target.pathname || "/"}${this.target.search}`;
    const port = this.target.port || "80";
    const host = port === "80" ? this.target.hostname : `${this.target.hostname}:${port}`;
    const lines = [
      `GET ${path} HTTP/1.1`,
      `Host: ${host}`,
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Key: ${key}`,
      "Sec-WebSocket-Version: 13",
    ];
    if (this.offeredProtocols.length > 0) {
      lines.push(`Sec-WebSocket-Protocol: ${this.offeredProtocols.join(", ")}`);
    }
    for (const [name, value] of this.headers) {
      const lower = name.toLowerCase();
      if (lower === "host"
        || lower === "upgrade"
        || lower === "connection"
        || lower.startsWith("sec-websocket-")) continue;
      lines.push(`${name}: ${value}`);
    }
    lines.push("", "");
    return lines.join("\r\n");
  }

  private validateHandshake(status: number, headers: Headers, expectedAccept: string): void {
    if (status !== 101
      || !headerHasToken(headers.get("upgrade"), "websocket")
      || !headerHasToken(headers.get("connection"), "upgrade")
      || headers.get("sec-websocket-accept") !== expectedAccept) {
      throw new LocalAppWebSocketHandshakeError("The local app refused the WebSocket upgrade.", 502);
    }

    const protocol = headers.get("sec-websocket-protocol")?.trim() || null;
    if (protocol && !this.offeredProtocols.includes(protocol)) {
      throw new LocalAppWebSocketHandshakeError("The local app selected an invalid WebSocket protocol.", 502);
    }
    this.selectedProtocol = protocol;
  }

  private acceptFrameBytes(chunk: Buffer): void {
    if (this.closed) return;
    this.frameBuffer = this.frameBuffer.byteLength === 0
      ? Buffer.from(chunk)
      : Buffer.concat([this.frameBuffer, chunk]);

    try {
      while (this.consumeFrame()) {
        // Continue while complete frames remain buffered.
      }
    } catch (error) {
      this.protocolError(error instanceof Error ? error.message : "Invalid WebSocket frame.");
    }
  }

  private consumeFrame(): boolean {
    if (this.frameBuffer.byteLength < 2) return false;
    const first = this.frameBuffer[0];
    const second = this.frameBuffer[1];
    const fin = (first & 0x80) !== 0;
    const rsv = first & 0x70;
    const opcode = first & 0x0f;
    const masked = (second & 0x80) !== 0;
    let payloadLength = second & 0x7f;
    let offset = 2;

    if (rsv !== 0 || masked) throw new Error("Invalid WebSocket frame flags.");
    if (payloadLength === 126) {
      if (this.frameBuffer.byteLength < 4) return false;
      payloadLength = this.frameBuffer.readUInt16BE(2);
      offset = 4;
    } else if (payloadLength === 127) {
      if (this.frameBuffer.byteLength < 10) return false;
      const length = this.frameBuffer.readBigUInt64BE(2);
      if (length > BigInt(MAX_MESSAGE_BYTES)) throw new Error("WebSocket message is too large.");
      payloadLength = Number(length);
      offset = 10;
    }

    const control = opcode >= 0x8;
    if (control && (!fin || payloadLength > 125)) throw new Error("Invalid WebSocket control frame.");
    if (payloadLength > MAX_MESSAGE_BYTES) throw new Error("WebSocket message is too large.");
    if (this.frameBuffer.byteLength < offset + payloadLength) return false;

    const payload = Buffer.from(this.frameBuffer.subarray(offset, offset + payloadLength));
    this.frameBuffer = this.frameBuffer.subarray(offset + payloadLength);
    this.handleFrame(fin, opcode, payload);
    return !this.closed && this.frameBuffer.byteLength > 0;
  }

  private handleFrame(fin: boolean, opcode: number, payload: Buffer): void {
    if (opcode === 0x0) {
      if (this.fragmentOpcode === null) throw new Error("Unexpected WebSocket continuation frame.");
      this.appendFragment(payload);
      if (fin) this.finishFragmentedMessage();
      return;
    }

    if (opcode === 0x1 || opcode === 0x2) {
      if (this.fragmentOpcode !== null) throw new Error("Interleaved WebSocket data frames.");
      if (fin) {
        this.emitMessage(opcode, payload);
      } else {
        this.fragmentOpcode = opcode;
        this.fragments = [payload];
        this.fragmentBytes = payload.byteLength;
      }
      return;
    }

    if (opcode === 0x8) {
      this.handleCloseFrame(payload);
      return;
    }
    if (opcode === 0x9) {
      this.handlers.ping(payload);
      return;
    }
    if (opcode === 0xa) {
      this.handlers.pong(payload);
      return;
    }
    throw new Error("Unsupported WebSocket opcode.");
  }

  private appendFragment(payload: Buffer): void {
    this.fragmentBytes += payload.byteLength;
    if (this.fragmentBytes > MAX_MESSAGE_BYTES) throw new Error("WebSocket message is too large.");
    this.fragments.push(payload);
  }

  private finishFragmentedMessage(): void {
    const opcode = this.fragmentOpcode;
    const payload = Buffer.concat(this.fragments, this.fragmentBytes);
    this.fragmentOpcode = null;
    this.fragments = [];
    this.fragmentBytes = 0;
    if (opcode === null) throw new Error("Missing WebSocket fragment opcode.");
    this.emitMessage(opcode, payload);
  }

  private emitMessage(opcode: number, payload: Buffer): void {
    if (opcode === 0x1) {
      let text: string;
      try {
        text = textDecoder.decode(payload);
      } catch {
        throw new Error("Invalid UTF-8 in WebSocket text message.");
      }
      this.handlers.message(text, false);
      return;
    }
    this.handlers.message(payload, true);
  }

  private handleCloseFrame(payload: Buffer): void {
    let code = 1000;
    let reason = "";
    if (payload.byteLength === 1) throw new Error("Invalid WebSocket close frame.");
    if (payload.byteLength >= 2) {
      code = payload.readUInt16BE(0);
      if (!isValidCloseCode(code)) throw new Error("Invalid WebSocket close code.");
      try {
        reason = textDecoder.decode(payload.subarray(2));
      } catch {
        throw new Error("Invalid UTF-8 in WebSocket close reason.");
      }
    }

    if (!this.closing) {
      this.closing = true;
      this.writeFrame(0x8, payload.byteLength === 0 ? encodeClosePayload(code, reason) : payload);
    }
    this.handlers.close(code, reason);
    this.socket?.end();
  }

  private writeControlFrame(opcode: number, payload: Buffer): void {
    if (payload.byteLength > 125) throw new Error("WebSocket control payload is too large.");
    this.writeFrame(opcode, payload);
  }

  private writeFrame(opcode: number, payload: string | Buffer): void {
    if (!this.open || this.closed) throw new Error("Local app WebSocket is not open.");
    const frame = encodeClientFrame(opcode, payload);
    const socket = this.socket;
    if (!socket || socket.destroyed) throw new Error("Local app WebSocket is closed.");
    if (socket.writableLength + frame.byteLength > MAX_BUFFERED_BYTES) {
      throw new Error("Local app WebSocket exceeded its outbound buffer limit.");
    }
    socket.write(frame);
  }

  private protocolError(message: string): void {
    if (!this.closed && this.open) {
      try {
        this.writeFrame(0x8, encodeClosePayload(1002, "WebSocket protocol error"));
      } catch {
        // The socket is terminated below.
      }
    }
    this.handlers.error(new Error(message));
    this.terminate();
  }
}

export class LocalAppWebSocketBridge {
  private browser: ServerWebSocket<LocalAppSocketData> | null = null;
  private readonly upstream: RawUpstreamWebSocket;
  private queued: QueuedBrowserEvent[] = [];
  private queuedBytes = 0;
  private readonly pendingPings: Buffer[] = [];
  private finished = false;
  private pausedForBrowser = false;

  constructor(
    readonly app: ResolvedLocalApp,
    target: URL,
    upstreamHeaders: Headers,
    offeredProtocols: string[],
    private readonly onFinished: (bridge: LocalAppWebSocketBridge) => void,
  ) {
    this.upstream = new RawUpstreamWebSocket(target, upstreamHeaders, offeredProtocols, {
      message: (data, binary) => this.forwardEvent({
        type: "message",
        data,
        binary,
        bytes: typeof data === "string" ? Buffer.byteLength(data) : data.byteLength,
      }),
      ping: (data) => this.forwardEvent({ type: "ping", data, bytes: data.byteLength }),
      pong: (data) => this.forwardEvent({ type: "pong", data, bytes: data.byteLength }),
      close: (code, reason) => this.closeFromUpstream(code, reason),
      error: (error) => this.fail(error),
    });
  }

  get protocol(): string | null {
    return this.upstream.protocol;
  }

  get active(): boolean {
    return !this.finished;
  }

  async connect(): Promise<void> {
    await this.upstream.connect();
  }

  attachBrowser(browser: ServerWebSocket<LocalAppSocketData>): void {
    if (this.finished) {
      browser.close(1011, "Local app WebSocket is closed");
      return;
    }
    this.browser = browser;
    const queued = this.queued;
    this.queued = [];
    this.queuedBytes = 0;
    for (const event of queued) {
      if (!this.sendBrowserEvent(event)) break;
    }
  }

  handleBrowserMessage(message: string | Buffer | Uint8Array): void {
    if (this.finished) return;
    try {
      if (typeof message === "string") {
        this.upstream.sendMessage(message, false);
      } else {
        this.upstream.sendMessage(Buffer.isBuffer(message) ? message : Buffer.from(message), true);
      }
    } catch (error) {
      this.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  handleBrowserPing(data: Buffer): void {
    if (this.finished) return;
    try {
      this.upstream.sendPing(Buffer.from(data));
    } catch (error) {
      this.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  handleBrowserPong(data: Buffer): void {
    if (this.finished) return;
    const payload = Buffer.from(data);
    const index = this.pendingPings.findIndex((pending) => pending.equals(payload));
    if (index < 0) return;
    this.pendingPings.splice(index, 1);
    try {
      this.upstream.sendPong(payload);
    } catch (error) {
      this.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  handleBrowserDrain(): void {
    if (!this.pausedForBrowser || this.finished) return;
    this.pausedForBrowser = false;
    this.upstream.resume();
  }

  closeFromBrowser(code: number, reason: string): void {
    if (this.finished) return;
    this.finished = true;
    this.browser = null;
    this.queued = [];
    this.queuedBytes = 0;
    this.pendingPings.length = 0;
    this.upstream.close(isValidCloseCode(code) ? code : 1000, reason);
    this.onFinished(this);
  }

  terminate(): void {
    if (this.finished) return;
    this.finished = true;
    this.browser?.terminate();
    this.browser = null;
    this.queued = [];
    this.queuedBytes = 0;
    this.pendingPings.length = 0;
    this.upstream.terminate();
    this.onFinished(this);
  }

  private forwardEvent(event: QueuedBrowserEvent): void {
    if (this.finished) return;
    if (!this.browser) {
      this.queuedBytes += event.bytes;
      if (this.queuedBytes > MAX_BUFFERED_BYTES) {
        this.fail(new Error("Local app WebSocket sent too much data before the browser attached."));
        return;
      }
      this.queued.push(event);
      return;
    }
    this.sendBrowserEvent(event);
  }

  private sendBrowserEvent(event: QueuedBrowserEvent): boolean {
    const browser = this.browser;
    if (!browser || this.finished) return false;

    try {
      let status: ServerWebSocketSendStatus;
      if (event.type === "message") {
        status = event.binary
          ? browser.sendBinary(event.data as Buffer, false)
          : browser.sendText(event.data as string, false);
      } else if (event.type === "ping") {
        if (this.pendingPings.length >= MAX_PENDING_PINGS) {
          throw new Error("Too many unanswered local app WebSocket pings.");
        }
        const payload = Buffer.from(event.data as Buffer);
        this.pendingPings.push(payload);
        status = browser.ping(payload);
      } else {
        status = browser.pong(event.data as Buffer);
      }

      if (status === 0) throw new Error("Browser WebSocket dropped proxied data.");
      if (status === -1 && !this.pausedForBrowser) {
        this.pausedForBrowser = true;
        this.upstream.pause();
      }
      return true;
    } catch (error) {
      this.fail(error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  private closeFromUpstream(code: number, reason: string): void {
    if (this.finished) return;
    this.finished = true;
    this.queued = [];
    this.queuedBytes = 0;
    this.pendingPings.length = 0;
    try {
      this.browser?.close(code, truncateCloseReason(reason));
    } catch {
      this.browser?.terminate();
    }
    this.browser = null;
    this.onFinished(this);
  }

  private fail(error: Error): void {
    if (this.finished) return;
    log.warn("Local app WebSocket bridge failed", {
      operation: "local_app_proxy.websocket_bridge_failure",
      appId: this.app.id,
      slug: this.app.slug,
      port: this.app.port,
      err: error,
    });
    this.finished = true;
    this.queued = [];
    this.queuedBytes = 0;
    this.pendingPings.length = 0;
    try {
      this.browser?.close(1011, "Local app WebSocket failed");
    } catch {
      this.browser?.terminate();
    }
    this.browser = null;
    this.upstream.terminate();
    this.onFinished(this);
  }
}

function textResponse(message: string, status: number): Response {
  return new Response(message, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

export class LocalAppWebSocketProxy {
  private readonly bridges = new Set<LocalAppWebSocketBridge>();

  async prepare(
    request: Request,
    app: ResolvedLocalApp,
    suffix: string,
  ): Promise<PreparedLocalAppWebSocket | Response> {
    try {
      const protocols = parseProtocols(request.headers.get("sec-websocket-protocol"));
      const target = buildLocalAppUpstreamUrl(app, suffix, new URL(request.url).search);
      const upstreamHeaders = buildLocalAppUpstreamHeaders(request, app);
      const bridge = new LocalAppWebSocketBridge(
        app,
        target,
        upstreamHeaders,
        protocols,
        (finished) => this.bridges.delete(finished),
      );
      this.bridges.add(bridge);
      try {
        await bridge.connect();
      } catch (error) {
        bridge.terminate();
        throw error;
      }
      if (!bridge.active) {
        return textResponse("The local app WebSocket closed during its handshake.", 502);
      }
      return {
        data: { kind: "local-app", appId: app.id, bridge },
        ...(bridge.protocol ? { headers: { "sec-websocket-protocol": bridge.protocol } } : {}),
      };
    } catch (error) {
      if (error instanceof LocalAppWebSocketHandshakeError) {
        return textResponse(error.message, error.status);
      }
      log.warn("Unable to open local app WebSocket upstream", {
        operation: "local_app_proxy.websocket_handshake_failure",
        appId: app.id,
        slug: app.slug,
        port: app.port,
        err: error,
      });
      return textResponse("Unable to reach the local app WebSocket.", 502);
    }
  }

  attachBrowser(ws: ServerWebSocket<LocalAppSocketData>): void {
    ws.data.bridge.attachBrowser(ws);
  }

  handleMessage(ws: ServerWebSocket<LocalAppSocketData>, message: string | Buffer | Uint8Array): void {
    ws.data.bridge.handleBrowserMessage(message);
  }

  handlePing(ws: ServerWebSocket<LocalAppSocketData>, data: Buffer): void {
    ws.data.bridge.handleBrowserPing(data);
  }

  handlePong(ws: ServerWebSocket<LocalAppSocketData>, data: Buffer): void {
    ws.data.bridge.handleBrowserPong(data);
  }

  handleDrain(ws: ServerWebSocket<LocalAppSocketData>): void {
    ws.data.bridge.handleBrowserDrain();
  }

  detachBrowser(ws: ServerWebSocket<LocalAppSocketData>, code: number, reason: string): void {
    ws.data.bridge.closeFromBrowser(code, reason);
  }

  abortPrepared(data: LocalAppSocketData): void {
    data.bridge.terminate();
  }

  closeApp(appId: string): void {
    for (const bridge of Array.from(this.bridges)) {
      if (bridge.app.id === appId) bridge.terminate();
    }
  }

  shutdown(): void {
    for (const bridge of Array.from(this.bridges)) bridge.terminate();
    this.bridges.clear();
  }
}
