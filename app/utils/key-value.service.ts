import {
  idb,
  type IndexedDBKeyValueStoreSchema,
} from "~/client-only/IndexedDB";

export const keyValueService = {
  async set<K extends keyof IndexedDBKeyValueStoreSchema>(
    byKey: K,
    value: IndexedDBKeyValueStoreSchema[K],
  ) {
    const kvIdb = await idb.kv;
    return kvIdb.set(byKey, value);
  },
  async get<K extends keyof IndexedDBKeyValueStoreSchema>(byKey: K) {
    const kvIdb = await idb.kv;
    return kvIdb.get(byKey) as Promise<
      IndexedDBKeyValueStoreSchema[K] | undefined
    >;
  },
};
