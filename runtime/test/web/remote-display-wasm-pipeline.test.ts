import { describe, expect, test, beforeAll } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as loader from "@assemblyscript/loader";
import { zlibSync } from "fflate";
import { tryRun } from "../helpers.js";
import { VncRemoteDisplayProtocol, DEFAULT_CLIENT_PIXEL_FORMAT } from "../../web/src/panes/remote-display-vnc.js";

// ─── WASM loading ───────────────────────────────────────────────

const WASM_PATH = resolve(import.meta.dir, "../../web/static/common/js/vendor/remote-display-decoder.wasm");

let wasm: any;

beforeAll(async () => {
  const buffer = readFileSync(WASM_PATH);
  const instantiated = await loader.instantiate(buffer, {});
  wasm = instantiated.exports;
});

// ─── Helpers ────────────────────────────────────────────────────

const encoder = new TextEncoder();

function bytes(...values: number[]) {
  return Uint8Array.from(values);
}

function normalizeInput(b: Uint8Array): ArrayBuffer {
  if (b.byteOffset === 0 && b.byteLength === b.buffer.byteLength) return b.buffer;
  return b.slice().buffer;
}

function callProcess(fn: string, data: Uint8Array, x: number, y: number, w: number, h: number, pf = DEFAULT_CLIENT_PIXEL_FORMAT) {
  const input = normalizeInput(data);
  const ptr = wasm.__pin(wasm.__newArrayBuffer(input));
  try {
    return wasm[fn](
      ptr, x, y, w, h,
      pf.bitsPerPixel,
      pf.bigEndian ? 1 : 0,
      pf.trueColor ? 1 : 0,
      pf.redMax, pf.greenMax, pf.blueMax,
      pf.redShift, pf.greenShift, pf.blueShift,
    );
  } finally {
    wasm.__unpin(ptr);
  }
}

function readFb(): Uint8ClampedArray {
  const ptr = wasm.getFramebufferPtr();
  const len = wasm.getFramebufferLen();
  // Copy out — WASM memory.buffer can be replaced after memory grows
  return new Uint8ClampedArray(new Uint8Array(wasm.memory.buffer, ptr, len).slice().buffer);
}

function pixelAt(x: number, y: number, fbWidth: number): number[] {
  const fb = readFb();
  const idx = (y * fbWidth + x) * 4;
  return [fb[idx], fb[idx + 1], fb[idx + 2], fb[idx + 3]];
}

function buildPipeline() {
  return {
    initFramebuffer(w: number, h: number) { wasm.initFramebuffer(w, h); },
    getFramebuffer() { return readFb(); },
    getFramebufferWidth() { return wasm.getFramebufferWidth(); },
    getFramebufferHeight() { return wasm.getFramebufferHeight(); },
    processRawRect(data: Uint8Array, x: number, y: number, w: number, h: number, pf: any) {
      return callProcess("processRawRect", data, x, y, w, h, pf);
    },
    processCopyRect(dstX: number, dstY: number, w: number, h: number, srcX: number, srcY: number) {
      return wasm.processCopyRect(dstX, dstY, w, h, srcX, srcY);
    },
    processRreRect(data: Uint8Array, x: number, y: number, w: number, h: number, pf: any) {
      return callProcess("processRreRect", data, x, y, w, h, pf);
    },
    processCoRreRect(data: Uint8Array, x: number, y: number, w: number, h: number, pf: any) {
      return callProcess("processCoRreRect", data, x, y, w, h, pf);
    },
    processHextileRect(data: Uint8Array, x: number, y: number, w: number, h: number, pf: any) {
      return callProcess("processHextileRect", data, x, y, w, h, pf);
    },
    processZrleTileData(data: Uint8Array, x: number, y: number, w: number, h: number, pf: any) {
      return callProcess("processZrleTileData", data, x, y, w, h, pf);
    },
    decodeRawRectToRgba(data: Uint8Array, width: number, height: number, pf: any) {
      const input = normalizeInput(data);
      const inputPtr = wasm.__pin(wasm.__newArrayBuffer(input));
      try {
        const outputPtr = wasm.__pin(wasm.decodeRawRectToRgba(
          inputPtr, width, height,
          pf.bitsPerPixel, pf.bigEndian ? 1 : 0, pf.trueColor ? 1 : 0,
          pf.redMax, pf.greenMax, pf.blueMax,
          pf.redShift, pf.greenShift, pf.blueShift,
        ));
        try { return new Uint8ClampedArray(wasm.__getArrayBuffer(outputPtr)); }
        finally { wasm.__unpin(outputPtr); }
      } finally {
        wasm.__unpin(inputPtr);
        void tryRun(() => wasm.__collect?.());
      }
    },
  };
}

function buildServerInit({ width, height, name }: { width: number; height: number; name: string }) {
  const nameBytes = encoder.encode(name);
  const buffer = new ArrayBuffer(24 + nameBytes.length);
  const view = new DataView(buffer);
  view.setUint16(0, width, false);
  view.setUint16(2, height, false);
  view.setUint8(4, 32);
  view.setUint8(5, 24);
  view.setUint8(6, 0);
  view.setUint8(7, 1);
  view.setUint16(8, 255, false);
  view.setUint16(10, 255, false);
  view.setUint16(12, 255, false);
  view.setUint8(14, 16);
  view.setUint8(15, 8);
  view.setUint8(16, 0);
  view.setUint32(20, nameBytes.length, false);
  const payload = new Uint8Array(buffer);
  payload.set(nameBytes, 24);
  return payload;
}

function connectProtocol(options: any = {}) {
  const protocol = new VncRemoteDisplayProtocol(options);
  protocol.receive(encoder.encode("RFB 003.008\n"));
  protocol.receive(bytes(1, 1)); // security: None
  protocol.receive(bytes(0, 0, 0, 0)); // auth OK
  return protocol;
}

function buildZrleUpdate(width: number, height: number, compressed: Uint8Array) {
  const length = compressed.length;
  return Uint8Array.from([
    0, 0, 0, 1,
    0, 0, 0, 0,
    (width >>> 8) & 0xff, width & 0xff,
    (height >>> 8) & 0xff, height & 0xff,
    0, 0, 0, 16,
    (length >>> 24) & 0xff,
    (length >>> 16) & 0xff,
    (length >>> 8) & 0xff,
    length & 0xff,
    ...compressed,
  ]);
}

function expectZrlePipelineMatchesJs(tile: Uint8Array, width: number, height: number) {
  const compressed = zlibSync(tile);

  const jsProto = connectProtocol();
  jsProto.receive(buildServerInit({ width, height, name: "T" }));
  const jsResult = jsProto.receive(buildZrleUpdate(width, height, compressed));
  const jsRgba = Array.from((jsResult.events[0] as any).rects[0].rgba);

  const pipeline = buildPipeline();
  const wasmProto = connectProtocol({ pipeline });
  wasmProto.receive(buildServerInit({ width, height, name: "T" }));
  const wasmResult = wasmProto.receive(buildZrleUpdate(width, height, compressed));
  const wasmFb = Array.from((wasmResult.events[0] as any).framebuffer);

  expect(wasmFb).toEqual(jsRgba);
}

// ─── Direct WASM tests ──────────────────────────────────────────

describe("WASM pipeline – direct API", () => {
  test("initFramebuffer allocates correct size", () => {
    wasm.initFramebuffer(4, 3);
    expect(wasm.getFramebufferWidth()).toBe(4);
    expect(wasm.getFramebufferHeight()).toBe(3);
    expect(wasm.getFramebufferLen()).toBe(4 * 3 * 4);
  });

  test("processRawRect decodes a red pixel at (0,0)", () => {
    wasm.initFramebuffer(2, 2);
    // little-endian 32bpp: 0x00,0x00,0xFF,0x00 => red=0xFF at shift 16
    const raw = bytes(0x00, 0x00, 0xff, 0x00);
    callProcess("processRawRect", raw, 0, 0, 1, 1);
    expect(pixelAt(0, 0, 2)).toEqual([255, 0, 0, 255]);
    // other pixels should be black (from initFramebuffer)
    expect(pixelAt(1, 0, 2)).toEqual([0, 0, 0, 0]);
  });

  test("processRawRect fills a 2x2 region", () => {
    wasm.initFramebuffer(4, 4);
    // green pixel: 0x00,0xFF,0x00,0x00 (greenShift=8, greenMax=255)
    const green = bytes(
      0x00, 0xff, 0x00, 0x00,
      0x00, 0xff, 0x00, 0x00,
      0x00, 0xff, 0x00, 0x00,
      0x00, 0xff, 0x00, 0x00,
    );
    callProcess("processRawRect", green, 1, 1, 2, 2);
    expect(pixelAt(1, 1, 4)).toEqual([0, 255, 0, 255]);
    expect(pixelAt(2, 2, 4)).toEqual([0, 255, 0, 255]);
    expect(pixelAt(0, 0, 4)).toEqual([0, 0, 0, 0]); // untouched
  });

  test("processCopyRect copies pixels within framebuffer", () => {
    wasm.initFramebuffer(4, 4);
    // put a red pixel at (0,0)
    callProcess("processRawRect", bytes(0x00, 0x00, 0xff, 0x00), 0, 0, 1, 1);
    expect(pixelAt(0, 0, 4)).toEqual([255, 0, 0, 255]);
    // copy (0,0)-(1x1) to (2,2)
    wasm.processCopyRect(2, 2, 1, 1, 0, 0);
    expect(pixelAt(2, 2, 4)).toEqual([255, 0, 0, 255]);
  });

  test("processRreRect fills background and subrects", () => {
    wasm.initFramebuffer(4, 4);
    // RRE payload: 1 subrect, blue background, red foreground subrect at (1,1) 2x2
    const rre = bytes(
      0, 0, 0, 1,                   // subrectCount = 1
      0xff, 0x00, 0x00, 0x00,       // background: blue (blueShift=0, blue=0xff)
      0x00, 0x00, 0xff, 0x00,       // subrect colour: red
      0, 1, 0, 1,                   // subrect x=1, y=1
      0, 2, 0, 2,                   // subrect w=2, h=2
    );
    callProcess("processRreRect", rre, 0, 0, 4, 4);
    expect(pixelAt(0, 0, 4)).toEqual([0, 0, 255, 255]); // blue bg
    expect(pixelAt(1, 1, 4)).toEqual([255, 0, 0, 255]); // red subrect
    expect(pixelAt(2, 2, 4)).toEqual([255, 0, 0, 255]); // red subrect
    expect(pixelAt(3, 3, 4)).toEqual([0, 0, 255, 255]); // blue bg
  });

  test("processRreRect handles zero subrects at non-zero origin", () => {
    wasm.initFramebuffer(6, 6);
    const rre = bytes(
      0, 0, 0, 0,
      0x00, 0xff, 0x00, 0x00,
    );
    callProcess("processRreRect", rre, 2, 2, 2, 2);
    expect(pixelAt(0, 0, 6)).toEqual([0, 0, 0, 0]);
    expect(pixelAt(2, 2, 6)).toEqual([0, 255, 0, 255]);
    expect(pixelAt(3, 3, 6)).toEqual([0, 255, 0, 255]);
  });

  test("processCoRreRect fills background and 8-bit subrects", () => {
    wasm.initFramebuffer(4, 4);
    // CoRRE payload: 1 subrect, blue background, red foreground subrect at (1,1) 2x2
    const corre = bytes(
      0, 0, 0, 1,                   // subrectCount = 1
      0xff, 0x00, 0x00, 0x00,       // background: blue
      0x00, 0x00, 0xff, 0x00,       // subrect colour: red
      1, 1, 2, 2,                   // subrect x=1, y=1, w=2, h=2
    );
    callProcess("processCoRreRect", corre, 0, 0, 4, 4);
    expect(pixelAt(0, 0, 4)).toEqual([0, 0, 255, 255]);
    expect(pixelAt(1, 1, 4)).toEqual([255, 0, 0, 255]);
    expect(pixelAt(2, 2, 4)).toEqual([255, 0, 0, 255]);
    expect(pixelAt(3, 3, 4)).toEqual([0, 0, 255, 255]);
  });

  test("processCoRreRect handles zero subrects, multiple subrects, and 8-bit coordinate boundaries", () => {
    wasm.initFramebuffer(256, 256);
    const blueBackgroundOnly = bytes(
      0, 0, 0, 0,
      0xff, 0x00, 0x00, 0x00,
    );
    callProcess("processCoRreRect", blueBackgroundOnly, 0, 0, 2, 2);
    expect(pixelAt(0, 0, 256)).toEqual([0, 0, 255, 255]);

    const corre = bytes(
      0, 0, 0, 2,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00, 1, 1, 2, 2,
      0x00, 0xff, 0x00, 0x00, 255, 255, 1, 1,
    );
    callProcess("processCoRreRect", corre, 0, 0, 256, 256);
    expect(pixelAt(1, 1, 256)).toEqual([255, 0, 0, 255]);
    expect(pixelAt(2, 2, 256)).toEqual([255, 0, 0, 255]);
    expect(pixelAt(255, 255, 256)).toEqual([0, 255, 0, 255]);
  });

  test("processHextileRect handles background + subrect tiles", () => {
    wasm.initFramebuffer(4, 4);
    // Hextile: subencoding 0x0E = bg + fg + subrects
    const hextile = bytes(
      0x0e,                         // bg=1, fg=1, subrects=1
      0xff, 0x00, 0x00, 0x00,       // background: blue
      0x00, 0x00, 0xff, 0x00,       // foreground: red
      0x01,                         // 1 subrect
      0x11,                         // x=1,y=1
      0x11,                         // w=2,h=2
    );
    callProcess("processHextileRect", hextile, 0, 0, 4, 4);
    expect(pixelAt(0, 0, 4)).toEqual([0, 0, 255, 255]); // blue bg
    expect(pixelAt(1, 1, 4)).toEqual([255, 0, 0, 255]); // red fg
  });

  test("processHextileRect carries background and foreground across multiple tiles", () => {
    wasm.initFramebuffer(17, 1);
    const hextile = bytes(
      0x06,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      0x08,
      0x01,
      0x00,
      0x00,
    );
    callProcess("processHextileRect", hextile, 0, 0, 17, 1);
    expect(pixelAt(0, 0, 17)).toEqual([0, 0, 255, 255]);
    expect(pixelAt(1, 0, 17)).toEqual([0, 0, 255, 255]);
    expect(pixelAt(16, 0, 17)).toEqual([255, 0, 0, 255]);
  });

  test("processZrleTileData handles solid-fill subencoding", () => {
    wasm.initFramebuffer(2, 2);
    // ZRLE subencoding 1 = solid fill
    const tile = bytes(
      0x01,                         // subencoding=1 (solid)
      0x00, 0x00, 0xff, 0x00,       // red pixel
    );
    callProcess("processZrleTileData", tile, 0, 0, 2, 2);
    expect(pixelAt(0, 0, 2)).toEqual([255, 0, 0, 255]);
    expect(pixelAt(1, 1, 2)).toEqual([255, 0, 0, 255]);
  });

  test("processZrleTileData handles raw subencoding", () => {
    wasm.initFramebuffer(2, 1);
    // ZRLE subencoding 0 = raw
    const tile = bytes(
      0x00,                         // subencoding=0 (raw)
      0x00, 0x00, 0xff, 0x00,       // pixel 0: red
      0x00, 0xff, 0x00, 0x00,       // pixel 1: green
    );
    callProcess("processZrleTileData", tile, 0, 0, 2, 1);
    expect(pixelAt(0, 0, 2)).toEqual([255, 0, 0, 255]);
    expect(pixelAt(1, 0, 2)).toEqual([0, 255, 0, 255]);
  });

  test("processZrleTileData handles packed palette subencoding", () => {
    wasm.initFramebuffer(2, 2);
    const tile = bytes(
      0x02,
      0x00, 0x00, 0xff, 0x00,       // palette[0]: red
      0xff, 0x00, 0x00, 0x00,       // palette[1]: blue
      0x40,                         // row 0: red, blue
      0x80,                         // row 1: blue, red
    );
    callProcess("processZrleTileData", tile, 0, 0, 2, 2);
    expect(pixelAt(0, 0, 2)).toEqual([255, 0, 0, 255]);
    expect(pixelAt(1, 0, 2)).toEqual([0, 0, 255, 255]);
    expect(pixelAt(0, 1, 2)).toEqual([0, 0, 255, 255]);
    expect(pixelAt(1, 1, 2)).toEqual([255, 0, 0, 255]);
  });

  test("processZrleTileData handles plain RLE subencoding", () => {
    wasm.initFramebuffer(3, 1);
    const tile = bytes(
      0x80,
      0x00, 0x00, 0xff, 0x00, 0x01, // red run length 2
      0xff, 0x00, 0x00, 0x00, 0x00, // blue run length 1
    );
    callProcess("processZrleTileData", tile, 0, 0, 3, 1);
    expect(pixelAt(0, 0, 3)).toEqual([255, 0, 0, 255]);
    expect(pixelAt(1, 0, 3)).toEqual([255, 0, 0, 255]);
    expect(pixelAt(2, 0, 3)).toEqual([0, 0, 255, 255]);
  });

  test("processZrleTileData handles palette RLE subencoding", () => {
    wasm.initFramebuffer(3, 1);
    const tile = bytes(
      0x82,
      0x00, 0x00, 0xff, 0x00,       // palette[0]: red
      0xff, 0x00, 0x00, 0x00,       // palette[1]: blue
      0x80, 0x01,                   // palette[0] run length 2
      0x01,                         // palette[1] run length 1
    );
    callProcess("processZrleTileData", tile, 0, 0, 3, 1);
    expect(pixelAt(0, 0, 3)).toEqual([255, 0, 0, 255]);
    expect(pixelAt(1, 0, 3)).toEqual([255, 0, 0, 255]);
    expect(pixelAt(2, 0, 3)).toEqual([0, 0, 255, 255]);
  });

  test("processZrleTileData rejects invalid palette subencodings, runs, and trailing bytes", () => {
    wasm.initFramebuffer(2, 1);
    expect(callProcess("processZrleTileData", bytes(0x11), 0, 0, 1, 1)).toBe(-1);
    expect(callProcess("processZrleTileData", bytes(0x81, 0x00, 0x00, 0xff, 0x00, 0x00), 0, 0, 1, 1)).toBe(-1);
    expect(callProcess("processZrleTileData", bytes(
      0x03,
      0x00, 0x00, 0xff, 0x00,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0xff, 0x00, 0x00,
      0xc0,
    ), 0, 0, 1, 1)).toBe(-1);
    expect(callProcess("processZrleTileData", bytes(
      0x82,
      0x00, 0x00, 0xff, 0x00,
      0xff, 0x00, 0x00, 0x00,
      0x02,
    ), 0, 0, 1, 1)).toBe(-1);
    expect(callProcess("processZrleTileData", bytes(0x80, 0x00, 0x00, 0xff, 0x00, 0x01), 0, 0, 1, 1)).toBe(-1);
    expect(callProcess("processZrleTileData", bytes(0x01, 0x00, 0x00, 0xff, 0x00, 0xaa), 0, 0, 1, 1)).toBe(-1);
  });

  test("encoded rectangle rejects do not partially mutate the framebuffer", () => {
    wasm.initFramebuffer(2, 2);
    const initial = Array.from(readFb());

    const rreOutOfBounds = bytes(
      0, 0, 0, 1,
      0x00, 0xff, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      0, 1, 0, 1,
      0, 2, 0, 2,
    );
    expect(callProcess("processRreRect", rreOutOfBounds, 0, 0, 2, 2)).toBe(-1);
    expect(Array.from(readFb())).toEqual(initial);

    const correOutOfBounds = bytes(
      0, 0, 0, 1,
      0x00, 0xff, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      1, 1, 2, 2,
    );
    expect(callProcess("processCoRreRect", correOutOfBounds, 0, 0, 2, 2)).toBe(-1);
    expect(Array.from(readFb())).toEqual(initial);

    const hextileOutOfBounds = bytes(
      0x0e,
      0x00, 0xff, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      0x01,
      0x11,
      0x11,
    );
    expect(callProcess("processHextileRect", hextileOutOfBounds, 0, 0, 2, 2)).toBe(-1);
    expect(Array.from(readFb())).toEqual(initial);

    const zrleOverflow = bytes(0x80, 0x00, 0x00, 0xff, 0x00, 0x04);
    expect(callProcess("processZrleTileData", zrleOverflow, 0, 0, 2, 2)).toBe(-1);
    expect(Array.from(readFb())).toEqual(initial);
  });
});

// ─── Full protocol pipeline tests ───────────────────────────────
// These verify that VncRemoteDisplayProtocol with pipeline option
// correctly dispatches to WASM and emits framebuffer events.

describe("WASM pipeline – through VncRemoteDisplayProtocol", () => {
  test("Raw encoding produces pipeline rects + framebuffer", () => {
    const pipeline = buildPipeline();
    const protocol = connectProtocol({ pipeline });
    protocol.receive(buildServerInit({ width: 1, height: 1, name: "T" }));

    const result = protocol.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0,
      0, 1, 0, 1,
      0, 0, 0, 0,                   // raw encoding
      0x00, 0x00, 0xff, 0x00,       // red pixel
    ));

    expect(result.events).toHaveLength(1);
    const ev = result.events[0] as any;
    expect(ev.type).toBe("framebuffer-update");
    expect(ev.rects).toHaveLength(1);
    expect(ev.rects[0].kind).toBe("pipeline");
    expect(ev.framebuffer).toBeDefined();
    expect(Array.from(ev.framebuffer.slice(0, 4))).toEqual([255, 0, 0, 255]);
  });

  test("RRE encoding through pipeline matches JS output", () => {
    // JS path
    const jsProto = connectProtocol();
    jsProto.receive(buildServerInit({ width: 4, height: 4, name: "T" }));
    const jsResult = jsProto.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0, 0, 4, 0, 4,
      0, 0, 0, 2,                   // RRE
      0, 0, 0, 1,                   // 1 subrect
      0xff, 0x00, 0x00, 0x00,       // bg blue
      0x00, 0x00, 0xff, 0x00,       // fg red
      0, 1, 0, 1,
      0, 2, 0, 2,
    ));
    const jsRects = (jsResult.events[0] as any).rects;
    const jsRgba = Array.from(jsRects[0].rgba);

    // Pipeline path
    const pipeline = buildPipeline();
    const wasmProto = connectProtocol({ pipeline });
    wasmProto.receive(buildServerInit({ width: 4, height: 4, name: "T" }));
    const wasmResult = wasmProto.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0, 0, 4, 0, 4,
      0, 0, 0, 2,
      0, 0, 0, 1,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      0, 1, 0, 1,
      0, 2, 0, 2,
    ));
    const wasmFb = Array.from((wasmResult.events[0] as any).framebuffer);

    expect(wasmFb).toEqual(jsRgba);
  });

  test("CoRRE encoding through pipeline matches JS output", () => {
    // JS path
    const jsProto = connectProtocol();
    jsProto.receive(buildServerInit({ width: 4, height: 4, name: "T" }));
    const jsResult = jsProto.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0, 0, 4, 0, 4,
      0, 0, 0, 4,                   // CoRRE
      0, 0, 0, 1,                   // 1 subrect
      0xff, 0x00, 0x00, 0x00,       // bg blue
      0x00, 0x00, 0xff, 0x00,       // fg red
      1, 1, 2, 2,
    ));
    const jsRgba = Array.from((jsResult.events[0] as any).rects[0].rgba);

    // Pipeline path
    const pipeline = buildPipeline();
    const wasmProto = connectProtocol({ pipeline });
    wasmProto.receive(buildServerInit({ width: 4, height: 4, name: "T" }));
    const wasmResult = wasmProto.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0, 0, 4, 0, 4,
      0, 0, 0, 4,
      0, 0, 0, 1,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      1, 1, 2, 2,
    ));
    const wasmFb = Array.from((wasmResult.events[0] as any).framebuffer);

    expect(wasmFb).toEqual(jsRgba);
  });

  test("CopyRect through pipeline copies within framebuffer", () => {
    const pipeline = buildPipeline();
    const protocol = connectProtocol({ pipeline });
    protocol.receive(buildServerInit({ width: 4, height: 4, name: "T" }));

    // First, write a red pixel at (0,0) via raw
    protocol.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0, 0, 1, 0, 1,
      0, 0, 0, 0,
      0x00, 0x00, 0xff, 0x00,
    ));

    // Now CopyRect (0,0)-1x1 to (2,2)
    const result = protocol.receive(bytes(
      0, 0, 0, 1,
      0, 2, 0, 2, 0, 1, 0, 1,
      0, 0, 0, 1,                   // CopyRect
      0, 0, 0, 0,                   // srcX=0, srcY=0
    ));

    const fb = (result.events[0] as any).framebuffer;
    const srcIdx = (0 * 4 + 0) * 4;
    const dstIdx = (2 * 4 + 2) * 4;
    expect(Array.from(fb.slice(srcIdx, srcIdx + 4))).toEqual([255, 0, 0, 255]);
    expect(Array.from(fb.slice(dstIdx, dstIdx + 4))).toEqual([255, 0, 0, 255]);
  });

  test("ZRLE solid-fill through pipeline matches JS output", () => {
    expectZrlePipelineMatchesJs(bytes(
      0x01,
      0x00, 0x00, 0xff, 0x00,
    ), 2, 2);
  });

  test("ZRLE raw tile through pipeline matches JS output", () => {
    expectZrlePipelineMatchesJs(bytes(
      0x00,
      0x00, 0x00, 0xff, 0x00,
      0x00, 0xff, 0x00, 0x00,
    ), 2, 1);
  });

  test("ZRLE packed palette through pipeline matches JS output", () => {
    expectZrlePipelineMatchesJs(bytes(
      0x02,
      0x00, 0x00, 0xff, 0x00,
      0xff, 0x00, 0x00, 0x00,
      0x40,
      0x80,
    ), 2, 2);
  });

  test("ZRLE plain RLE through pipeline matches JS output", () => {
    expectZrlePipelineMatchesJs(bytes(
      0x80,
      0x00, 0x00, 0xff, 0x00, 0x01,
      0xff, 0x00, 0x00, 0x00, 0x00,
    ), 3, 1);
  });

  test("ZRLE palette RLE through pipeline matches JS output", () => {
    expectZrlePipelineMatchesJs(bytes(
      0x82,
      0x00, 0x00, 0xff, 0x00,
      0xff, 0x00, 0x00, 0x00,
      0x80, 0x01,
      0x01,
    ), 3, 1);
  });

  test("ZRLE invalid unused subencoding is skipped in JS fallback and pipeline modes", () => {
    const compressed = zlibSync(bytes(0x11));

    const jsProto = connectProtocol();
    jsProto.receive(buildServerInit({ width: 1, height: 1, name: "T" }));
    const jsResult = jsProto.receive(buildZrleUpdate(1, 1, compressed));
    expect((jsResult.events[0] as any).rects).toEqual([]);

    const pipeline = buildPipeline();
    const wasmProto = connectProtocol({ pipeline });
    wasmProto.receive(buildServerInit({ width: 1, height: 1, name: "T" }));
    const wasmResult = wasmProto.receive(buildZrleUpdate(1, 1, compressed));
    expect((wasmResult.events[0] as any).rects).toEqual([]);
    expect(Array.from((wasmResult.events[0] as any).framebuffer)).toEqual([0, 0, 0, 0]);
  });

  test("Hextile through pipeline matches JS output", () => {
    // JS path
    const jsProto = connectProtocol();
    jsProto.receive(buildServerInit({ width: 4, height: 4, name: "T" }));
    const jsResult = jsProto.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0, 0, 4, 0, 4,
      0, 0, 0, 5,                   // Hextile
      0x0e,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      0x01, 0x11, 0x11,
    ));
    const jsRgba = Array.from((jsResult.events[0] as any).rects[0].rgba);

    // Pipeline path
    const pipeline = buildPipeline();
    const wasmProto = connectProtocol({ pipeline });
    wasmProto.receive(buildServerInit({ width: 4, height: 4, name: "T" }));
    const wasmResult = wasmProto.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0, 0, 4, 0, 4,
      0, 0, 0, 5,
      0x0e,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      0x01, 0x11, 0x11,
    ));
    const wasmFb = Array.from((wasmResult.events[0] as any).framebuffer);

    expect(wasmFb).toEqual(jsRgba);
  });

  test("DesktopSize resize re-initializes pipeline framebuffer", () => {
    const pipeline = buildPipeline();
    const protocol = connectProtocol({ pipeline });
    protocol.receive(buildServerInit({ width: 4, height: 4, name: "T" }));
    expect(pipeline.getFramebufferWidth()).toBe(4);
    expect(pipeline.getFramebufferHeight()).toBe(4);

    // DesktopSize pseudo-encoding
    const result = protocol.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0,
      0, 8, 0, 6,                   // new size 8x6
      255, 255, 255, 33,            // -223 = DesktopSize
    ));

    expect(pipeline.getFramebufferWidth()).toBe(8);
    expect(pipeline.getFramebufferHeight()).toBe(6);
    expect(pipeline.getFramebuffer().length).toBe(8 * 6 * 4);
    const rects = (result.events[0] as any).rects;
    expect(rects[0].kind).toBe("resize");
  });

  test("survives many frames without memory errors", () => {
    const pipeline = buildPipeline();
    const protocol = connectProtocol({ pipeline });
    protocol.receive(buildServerInit({ width: 64, height: 64, name: "Stress" }));

    // Send 200 raw framebuffer updates to exercise WASM memory allocation/GC
    for (let frame = 0; frame < 200; frame++) {
      const pixel = bytes(
        (frame & 0xff), 0x00, ((frame >> 8) & 0xff), 0x00,
      );
      const result = protocol.receive(bytes(
        0, 0, 0, 1,
        0, 0, 0, 0,
        0, 1, 0, 1,
        0, 0, 0, 0,    // raw
        ...pixel,
      ));
      expect(result.events).toHaveLength(1);
      const fb = (result.events[0] as any).framebuffer;
      expect(fb).toBeDefined();
      expect(fb.length).toBe(64 * 64 * 4);
    }
  });
});
