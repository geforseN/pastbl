import type { DBSchema } from "idb";
import { openIndexedDBDatabase } from "../../layers/indexed-db/utils/indexed-db.open";
import type { KeyValueIndexedDBSchema } from "../../layers/key-value/indexed-db/utils/schema";

export interface AppIndexedDBSchema extends DBSchema, KeyValueIndexedDBSchema {}

export async function openAppIndexedDBDatabase() {
  return await openIndexedDBDatabase<AppIndexedDBSchema>({
    name: "key-value",
    version: 1,
    upgrade(database, oldVersion) {
      if (oldVersion < 1) {
        database.createObjectStore("key-value");
      }
    },
  });
}
