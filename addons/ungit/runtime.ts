import { startUngitIfNeeded } from "./service.ts";

void startUngitIfNeeded().catch((error) => {
  console.warn("[ungit] automatic startup failed", error);
});
