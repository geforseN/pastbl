import type { IDBPDatabase } from "idb";
import type { CollectionsSchema } from "~/client-only/IndexedDB";
import type { SettledEmoteIntegration } from "~/integrations/integrations";

export class GlobalIntegrationsStore {
  constructor(private readonly db: IDBPDatabase<CollectionsSchema>) {}

  getAll() {
    return this.db.getAll("global");
  }

  getAllSources() {
    return this.db.getAllKeys("global");
  }

  put(collection: SettledEmoteIntegration) {
    return this.db
      .transaction("global", "readwrite")
      .objectStore("global")
      .put(collection);
  }
}
