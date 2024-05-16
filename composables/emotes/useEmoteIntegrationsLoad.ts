import { emoteSources, type EmoteSource } from "~/integrations";

export function useEmoteIntegrationsLoad<
  I extends { source: EmoteSource },
  IRecord extends Record<EmoteSource, I>,
>(loaders: {
  load: (source: EmoteSource) => Promise<I>;
  loadAll: () => Promise<IRecord>;
  loadMany: (sources: EmoteSource[]) => Promise<I[]>;
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
    async execute(source: EmoteSource) {
      asyncQueue.value.add(source);
      const integration = await loaders.load(source);
      asyncQueue.value.delete(source);
      return integration;
    },
    async executeAll() {
      for (const source of emoteSources) {
        asyncQueue.value.add(source);
      }
      const integrations = await loaders.loadAll();
      for (const source of emoteSources) {
        asyncQueue.value.delete(source);
      }
      return integrations;
    },
    isCurrentlyLoading(source: EmoteSource) {
      return asyncQueue.value.has(source);
    },
  };
}
