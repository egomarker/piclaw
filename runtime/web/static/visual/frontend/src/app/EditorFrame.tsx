/**
 * EditorFrame.tsx — Lazy-loading wrapper that mounts the shared editor bundle
 * into the visual UI's extension page area.
 *
 * Dynamically imports editor.bundle.js (CodeMirror 6), creates a
 * StandaloneEditorInstance, and manages its lifecycle via useEffect cleanup.
 */
import { useEffect, useRef, useState } from "preact/hooks";
import { createLogger } from "../utils/logger";

const log = createLogger("EditorFrame");

interface EditorFrameProps {
  /** Workspace-relative file path to open. */
  filePath: string;
  /** Called when the user closes/navigates away. */
  onBack?: () => void;
}

let editorBundlePromise: Promise<any> | null = null;

function loadEditorBundle(): Promise<any> {
  if (!editorBundlePromise) {
    editorBundlePromise = import(
      /* @vite-ignore */
      "/static/classic/dist/editor.bundle.js"
    ).catch((err) => {
      editorBundlePromise = null;
      throw err;
    });
  }
  return editorBundlePromise;
}

export function EditorFrame({ filePath, onBack }: EditorFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let disposed = false;

    // Wait for next frame so containerRef is attached
    requestAnimationFrame(() => {
      if (disposed || !containerRef.current || !filePath) return;

      (async () => {
        try {
          setStatus("loading");
          const mod = await loadEditorBundle();
          if (disposed || !containerRef.current) return;

          const EditorClass = mod.StandaloneEditorInstance || mod.default?.StandaloneEditorInstance;
          if (!EditorClass) {
            throw new Error("editor.bundle.js does not export StandaloneEditorInstance");
          }

          containerRef.current.innerHTML = "";

          const instance = new EditorClass(containerRef.current, {
            path: filePath,
            mode: "edit",
          });

          instanceRef.current = instance;
          if (!disposed) setStatus("ready");
        } catch (err) {
          if (disposed) return;
          log.error("Failed to load editor", err);
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : String(err));
        }
      })();
    });

    return () => {
      disposed = true;
      if (instanceRef.current?.dispose) {
        try { instanceRef.current.dispose(); } catch { /* ignore */ }
      }
      instanceRef.current = null;
    };
  }, [filePath]);

  return (
    <div className={`editor-frame editor-frame--${status}`}>
      <div className="editor-frame__header">
        <button className="editor-frame__back" onClick={onBack} title="Back">←</button>
        <span className="editor-frame__path">{filePath}</span>
        {status === "loading" && <span className="editor-frame__spinner">Loading editor…</span>}
        {status === "error" && <span className="editor-frame__error-inline">{errorMsg}</span>}
      </div>
      <div className="editor-frame__container" ref={containerRef} />
    </div>
  );
}
