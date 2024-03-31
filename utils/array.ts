export function countAppearances<T>(array: T[]) {
  return array.reduce((accumulator, value) => {
    const tagCount = accumulator.get(value) || 0;
    accumulator.set(value, tagCount + 1);
    return accumulator;
  }, new Map<T, number>());
}

export function withRemoved<T>(
  array: MaybeRef<T[]>,
  cbOrValue: MaybeRef<T> | ((value: T, index: number, array: T[]) => boolean),
  messageOrError?: string | Error,
) {
  const values = toValue(array);
  const index =
    cbOrValue instanceof Function
      ? values.findIndex(cbOrValue)
      : values.indexOf(toValue(cbOrValue));
  assert.ok(index >= 0, messageOrError);
  return values.toSpliced(index, 1);
}

export function swap<A extends unknown[]>(array: A, i: number, j: number) {
  [array[i], array[j]] = [array[j], array[i]];
  return array;
}

export function sum<T>(
  array: T[],
  cb: (value: T, index: number, array: T[]) => number,
  initialValue: number = 0,
) {
  return array.reduce(
    (acc, value, index, array) => acc + cb(value, index, array),
    initialValue,
  );
}

export function getValidIndex<T>(
  array: MaybeRef<T[]>,
  cb: (value: T, index: number, array: T[]) => boolean,
  messageOrError = new Error("Invalid index"),
) {
  const index = toValue(array).findIndex(cb);
  assert.ok(index >= 0, messageOrError);
  return index;
}

export function uniqueValues<T>(array: T[]) {
  return [...new Set(array)];
}
