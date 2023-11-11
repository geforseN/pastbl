import type { IDBPDatabase } from "idb";
import {
  prepareUserEmoteCollectionForIDB,
  type EmoteCollectionsSchema,
  type IndexedDBUserCollection,
} from "~/client-only/IndexedDB";
import type { IUserEmoteCollection } from "~/integrations";

export class UsersEmoteCollections {
  db;
  constructor(db: IDBPDatabase<EmoteCollectionsSchema>) {
    this.db = db;
  }

  getAllCollections() {
    return this.db.transaction("users").store.getAll();
  }

  async getAllCollectionsEntries() {
    const collections = await this.getAllCollections();
    return collections.map((collection) => [
      collection.twitch.nickname,
      collection,
    ]) as [
      IndexedDBUserCollection["twitch"]["nickname"],
      IndexedDBUserCollection,
    ][];
  }

  updateCollection(idbCollection: IndexedDBUserCollection) {
    const raIdbCollection: IndexedDBUserCollection = {
      ...idbCollection,
      collections: toRaw(idbCollection.collections),
      failedCollectionsReasons: toRaw(idbCollection.failedCollectionsReasons),
      twitch: toRaw(idbCollection.twitch),
    };
    return this.db
      .transaction("users", "readwrite")
      .objectStore("users")
      .put(raIdbCollection);
  }

  removeCollection(collection: IndexedDBUserCollection) {
    return this.db.delete("users", collection.twitch.username);
  }

  async putCollection(collection: IUserEmoteCollection) {
    const idbCollection = prepareUserEmoteCollectionForIDB(collection);
    await this.db
      .transaction("users", "readwrite")
      .objectStore("users")
      .put(idbCollection);
    return idbCollection;
  }
}
