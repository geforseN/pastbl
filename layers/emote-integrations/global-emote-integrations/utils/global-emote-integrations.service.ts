import type { GlobalEmoteIntegrationsIndexedDBStorage } from "./global-emote-integrations.indexed-db-storage";
import type { GlobalEmoteIntegrationsAPI } from "./global-emote-integrations.api";
import type { TEmoteIntegrations } from "$/emote-integrations/base/EmoteIntegration";

export class GlobalEmoteIntegrationService {
  constructor(
    private readonly storage: GlobalEmoteIntegrationsIndexedDBStorage,
    private readonly api: GlobalEmoteIntegrationsAPI,
  ) {}

  __put(integration: TEmoteIntegrations.Global.Settled) {
    return this.storage.put(integration);
  }

  async load<S extends EmoteSource>(source: S) {
    const integration = await this.api.get(source);
    await this.storage.put(integration);
    return integration;
  }

  async loadAll() {
    const all = await this.api.getAll();
    const values = objectValues(all);
    await this.storage.putMany(values);
    return all;
  }

  async loadMany<S extends EmoteSource>(sources: S[]) {
    const response = await this.api.getMany(sources);
    const values = objectValues(response.integrations);
    await this.storage.putMany(values);
    return values;
  }

  async getAll(): Promise<TEmoteIntegrations.Global.SettledRecord> {
    if (import.meta.server) {
      return null;
    }
    const storedIntegrations = await this.storage.getAll();
    const settled = allEmoteSources.map(
      (source) =>
        storedIntegrations.find(
          (integration) => integration.source === source,
        ) || {
          source,
          status: "failed",
          reason: `Failed to find in storage`,
        },
    );

    return flatGroupBySource(settled);
  }
}
