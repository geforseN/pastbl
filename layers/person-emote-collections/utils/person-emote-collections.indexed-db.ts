import type { IDBPDatabase } from "idb";
import { type CollectionsSchema } from "~/client-only/IndexedDB";
import { assert } from "~/utils/error";

export class UsersCollectionsStore {
  constructor(private readonly database: IDBPDatabase<CollectionsSchema>) {}

  async get(login: TwitchUserLogin) {
    const collection = await this.database
      .transaction("users")
      .store.get(login);
    assert.ok(
      collection,
      "Failed to find loaded user collection in your browser storage (IndexedDB)",
    );
    return collection;
  }

  getAll() {
    return this.database.transaction("users").store.getAll();
  }

  getAllLogins() {
    return this.database.transaction("users").store.getAllKeys();
  }

  delete(login: TwitchUserLogin) {
    return this.database.delete("users", login);
  }

  put(collection: IndexedDBUserEmoteCollection) {
    return this.database.put("users", collection);
  }
}
