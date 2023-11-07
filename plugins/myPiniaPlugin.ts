import type { PiniaPluginContext } from "pinia";

function MyPiniaPlugin({ store }: PiniaPluginContext) {
  store.$subscribe((mutation) => {
    // eslint-disable-next-line no-console
    process.dev && console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}`);
  });
  return { creationTime: new Date() };
}

export default defineNuxtPlugin(({ $pinia }) => {
  // @ts-expect-error do not know how to TypeScript this
  $pinia.use(MyPiniaPlugin);
});
