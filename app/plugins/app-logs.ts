export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.dev) {
    nuxtApp.hooks.hook("app:created", (_app) => {
      // eslint-disable-next-line no-console
      console.log("app created");
    });
  }
});
