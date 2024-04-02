export function makeLengthStatus({ min, max }: { min: number; max: number }) {
  return (lengthLike: number | { length: number }) => {
    const length =
      typeof lengthLike === "number" ? lengthLike : lengthLike.length;
    if (!length) {
      return "empty";
    }
    if (length < min) {
      return "tooShort";
    }
    if (length > max) {
      return "tooLong";
    }
    return "ok";
  };
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
