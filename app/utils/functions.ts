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
