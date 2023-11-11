import type { IDBPDatabase } from "idb";
import type { EmoteCollectionsSchema } from "~/client-only/IndexedDB";
import {
  globalEmotesGetters,
  type AvailableEmoteSource,
  type IGlobalEmoteCollection,
} from "~/integrations";

export class GlobalEmoteCollections {
  db;

  constructor(db: IDBPDatabase<EmoteCollectionsSchema>) {
    this.db = db;
  }

  getAllCollections() {
    return this.db.getAll("global");
  }

  async getAllCollectionsEntries() {
    const collections = await this.db.getAll("global");
    return collections.map((collection) => [collection.source, collection]) as [
      IGlobalEmoteCollection["source"],
      IGlobalEmoteCollection,
    ][];
  }

  putCollection(collection: IGlobalEmoteCollection) {
    return this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put({ ...collection, updatedAt: Date.now() });
  }

  async updateCollection(collectionName: AvailableEmoteSource) {
    const collectionGetter = globalEmotesGetters[collectionName];
    const collection = await collectionGetter();
    return this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put(collection);
  }

  async updateCollectionActivity(
    collectionName: AvailableEmoteSource,
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
