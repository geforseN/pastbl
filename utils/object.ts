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
  V extends O[K],
>(objectArray: O[], key: V extends string | number | symbol ? K : never) {
  return objectArray.reduce(
    (record, object) => {
      const value = object[key] as V;
      record[value] = object;
      return record;
    },
    // @ts-expect-error IF instead of:
    // V extends O[K]
    // DO:
    // V extends O[K] extends string | number | symbol ? O[K] : never
    // THEN no autosuggestion in code editor BUT error in below Record<V, O>
    {} as Record<V, O>,
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const record1 = {
  c: 3,
  g: 4,
  f: [1],
} as const;

const record2 = {
  c: "c",
  g: 1,
  f: [3],
} as const;

const records = [record1, record2];

const good1 = makeRecordFromObjectArrayByEntry(records, "c");
const good2 = makeRecordFromObjectArrayByEntry(records, "g");
type Good1 = typeof good1;
type Good2 = typeof good2;
// @ts-expect-error value of record1['f'] (and record2['f']) is an array, only string | number | symbol allowed
const bad1 = makeRecordFromObjectArrayByEntry(records, "f");
type Bad1 = typeof bad1;
