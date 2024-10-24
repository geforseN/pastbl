import type { GlobalEmotesIntegrationsIndexedDBRepository } from "../indexed-db/repository.ts";
import type { GlobalEmotesIntegrationsAPI } from "../api.ts";

export class GlobalEmotesIntegrationService {
  constructor(
    private readonly repository: GlobalEmotesIntegrationsIndexedDBRepository,
    private readonly api: GlobalEmotesIntegrationsAPI,
  ) {}

  __put(integration: TEmoteIntegrations.Global.Settled) {
    return this.repository.put(integration);
  }

  async load<S extends EmoteSource>(source: S) {
    const { integration } = await this.api.get(source);
    await this.repository.put(integration);
    return integration;
  }

  async loadAll() {
    const { integrations } = await this.api.getAll();
    const values = objectValues(integrations);
    await this.repository.putMany(values);
    return integrations;
  }

  async loadMany<S extends EmoteSource>(sources: S[]) {
    const { integrations } = await this.api.getMany(sources);
    const values = objectValues(integrations);
    await this.repository.putMany(values);
    return values;
  }

  async getAll(): Promise<TEmoteIntegrations.Global.SettledRecord> {
    if (import.meta.server) {
      return null;
    }
    const storedIntegrations = await this.repository.getAll();
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
