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
      const refreshedCollections = await loaders.loadMany(sources);
      for (const refreshed of refreshedCollections) {
        asyncQueue.value.delete(refreshed.source);
      }
      return refreshedCollections;
    },
    async execute(sources: EmoteSource) {
      asyncQueue.value.add(sources);
      const collection = await loaders.load(sources);
      asyncQueue.value.delete(sources);
      return collection;
    },
    async executeAll() {
      for (const source of emoteSources) {
        asyncQueue.value.add(source);
      }
      const allCollections = await loaders.loadAll();
      for (const source in allCollections) {
        assert.ok(isEmoteSource(source));
        asyncQueue.value.delete(source);
      }
      return allCollections;
    },
    isCurrentlyLoading(source: EmoteSource) {
      return asyncQueue.value.has(source);
    },
  };
}
