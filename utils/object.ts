export function deepFreeze<T extends Record<string | symbol, unknown>>(
  object: T,
) {
  for (const key of Reflect.ownKeys(object)) {
    const value = object[key];
    const type = typeof value;
    if (value !== null && type === "object") {
      deepFreeze(value as Record<string, unknown>);
    }
  }
  return Object.freeze(object);
}

export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  cb: (value: T, index: number, array: T[]) => K,
): Record<K, T> {
  return array.reduce(
    (record, value, index, array) => {
      const key = cb(value, index, array);
      record[key] = value;
      return record;
    },
    {} as Record<K, T>,
  );
}

export function groupBy2<T, K extends string | number | symbol, V>(
  array: T[],
  keyCallback: (value: T, index: number, array: T[]) => K,
  valueCallback: (value: T, index: number, array: T[]) => V,
): Record<K, V> {
  return array.reduce(
    (record, value, index, array) => {
      record[keyCallback(value, index, array)] = valueCallback(
        value,
        index,
        array,
      );
      return record;
    },
    {} as Record<K, V>,
  );
}

export function groupBy3<T, K extends string | number | symbol>(
  array: T[],
  recordOrKeyCallback:
    | ((value: T, index: number, array: T[]) => K)
    | {
        key: (value: T, index: number, array: T[]) => K;
        value?: (value: T, index: number, array: T[]) => K;
      },
) {
  if (typeof recordOrKeyCallback === "function") {
    return groupBy(array, recordOrKeyCallback);
  }
  assert.ok(recordOrKeyCallback.key);
  if (typeof recordOrKeyCallback.value !== "undefined") {
    return groupBy2(array, recordOrKeyCallback.key, recordOrKeyCallback.value);
  }
  return groupBy(array, recordOrKeyCallback.key);
}
