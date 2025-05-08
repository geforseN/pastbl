import { useClipboard } from "@vueuse/core";
import { defineNuxtPlugin } from "#app/nuxt";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      clipboard: reactive(useClipboard()),
    },
  };
});
