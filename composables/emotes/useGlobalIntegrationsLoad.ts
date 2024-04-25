import {
  emoteSources,
  isEmoteSource,
  type EmoteSource,
  type IGlobalEmoteIntegration,
  type IGlobalEmoteIntegrationRecord,
} from "~/integrations";

export function useGlobalIntegrationsLoad(loaders: {
  load: (source: EmoteSource) => Promise<IGlobalEmoteIntegration>;
  loadAll: () => Promise<IGlobalEmoteIntegrationRecord>;
  loadMany: (sources: EmoteSource[]) => Promise<IGlobalEmoteIntegration[]>;
}) {
  const asyncQueue = ref(new Set<EmoteSource>());
  return {
    async executeMany(sources: EmoteSource[]) {
      for (const source of sources) {
        asyncQueue.value.add(source);
      }
      const integrations = await loaders.loadMany(sources);
      for (const loaded of integrations) {
        asyncQueue.value.delete(loaded.source);
      }
      return integrations;
    },
    async execute(sources: EmoteSource) {
      asyncQueue.value.add(sources);
      const integration = await loaders.load(sources);
      asyncQueue.value.delete(sources);
      return integration;
    },
    async executeAll() {
      for (const source of emoteSources) {
        asyncQueue.value.add(source);
      }
      const integrations = await loaders.loadAll();
      for (const source in integrations) {
        assert.ok(isEmoteSource(source));
        asyncQueue.value.delete(source);
      }
      return integrations;
    },
    isCurrentlyLoading(source: EmoteSource) {
      return asyncQueue.value.has(source);
    },
  };
}
