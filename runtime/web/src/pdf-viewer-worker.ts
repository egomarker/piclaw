// Dedicated PDF.js worker entry. Built separately so the mobile viewer can load
// it on demand without adding PDF parsing code to Piclaw's desktop app bundle.
import "./pdf-viewer-compatibility.js";
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
