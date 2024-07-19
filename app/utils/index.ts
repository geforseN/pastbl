export function writableComputedForKey<
  T extends object,
  K extends keyof T,
  V = T[K],
>(ref: Ref<T>, key: K) {
  return computed({
    get() {
      return ref.value[key] as V;
    },
    set(value: V) {
      (ref.value[key] as V) = value;
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

export function fixedEncodeURIComponent(string: string) {
  return encodeURIComponent(string).replaceAll(/[!'()*]/g, (char) => {
    return "%" + (char.codePointAt(0) ?? "").toString(16);
  });
}
