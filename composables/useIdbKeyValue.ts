import type { WatchDebouncedOptions } from "@vueuse/core";
import type { MyKeyValueSchema } from "~/client-only/IndexedDB";
import { keyValueService } from "~/client-only/services";

export function useIdbKeyValue<K extends keyof MyKeyValueSchema>(
  key: K,
  defaultValue: MyKeyValueSchema[K],
  watchDebouncedOptions: WatchDebouncedOptions<true | false> = {},
) {
  const isLoading = ref(true);
  const isRestored = ref(false);
  const state = ref(defaultValue);
  const error = ref<unknown>(undefined);

  keyValueService
    .get(key)
    .catch(() => undefined)
    .then(async (restoredValue) => {
      withLogSync({ restoredValue, key }, `${key}:restoredValue`);
      const isRestoredOk = typeof restoredValue !== "undefined";
      if (!isRestoredOk) {
        await keyValueService.set(key, defaultValue).catch((reason) => {
          error.value = reason;
        });
      }
      // @ts-expect-error TypeScript is silly or what?
      state.value = isRestoredOk ? restoredValue : defaultValue;
      isRestored.value = true;
    })
    .finally(() => {
      isLoading.value = false;
    });

  watchDebounced(
    state,
    (state) => {
      if (!isRestored.value) {
        withLogSync({ key }, `${key}:fast-quit:set`);
        return;
      }
      isLoading.value = true;
      const value = toRaw(state);
      // @ts-expect-error TypeScript is silly or what?
      keyValueService.set(key, value).finally(() => {
        isLoading.value = false;
        withLogSync({ key }, `${key}:set:${state}`);
      });
    },
    {
      ...watchDebouncedOptions,
      debounce: watchDebouncedOptions.debounce ?? 300,
      maxWait: watchDebouncedOptions.maxWait ?? 1000,
    },
  );

  return {
    state,
    isRestored,
    isLoading,
    error,
  };
}
