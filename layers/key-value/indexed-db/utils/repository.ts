import type { KeyValueIndexedDBStore } from "$/key-value/indexed-db/utils/store.ts";

export class KeyValueIndexedDBRepository implements IKeyValueRepository {
  constructor(private readonly store: KeyValueIndexedDBStore) {}

  async get<K extends keyof KeyValueSchema>(key: K) {
    return await this.store.get(key);
  }

  async set<K extends keyof KeyValueSchema>(key: K, value: KeyValueSchema[K]) {
    return this.store.set(key, value);
  }
}
