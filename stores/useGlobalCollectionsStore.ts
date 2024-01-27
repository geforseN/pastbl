import {
  emoteSources,
  type IGlobalEmoteCollection,
  type IGlobalEmoteCollectionRecord,
} from "~/integrations";
import { globalCollectionsIdb } from "~/client-only/services";

const globalCollectionsApi = {
  getAll() {
    return $fetch("/api/collections/global", {
      query: { sources: emoteSources.join("+") },
    });
  },
};

export const useGlobalCollectionsStore = defineStore(
  "global-collections",
  () => {
    const collections = useAsyncState(
      globalCollectionsIdb.getAll,
      {},
      { shallow: true, throwError: true },
    );

    const checkedSources = useIndexedDBKeyValue(
      "global-collections:checked-sources",
      [...emoteSources],
    );

    watchOnce(collections.state, async (state) => {
      const missing = await globalCollectionsIdb.___loadMissing(state);
      if (!missing) {
        return;
      }
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
        return record as Partial<IGlobalEmoteCollectionRecord>;
      }),
      async refreshCollection(source: IGlobalEmoteCollection["source"]) {
        const refreshed = await globalCollectionsIdb.___refresh(source);
        collections.state.value = {
          ...collections.state.value,
          [source]: refreshed,
        };
      },
      async refreshAllCollections() {
        const all = await globalCollectionsApi.getAll();
        const values = Object.values(all);
        await globalCollectionsIdb.putMany(values);
        collections.state.value = all;
      },
    };
  },
);
