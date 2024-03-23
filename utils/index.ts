import type { WatchDebouncedOptions } from "@vueuse/core";

export function toBooleanish<B extends boolean>(value: B) {
  return String(value) as "true" | "false";
}

export function useDebouncedRef<T>(value: T, delay = 200) {
  let timeoutID: number;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeoutID);
        const timeoutId = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
        // NOTE: timeoutId is number is browser, in node it is an object
        assert.ok(typeof timeoutId === "number");
        timeoutID = timeoutId;
      },
    };
  });
}

export function getLengthStatus(
  length: number,
  options: { min: number; max: number },
) {
  if (!length) {
    return "empty";
  }
  if (length < options.min) {
    return "tooShort";
  }
  if (length > options.max) {
    return "tooLong";
  }
  return "ok";
}

export function writableComputedForKey<
  T extends object,
  K extends keyof T,
  V = T[K],
>(ref_: Ref<T>, key: K) {
  return computed({
    get() {
      return ref_.value[key] as V;
    },
    set(value: V) {
      (ref_.value[key] as V) = value;
    },
  });
}

export const match = {
  hasSame<T>(self: T, key: keyof T) {
    return function (value: T) {
      return self[key] === value[key];
    };
  },
};

export const sortFns = {};

// ////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////

function computedDebounced(
  watchSource: WatchSource<any>,
  options: WatchDebouncedOptions,
) {
  const val = ref();
  watchDebounced(
    () => megaPasta.value.text,
    (text) => {
      trimmedText.value = megaTrim(text);
    },
    options,
  );

  return readonly(val);
}

export function _refDebounced<T>(
  value: Ref<T>,
  ms: MaybeRefOrGetter<number> = 200,
  options: DebounceFilterOptions = {},
): Readonly<Ref<T>> {
  const debounced = ref(value.value as T) as Ref<T>;

  const updater = useDebounceFn(
    () => {
      debounced.value = value.value;
    },
    ms,
    options,
  );

  watch(value, () => updater());

  return debounced;
}
