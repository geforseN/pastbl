import type { IDBPDatabase, OpenDBCallbacks } from "idb";
import type {
  IndexedDBKeyValueStoreSchema,
  KeyValueSchema,
} from "~/client-only/IndexedDB";
import { openIdb } from "~/client-only/IndexedDB/open";

export class KeyValueStore {
  constructor(private idb: IDBPDatabase<KeyValueSchema>) {}

  set<Key extends keyof IndexedDBKeyValueStoreSchema>(
    key: Key,
    value: IndexedDBKeyValueStoreSchema[Key],
  ) {
    return this.idb.put("key-value", value, key);
  }

  get(key: keyof IndexedDBKeyValueStoreSchema) {
    return this.idb.get("key-value", key);
  }
}

const keyValueOpenIdbUpdates: OpenDBCallbacks<KeyValueSchema>["upgrade"] = (
  database,
) => {
  if (!database.objectStoreNames.contains("key-value")) {
    database.createObjectStore("key-value");
  }
};

export const kvIdb = openIdb("key-value", 1, keyValueOpenIdbUpdates).then(
  (idb) => new KeyValueStore(idb),
);
