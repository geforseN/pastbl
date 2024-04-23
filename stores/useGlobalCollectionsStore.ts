import {
  emoteSources,
  isEmoteSource,
  type IGlobalEmoteIntegrationRecord,
} from "~/integrations";
import { globalCollectionsService } from "~/client-only/services";

export const useGlobalCollectionsStore = defineStore(
  "global-collections",
  () => {
    const collections = useAsyncObject(globalCollectionsService.getAll);

    const checkedSources = useIndexedDBKeyValue(
      "global-collections:checked-sources",
      [...emoteSources],
    );

    const integrationsLoad = useGlobalIntegrationsLoad(
      globalCollectionsService,
    );

    watchOnce(collections.state, async (state) => {
      const missingSources = emoteSources.filter((source) => !state[source]);
      if (!missingSources.length) {
        return;
      }
      const missing = await integrationsLoad.executeMany(missingSources);
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
      async refreshCollection(source: SomeEmoteSource) {
        const emoteSource = getEmoteSource(source);
        const refreshed = await integrationsLoad.execute(emoteSource);
        collections.state.value = {
          ...collections.state.value,
          [emoteSource]: refreshed,
        };
      },
      async refreshAllCollections() {
        const all = await integrationsLoad.executeAll();
        // NOTE: for loop and triggerRef could be replaced with => collections.state.value = all
        // HOWEVER: order of entries will change and view of global collections will change order
        for (const [source, collection] of Object.entries(all)) {
          assert.ok(isEmoteSource(source));
          // @ts-expect-error weird type error
          collections.state.value[source] = collection;
        }
        triggerRef(collections.state);
      },
      isCurrentlyRefreshing(source: SomeEmoteSource) {
        return integrationsLoad.isCurrentlyLoading(getEmoteSource(source));
      },
    };
  },
);
