import type { IDBPDatabase } from "idb";
import type {
  EmoteCollectionsSchema,
  IndexedDBUserCollection,
} from "~/client-only/IndexedDB";

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

  updateCollectionActive(
    collection: IndexedDBUserCollection,
    isActive: boolean,
  ) {
    return this.db
      .transaction("users", "readwrite")
      .objectStore("users")
      .put({ ...toRawCollection(collection), isActive });
  }
}

function toRawCollection(
  collection: IndexedDBUserCollection,
): IndexedDBUserCollection {
  return {
    ...collection,
    twitch: toRaw(collection.twitch),
    collections: toRaw(collection.collections),
    failedCollectionsReasons: toRaw(collection.failedCollectionsReasons),
  };
}
