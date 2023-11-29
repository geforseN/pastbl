export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook("app:created", (_app) => {
    // eslint-disable-next-line no-console
    console.log("app created");
  });
});
