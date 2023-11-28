export function makeObjectFrozen<T extends object>(object: T): Readonly<T> {
  Object.freeze(object);
  return object;
}

export function makeObjectFromMap<K extends string, V>(
  map: ReadonlyMap<K, V>,
  mustBeFrozen = true,
): typeof mustBeFrozen extends true ? Readonly<Record<K, V>> : Record<K, V> {
  const object = [...map].reduce(
    (record, [key, value]) => {
      record[key] = value;
      return record;
    },
    {} as Record<K, V>,
  );
  if (mustBeFrozen) {
    return makeObjectFrozen(object);
  }
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
