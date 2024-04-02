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
