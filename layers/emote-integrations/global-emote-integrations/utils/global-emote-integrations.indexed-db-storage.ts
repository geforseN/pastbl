import type { TEmoteIntegrations } from "$/emote-integrations/base/EmoteIntegration";
import type { GlobalEmoteIntegrationsIndexedDBStore } from "./global-emote-integrations.indexed-db-store";

export class GlobalEmoteIntegrationsIndexedDBStorage {
  constructor(private readonly store: GlobalEmoteIntegrationsIndexedDBStore) {}

  async getAll() {
    return await this.store.getAll();
  }

  async put(integration: TEmoteIntegrations.Global.Settled) {
    return await this.store.put(integration);
  }

  async putMany<I extends TEmoteIntegrations.Global.Settled>(
    integrations: I[],
  ) {
    await Promise.all(
      integrations.map((integration) => this.store.put(integration)),
    );
  }
}
