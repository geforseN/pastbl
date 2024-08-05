import type { TEmoteIntegrations } from "$/emote-integrations";
import type { GlobalEmotesIntegrationsIndexedDBStore } from "./store";

export class GlobalEmotesIntegrationsIndexedDBRepository {
  constructor(private readonly store: GlobalEmotesIntegrationsIndexedDBStore) {}

  async getAll() {
    return await this.store.getAll();
  }

  async put(integration: TEmoteIntegrations.Global.Settled) {
    return await this.store.put(integration);
  }

  async putMany(integrations: TEmoteIntegrations.Global.Settled[]) {
    await Promise.all(
      integrations.map((integration) => this.store.put(integration)),
    );
  }
}
