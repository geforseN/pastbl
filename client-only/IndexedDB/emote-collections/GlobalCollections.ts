import type { IDBPDatabase } from "idb";
import type { CollectionsSchema } from "~/client-only/IndexedDB";
import type { IGlobalEmoteIntegration } from "~/integrations";

export class GlobalCollectionStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<CollectionsSchema>) {}

  getAll() {
    return this.db.getAll("global");
  }

  getAllSources() {
    return this.db.getAllKeys("global");
  }

  add(collection: IGlobalEmoteIntegration) {
    return this.db.add("global", collection);
  }

  put(collection: IGlobalEmoteIntegration) {
    return this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put(collection);
  }
}
