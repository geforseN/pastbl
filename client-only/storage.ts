import { zipsonSerializer } from "../utils/zipson";

export function createStorageReader<T>(
  keyPrefix: string,
  parse = zipsonSerializer.read,
  storage = localStorage,
): (nonPrefixedKey: string) => T | "" {
  return function get(nonPrefixedKey: string) {
    return parse(storage.getItem(`${keyPrefix}${nonPrefixedKey}`) ?? "");
  };
}

export function createStorageWriter<T>(
  keyPrefix: string,
  stringify = zipsonSerializer.write,
  storage = localStorage,
) {
  return function set(nonPrefixedKey: string, value: T) {
    storage.setItem(`${keyPrefix}${nonPrefixedKey}`, stringify(value));
  };
}
