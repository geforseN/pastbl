import type { IKeyValueStorage } from "../key-value.abstract";
import type { KeyValueSchema } from "../key-value.schema";
import type { KeyValueIndexedDBStore } from "./key-value.indexed-db-store";

export class KeyValueIndexedDBStorage implements IKeyValueStorage {
  constructor(private readonly store: KeyValueIndexedDBStore) {}

  async get<K extends keyof KeyValueSchema>(key: K) {
    return await this.store.get(key);
  }

  async set<K extends keyof KeyValueSchema>(key: K, value: KeyValueSchema[K]) {
    return this.store.set(key, value);
  }
}
