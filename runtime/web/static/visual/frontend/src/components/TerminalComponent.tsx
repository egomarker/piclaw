import { useEffect, useRef, useState } from "preact/hooks";
import { init, Terminal, FitAddon } from "ghostty-web";
import type { ITheme } from "ghostty-web";


import { createLogger } from "../utils/logger";
const log = createLogger("terminal");
// Catppuccin Mocha theme colors matching theme.ts dark theme
const CATPPUCCIN_MOCHA_THEME: ITheme = {
  foreground: "#cdd6f4",
  background: "#11111b",
  cursor: "#f5e0dc",
  cursorAccent: "#11111b",
  selectionBackground: "#45475a",
  selectionForeground: "#cdd6f4",
  // Normal colors
  black: "#45475a",
  red: "#f38ba8",
  green: "#a6e3a1",
  yellow: "#f9e2af",
  blue: "#89b4fa",
  magenta: "#f5c2e7",
  cyan: "#94e2d5",
  white: "#bac2de",
  // Bright colors
  brightBlack: "#585b70",
  brightRed: "#f38ba8",
  brightGreen: "#a6e3a1",
  brightYellow: "#f9e2af",
  brightBlue: "#89b4fa",
  brightMagenta: "#f5c2e7",
  brightCyan: "#94e2d5",
  brightWhite: "#a6adc8",
};

interface TerminalSessionInfo {
  ws_path: string;
}

function getTerminalClientId(): string {
  const key = "piclaw-terminal-client-id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

let wasmInitialized = false;
let wasmInitPromise: Promise<void> | null = null;

/**
 * Intercept fetch calls for data: WASM URLs and redirect to the vendored file.
 * ghostty-web's bundled init() tries to fetch the WASM as a base64 data: URL,
 * which fails in non-secure contexts. This shim rewrites to the vendored path.
 */
const GHOSTTY_WASM_PATH = "/static/common/js/vendor/ghostty-vt.wasm";
const originalFetch = globalThis.fetch;

async function withWasmFetchShim<T>(fn: () => Promise<T>): Promise<T> {
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.startsWith("data:application/wasm")) {
      return originalFetch(new URL(GHOSTTY_WASM_PATH, window.location.origin).href, init);
    }
    return originalFetch(input, init);
  };
  try {
    return await fn();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function ensureWasmInit(): Promise<void> {
  if (wasmInitialized) return;
  if (!wasmInitPromise) {
    wasmInitPromise = withWasmFetchShim(() => init()).then(() => {
      wasmInitialized = true;
    });
  }
  return wasmInitPromise;
}

type ConnStatus = "connecting" | "connected" | "error" | "retrying";

export function TerminalComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const mountedRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [connStatus, setConnStatus] = useState<ConnStatus>("connecting");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    mountedRef.current = true;
    let terminal: Terminal | null = null;
    let fitAddon: FitAddon | null = null;
    let ws: WebSocket | null = null;

    async function setup() {
      if (!containerRef.current || !mountedRef.current) return;

      setConnStatus("connecting");
      setErrorMsg("");

      // Load WASM first
      try {
        await ensureWasmInit();
      } catch (err) {
        log.error("WASM init failed:", err);
        if (mountedRef.current) {
          setConnStatus("error");
          setErrorMsg("Failed to load terminal engine. Will retry...");
          scheduleRetry();
        }
        return;
      }
      if (!mountedRef.current) return;

      // Fetch terminal session info — fall back to default path if this fails
      const clientId = getTerminalClientId();
      let wsPath = "/terminal/ws";
      try {
        const resp = await fetch(`/terminal/session?client=${clientId}`, { credentials: "same-origin" });
        if (resp.ok) {
          const sessionInfo = await resp.json() as TerminalSessionInfo;
          wsPath = sessionInfo.ws_path || wsPath;
        } else {
          log.warn(/terminal/session returned ${resp.status}, connecting directly`);
        }
      } catch (err) {
        log.warn(failed to fetch session info, connecting directly:", err);
      }

      if (!mountedRef.current || !containerRef.current) return;

      // Dispose any existing terminal before creating a new one
      if (terminalRef.current) {
        terminalRef.current.dispose();
        terminalRef.current = null;
      }

      // Create terminal
      terminal = new Terminal({
        fontFamily: '"JetBrains Mono NF", monospace',
        fontSize: 13,
        theme: CATPPUCCIN_MOCHA_THEME,
        cursorBlink: true,
        cursorStyle: "block",
        scrollback: 5000,
      });

      terminalRef.current = terminal;

      // Load FitAddon
      fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);

      // Mount terminal to DOM — container needs non-zero dimensions
      terminal.open(containerRef.current);

      // Wait for fonts to be ready before fitting
      try {
        await document.fonts.ready;
      } catch (_) { /* ignore */ }

      if (!mountedRef.current) return;
      fitAddon.fit();
      fitAddon.observeResize();

      // Connect WebSocket
      const wsUrl = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + wsPath + (wsPath.includes("?") ? "&" : "?") + `client=${clientId}`;
      ws = new WebSocket(wsUrl);

      const connectTimeout = setTimeout(() => {
        if (ws && ws.readyState !== WebSocket.OPEN && mountedRef.current) {
          ws.close();
          setConnStatus("error");
          setErrorMsg("Connection timed out. Retrying...");
          scheduleRetry();
        }
      }, 8000);

      ws.addEventListener("open", () => {
        clearTimeout(connectTimeout);
        if (!mountedRef.current) return;
        setConnStatus("connected");
        setErrorMsg("");
        // Send resize on open after fit
        const dims = fitAddon!.proposeDimensions();
        if (dims) {
          ws!.send(JSON.stringify({ type: "resize", cols: dims.cols, rows: dims.rows }));
        }
      });

      ws.addEventListener("message", (event: MessageEvent) => {
        if (!terminal) return;
        try {
          const msg = JSON.parse(event.data as string);
          if (msg.type === "output" && typeof msg.data === "string") {
            terminal.write(msg.data);
          } else if (msg.type === "session") {
            // Session established — optionally resize to server's reported dimensions
            const cols = msg.cols as number | undefined;
            const rows = msg.rows as number | undefined;
            if (cols && rows) {
              // Prefer fit dimensions but accept server's if no container size yet
              const dims = fitAddon!.proposeDimensions();
              if (!dims) {
                terminal.resize(cols, rows);
              }
            }
          }
        } catch (_) {
          // Binary or non-JSON data — write directly
          if (typeof event.data === "string") {
            terminal.write(event.data);
          }
        }
      });

      ws.addEventListener("close", (event) => {
        clearTimeout(connectTimeout);
        if (mountedRef.current) {
          if (event.code === 1006) {
            setConnStatus("error");
            setErrorMsg("Terminal connection rejected — check authentication.");
            scheduleRetry(10000);
          } else {
            const reason = event.reason ? `: ${event.reason}` : "";
            setConnStatus("retrying");
            setErrorMsg(`Connection closed (code ${event.code}${reason}). Retrying in 3s...`);
            scheduleRetry(3000);
          }
        }
      });

      ws.addEventListener("error", () => {
        clearTimeout(connectTimeout);
        if (mountedRef.current) {
          setConnStatus("error");
          setErrorMsg("WebSocket error. Retrying in 3s...");
          scheduleRetry();
        }
      });

      // Forward keyboard input to WebSocket
      terminal.onData((data: string) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "input", data }));
        }
      });

      // Forward resize events to WebSocket
      terminal.onResize(({ cols, rows }: { cols: number; rows: number }) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "resize", cols, rows }));
        }
      });
    }

    function scheduleRetry(delay = 3000) {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setConnStatus("connecting");
          setup().catch((err) => log.error(setup error:", err));
        }
      }, delay);
    }

    setup().catch((err) => {
      log.error(setup error:", err);
      if (mountedRef.current) {
        setConnStatus("error");
        setErrorMsg(`Failed to start terminal: ${String(err)}`);
        scheduleRetry();
      }
    });

    return () => {
      mountedRef.current = false;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      if (ws) {
        ws.close();
      }
      if (terminal) {
        terminal.dispose();
        terminalRef.current = null;
      }
    };
  }, []);

  const showOverlay = connStatus !== "connected";

  return (
    <div className="terminal__outer">
      {/* Terminal canvas container — always rendered so open() has a DOM target */}
      <div
        ref={containerRef}
        className="terminal__canvas"
      />
      {/* Status overlay — shown while connecting/erroring */}
      {showOverlay && (
        <div
          className={`terminal__overlay${connStatus === "error" ? " terminal__overlay--error" : ""}`}
        >
          {connStatus === "connecting" && (
            <span className="terminal__overlay-connecting">Connecting to terminal...</span>
          )}
          {(connStatus === "error" || connStatus === "retrying") && (
            <>
              <span className="terminal__overlay-error">⚠ {errorMsg || "Terminal connection error"}</span>
              <span className="terminal__overlay-retry">Retrying automatically...</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
