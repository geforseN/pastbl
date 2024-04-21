export function makeLengthStatus({ min, max }: { min: number; max: number }) {
  return function (lengthLike: number | { length: number }) {
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

// function parseFailMessage(fail: unknown) {
//   if (fail instanceof Error) {
//     return fail.message;
//   }
// }

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
