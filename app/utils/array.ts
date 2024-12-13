import { assert } from "./assert";
import type { RaiseReason } from "./assert";

export function withRemoved<T>(
  array: MaybeRef<T[]>,
  refOrPredicate:
    | MaybeRef<T>
    | ((value: T, index: number, array: T[]) => boolean),
  raiseReason?: RaiseReason,
) {
  const values = toValue(array);
  const index
    = refOrPredicate instanceof Function
      ? values.findIndex(refOrPredicate)
      : values.indexOf(toValue(refOrPredicate));
  assert.ok(index >= 0, raiseReason);
  return values.toSpliced(index, 1);
}

export function swap<A extends unknown[]>(
  array: A,
  index: number,
  index_: number,
) {
  [array[index], array[index_]] = [array[index_], array[index]];
  return array;
}

export function sum<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => number,
  initialValue: number = 0,
) {
  return array.reduce(
    (sum, value, index, array) => sum + predicate(value, index, array),
    initialValue,
  );
}

export function getIndex<T>(
  array: MaybeRef<T[]>,
  predicate: (value: T, index: number, array: T[]) => boolean,
  raiseReason: RaiseReason = new Error("Invalid index"),
) {
  const index = toValue(array).findIndex(predicate);
  assert.ok(index >= 0, raiseReason);
  return index;
}

export function uniqueValues<T>(array: T[]) {
  return [...new Set(array)];
}

export function range(begin: number, end: number, step = 1) {
  return Array.from(
    { length: (end - begin) / step + 1 },
    (_, index) => begin + index * step,
  );
}
