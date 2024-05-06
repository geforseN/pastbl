import type { IDBPDatabase } from "idb";
import {
  type CollectionsSchema,
  type IndexedDBUserEmoteCollection,
} from "~/client-only/IndexedDB";
import { assert } from "~/utils/error";

export class UsersCollectionsStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<CollectionsSchema>) {}

  async get(login: TwitchUserLogin) {
    const collection = await this.db.transaction("users").store.get(login);
    assert.ok(
      collection,
      "Failed to find loaded user collection in your browser storage (IndexedDB)",
    );
    return collection;
  }

  getAll() {
    return this.db.transaction("users").store.getAll();
  }

  getAllLogins() {
    return this.db.transaction("users").store.getAllKeys();
  }

  delete(login: TwitchUserLogin) {
    return this.db.delete("users", login);
  }

  put(collection: IndexedDBUserEmoteCollection) {
    return this.db.put("users", collection);
  }
}
