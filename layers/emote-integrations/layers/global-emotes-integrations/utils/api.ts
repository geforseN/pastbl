import type { TEmoteIntegrations } from "$/emote-integrations";

export class GlobalEmotesIntegrationsAPI {
  constructor(private readonly fetch: typeof $fetch) {}

  async get<S extends EmoteSource>(source: S) {
    const value = await this.fetch(`/global-emotes-integrations/${source}`);
    return value as { integration: TEmoteIntegrations.Global.Of<S> };
  }

  async getMany<S extends EmoteSource>(sources: S[]) {
    const value = await this.fetch("/global-emotes-integrations", {
      query: { sources: sources.join("+") },
      method: "get",
    });
    return value as {
      integrations: { [ES in S]: TEmoteIntegrations.Global.Of<ES> };
    };
  }

  async getAll() {
    const value = await this.fetch("/global-emotes-integrations/all", {
      method: "get",
    });
    return value as {
      integrations: TEmoteIntegrations.Global.SettledRecord;
    };
  }
}
