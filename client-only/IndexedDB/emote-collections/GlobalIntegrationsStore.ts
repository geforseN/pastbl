import type { IDBPDatabase } from "idb";
import type { CollectionsSchema } from "~/client-only/IndexedDB";
import type { LoadedEmoteIntegration } from "~/integrations/integrations";

export class GlobalIntegrationsStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<CollectionsSchema>) {}

  getAll() {
    return this.db.getAll("global");
  }

  getAllSources() {
    return this.db.getAllKeys("global");
  }

  put(collection: LoadedEmoteIntegration) {
    return this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put(collection);
  }
}
