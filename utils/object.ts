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

export function makeRecordFromObjectArrayByEntry<
  O extends object,
  K extends keyof O,
  V extends O[K] extends string | number | symbol ? O[K] : never,
>(array: O[], key: V extends O[K] ? K : never) {
  return array.reduce(
    (record, object) => {
      const value = object[key] as V;
      const type = typeof value;
      assert.ok(type === "string" || type === "number" || type === "symbol");
      record[value] = object;
      return record;
    },
    {} as Record<V, O>,
  );
}
