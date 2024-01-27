import type { IDBPDatabase } from "idb";
import type { CollectionsSchema } from "~/client-only/IndexedDB";
import type { IGlobalEmoteCollection } from "~/integrations";

export class GlobalCollectionStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<CollectionsSchema>) {}

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
      .put(collection);
  }
}
