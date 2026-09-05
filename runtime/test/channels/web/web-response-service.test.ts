/**
 * test/channels/web/web-response-service.test.ts – Tests for ResponseService.
 *
 * Verifies JSON response building, static file serving, and
 * content-type detection.
 */

import { expect, test } from "bun:test";
import "../../helpers.js";

import { ResponseService } from "../../../src/channels/web/http/response-service.js";


test("response service wraps json and static helpers", async () => {
  const service = new ResponseService();

  const json = service.json({ ok: true }, 201, { "Set-Cookie": "piclaw_session=test" });
  expect(json.status).toBe(201);
  expect(await json.json()).toEqual({ ok: true });
  expect(json.headers.get("Set-Cookie")).toBe("piclaw_session=test");

  const ok = service.ok({ visible: true }, 202, { "X-Test": "yes" });
  expect(ok.status).toBe(202);
  expect(await ok.json()).toEqual({ status: "ok", visible: true });
  expect(ok.headers.get("X-Test")).toBe("yes");

  const err = service.error("Nope", 418);
  expect(err.status).toBe(418);
  expect(await err.json()).toEqual({ error: "Nope" });

  const clamped = service.clampInt("5", 1, 1, 4);
  expect(clamped).toBe(4);
  expect(service.parseOptionalInt("12")).toBe(12);
  expect(service.parseOptionalInt(null)).toBeNull();

  const staticRes = await service.serveStatic("mobile/index.html");
  expect(staticRes.status).toBe(200);
  expect(staticRes.headers.get("Content-Type")).toContain("text/html");
});
