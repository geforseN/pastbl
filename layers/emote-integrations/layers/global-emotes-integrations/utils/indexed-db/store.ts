type IndexedDBGlobalEmotesIntegration =
  GlobalEmotesIntegrationsIndexedDBSchema["global-integrations"]["value"];

export class GlobalEmotesIntegrationsIndexedDBStore {
  constructor(private readonly withDatabase: WithEmoteIntegrationsIndexedDB) {}

  async getAll() {
    return await this.withDatabase((database) =>
      database.getAll("global-integrations"),
    );
  }

  async put(integration: IndexedDBGlobalEmotesIntegration) {
    return await this.withDatabase((database) =>
      database.put("global-integrations", integration),
    );
  }
}
