import { assert } from "~/utils/assert";
import type { WithEmoteIntegrationsIndexedDB } from "$/emote-integrations/layers/indexed-db/utils/with";

export class PersonsEmoteCollectionsIndexedDBStore {
  constructor(private readonly withDatabase: WithEmoteIntegrationsIndexedDB) {}

  async get(login: TwitchUserLogin) {
    const collection = await this.withDatabase((database) =>
      database.get("persons-collections", login),
    );
    assert.ok(
      collection,
      "Failed to find loaded user collection in your browser storage (IndexedDB)",
    );
    return collection;
  }

  async getAll() {
    return await this.withDatabase((database) =>
      database.getAll("persons-collections"),
    );
  }

  async getAllRawExcept(login: TwitchUserLogin) {
    return await this.withDatabase(async (database) => {
      const tx = database.transaction("persons-collections");
      const collections = [];
      for await (const cursor of tx.store) {
        if (cursor.key !== login) {
          collections.push(cursor.value);
        }
      }
      return collections;
    });
  }

  async getAllLogins() {
    return await this.withDatabase((database) =>
      database.getAllKeys("persons-collections"),
    );
  }

  async delete(login: TwitchUserLogin) {
    return await this.withDatabase((database) =>
      database.delete("persons-collections", login),
    );
  }

  async put(collection: TPersonEmoteCollection.SettledIndexedDB) {
    return await this.withDatabase((database) =>
      database.put("persons-collections", collection),
    );
  }
}
