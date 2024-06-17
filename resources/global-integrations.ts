import type { EmoteSource } from "~~/integrations/emote-source";

export const globalIntegrationsAPI = {
  get<S extends EmoteSource>(source: S) {
    return $fetch(`/api/v1/collections/global/integrations/${source}`);
  },
  getMany(sources: EmoteSource[]) {
    return $fetch("/api/v1/collections/global/integrations", {
      query: { sources: sources.join("+") },
    });
  },
  getAll() {
    return $fetch("/api/v1/collections/global/integrations/all");
  },
};
