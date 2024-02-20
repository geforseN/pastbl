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
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb?: undefined,
): Record<K, V>;

export function flatGroupBy<T, K extends string | number | symbol, V>(
  array: T[],
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb: (value: T) => V,
): Record<K, V>;

export function flatGroupBy<T, V, K extends string | number | symbol>(
  array: T[],
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb?: (value: T, index: number, array: T[]) => V,
  initialRecord: Record<K, V> = {} as Record<K, V>,
): Record<K, V> {
  const getValue = valueCb ?? ((value: T) => value as unknown as V);
  return array.reduce((record, value, index, array) => {
    const key = keyCb(value, index, array);
    record[key] = getValue(value, index, array);
    return record;
  }, initialRecord);
}

export function objectKeys<T extends object>(object: T) {
  return Object.keys(object) as (keyof T)[];
}

export function objectValues<T extends object>(object: T) {
  return Object.values(object) as T[keyof T][];
}

export function objectEntries<T extends object, K extends keyof T>(object: T) {
  return Object.entries(object) as [K, T[K]][];
}
