import type { IDBPDatabase } from "idb";
import type { CollectionsSchema } from "~/client-only/IndexedDB";
import type { SettledEmoteIntegration } from "~/integrations/integrations";

export class GlobalIntegrationsStore {
  constructor(private readonly database: IDBPDatabase<CollectionsSchema>) {}

  getAll() {
    return this.database.getAll("global");
  }

  getAllSources() {
    return this.database.getAllKeys("global");
  }

  put(collection: SettledEmoteIntegration) {
    return this.database
      .transaction("global", "readwrite")
      .objectStore("global")
      .put(collection);
  }
}
