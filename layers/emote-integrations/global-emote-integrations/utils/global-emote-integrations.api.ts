import type { TEmoteIntegrations } from "$/emote-integrations/base/EmoteIntegration";

export class GlobalEmoteIntegrationsAPI {
  constructor(private readonly fetch: typeof $fetch) {}

  get<S extends EmoteSource>(source: S) {
    return this.fetch(`/integrations/${source}`) as Promise<
      TEmoteIntegrations.Global.SettledRecord[S]
    >;
  }

  getMany<S extends EmoteSource>(sources: S[]) {
    return this.fetch<{
      integrations: { [ES in S]: TEmoteIntegrations.Global.SettledRecord[ES] };
    }>("/integrations", {
      query: { sources: sources.join("+") },
    });
  }

  getAll() {
    return this.fetch(
      "/integrations/all",
    ) as Promise<TEmoteIntegrations.Global.SettledRecord>;
  }
}
