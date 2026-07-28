import { describe, expect, mock, test } from "bun:test";
import { EventEmitter } from "node:events";

import { setEnv } from "../../helpers.js";
import {
  parseDirectVncTargetReference,
  parseVncTargets,
  VncSessionService,
} from "../../../src/channels/web/vnc/vnc-session-service.ts";

class FakeSocket extends EventEmitter {
  destroyed = false;
  write() { return true; }
  destroy(error?: Error) {
    this.destroyed = true;
    if (error) this.emit("error", error);
    this.emit("close");
  }
}

describe("VncSessionService", () => {
  test("parseVncTargets accepts object and array JSON formats", () => {
    const fromObject = parseVncTargets(JSON.stringify({
      lab: { host: "10.0.0.10", port: 5901, label: "Lab Desktop" },
    }));
    expect(fromObject).toHaveLength(1);
    expect(fromObject[0]).toMatchObject({ id: "lab", host: "10.0.0.10", port: 5901, label: "Lab Desktop" });

    const fromArray = parseVncTargets(JSON.stringify([
      { id: "printer", host: "10.0.0.20", port: 5900, label: "Printer Console", readOnly: true },
    ]));
    expect(fromArray).toHaveLength(1);
    expect(fromArray[0]).toMatchObject({ id: "printer", readOnly: true });
  });

  test("parseDirectVncTargetReference accepts host:port references", () => {
    expect(parseDirectVncTargetReference("192.168.1.137:5917")).toEqual({
      id: "192.168.1.137:5917",
      label: "192.168.1.137:5917",
      host: "192.168.1.137",
      port: 5917,
      readOnly: false,
    });
  });

  test("getSessionInfo exposes only allowlisted target metadata", () => {
    const service = new VncSessionService({
      allowDirectTargets: false,
      targets: [
        { id: "lab", label: "Lab Desktop", host: "10.0.0.10", port: 5901 },
        { id: "printer", label: "Printer Console", host: "10.0.0.20", port: 5900, readOnly: true },
      ],
    });

    const info = service.getSessionInfo();
    expect(info.enabled).toBe(true);
    expect(info.transport).toBe("websocket");
    expect(info.direct_connect_enabled).toBe(false);
    expect(info.targets).toEqual([
      { id: "lab", label: "Lab Desktop", readOnly: false },
      { id: "printer", label: "Printer Console", readOnly: true },
    ]);
    expect(JSON.stringify(info)).not.toContain("10.0.0.10");
    expect(JSON.stringify(info)).not.toContain("5901");
  });

  test("getSessionInfo can scope to a specific allowlisted target", () => {
    const service = new VncSessionService({
      allowDirectTargets: false,
      targets: [
        { id: "lab", label: "Lab Desktop", host: "10.0.0.10", port: 5901 },
      ],
    });

    const info = service.getSessionInfo("lab");
    expect(info.target).toEqual({ id: "lab", label: "Lab Desktop", read_only: false, direct_connect: false });
  });

  test("direct targets are accepted only when enabled", () => {
    const disabled = new VncSessionService({ allowDirectTargets: false });
    expect(disabled.resolveTargetReference("192.168.1.137:5917")).toBeNull();

    const enabled = new VncSessionService({ allowDirectTargets: true });
    expect(enabled.resolveTargetReference("192.168.1.137:5917")).toMatchObject({
      id: "192.168.1.137:5917",
      host: "192.168.1.137",
      port: 5917,
    });
    expect(enabled.getSessionInfo("192.168.1.137:5917").target).toEqual({
      id: "192.168.1.137:5917",
      label: "192.168.1.137:5917",
      read_only: false,
      direct_connect: true,
    });
  });

  test("times out unreachable VNC targets instead of hanging indefinitely", async () => {
    const socket = new FakeSocket();
    const service = new VncSessionService({
      allowDirectTargets: true,
      connectTimeoutMs: 5,
      createSocket: () => socket as any,
    });
    const ws = {
      data: { kind: "vnc", token: "t", userId: "u", targetRef: "192.168.1.137:5917" },
      send: mock(() => {}),
      close: mock(() => {}),
    } as any;

    service.attachClient(ws);
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(socket.destroyed).toBe(true);
    expect(ws.send).toHaveBeenCalledWith(JSON.stringify({
      type: "vnc.error",
      error: "Timed out connecting to VNC target 192.168.1.137:5917.",
    }));
    expect(ws.close).toHaveBeenCalled();
  });

  test("direct-target policy follows runtime config when no override is provided", async () => {
    const configModule = await import("../../../src/core/config.js");
    const restoreEnv = setEnv({
      PICLAW_WEB_VNC_ALLOW_DIRECT: undefined,
      PICLAW_VNC_ALLOW_DIRECT: undefined,
    });
    const previous = configModule.getWebRuntimeConfig().vncAllowDirect;

    try {
      configModule.setWebVncAllowDirect(false);
      const service = new VncSessionService();
      expect(service.isDirectConnectEnabled()).toBe(false);
      expect(service.resolveTargetReference("192.168.1.137:5917")).toBeNull();

      configModule.setWebVncAllowDirect(true);
      expect(service.isDirectConnectEnabled()).toBe(true);
      expect(service.resolveTargetReference("192.168.1.137:5917")).toMatchObject({
        id: "192.168.1.137:5917",
        host: "192.168.1.137",
        port: 5917,
      });
    } finally {
      configModule.setWebVncAllowDirect(previous);
      restoreEnv();
    }
  });
});
