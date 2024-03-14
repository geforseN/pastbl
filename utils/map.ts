export function mapGroupBy<T, K extends string | number | symbol, V extends T>(
  array: T[],
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb?: undefined,
): Map<K, V[]>;

export function mapGroupBy<T, K extends string | number | symbol, V>(
  array: T[],
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb: (value: T) => V,
): Map<K, V[]>;

export function mapGroupBy<T, K extends string | number | symbol, V>(
  array: T[],
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb?: (value: T, index: number, array: T[]) => V,
  initialMap: Map<K, V[]> = new Map() as Map<K, V[]>,
): Map<K, V[]> {
  const getValue = valueCb ?? ((value: T) => value as unknown as V);
  return array.reduce((record, value, index, array) => {
    const key = keyCb(value, index, array);
    if (!Array.isArray(record.has(key))) {
      record.set(key, []);
    }
    record.get(key)!.push(getValue(value, index, array));
    return record;
  }, initialMap);
}

export function mapFlatGroupBy<
  T,
  K extends string | number | symbol,
  V extends T,
>(
  array: T[],
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb?: undefined,
): Map<K, V>;

export function mapFlatGroupBy<T, K extends string | number | symbol, V>(
  array: T[],
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb: (value: T, index: number, array: T[], grouped: V) => V,
): Map<K, V>;

export function mapFlatGroupBy<T, V, K extends string | number | symbol>(
  array: T[],
  keyCb: (value: T, index: number, array: T[]) => K,
  valueCb?: (value: T, index: number, array: T[], grouped: V) => V,
  initialMap: Map<K, V> = new Map(),
): Map<K, V> {
  const getValue = valueCb ?? ((value: T) => value as unknown as V);
  return array.reduce((map, value, index, array) => {
    const key = keyCb(value, index, array);
    map.set(key, getValue(value, index, array, map.get(key)));
    return map;
  }, initialMap);
}
