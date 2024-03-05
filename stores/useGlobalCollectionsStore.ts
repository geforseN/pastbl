import {
  emoteSources,
  type IGlobalEmoteCollection,
  type IGlobalEmoteCollectionRecord,
} from "~/integrations";
import { globalCollectionsService } from "~/client-only/services";

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

    watchOnce(collections.state, async (state) => {
      const missing = await globalCollectionsService.tryLoadMissing(state);
      if (missing) {
        collections.state.value = {
          ...collections.state.value,
          ...missing,
        };
      }
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
        return record as Partial<IGlobalEmoteCollectionRecord>;
      }),
      async refreshCollection(source: IGlobalEmoteCollection["source"]) {
        const refreshed = await globalCollectionsService.refresh(source);
        collections.state.value = {
          ...collections.state.value,
          [source]: refreshed,
        };
      },
      async refreshAllCollections() {
        const all = await globalCollectionsService.refreshAll();
        // NOTE: for loop and triggerRef could be replaced with => collections.state.value = all
        // HOWEVER: order of entries will change and view of global collections will change order
        for (const [source, collection] of Object.entries(all)) {
          // @ts-expect-error weird typing of Nitro eventHandler
          collections.state.value[source] = collection;
        }
        triggerRef(collections.state);
      },
    };
  },
);
