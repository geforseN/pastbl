import { log } from "~~/shared/utils/dev-only";

export default defineNitroPlugin((nitroApp) => {
  if (import.meta.dev) {
    nitroApp.hooks.hook("error", (error, { event }) => {
      log("error", `${event?.path} Application error:`, { error });
    });
    nitroApp.hooks.hook("request", (event) => {
      log("info", `on request ${event.path}`);
    });
    nitroApp.hooks.hook("beforeResponse", (event) => {
      log("info", `on response ${event.path}`);
    });
    nitroApp.hooks.hook("afterResponse", (event) => {
      log("info", `on after response ${event.path}`);
    });
    nitroApp.hooks.hookOnce("close", () => {
      log("info", "on close");
    });
  }
});
