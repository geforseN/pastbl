import type { DBSchema } from "idb";

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
