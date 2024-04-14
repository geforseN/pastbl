import {
  emoteSources,
  isValidEmoteSource,
  type EmoteSource,
  type IGlobalEmoteIntegration,
  type IGlobalEmoteIntegrationRecord,
} from "~/integrations";
import { globalCollectionsService } from "~/client-only/services";

type SourceKey = IGlobalEmoteIntegration | IGlobalEmoteIntegration["source"];

function getSource(key: SourceKey) {
  return typeof key === "string" ? key : key.source;
}

function useCollectionsRefresh() {
  const currentlyUpdated = ref(new Set<EmoteSource>());

  return {
    async executeMany(sources: EmoteSource[]) {
      for (const source of sources) {
        currentlyUpdated.value.add(source);
      }
      const refreshedCollections =
        await globalCollectionsService.refreshMany(sources);
      for (const refreshed of refreshedCollections) {
        currentlyUpdated.value.delete(refreshed.source);
      }
      return refreshedCollections;
    },
    async execute(sources: EmoteSource) {
      currentlyUpdated.value.add(sources);
      const collection = await globalCollectionsService.refresh(sources);
      currentlyUpdated.value.delete(sources);
      return collection;
    },
    async executeAll() {
      for (const source of emoteSources) {
        currentlyUpdated.value.add(source);
      }
      const allCollections = await globalCollectionsService.refreshAll();
      for (const source in allCollections) {
        assert.ok(isValidEmoteSource(source));
        currentlyUpdated.value.delete(source);
      }
      return allCollections;
    },
    isCurrentlyRefreshing(source: EmoteSource) {
      return currentlyUpdated.value.has(source);
    },
  };
}

export const useGlobalCollectionsStore = defineStore(
  "global-collections",
  () => {
    const collections = useAsyncState(
      globalCollectionsService.getAll,
      {},
      { shallow: true, throwError: true },
    );

    const checkedSources = useIndexedDBKeyValue(
      "global-collections:checked-sources",
      [...emoteSources],
    );

    const collectionsRefresh = useCollectionsRefresh();

    watchOnce(collections.state, async (state) => {
      const missingSources = emoteSources.filter((source) => !state[source]);
      if (!missingSources.length) {
        return;
      }
      const missing = await collectionsRefresh.executeMany(missingSources);
      collections.state.value = {
        ...collections.state.value,
        ...missing,
      };
    });

    return {
      checkedSources,
      collections,
      checkedCollections: computed(() => {
        const values = Object.values(collections.state.value);
        const checked = values.filter((collection) =>
          checkedSources.state.value.includes(collection.source),
        );
        const record = flatGroupBy(checked, (collection) => collection.source);
        return record as Partial<IGlobalEmoteIntegrationRecord>;
      }),
      async refreshCollection(key: SourceKey) {
        const source = getSource(key);
        const refreshed = await collectionsRefresh.execute(source);
        collections.state.value = {
          ...collections.state.value,
          [source]: refreshed,
        };
      },
      async refreshAllCollections() {
        const all = await collectionsRefresh.executeAll();
        // NOTE: for loop and triggerRef could be replaced with => collections.state.value = all
        // HOWEVER: order of entries will change and view of global collections will change order
        for (const [source, collection] of Object.entries(all)) {
          // @ts-expect-error weird typing of Nitro eventHandler
          collections.state.value[source] = collection;
        }
        triggerRef(collections.state);
      },
      isCurrentlyRefreshing(key: SourceKey) {
        const source = getSource(key);
        return collectionsRefresh.isCurrentlyRefreshing(source);
      },
    };
  },
);
