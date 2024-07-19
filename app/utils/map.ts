export function mapGroupBy<T, K extends string | number | symbol, V extends T>(
  array: T[],
  ketKey: (value: T, index: number, array: T[]) => K,
  getValue?: undefined,
): Map<K, V[]>;

export function mapGroupBy<T, K extends string | number | symbol, V>(
  array: T[],
  ketKey: (value: T, index: number, array: T[]) => K,
  getValue: (value: T) => V,
): Map<K, V[]>;

export function mapGroupBy<T, K extends string | number | symbol, V>(
  array: T[],
  ketKey: (value: T, index: number, array: T[]) => K,
  getValue?: (value: T, index: number, array: T[]) => V,
  initialMap: Map<K, V[]> = new Map() as Map<K, V[]>,
): Map<K, V[]> {
  const getValue_ = getValue ?? ((value: T) => value as unknown as V);
  return array.reduce((record, value, index, array) => {
    const key = ketKey(value, index, array);
    if (!Array.isArray(record.has(key))) {
      record.set(key, []);
    }
    record.get(key)!.push(getValue_(value, index, array));
    return record;
  }, initialMap);
}

export function mapFlatGroupBy<
  T,
  K extends string | number | symbol,
  V extends T,
>(
  array: T[],
  ketKey: (value: T, index: number, array: T[]) => K,
  getValue?: undefined,
): Map<K, V>;

export function mapFlatGroupBy<T, K extends string | number | symbol, V>(
  array: T[],
  ketKey: (value: T, index: number, array: T[]) => K,
  getValue: (value: T, index: number, array: T[], grouped: V) => V,
): Map<K, V>;

export function mapFlatGroupBy<T, V, K extends string | number | symbol>(
  array: T[],
  getKey: (value: T, index: number, array: T[]) => K,
  getValue?: (value: T, index: number, array: T[], grouped: V) => V,
  initialMap: Map<K, V> = new Map(),
): Map<K, V> {
  const getValue_ = getValue ?? ((value: T) => value as unknown as V);
  return array.reduce((map, value, index, array) => {
    const key = getKey(value, index, array);
    map.set(key, getValue_(value, index, array, map.get(key)));
    return map;
  }, initialMap);
}

export function countAppearances<T>(array: T[]) {
  return array.reduce((accumulator, value) => {
    const tagCount = accumulator.get(value) || 0;
    accumulator.set(value, tagCount + 1);
    return accumulator;
  }, new Map<T, number>());
}
