import { KeyValueIndexedDBStorage } from "../key-value.indexed-db-storage";
import { KeyValueIndexedDBStore } from "../key-value.indexed-db-store";

const appIndexedDBPromise = openAppIndexedDBDatabase();

const withAppIndexedDB = withIndexedDBDatabase(appIndexedDBPromise);

export type WithAppIndexedDB = WithIndexedDBDatabase<AppIndexedDBSchema>;

export const keyValueStorage = new KeyValueIndexedDBStorage(
  new KeyValueIndexedDBStore(withAppIndexedDB),
);
