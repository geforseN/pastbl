import type { TEmoteIntegrations } from "$/emote-integrations";

export class PersonsEmoteIntegrationsApi {
  constructor(private readonly fetch: typeof $fetch) {}

  async get<T extends EmoteSource>(source: T) {
    const value = await this.fetch(`/integrations/${source}`);
    return value as { T: TEmoteIntegrations.Person.Settled } /* TODO: OF T */;
  }

  async getAll() {
    const value = await this.fetch(`/integrations`);
    return value as TEmoteIntegrations.Person.SettledRecord;
  }

  async getMany<T extends EmoteSource>(sources: T[]) {
    const value = await this.fetch(`/integrations`, {
      params: {
        sources: sources.join("+"),
      },
    });
    return value as { [K in T]: TEmoteIntegrations.Person.SettledRecord[K] };
  }
}