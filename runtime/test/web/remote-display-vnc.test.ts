import { describe, expect, test } from "bun:test";
import { Zlib, zlibSync } from "fflate";

import {
  measureCoRreRectPayload,
  measureHextileRectPayload,
  measureRreRectPayload,
  measureZrleRectPayload,
  measureZrleTileDataPayload,
  VncRemoteDisplayProtocol,
} from "../../web/src/panes/remote-display-vnc.js";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytes(...values: number[]) {
  return Uint8Array.from(values);
}

function concatChunks(chunks: Uint8Array[]) {
  const length = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const merged = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged;
}

function buildContinuousZrleChunks(tiles: Uint8Array[]) {
  const pending: Uint8Array[] = [];
  const zlib = new Zlib((chunk) => pending.push(new Uint8Array(chunk)));
  return tiles.map((tile) => {
    pending.length = 0;
    zlib.push(tile, false);
    zlib.flush(true);
    return concatChunks(pending);
  });
}

function buildZrleUpdate(x: number, y: number, width: number, height: number, compressed: Uint8Array) {
  const length = compressed.length;
  return Uint8Array.from([
    0, 0, 0, 1,
    (x >>> 8) & 0xff, x & 0xff,
    (y >>> 8) & 0xff, y & 0xff,
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

function buildServerInit({ width, height, name }: { width: number; height: number; name: string }) {
  const nameBytes = encoder.encode(name);
  const buffer = new ArrayBuffer(24 + nameBytes.length);
  const view = new DataView(buffer);
  view.setUint16(0, width, false);
  view.setUint16(2, height, false);
  view.setUint8(4, 32); // bitsPerPixel
  view.setUint8(5, 24); // depth
  view.setUint8(6, 0); // little-endian
  view.setUint8(7, 1); // true-colour
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

describe("VNC encoded rectangle payload measurement", () => {
  test("measures complete and incomplete RRE payloads without decoding pixels", () => {
    const rre = bytes(
      0, 0, 0, 2,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00, 0, 1, 0, 1, 0, 2, 0, 2,
      0x00, 0xff, 0x00, 0x00, 0, 2, 0, 2, 0, 1, 0, 1,
    );
    expect(measureRreRectPayload(rre)?.consumed).toBe(rre.length);
    expect(measureRreRectPayload(rre.slice(0, -1))).toBeNull();
    expect(measureRreRectPayload(bytes(0, 0, 0, 0, 0xaa), 0, { bitsPerPixel: 8 })?.consumed).toBe(5);
  });

  test("measures complete and incomplete CoRRE payloads without decoding pixels", () => {
    const corre = bytes(
      0, 0, 0, 2,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00, 1, 1, 2, 2,
      0x00, 0xff, 0x00, 0x00, 2, 2, 1, 1,
    );
    expect(measureCoRreRectPayload(corre)?.consumed).toBe(corre.length);
    expect(measureCoRreRectPayload(corre.slice(0, -1))).toBeNull();
    expect(measureCoRreRectPayload(bytes(0, 0, 0, 0, 0xaa), 0, { bitsPerPixel: 8 })?.consumed).toBe(5);
  });

  test("measures multi-tile Hextile payloads and incomplete tile data", () => {
    const rawTile = new Uint8Array(1 + 16 * 16 * 4);
    rawTile[0] = 0x01;
    const secondTile = bytes(
      0x0e,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      0x01,
      0x00,
      0x00,
    );
    const payload = concatChunks([rawTile, secondTile]);
    expect(measureHextileRectPayload(payload, 0, 17, 16)?.consumed).toBe(payload.length);
    expect(measureHextileRectPayload(payload.slice(0, -1), 0, 17, 16)).toBeNull();
    expect(measureHextileRectPayload(bytes(0x18, 0x01, 0x00), 0, 1, 1)).toBeNull();
  });

  test("measures ZRLE compressed payload framing without inflating", () => {
    const payload = bytes(0, 0, 0, 3, 0xaa, 0xbb, 0xcc);
    const measured = measureZrleRectPayload(payload);
    expect(measured?.consumed).toBe(payload.length);
    expect(Array.from(measured?.compressed ?? [])).toEqual([0xaa, 0xbb, 0xcc]);
    expect(measureZrleRectPayload(payload.slice(0, -1))).toBeNull();
  });

  test("measures inflated ZRLE tile payloads without mutating WASM framebuffer", () => {
    const validTwoTilePayload = bytes(
      0x01,
      0x00, 0x00, 0xff, 0x00,
      0x01,
      0xff, 0x00, 0x00, 0x00,
    );
    expect(measureZrleTileDataPayload(validTwoTilePayload, 65, 1)?.consumed).toBe(validTwoTilePayload.length);
    expect(measureZrleTileDataPayload(validTwoTilePayload.slice(0, -1), 65, 1)).toBeNull();
    expect(measureZrleTileDataPayload(bytes(
      0x03,
      0, 0, 0xff, 0,
      0xff, 0, 0, 0,
      0, 0xff, 0, 0,
      0xc0,
    ), 1, 1)).toBeNull();
    expect(measureZrleTileDataPayload(bytes(0x82, 0, 0, 0xff, 0, 0xff, 0, 0, 0, 0x02), 1, 1)).toBeNull();
    expect(measureZrleTileDataPayload(bytes(0x80, 0, 0, 0xff, 0, 0x01), 1, 1)).toBeNull();
    expect(measureZrleTileDataPayload(bytes(0x81, 0, 0, 0xff, 0, 0x00), 1, 1)).toBeNull();
    expect(measureZrleTileDataPayload(bytes(0x01, 0, 0, 0xff, 0, 0xaa), 1, 1)).toBeNull();
    expect(measureZrleTileDataPayload(bytes(0x11), 1, 1)).toBeNull();
  });
});

describe("VncRemoteDisplayProtocol", () => {
  test("negotiates RFB 3.8 and emits generic display-init events", () => {
    const protocol = new VncRemoteDisplayProtocol();

    const version = protocol.receive(encoder.encode("RFB 003.008\n"));
    expect(version.events).toEqual([
      {
        type: "protocol-version",
        protocol: "vnc",
        server: "RFB 003.008",
        client: "RFB 003.008",
      },
    ]);
    expect(decoder.decode(version.outgoing[0])).toBe("RFB 003.008\n");

    const securityTypes = protocol.receive(bytes(1, 1));
    expect(securityTypes.events).toEqual([
      { type: "security-types", protocol: "vnc", types: [1] },
      { type: "security-selected", protocol: "vnc", securityType: 1, label: "None" },
    ]);
    expect(Array.from(securityTypes.outgoing[0])).toEqual([1]);

    const securityResult = protocol.receive(bytes(0, 0, 0, 0));
    expect(securityResult.events).toEqual([
      { type: "security-result", protocol: "vnc", ok: true },
    ]);
    expect(Array.from(securityResult.outgoing[0])).toEqual([1]);

    const serverInit = protocol.receive(buildServerInit({ width: 2, height: 1, name: "Lab Desktop" }));
    expect(serverInit.events).toHaveLength(1);
    expect(serverInit.events[0]).toMatchObject({
      type: "display-init",
      protocol: "vnc",
      width: 2,
      height: 1,
      name: "Lab Desktop",
    });
    expect(serverInit.outgoing).toHaveLength(3);
    expect(serverInit.outgoing[0][0]).toBe(0); // SetPixelFormat
    expect(serverInit.outgoing[1][0]).toBe(2); // SetEncodings
    expect(Array.from(serverInit.outgoing[1].slice(4))).toEqual([
      0, 0, 0, 16, // ZRLE
      0, 0, 0, 5, // Hextile
      0, 0, 0, 2, // RRE
      0, 0, 0, 4, // CoRRE
      0, 0, 0, 1, // CopyRect
      0, 0, 0, 0, // Raw
      255, 255, 255, 17, // Cursor pseudo-encoding (-239)
      255, 255, 255, 32, // LastRect pseudo-encoding (-224)
      255, 255, 255, 33, // DesktopSize pseudo-encoding (-223)
      255, 255, 254, 205, // DesktopName pseudo-encoding (-307)
      255, 255, 254, 204, // ExtendedDesktopSize pseudo-encoding (-308)
    ]);
    expect(serverInit.outgoing[2][0]).toBe(3); // FramebufferUpdateRequest
    expect(protocol.state).toBe("connected");
    expect(protocol.framebufferWidth).toBe(2);
    expect(protocol.framebufferHeight).toBe(1);
    expect(protocol.serverName).toBe("Lab Desktop");
  });

  test("negotiates VNC password auth under RFB 3.8 when a password is configured", () => {
    const protocol = new VncRemoteDisplayProtocol({ password: "cd8a99cd" });

    const version = protocol.receive(encoder.encode("RFB 003.008\n"));
    expect(decoder.decode(version.outgoing[0])).toBe("RFB 003.008\n");

    const securityTypes = protocol.receive(bytes(1, 2));
    expect(securityTypes.events).toEqual([
      { type: "security-types", protocol: "vnc", types: [2] },
      { type: "security-selected", protocol: "vnc", securityType: 2, label: "VNC Authentication" },
    ]);
    expect(Array.from(securityTypes.outgoing[0])).toEqual([2]);

    const challenge = Uint8Array.from([
      0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
      0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff,
    ]);
    const authChallenge = protocol.receive(challenge);
    expect(authChallenge.events).toEqual([]);
    expect(Array.from(authChallenge.outgoing[0])).toEqual([
      0xe9, 0xbd, 0x7c, 0x77, 0x80, 0x18, 0x4f, 0x8f,
      0x84, 0x5a, 0x17, 0x35, 0x81, 0xf4, 0xdd, 0xeb,
    ]);

    const securityResult = protocol.receive(bytes(0, 0, 0, 0));
    expect(securityResult.events).toEqual([
      { type: "security-result", protocol: "vnc", ok: true },
    ]);
    expect(Array.from(securityResult.outgoing[0])).toEqual([1]);
  });

  test("requires a password when the server only offers VNC auth", () => {
    const protocol = new VncRemoteDisplayProtocol();
    protocol.receive(encoder.encode("RFB 003.008\n"));
    expect(() => protocol.receive(bytes(1, 2))).toThrow(/password/i);
  });

  test("decodes raw framebuffer updates into generic RGBA rectangles", () => {
    const protocol = new VncRemoteDisplayProtocol();
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 1, height: 1, name: "Display" }));

    const framebufferUpdate = protocol.receive(bytes(
      0, 0, 0, 1, // message type, padding, rect count
      0, 0, 0, 0, // x, y
      0, 1, 0, 1, // width, height
      0, 0, 0, 0, // raw encoding
      0x00, 0x00, 0xff, 0x00, // little-endian pixel value => red
    ));

    expect(framebufferUpdate.events).toHaveLength(1);
    expect(framebufferUpdate.events[0]).toMatchObject({
      type: "framebuffer-update",
      protocol: "vnc",
      width: 1,
      height: 1,
    });
    const rects = (framebufferUpdate.events[0] as any).rects;
    expect(rects).toHaveLength(1);
    expect(rects[0]).toMatchObject({ kind: "rgba", x: 0, y: 0, width: 1, height: 1 });
    expect(Array.from(rects[0].rgba)).toEqual([255, 0, 0, 255]);
    expect(framebufferUpdate.outgoing).toHaveLength(1);
    expect(framebufferUpdate.outgoing[0][0]).toBe(3);
  });

  test("parses RRE framebuffer updates", () => {
    const protocol = new VncRemoteDisplayProtocol();
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 4, height: 4, name: "Display" }));

    const framebufferUpdate = protocol.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0,
      0, 4, 0, 4,
      0, 0, 0, 2,
      0, 0, 0, 1,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      0, 1, 0, 1,
      0, 2, 0, 2,
    ));

    const rects = (framebufferUpdate.events[0] as any).rects;
    expect(rects).toHaveLength(1);
    expect(rects[0]).toMatchObject({ kind: "rgba", x: 0, y: 0, width: 4, height: 4 });
    const rgba = Array.from(rects[0].rgba);
    const bgPixel = ((0 * 4) + 0) * 4;
    expect(rgba.slice(bgPixel, bgPixel + 4)).toEqual([0, 0, 255, 255]);
    const subrectPixel = ((1 * 4) + 1) * 4;
    expect(rgba.slice(subrectPixel, subrectPixel + 4)).toEqual([255, 0, 0, 255]);
  });

  test("parses CoRRE framebuffer updates", () => {
    const protocol = new VncRemoteDisplayProtocol();
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 4, height: 4, name: "Display" }));

    const framebufferUpdate = protocol.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0,
      0, 4, 0, 4,
      0, 0, 0, 4,
      0, 0, 0, 1,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      1, 1, 2, 2,
    ));

    const rects = (framebufferUpdate.events[0] as any).rects;
    expect(rects).toHaveLength(1);
    expect(rects[0]).toMatchObject({ kind: "rgba", x: 0, y: 0, width: 4, height: 4 });
    const rgba = Array.from(rects[0].rgba);
    const bgPixel = ((0 * 4) + 0) * 4;
    expect(rgba.slice(bgPixel, bgPixel + 4)).toEqual([0, 0, 255, 255]);
    const subrectPixel = ((1 * 4) + 1) * 4;
    expect(rgba.slice(subrectPixel, subrectPixel + 4)).toEqual([255, 0, 0, 255]);
  });

  test("parses CopyRect framebuffer updates", () => {
    const protocol = new VncRemoteDisplayProtocol();
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 10, height: 8, name: "Display" }));

    const framebufferUpdate = protocol.receive(bytes(
      0, 0, 0, 1,
      0, 3, 0, 4,
      0, 2, 0, 2,
      0, 0, 0, 1,
      0, 1, 0, 2,
    ));

    const rects = (framebufferUpdate.events[0] as any).rects;
    expect(rects).toHaveLength(1);
    expect(rects[0]).toEqual({ kind: "copy", x: 3, y: 4, width: 2, height: 2, srcX: 1, srcY: 2 });
  });

  test("parses ZRLE framebuffer updates", () => {
    const protocol = new VncRemoteDisplayProtocol();
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 2, height: 2, name: "Display" }));

    const zrleTile = bytes(
      0x01,
      0x00, 0x00, 0xff, 0x00,
    );
    const compressed = zlibSync(zrleTile);
    const length = compressed.length;

    const framebufferUpdate = protocol.receive(Uint8Array.from([
      0, 0, 0, 1,
      0, 0, 0, 0,
      0, 2, 0, 2,
      0, 0, 0, 16,
      (length >>> 24) & 0xff,
      (length >>> 16) & 0xff,
      (length >>> 8) & 0xff,
      length & 0xff,
      ...compressed,
    ]));

    const rects = (framebufferUpdate.events[0] as any).rects;
    expect(rects).toHaveLength(1);
    expect(rects[0]).toMatchObject({ kind: "rgba", x: 0, y: 0, width: 2, height: 2 });
    expect(Array.from(rects[0].rgba.slice(0, 4))).toEqual([255, 0, 0, 255]);
  });

  test("consumes and skips complete malformed ZRLE rectangles in JS fallback", () => {
    const protocol = new VncRemoteDisplayProtocol();
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 1, height: 1, name: "Display" }));

    const [malformedChunk, validChunk] = buildContinuousZrleChunks([
      bytes(0x81, 0, 0, 0xff, 0, 0x00),
      bytes(0x01, 0x00, 0x00, 0xff, 0x00),
    ]);

    const malformed = protocol.receive(buildZrleUpdate(0, 0, 1, 1, malformedChunk));
    expect((malformed.events[0] as any).rects).toEqual([]);

    const valid = protocol.receive(buildZrleUpdate(0, 0, 1, 1, validChunk));
    const rects = (valid.events[0] as any).rects;
    expect(rects).toHaveLength(1);
    expect(Array.from(rects[0].rgba.slice(0, 4))).toEqual([255, 0, 0, 255]);
  });

  test("parses consecutive ZRLE rectangles from one continuous zlib stream", () => {
    const protocol = new VncRemoteDisplayProtocol();
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 2, height: 1, name: "Display" }));

    const [redTile, blueTile] = buildContinuousZrleChunks([
      bytes(0x01, 0x00, 0x00, 0xff, 0x00),
      bytes(0x01, 0xff, 0x00, 0x00, 0x00),
    ]);

    const update1 = protocol.receive(buildZrleUpdate(0, 0, 1, 1, redTile));
    const rects1 = (update1.events[0] as any).rects;
    expect(rects1).toHaveLength(1);
    expect(Array.from(rects1[0].rgba.slice(0, 4))).toEqual([255, 0, 0, 255]);

    const update2 = protocol.receive(buildZrleUpdate(1, 0, 1, 1, blueTile));
    const rects2 = (update2.events[0] as any).rects;
    expect(rects2).toHaveLength(1);
    expect(Array.from(rects2[0].rgba.slice(0, 4))).toEqual([0, 0, 255, 255]);
  });

  test("parses consecutive ZRLE rectangles on one continuous inflater", () => {
    const decodedQueue = [
      bytes(0x01, 0x00, 0x00, 0xff, 0x00),
      bytes(0x01, 0xff, 0x00, 0x00, 0x00),
    ];
    const protocol = new VncRemoteDisplayProtocol({
      inflateZrle: () => decodedQueue.shift() ?? new Uint8Array(0),
    });
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 2, height: 1, name: "Display" }));

    const update1 = protocol.receive(Uint8Array.from([
      0, 0, 0, 1,
      0, 0, 0, 0,
      0, 1, 0, 1,
      0, 0, 0, 16,
      0, 0, 0, 1,
      0x11,
    ]));
    const rects1 = (update1.events[0] as any).rects;
    expect(rects1).toHaveLength(1);
    expect(Array.from(rects1[0].rgba.slice(0, 4))).toEqual([255, 0, 0, 255]);

    const update2 = protocol.receive(Uint8Array.from([
      0, 0, 0, 1,
      0, 1, 0, 0,
      0, 1, 0, 1,
      0, 0, 0, 16,
      0, 0, 0, 1,
      0x22,
    ]));
    const rects2 = (update2.events[0] as any).rects;
    expect(rects2).toHaveLength(1);
    expect(Array.from(rects2[0].rgba.slice(0, 4))).toEqual([0, 0, 255, 255]);
  });

  test("parses Hextile framebuffer updates", () => {
    const protocol = new VncRemoteDisplayProtocol();
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 4, height: 4, name: "Display" }));

    const framebufferUpdate = protocol.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0,
      0, 4, 0, 4,
      0, 0, 0, 5,
      0x0e,
      0xff, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00,
      0x01,
      0x11,
      0x11,
    ));

    const rects = (framebufferUpdate.events[0] as any).rects;
    expect(rects).toHaveLength(1);
    expect(rects[0]).toMatchObject({ kind: "rgba", x: 0, y: 0, width: 4, height: 4 });
    const rgba = Array.from(rects[0].rgba);
    expect(rgba.slice(0, 4)).toEqual([0, 0, 255, 255]);
    const centerPixel = ((1 * 4) + 1) * 4;
    expect(rgba.slice(centerPixel, centerPixel + 4)).toEqual([255, 0, 0, 255]);
  });

  test("buffers incomplete RRE, CoRRE, Hextile, and ZRLE rectangles across chunks", () => {
    const cases = [
      {
        name: "rre",
        frame: bytes(
          0, 0, 0, 1,
          0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 2,
          0, 0, 0, 1,
          0xff, 0x00, 0x00, 0x00,
          0x00, 0x00, 0xff, 0x00,
          0, 1, 0, 1, 0, 2, 0, 2,
        ),
      },
      {
        name: "corre",
        frame: bytes(
          0, 0, 0, 1,
          0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 4,
          0, 0, 0, 1,
          0xff, 0x00, 0x00, 0x00,
          0x00, 0x00, 0xff, 0x00,
          1, 1, 2, 2,
        ),
      },
      {
        name: "hextile",
        frame: bytes(
          0, 0, 0, 1,
          0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 5,
          0x0e,
          0xff, 0x00, 0x00, 0x00,
          0x00, 0x00, 0xff, 0x00,
          0x01,
          0x11,
          0x11,
        ),
      },
      {
        name: "zrle",
        frame: buildZrleUpdate(0, 0, 2, 2, zlibSync(bytes(0x01, 0x00, 0x00, 0xff, 0x00))),
      },
    ];

    for (const item of cases) {
      const protocol = new VncRemoteDisplayProtocol();
      protocol.receive(encoder.encode("RFB 003.008\n"));
      protocol.receive(bytes(1, 1));
      protocol.receive(bytes(0, 0, 0, 0));
      protocol.receive(buildServerInit({ width: 4, height: 4, name: item.name }));

      const splitAt = item.frame.length - 1;
      expect(protocol.receive(item.frame.slice(0, splitAt)).events).toEqual([]);
      const completed = protocol.receive(item.frame.slice(splitAt));
      expect(completed.events).toHaveLength(1);
      expect((completed.events[0] as any).rects).toHaveLength(1);
    }
  });

  test("mixed pseudo-encodings interleave with pipeline framebuffer rectangles", () => {
    const calls: string[] = [];
    const pipeline = {
      initFramebuffer(width: number, height: number) { calls.push(`init:${width}x${height}`); },
      getFramebuffer() { return new Uint8ClampedArray(2 * 2 * 4); },
      processRreRect() { calls.push("rre"); return 0; },
    };
    const protocol = new VncRemoteDisplayProtocol({ pipeline });
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 4, height: 4, name: "Display" }));

    const name = encoder.encode("Resized Display");
    const frame = concatChunks([
      bytes(0, 0, 0, 4),
      bytes(0, 0, 0, 0, 0, 2, 0, 2, 255, 255, 255, 33),
      bytes(0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 254, 205, 0, 0, 0, name.length),
      name,
      bytes(
        0, 0, 0, 0, 0, 1, 0, 1, 255, 255, 255, 17,
        0x00, 0x00, 0xff, 0x00,
        0x80,
      ),
      bytes(
        0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2,
        0, 0, 0, 0,
        0xff, 0x00, 0x00, 0x00,
      ),
    ]);

    const result = protocol.receive(frame);
    expect(calls).toEqual(["init:4x4", "init:2x2", "rre"]);
    expect(protocol.serverName).toBe("Resized Display");
    const rects = (result.events[0] as any).rects;
    expect(rects.map((rect) => rect.kind)).toEqual(["resize", "desktop-name", "cursor", "pipeline"]);
    expect((result.events[0] as any).framebuffer).toBeInstanceOf(Uint8ClampedArray);
  });

  test("pipeline mode validates inflated ZRLE before calling WASM", () => {
    let calls = 0;
    const pipeline = {
      initFramebuffer() {},
      getFramebuffer() { return new Uint8ClampedArray(65 * 1 * 4); },
      processZrleTileData() { calls += 1; return 0; },
    };
    const protocol = new VncRemoteDisplayProtocol({
      pipeline,
      inflateZrle() {
        return bytes(
          0x01,
          0x00, 0x00, 0xff, 0x00,
          0x11,
        );
      },
    });
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 65, height: 1, name: "Display" }));

    const result = protocol.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0, 0, 65, 0, 1, 0, 0, 0, 16,
      0, 0, 0, 1,
      0xaa,
    ));

    expect(calls).toBe(0);
    expect((result.events[0] as any).rects).toEqual([]);
  });

  test("pipeline mode skips rectangles when a WASM processor reports failure", () => {
    const pipeline = {
      initFramebuffer() {},
      getFramebuffer() { return new Uint8ClampedArray(1 * 1 * 4); },
      processHextileRect() { return -1; },
    };
    const protocol = new VncRemoteDisplayProtocol({ pipeline });
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 1, height: 1, name: "Display" }));

    const result = protocol.receive(bytes(
      0, 0, 0, 1,
      0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 5,
      0x01,
      0x00, 0x00, 0xff, 0x00,
    ));

    expect((result.events[0] as any).rects).toEqual([]);
    expect((result.events[0] as any).framebuffer).toBeInstanceOf(Uint8ClampedArray);
  });

  test("pipeline mode routes encoded rectangles without invoking JS raw decoding", () => {
    const calls: string[] = [];
    const pipeline = {
      initFramebuffer() {},
      getFramebuffer() { return new Uint8ClampedArray(4 * 4 * 4); },
      processRreRect() { calls.push("rre"); return 0; },
      processCoRreRect() { calls.push("corre"); return 0; },
      processHextileRect() { calls.push("hextile"); return 0; },
      processZrleTileData() { calls.push("zrle"); return 0; },
    };
    const protocol = new VncRemoteDisplayProtocol({
      pipeline,
      decodeRawRect() { throw new Error("JS raw decoder should not run in pipeline mode"); },
      inflateZrle() { return bytes(0x00, 0x00, 0x00, 0xff, 0x00); },
    });
    protocol.receive(encoder.encode("RFB 003.008\n"));
    protocol.receive(bytes(1, 1));
    protocol.receive(bytes(0, 0, 0, 0));
    protocol.receive(buildServerInit({ width: 4, height: 4, name: "Display" }));

    const rreRect = bytes(
      0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 2,
      0, 0, 0, 0,
      0xff, 0x00, 0x00, 0x00,
    );
    const correRect = bytes(
      0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 4,
      0, 0, 0, 0,
      0xff, 0x00, 0x00, 0x00,
    );
    const hextileRect = bytes(
      0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 5,
      0x01,
      0x00, 0x00, 0xff, 0x00,
    );
    const zrleRect = bytes(
      0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 16,
      0, 0, 0, 1,
      0xaa,
    );
    const framebufferUpdate = protocol.receive(concatChunks([
      bytes(0, 0, 0, 4),
      rreRect,
      correRect,
      hextileRect,
      zrleRect,
    ]));

    expect(calls).toEqual(["rre", "corre", "hextile", "zrle"]);
    const rects = (framebufferUpdate.events[0] as any).rects;
    expect(rects.map((rect) => rect.kind)).toEqual(["pipeline", "pipeline", "pipeline", "pipeline"]);
  });
});
