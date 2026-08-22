import { startUngitIfNeeded } from "./service.ts";

void startUngitIfNeeded().catch((error) => {
  console.warn("[ungit-go] automatic startup failed", error);
});
