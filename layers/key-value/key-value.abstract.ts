import type { KeyValueSchema } from "./key-value.schema";

export interface IKeyValueStorage {
  get<K extends keyof KeyValueSchema>(key: K): Promise<KeyValueSchema[K]>;
  set<K extends keyof KeyValueSchema>(
    key: K,
    value: KeyValueSchema[K],
  ): Promise<void>;
}
