import type { IDBPDatabase } from "idb";
import type { CollectionsSchema } from "~/client-only/IndexedDB";
import type { TEmoteIntegrations } from "~/integrations/abstract";

export class GlobalIntegrationsStore {
  constructor(private readonly database: IDBPDatabase<CollectionsSchema>) {}

  getAll() {
    return this.database.getAll("global");
  }

  getAllSources() {
    return this.database.getAllKeys("global");
  }

  put(integration: TEmoteIntegrations.Global.Settled) {
    return this.database
      .transaction("global", "readwrite")
      .objectStore("global")
      .put(integration);
  }
}
