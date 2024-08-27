export default defineNitroPlugin((nitroApp) => {
  /* eslint-disable no-console */
  nitroApp.hooks.hook("error", (error, { event }) => {
    console.error(`${event?.path} Application error:`, error);
  });
  nitroApp.hooks.hook("request", (event) => {
    console.log("on request", event.path);
  });
  nitroApp.hooks.hook("beforeResponse", (event /*, { body } */) => {
    console.log("on response", event.path /*, { body } */);
  });
  nitroApp.hooks.hook("afterResponse", (event /*, { body } = {} */) => {
    console.log("on after response", event.path /*, { body } */);
  });
  nitroApp.hooks.hookOnce("close", () => {
    console.log("on close");
  });
  /* eslint-enable no-console */
});
