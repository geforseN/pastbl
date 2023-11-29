import type { PiniaPluginContext } from "pinia";

function piniaLogPlugin({ store }: PiniaPluginContext) {
  store.$subscribe((mutation) => {
    if (process.dev) {
      // eslint-disable-next-line no-console
      console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}`);
    }
  });
  return { creationTime: new Date() };
}

export default defineNuxtPlugin(({ $pinia }) => {
  // @ts-expect-error do not know how to TypeScript this
  $pinia.use(piniaLogPlugin);
});
