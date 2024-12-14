import type * as TEmoteIntegrations from "../../../../../shared/types";
import type { EmoteSource } from "../../../../emote-sources/utils/external";

export class PersonsEmoteIntegrationsApi {
  constructor(private readonly fetch: typeof $fetch) {}

  async get<E extends EmoteSource>(source: E) {
    const value = await this.fetch(`/integrations/${source}`);
    return value;
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
