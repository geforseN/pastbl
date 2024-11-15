export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.dev) {
    nuxtApp.hooks.hook("app:created", (_app) => {
      log("info", "app created");
    });
  }
});
