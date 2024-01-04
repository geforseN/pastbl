import { idb, type MyKeyValueSchema } from "~/client-only/IndexedDB";

export const keyValueService = {
  async set<K extends keyof MyKeyValueSchema>(
    byKey: K,
    value: MyKeyValueSchema[K],
  ) {
    const kvIdb = await idb.kv;
    return kvIdb.set(byKey, value);
  },
  async get<K extends keyof MyKeyValueSchema>(byKey: K) {
    const kvIdb = await idb.kv;
    return kvIdb.get(byKey) as Promise<MyKeyValueSchema[K] | undefined>;
  },
};
