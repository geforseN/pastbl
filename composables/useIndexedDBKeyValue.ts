import { set, type WatchDebouncedOptions } from "@vueuse/core";
import type { MyKeyValueSchema } from "~/client-only/IndexedDB";
import { keyValueService } from "~/client-only/services";

class IndexedDBValue {
  // eslint-disable-next-line no-useless-constructor
  constructor(readonly key: keyof MyKeyValueSchema) {}

  get() {
    return keyValueService.get(this.key);
  }

  set(value: MyKeyValueSchema[(typeof this)["key"]]) {
    return keyValueService.set(this.key, value);
  }
}

export function useIndexedDBKeyValue<K extends keyof MyKeyValueSchema>(
  key: K,
  defaultValue: MyKeyValueSchema[K],
  options: WatchDebouncedOptions<true | false> & {
    onRestored?: (value: MyKeyValueSchema[K]) => void;
  } = {},
) {
  const idbValue = new IndexedDBValue(key);
  const isLoading = ref(true);
  const isRestored = ref(false);
  const state = ref(defaultValue);
  const error = ref<unknown>();

  const setErrorWithThrow = (reason: unknown) => {
    error.value = reason;
    throw reason;
  };

  if (process.client) {
    idbValue
      .get()
      .catch(() => undefined)
      .then(async (restoredValue) => {
        withLogSync({ restoredValue, key }, `${key}:restoredValue`);
        const isRestoredOk = typeof restoredValue !== "undefined";
        if (!isRestoredOk) {
          await idbValue.set(defaultValue).catch(setErrorWithThrow);
        }
        const value = isRestoredOk ? restoredValue : defaultValue;
        set(state, value);
        options.onRestored?.(value);
        isRestored.value = true;
      })
      .finally(() => {
        isLoading.value = false;
      });

    watchDebounced(
      state,
      (value) => {
        if (!isRestored.value) {
          return withLogSync({ key }, `${key}:set:fast-quit`);
        }
        const rawValue = toRaw(value);
        isLoading.value = true;
        return idbValue
          .set(rawValue)
          .catch(setErrorWithThrow)
          .finally(() => {
            isLoading.value = false;
            withLogSync({ key, rawValue, value }, `${key}:set:done`);
          });
      },
      {
        ...options,
        deep: options.deep ?? (typeof state === "object" && state !== null),
        debounce: options.debounce ?? 500,
      },
    );
  } else {
    set(state, defaultValue);
    isLoading.value = false;
  }

  return {
    state,
    isRestored,
    isLoading,
    error,
  };
}
