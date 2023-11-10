import type { IDBPDatabase } from "idb";
import {
  openEmoteCollections,
  type EmoteCollectionsSchema,
} from "~/client-only/IndexedDB";
import {
  globalEmotesGetters,
  type AvailableEmoteSources,
  type IGlobalEmoteCollection,
} from "~/integrations";

class GlobalEmoteCollections {
  db;

  constructor(db: IDBPDatabase<EmoteCollectionsSchema>) {
    this.db = db;
  }

  getCollections() {
    return this.db.getAll("global");
  }

  putCollection(collection: IGlobalEmoteCollection) {
    return this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put({ ...collection, updatedAt: Date.now() });
  }

  async updateCollection(collectionName: AvailableEmoteSources) {
    const collectionGetter = globalEmotesGetters[collectionName];
    const collection = await collectionGetter();
    return this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put(collection);
  }

  async updateCollectionActivity(
    collectionName: AvailableEmoteSources,
    isActive: boolean,
  ) {
    const collection = await this.db.get("global", collectionName);
    assert.ok(
      collection,
      "You must have an existing collection to update activity",
    );
    const newCollection = {
      ...collection,
      isActive,
      updatedAt: Date.now(),
    };
    return this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put(newCollection);
  }
}

class EmoteCollections {
  db;
  global;

  constructor(db: IDBPDatabase<EmoteCollectionsSchema>) {
    this.db = db;
    this.global = new GlobalEmoteCollections(db);
  }

  async getUserCollections() {}
}

export const emoteCollectionsDB = new EmoteCollections(
  await openEmoteCollections,
);
