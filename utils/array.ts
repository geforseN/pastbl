export function countAppearances<T>(array: T[]) {
  return array.reduce((accumulator, value) => {
    const tagCount = accumulator.get(value) || 0;
    accumulator.set(value, tagCount + 1);
    return accumulator;
  }, new Map<T, number>());
}

export function withRemoved<T>(
  array: T[],
  cb: (value: T, index: number, array: T[]) => boolean,
  messageOrError?: string | Error,
) {
  const index = array.findIndex(cb);
  assert.ok(index >= 0, messageOrError);
  return array.toSpliced(index, 1);
}

export function swap<A extends unknown[]>(array: A, i: number, j: number) {
  [array[i], array[j]] = [array[j], array[i]];
  return array;
}

export function groupBy<T, K extends string | number | symbol, V extends T>(
  array: T[],
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb?: undefined,
): Record<K, V[]>;
export function groupBy<T, K extends string | number | symbol, V>(
  array: T[],
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb: (value: T) => V,
): Record<K, V[]>;
export function groupBy<T, K extends string | number | symbol, V>(
  array: T[],
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb?: (value: T, index: number, array: T[]) => V,
  initialRecord: Record<K, V[]> = {} as Record<K, V[]>,
): Record<K, V[]> {
  const getValue = valueCb ?? ((value: T) => value as unknown as V);
  return array.reduce((record, value, index, array) => {
    const key = keyCb(value, index, array);
    if (!Array.isArray(record[key])) {
      record[key] = [];
    }
    record[key].push(getValue(value, index, array));
    return record;
  }, initialRecord);
}
