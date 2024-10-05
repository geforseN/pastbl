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

export function flatGroupBy<T, K extends string | number | symbol, V extends T>(
  array: T[],
  getKey: (value: T, index: number, array: T[]) => K,
  getValue?: undefined,
): Record<K, V>;

export function flatGroupBy<T, K extends string | number | symbol, V>(
  array: T[],
  getKey: (value: T, index: number, array: T[]) => K,
  getValue?: (value: T, index: number, array: T[]) => V,
): Record<K, V>;

export function flatGroupBy<T, V, K extends string | number | symbol>(
  array: T[],
  getKey: (value: T, index: number, array: T[]) => K,
  getValue?: (value: T, index: number, array: T[]) => V,
  initialRecord: Record<K, V> = {} as Record<K, V>,
): Record<K, V> {
  const getValue_ = getValue ?? ((value: T) => value as unknown as V);
  return array.reduce((record, value, index, array) => {
    const key = getKey(value, index, array);
    record[key] = getValue_(value, index, array);
    return record;
  }, initialRecord);
}

export function objectKeys<T extends object>(object: T) {
  return Object.keys(object) as (keyof T)[];
}

export function objectValues<T extends Record<string, unknown>>(object: T) {
  return Object.values(object) as T[keyof T][];
}

export function objectEntries<T extends object, K extends keyof T>(object: T) {
  return Object.entries(object) as [K, T[K]][];
}

export function groupBy<T, K extends string | number | symbol, V extends T>(
  array: T[],
  keyCallback: (value: T, index: number, array: T[]) => K,
  valueCallback?: undefined,
): Record<K, V[]>;

export function groupBy<T, K extends string | number | symbol, V>(
  array: T[],
  keyCallback: (value: T, index: number, array: T[]) => K,
  valueCallback: (value: T, index: number, array: T[]) => V,
): Record<K, V[]>;

export function groupBy<T, K extends string | number | symbol, V>(
  array: T[],
  keyCallback: (value: T, index: number, array: T[]) => K,
  valueCallback?: (value: T, index: number, array: T[]) => V,
  initialRecord: Record<K, V[]> = {} as Record<K, V[]>,
): Record<K, V[]> {
  const getValue = valueCallback ?? ((value: T) => value as unknown as V);
  return array.reduce((record, value, index, array) => {
    const key = keyCallback(value, index, array);
    let recordValue = record[key];
    if (!Array.isArray(recordValue)) {
      record[key] = recordValue = [];
    }
    recordValue.push(getValue(value, index, array));
    return record;
  }, initialRecord);
}

export function objectSorted<O extends Record<string, unknown>>(
  object: O,
  compare: (a: string, b: string) => number = (a, b) => a.localeCompare(b),
): O {
  return Object.keys(object)
    .sort(compare)
    .reduce((accumulator, key) => {
      accumulator[key as keyof O] = object[key as keyof O];
      return accumulator;
    }, {} as O);
}
