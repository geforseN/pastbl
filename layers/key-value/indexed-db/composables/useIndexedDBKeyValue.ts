import type { WatchDebouncedOptions } from "@vueuse/core";

const makeIndexedDBValue
  = IndexedDBValue.createWithRepository(keyValueRepository);

export function useIndexedDBKeyValue<K extends keyof KeyValueSchema>(
  key: K,
  defaultValue: KeyValueSchema[K],
  options: WatchDebouncedOptions<boolean> & {
    onRestored?: (value: KeyValueSchema[K]) => void;
    onUpdated?: (value: KeyValueSchema[K]) => void;
  } = {},
) {
  const idbValue = makeIndexedDBValue(key);
  const isLoading = ref(true);
  const isRestored = ref(false);
  const state = ref(defaultValue) as Ref<KeyValueSchema[K]>;
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
        log("debug", "restored", { restoredValue, key, tag: "useIndexedDBKeyValue" });
        const isRestoredOk = restoredValue !== undefined;
        if (!isRestoredOk) {
          await idbValue.set(defaultValue).catch(setErrorAndThrow);
        }
        const value = isRestoredOk
          ? (restoredValue as KeyValueSchema[K])
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
          return log("debug", "set:fast-quit", { key, tag: "useIndexedDBKeyValue" });
        }
        // NOTE: must use toRaw, otherwise will throw cause Proxy can not be in IndexedDB
        const rawValue = toRaw(value);
        isLoading.value = true;
        return idbValue
          .set(rawValue)
          .then(() => {
            options.onUpdated?.(value);
          })
          .catch(setErrorAndThrow)
          .finally(() => {
            isLoading.value = false;
            return log("debug", "set:done", { key, rawValue, value, tag: "useIndexedDBKeyValue" });
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
