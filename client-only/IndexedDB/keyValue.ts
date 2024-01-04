import type { IDBPDatabase, OpenDBCallbacks } from "idb";
import type { MyKeyValueSchema, KeyValueSchema } from "~/client-only/IndexedDB";

export class KeyValueStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(private idb: IDBPDatabase<KeyValueSchema>) {}

  set<Key extends keyof MyKeyValueSchema>(
    key: Key,
    value: MyKeyValueSchema[Key],
  ) {
    this.idb.put("key-value", value, key);
  }

  get(key: keyof MyKeyValueSchema) {
    return this.idb.get("key-value", key);
  }
}

const keyValueOpenIdbUpdates: OpenDBCallbacks<KeyValueSchema>["upgrade"] = (
  db,
) => {
  if (!db.objectStoreNames.contains("key-value")) {
    db.createObjectStore("key-value");
  }
};

export const kvIdb = import("~/client-only/IndexedDB")
  .then(({ openIdb }) => openIdb("key-value", 1, keyValueOpenIdbUpdates))
  .then((idb) => new KeyValueStore(idb));
