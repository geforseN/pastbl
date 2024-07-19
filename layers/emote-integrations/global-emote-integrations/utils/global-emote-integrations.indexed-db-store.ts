import type { WithEmoteIntegrationsIndexedDB } from "$/emote-integrations/indexed-db/utils";
import type { GlobalEmoteIntegrationsIndexedDBSchema } from "./global-emote-integrations.indexed-db-schema";

type IndexedDBGlobalEmoteIntegration =
  GlobalEmoteIntegrationsIndexedDBSchema["global-integrations"]["value"];

export class GlobalEmoteIntegrationsIndexedDBStore {
  constructor(private readonly withDatabase: WithEmoteIntegrationsIndexedDB) {}

  async getAll() {
    return await this.withDatabase((database) =>
      database.getAll("global-integrations"),
    );
  }

  async put(integration: IndexedDBGlobalEmoteIntegration) {
    return await this.withDatabase((database) =>
      database.put("global-integrations", integration),
    );
  }
}
