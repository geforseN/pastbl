import type { IDBPDatabase } from "idb";
import type { EmoteCollectionsSchema } from "~/client-only/IndexedDB";
import type { IGlobalEmoteCollection } from "~/integrations";

export class GlobalEmoteCollections {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<EmoteCollectionsSchema>) {}

  getAll() {
    return this.db.getAll("global");
  }

  getAllSources() {
    return this.db.getAllKeys("global");
  }

  add(collection: IGlobalEmoteCollection) {
    return this.db.add("global", collection);
  }

  put(collection: IGlobalEmoteCollection) {
    return this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put({ ...collection, updatedAt: Date.now() });
  }
}
