import type { WatchDebouncedOptions } from "@vueuse/core";
import type { IndexedDBKeyValueStoreSchema } from "~/client-only/IndexedDB";
import { keyValueService } from "~/client-only/services/keyValue.service";

class IndexedDBValue<K extends keyof IndexedDBKeyValueStoreSchema> {
  constructor(readonly key: K) {}

  get() {
    return keyValueService.get(this.key);
  }

  set(value: IndexedDBKeyValueStoreSchema[K]) {
    return keyValueService.set(this.key, value);
  }
}

export function useIndexedDBKeyValue<
  K extends keyof IndexedDBKeyValueStoreSchema,
>(
  key: K,
  defaultValue: IndexedDBKeyValueStoreSchema[K],
  options: WatchDebouncedOptions<true | false> & {
    onRestored?: (value: IndexedDBKeyValueStoreSchema[K]) => void;
  } = {},
) {
  const idbValue = new IndexedDBValue(key);
  const isLoading = ref(true);
  const isRestored = ref(false);
  const state = ref(defaultValue) as Ref<IndexedDBKeyValueStoreSchema[K]>;
  const error = ref<unknown>();

  const setErrorAndThrow = (reason: unknown) => {
    error.value = reason;
    throw reason;
  };

  if (import.meta.client) {
    idbValue
      .get()
      .catch(() => {})
      .then(async (restoredValue) => {
        withLogSync({ restoredValue, key }, `${key}:restoredValue`);
        const isRestoredOk = restoredValue !== undefined;
        if (!isRestoredOk) {
          await idbValue.set(defaultValue).catch(setErrorAndThrow);
        }
        const value = isRestoredOk
          ? (restoredValue as IndexedDBKeyValueStoreSchema[K])
          : defaultValue;
        state.value = value;
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
        // NOTE: must use toRaw, otherwise will throw cause Proxy can not be in IndexedDB
        const rawValue = toRaw(value);
        isLoading.value = true;
        return idbValue
          .set(rawValue)
          .catch(setErrorAndThrow)
          .finally(() => {
            isLoading.value = false;
            withLogSync({ key, rawValue, value }, `${key}:set:done`);
          });
      },
      {
        ...options,
        deep: options.deep ?? isObject(state),
        debounce: options.debounce ?? 500,
      },
    );
  } else {
    state.value = defaultValue;
    isLoading.value = false;
  }

  return {
    state,
    isRestored,
    isLoading,
    error,
  };
}
