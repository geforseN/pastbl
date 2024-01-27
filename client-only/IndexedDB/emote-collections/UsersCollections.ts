import type { IDBPDatabase } from "idb";
import {
  type CollectionsSchema,
  type IndexedDBUserEmoteCollection,
} from "~/client-only/IndexedDB";

export class UsersCollectionsStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<CollectionsSchema>) {}

  get(login: Lowercase<string>) {
    return this.db.transaction("users").store.get(login);
  }

  getAll() {
    return this.db.transaction("users").store.getAll();
  }

  getAllLogins() {
    return this.db.transaction("users").store.getAllKeys();
  }

  delete(login: Lowercase<string>) {
    return this.db.delete("users", login);
  }

  async put(collection: IndexedDBUserEmoteCollection) {
    await this.db
      .transaction("users", "readwrite")
      .objectStore("users")
      .put(collection);
  }
}
