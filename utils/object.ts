export function makeObjectFrozen<T extends object>(object: T): Readonly<T> {
  Object.freeze(object);
  return object;
}

export function groupBy<T, V extends string | number | symbol>(
  array: T[],
  cb: (value: T, index: number, array: T[]) => V,
): Record<V, T> {
  return array.reduce(
    (record, value, index, array) => {
      const key = cb(value, index, array);
      record[key] = value;
      return record;
    },
    {} as Record<V, T>,
  );
}

export function groupBy2<T, KV extends string | number | symbol, V>(
  array: T[],
  keyCallback: (value: T, index: number, array: T[]) => KV,
  valueCallback: (value: T, index: number, array: T[]) => V,
): Record<KV, V> {
  return array.reduce(
    (record, value, index, array) => {
      record[keyCallback(value, index, array)] = valueCallback(
        value,
        index,
        array,
      );
      return record;
    },
    {} as Record<KV, V>,
  );
}
