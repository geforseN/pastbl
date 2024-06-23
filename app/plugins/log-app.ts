export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook("app:created", (_app) => {
    if (import.meta.dev) {
      // eslint-disable-next-line no-console
      console.log("app created");
    }
  });
});
