import type { IDBPDatabase } from "idb";
import {
  type CollectionsSchema,
  type IndexedDBUserEmoteCollection,
} from "~/client-only/IndexedDB";

export class UsersCollectionsStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<CollectionsSchema>) {}

  get(username: IndexedDBUserEmoteCollection["twitch"]["username"]) {
    return this.db.transaction("users").store.get(username);
  }

  getAll() {
    return this.db.transaction("users").store.getAll();
  }

  getAllUsernames() {
    return this.db.transaction("users").store.getAllKeys();
  }

  delete(username: IndexedDBUserEmoteCollection["twitch"]["username"]) {
    return this.db.delete("users", username);
  }

  async put(collection: IndexedDBUserEmoteCollection) {
    await this.db
      .transaction("users", "readwrite")
      .objectStore("users")
      .put(collection);
  }
}
