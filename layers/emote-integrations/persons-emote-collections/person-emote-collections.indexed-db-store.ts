import type { IDBPDatabase } from "idb";
import { assert } from "~/utils/assert";
import type { IndexedDBEmoteIntegrationsSchema } from "$/emote-integrations/emote-integrations.indexed-db";
import type { TPersonEmoteCollection } from "../emote-integrations/base/PersonEmoteCollection";

export class PersonsEmoteCollectionsIndexedDBStore {
  constructor(
    private readonly database: IDBPDatabase<IndexedDBEmoteIntegrationsSchema>,
  ) {}

  async get(login: TwitchUserLogin) {
    const collection = await this.database.get("persons-collections", login);
    assert.ok(
      collection,
      "Failed to find loaded user collection in your browser storage (IndexedDB)",
    );
    return collection;
  }

  getAll() {
    return this.database.getAll("persons-collections");
  }

  getAllLogins() {
    return this.database.getAllKeys("persons-collections");
  }

  delete(login: TwitchUserLogin) {
    return this.database.delete("persons-collections", login);
  }

  put(collection: TPersonEmoteCollection.SettledIndexedDB) {
    return this.database.put("persons-collections", collection);
  }
}

