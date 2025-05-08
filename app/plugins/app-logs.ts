import { log } from "../../shared/utils/dev-only";
import { defineNuxtPlugin } from "#app/nuxt";

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.dev) {
    nuxtApp.hooks.hook("app:created", (_app) => {
      log("info", "app created");
    });
  }
});
