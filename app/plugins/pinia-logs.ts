import type { PiniaPluginContext } from "pinia";
import { log } from "../../shared/utils/dev-only";
import { defineNuxtPlugin } from "#app/nuxt";

function piniaLogPlugin({ store }: PiniaPluginContext) {
  if (import.meta.dev) {
    store.$subscribe((mutation) => {
      log("log", `[🍍 ${mutation.storeId}]: ${mutation.type}`);
    });
  }
  return { creationTime: new Date() };
}

export default defineNuxtPlugin(({ $pinia }) => {
  // @ts-expect-error do not know how to TypeScript this
  $pinia.use(piniaLogPlugin);
});
