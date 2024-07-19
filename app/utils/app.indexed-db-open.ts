import type { DBSchema } from "idb";
import type { KeyValueIndexedDBSchema } from "$/key-value/indexed-db/key-value.indexed-db-schema";

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
