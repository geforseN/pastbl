import { zipsonSerializer } from "../utils/zipson";

export function createStorageReader<T>(
  keyPrefix: string,
  parse = zipsonSerializer.read,
  storage = localStorage,
): (k: string) => T | "" {
  return (nonPrefixedKey: string) => {
    return parse(storage.getItem(`${keyPrefix}${nonPrefixedKey}`) ?? "");
  };
}

export function createStorageWriter<T>(
  keyPrefix: string,
  stringify = zipsonSerializer.write,
  storage = localStorage,
) {
  return (nonPrefixedKey: string, value: T) => {
    storage.setItem(`${keyPrefix}${nonPrefixedKey}`, stringify(value));
  };
}
