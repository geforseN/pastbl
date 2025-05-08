import { useEventListener } from "@vueuse/core";
import { defineNuxtPlugin } from "#app/nuxt";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<HTMLElement, () => (event: Event) => Promise<void>>(
    "on-mouseover",
  {
    mounted(element, bindings) {
      if (import.meta.server) {
        return;
      }
      const listener = bindings.value();
      useEventListener(element, "mouseover", listener);
    },
  },
  );
});
