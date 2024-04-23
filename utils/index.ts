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

export function lazy<T>(fn: () => T) {
  let isEvaluated = false;
  let result: T;
  return function () {
    if (!isEvaluated) {
      result = fn();
      isEvaluated = true;
    }
    return result as T;
  };
}
