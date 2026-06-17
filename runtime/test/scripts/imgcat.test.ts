import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  buildIterm2ImageOutput,
  buildKittyImageOutput,
  buildSixelImageOutput,
  detectImageProtocol,
  parseArgs,
  parsePngDimensions,
  resolveImageProtocol,
} from "../../scripts/imgcat.js";

const PNG_1X1 = new Uint8Array(Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
));

test("imgcat parses protocol switches and keeps auto as the default", () => {
  expect(parseArgs(["image.png"]).protocol).toBe("auto");
  expect(parseArgs(["--protocol", "kitty", "image.png"]).protocol).toBe("kitty");
  expect(parseArgs(["--protocol=iterm", "image.png"]).protocol).toBe("iterm2");
  expect(parseArgs(["--sixel", "-w", "12", "image.png"])).toMatchObject({
    protocol: "sixel",
    width: 12,
  });
});

test("imgcat auto-detects terminal image protocols from environment hints", () => {
  expect(detectImageProtocol({ PICLAW_TERMINAL_IMAGE_PROTOCOL: "iterm2" })).toBe("iterm2");
  expect(detectImageProtocol({ TERM_INLINE_IMAGE_PROTOCOL: "sixel" })).toBe("sixel");
  expect(detectImageProtocol({ KITTY_WINDOW_ID: "1" })).toBe("kitty");
  expect(detectImageProtocol({ TERM_PROGRAM: "iTerm.app" })).toBe("iterm2");
  expect(detectImageProtocol({ PICLAW_TERMINAL: "1" })).toBe("iterm2");
  expect(resolveImageProtocol("auto", {})).toBe("kitty");
});

test("imgcat builds Kitty graphics output", () => {
  const dims = parsePngDimensions(PNG_1X1);
  expect(dims).toEqual({ width: 1, height: 1 });

  const output = buildKittyImageOutput(PNG_1X1, 1, 1, 2, 3, 9, 1);
  expect(output).toStartWith("\x1b_Ga=T,q=1,f=100,t=d,i=9,s=1,v=1,c=2,r=3,m=0;");
  expect(output).toContain(Buffer.from(PNG_1X1).toString("base64"));
  expect(output).toEndWith("\x1b\\\n");
});

test("imgcat builds iTerm2 inline-image output", () => {
  const output = buildIterm2ImageOutput(PNG_1X1, 4, 5);
  expect(output).toStartWith("\x1b]1337;File=inline=1;");
  expect(output).toContain(`size=${PNG_1X1.byteLength}`);
  expect(output).toContain("width=4;height=5");
  expect(output).toContain(Buffer.from(PNG_1X1).toString("base64"));
  expect(output).toEndWith("\x07\n");
});

test("imgcat builds SIXEL output", async () => {
  const output = await buildSixelImageOutput(PNG_1X1, 1, 1);
  expect(output).toStartWith("\x1bPq\"1;1;8;16");
  expect(output).toContain("#1;2;");
  expect(output).toEndWith("\x1b\\\n");
});

test("Piclaw terminal sessions advertise the inline-image protocol supported by the xterm bundle", () => {
  const source = readFileSync(join("/workspace/piclaw", "runtime/src/channels/web/terminal/terminal-session-service.ts"), "utf8");
  expect(source).toContain('PICLAW_TERMINAL: "1"');
  expect(source).toContain('PICLAW_TERMINAL_IMAGE_PROTOCOL: process.env.PICLAW_TERMINAL_IMAGE_PROTOCOL || "iterm2"');
  expect(source).toContain('TERM_INLINE_IMAGE_PROTOCOL: process.env.TERM_INLINE_IMAGE_PROTOCOL || process.env.PICLAW_TERMINAL_IMAGE_PROTOCOL || "iterm2"');
});
