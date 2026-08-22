import {
  getDocument,
  GlobalWorkerOptions,
  PasswordResponses,
} from "pdfjs-dist";
import {
  EventBus,
  LinkTarget,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer.mjs";

const PDFJS_ASSET_ROOT = "/static/common/pdfjs";
const PDFJS_WORKER_URL = "/static/common/dist/pdf-viewer-worker.bundle.js?v=6.2.108-piclaw1";
const MAX_MOBILE_CANVAS_PIXELS = 16_777_216;
const MAX_MOBILE_CANVAS_DIMENSION = 8_192;

export interface MobilePdfViewerOptions {
  sourceUrl: string;
  name?: string;
}

interface PageChangingEvent {
  pageNumber?: number;
}

interface ScaleChangingEvent {
  presetValue?: string;
  scale?: number;
}

interface TouchPoint {
  clientX: number;
  clientY: number;
}

function requiredElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Mobile PDF viewer element is missing: ${selector}`);
  return element;
}

function touchDistance(first: TouchPoint, second: TouchPoint): number {
  return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
}

function touchMidpoint(first: TouchPoint, second: TouchPoint): [number, number] {
  return [
    (first.clientX + second.clientX) / 2,
    (first.clientY + second.clientY) / 2,
  ];
}

function friendlyError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return "The PDF could not be opened.";
}

export async function mountMobilePdfViewer(options: MobilePdfViewerOptions): Promise<void> {
  if (!options.sourceUrl) throw new Error("A PDF source URL is required.");

  GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;

  const documentName = options.name?.trim() || "PDF document";
  document.title = documentName;
  document.body.replaceChildren();
  document.body.dataset.pdfRenderer = "pdfjs";

  const shell = document.createElement("main");
  shell.className = "pdfjs-mobile-shell";
  shell.innerHTML = `
    <div class="pdfjs-mobile-toolbar" role="toolbar" aria-label="PDF controls">
      <span class="pdfjs-mobile-title" data-pdf-title></span>
      <span class="pdfjs-mobile-page" data-pdf-page aria-live="polite">— / —</span>
      <button type="button" data-pdf-action="zoom-out" aria-label="Zoom out">−</button>
      <span class="pdfjs-mobile-zoom" data-pdf-zoom aria-live="polite">—</span>
      <button type="button" data-pdf-action="zoom-in" aria-label="Zoom in">+</button>
      <button type="button" data-pdf-action="fit-width" aria-label="Fit to width" aria-pressed="true">Fit</button>
      <button type="button" data-pdf-action="rotate" aria-label="Rotate clockwise">↻</button>
      <a class="pdfjs-mobile-download" data-pdf-download aria-label="Download PDF">↓</a>
    </div>
    <div class="pdfjs-mobile-stage">
      <div class="pdfjs-mobile-container" data-pdf-container tabindex="0" aria-label="PDF pages">
        <div class="pdfViewer" data-pdf-viewer></div>
      </div>
      <div class="pdfjs-mobile-state" data-pdf-state role="status" aria-live="polite">
        <div class="pdfjs-mobile-spinner" data-pdf-spinner aria-hidden="true"></div>
        <strong data-pdf-state-title>Loading PDF…</strong>
        <span data-pdf-state-detail>Starting viewer</span>
        <div class="pdfjs-mobile-progress" data-pdf-progress aria-hidden="true"><span></span></div>
        <div class="pdfjs-mobile-state-actions" data-pdf-state-actions hidden>
          <button type="button" data-pdf-retry>Retry</button>
          <a data-pdf-error-download>Download PDF</a>
        </div>
      </div>
    </div>
  `;
  document.body.append(shell);

  const title = requiredElement<HTMLElement>(shell, "[data-pdf-title]");
  const pageLabel = requiredElement<HTMLElement>(shell, "[data-pdf-page]");
  const zoomLabel = requiredElement<HTMLElement>(shell, "[data-pdf-zoom]");
  const container = requiredElement<HTMLDivElement>(shell, "[data-pdf-container]");
  const viewerElement = requiredElement<HTMLDivElement>(shell, "[data-pdf-viewer]");
  const state = requiredElement<HTMLElement>(shell, "[data-pdf-state]");
  const stateTitle = requiredElement<HTMLElement>(shell, "[data-pdf-state-title]");
  const stateDetail = requiredElement<HTMLElement>(shell, "[data-pdf-state-detail]");
  const spinner = requiredElement<HTMLElement>(shell, "[data-pdf-spinner]");
  const progress = requiredElement<HTMLElement>(shell, "[data-pdf-progress]");
  const progressBar = requiredElement<HTMLElement>(progress, "span");
  const stateActions = requiredElement<HTMLElement>(shell, "[data-pdf-state-actions]");
  const retryButton = requiredElement<HTMLButtonElement>(shell, "[data-pdf-retry]");
  const fitWidthButton = requiredElement<HTMLButtonElement>(shell, "[data-pdf-action='fit-width']");
  const zoomInButton = requiredElement<HTMLButtonElement>(shell, "[data-pdf-action='zoom-in']");
  const zoomOutButton = requiredElement<HTMLButtonElement>(shell, "[data-pdf-action='zoom-out']");
  const rotateButton = requiredElement<HTMLButtonElement>(shell, "[data-pdf-action='rotate']");
  const downloadLink = requiredElement<HTMLAnchorElement>(shell, "[data-pdf-download]");
  const errorDownloadLink = requiredElement<HTMLAnchorElement>(shell, "[data-pdf-error-download]");

  title.textContent = documentName;
  title.title = documentName;
  for (const link of [downloadLink, errorDownloadLink]) {
    link.href = options.sourceUrl;
    link.download = documentName;
  }
  retryButton.addEventListener("click", () => location.reload());

  const showError = (message: string) => {
    state.classList.remove("is-hidden");
    state.classList.add("is-error");
    spinner.hidden = true;
    progress.hidden = true;
    stateTitle.textContent = "Unable to open PDF";
    stateDetail.textContent = message;
    stateActions.hidden = false;
  };

  const eventBus = new EventBus();
  const linkService = new PDFLinkService({
    eventBus,
    externalLinkTarget: LinkTarget.BLANK,
    externalLinkRel: "noopener noreferrer nofollow",
  });
  const pdfViewer = new PDFViewer({
    container,
    viewer: viewerElement,
    eventBus,
    linkService,
    maxCanvasPixels: MAX_MOBILE_CANVAS_PIXELS,
    maxCanvasDim: MAX_MOBILE_CANVAS_DIMENSION,
    enableDetailCanvas: true,
    supportsPinchToZoom: true,
  });
  linkService.setViewer(pdfViewer);

  let fitWidth = true;
  let pagesCount = 0;
  let resizeFrame = 0;
  let pinchDistance = 0;
  let passwordCancelled = false;

  const updateFitButton = () => {
    fitWidthButton.setAttribute("aria-pressed", String(fitWidth));
    fitWidthButton.classList.toggle("is-active", fitWidth);
  };
  updateFitButton();

  eventBus.on("pagesinit", () => {
    pdfViewer.currentScaleValue = "page-width";
    state.classList.add("is-hidden");
    container.focus({ preventScroll: true });
  });
  eventBus.on("pagesloaded", (event: { pagesCount?: number }) => {
    pagesCount = event.pagesCount || pagesCount;
    pageLabel.textContent = `${pdfViewer.currentPageNumber} / ${pagesCount}`;
  });
  eventBus.on("pagechanging", (event: PageChangingEvent) => {
    pageLabel.textContent = `${event.pageNumber || pdfViewer.currentPageNumber} / ${pagesCount || "—"}`;
  });
  eventBus.on("scalechanging", (event: ScaleChangingEvent) => {
    fitWidth = event.presetValue === "page-width";
    updateFitButton();
    const scale = event.scale || pdfViewer.currentScale;
    zoomLabel.textContent = Number.isFinite(scale) ? `${Math.round(scale * 100)}%` : "—";
  });

  zoomInButton.addEventListener("click", () => {
    fitWidth = false;
    updateFitButton();
    pdfViewer.increaseScale();
  });
  zoomOutButton.addEventListener("click", () => {
    fitWidth = false;
    updateFitButton();
    pdfViewer.decreaseScale();
  });
  fitWidthButton.addEventListener("click", () => {
    fitWidth = true;
    updateFitButton();
    pdfViewer.currentScaleValue = "page-width";
  });
  rotateButton.addEventListener("click", () => {
    pdfViewer.pagesRotation = (pdfViewer.pagesRotation + 90) % 360;
    if (fitWidth) pdfViewer.currentScaleValue = "page-width";
  });

  const resizeObserver = new ResizeObserver(() => {
    if (!fitWidth || !pagesCount) return;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      pdfViewer.currentScaleValue = "page-width";
    });
  });
  resizeObserver.observe(container);

  container.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 2) return;
    pinchDistance = touchDistance(event.touches[0], event.touches[1]);
    fitWidth = false;
    updateFitButton();
  }, { passive: true });
  container.addEventListener("touchmove", (event) => {
    if (event.touches.length !== 2 || pinchDistance <= 0) return;
    const distance = touchDistance(event.touches[0], event.touches[1]);
    if (distance <= 0) return;
    const scaleFactor = distance / pinchDistance;
    if (Math.abs(scaleFactor - 1) < 0.01) return;
    if (event.cancelable) event.preventDefault();
    pdfViewer.updateScale({
      scaleFactor,
      origin: touchMidpoint(event.touches[0], event.touches[1]),
      drawingDelay: 120,
    });
    pinchDistance = distance;
  }, { passive: false });
  const finishPinch = (event: TouchEvent) => {
    if (event.touches.length < 2) pinchDistance = 0;
  };
  container.addEventListener("touchend", finishPinch, { passive: true });
  container.addEventListener("touchcancel", finishPinch, { passive: true });

  const loadingTask = getDocument({
    url: options.sourceUrl,
    cMapUrl: `${PDFJS_ASSET_ROOT}/cmaps/`,
    cMapPacked: true,
    iccUrl: `${PDFJS_ASSET_ROOT}/iccs/`,
    standardFontDataUrl: `${PDFJS_ASSET_ROOT}/standard_fonts/`,
    wasmUrl: `${PDFJS_ASSET_ROOT}/wasm/`,
    useWorkerFetch: true,
  });

  loadingTask.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
    if (total > 0) {
      const percentage = Math.min(100, Math.round((loaded / total) * 100));
      stateDetail.textContent = `Loading… ${percentage}%`;
      progressBar.style.width = `${percentage}%`;
      progress.setAttribute("aria-valuenow", String(percentage));
    } else {
      stateDetail.textContent = `${Math.round(loaded / 1024)} KiB loaded`;
    }
  };
  loadingTask.onPassword = (updatePassword: (password: string) => void, reason: number) => {
    const message = reason === PasswordResponses.INCORRECT_PASSWORD
      ? "That password was incorrect. Enter the PDF password:"
      : "Enter the password for this PDF:";
    const password = window.prompt(message);
    if (password === null) {
      passwordCancelled = true;
      void loadingTask.destroy();
      return;
    }
    updatePassword(password);
  };

  const cleanup = () => {
    resizeObserver.disconnect();
    cancelAnimationFrame(resizeFrame);
    void loadingTask.destroy();
  };
  window.addEventListener("pagehide", cleanup, { once: true });

  try {
    const pdfDocument = await loadingTask.promise;
    pagesCount = pdfDocument.numPages;
    pageLabel.textContent = `1 / ${pagesCount}`;
    linkService.setDocument(pdfDocument);
    pdfViewer.setDocument(pdfDocument);
  } catch (error) {
    showError(passwordCancelled ? "Password entry was cancelled." : friendlyError(error));
  }
}
