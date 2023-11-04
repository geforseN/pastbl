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

type StringNumberOrSymbolValuesOfKeys<T> = {
  [K in keyof T]: T[K] extends string | number | symbol ? K : never;
}[keyof T];

type ListValuesForKey<
  O extends object[],
  K extends StringNumberOrSymbolValuesOfKeys<O[number]>,
> = O[number][K] extends string | number | symbol ? O[number][K] : never;

export function arrayToRecordByValueOfKey<
  Obj extends object,
  KeyObj extends StringNumberOrSymbolValuesOfKeys<Obj>,
>(objectArray: Obj[], key: KeyObj) {
  type ObjValue = ListValuesForKey<Obj[], typeof key>;
  return objectArray.reduce(
    (record, object) => {
      const value = object[key] as ObjValue;
      record[value] = object;
      return record;
    },
    {} as {
      [V in ObjValue]: Obj;
    },
  );
}

export function withExcludedKey1(
  object: Record<string, unknown>,
  key: keyof typeof object,
) {
  const copy = { ...object };
  delete copy[key];
  return copy;
}

export function withExcludedKey2(
  object: Record<string, unknown>,
  key: keyof typeof object,
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _, ...newObject } = object;
  return newObject;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const record1 = {
  c: 3,
  g: 4,
  f: [1],
} as const;

const record2 = {
  c: "aa",
  g: 1,
  f: [3],
} as const;

const records = [record1, record2];

const good1 = arrayToRecordByValueOfKey(records, "c");
const good2 = arrayToRecordByValueOfKey(records, "g");
type Good1 = typeof good1;
type Good2 = typeof good2;
// @ts-expect-error value of record1['f'] (and record2['f']) is an array, only string | number | symbol allowed
const bad1 = arrayToRecordByValueOfKey(records, "f");
type Bad1 = typeof bad1;

const c = arrayToRecordByValueOfKey(records, "c");
