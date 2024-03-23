export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("q", () => {
    console.log(1111);
  });
  nitroApp.hooks.hook("error", (error, { event }) => {
    // eslint-disable-next-line no-console
    console.error(`${event?.path} Application error:`, error);
  });
  nitroApp.hooks.hook("request", (event) => {
    // eslint-disable-next-line no-console
    console.log("on request", event.path);
    nitroApp.hooks.callHook("q");
    nitroApp.hooks.callHook("q");
  });
  nitroApp.hooks.hook("beforeResponse", (event /*, { body } */) => {
    // eslint-disable-next-line no-console
    console.log("on response", event.path /*, { body } */);
  });
  nitroApp.hooks.hook("afterResponse", (event /*, { body } = {} */) => {
    // eslint-disable-next-line no-console
    console.log("on after response", event.path /*, { body } */);
  });
  nitroApp.hooks.hookOnce("close", () => {
    // eslint-disable-next-line no-console
    console.log("on close");
  });
});
