import { useClipboard } from "@vueuse/core";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      clipboard: reactive(useClipboard()),
    },
  };
});
