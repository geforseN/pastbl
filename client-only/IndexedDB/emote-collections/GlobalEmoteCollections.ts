import type { IDBPDatabase } from "idb";
import type { EmoteCollectionsSchema } from "~/client-only/IndexedDB";
import {
  getGlobalCollection,
  type IGlobalEmoteCollection,
} from "~/integrations";

export class GlobalEmoteCollections {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<EmoteCollectionsSchema>) {}

  getAllCollections() {
    return this.db.getAll("global");
  }

  getAllCollectionsKeys() {
    return this.db.getAllKeys("global");
  }

  addCollection(collection: IGlobalEmoteCollection) {
    return this.db.add("global", collection);
  }

  putCollection(collection: IGlobalEmoteCollection) {
    return this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put({ ...collection, updatedAt: Date.now() });
  }

  async refreshCollection(collection: IGlobalEmoteCollection) {
    const newCollection = await getGlobalCollection(collection.source);
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
