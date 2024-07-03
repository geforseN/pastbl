import type { TEmoteIntegrations } from "~~/layers/emote-integrations/abstract";

export const API = {
  get<S extends EmoteSource>(source: S) {
    return $fetch(
      `/api/v1/collections/global/integrations/${source}`,
    ) as Promise<TEmoteIntegrations.Global.SettledRecord[S]>;
  },
  getMany<S extends EmoteSource>(sources: S[]) {
    return $fetch<{
      integrations: { [ES in S]: TEmoteIntegrations.Global.SettledRecord[ES] };
    }>("/api/v1/collections/global/integrations", {
      query: { sources: sources.join("+") },
    });
  },
  getAll() {
    return $fetch(
      "/api/v1/collections/global/integrations/all",
    ) as Promise<TEmoteIntegrations.Global.SettledRecord>;
  },
};
