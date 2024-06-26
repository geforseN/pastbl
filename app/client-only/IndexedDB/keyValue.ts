import type { IDBPDatabase, OpenDBCallbacks } from "idb";
import type { MyKeyValueSchema, KeyValueSchema } from "~/client-only/IndexedDB";
import { openIdb } from "~/client-only/IndexedDB/open";

export class KeyValueStore {
  constructor(private idb: IDBPDatabase<KeyValueSchema>) {}

  set<Key extends keyof MyKeyValueSchema>(
    key: Key,
    value: MyKeyValueSchema[Key],
  ) {
    return this.idb.put("key-value", value, key);
  }

  get(key: keyof MyKeyValueSchema) {
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
