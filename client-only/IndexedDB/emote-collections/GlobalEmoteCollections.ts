import type { IDBPDatabase } from "idb";
import type { EmoteCollectionsSchema } from "~/client-only/IndexedDB";
import {
  globalEmotesGetters,
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

  async updateCollection(collection: IGlobalEmoteCollection) {
    const getCollection = globalEmotesGetters[collection.source];
    const newCollection = await getCollection();
    await this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put(newCollection);
    return newCollection;
  }

  updateCollectionActivity(
    collection: IGlobalEmoteCollection,
    isActive: boolean,
  ) {
    const newCollection = {
      ...collection,
      sets: toRaw(collection.sets),
      isActive,
    };
    return this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put(newCollection);
  }
}
