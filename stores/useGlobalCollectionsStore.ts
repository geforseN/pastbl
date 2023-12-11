import { defineStore } from "pinia";
import {
  isGlobalCollectionMissing,
  type IGlobalEmoteCollection,
} from "~/integrations";
import {
  getAllGlobalCollections,
  loadMissingGlobalCollections,
  refreshGlobalCollection,
} from "~/client-only/IndexedDB/emote-collections";

export const useGlobalCollectionsStore = defineStore(
  "global-collections",
  () => {
    const asyncState = useAsyncState(
      async () => {
        if (typeof window === "undefined") {
          return [];
        }
        return await getAllGlobalCollections();
      },
      [],
      { shallow: true },
    );

    watch(asyncState.state, async (state) => {
      const missingSources = state
        .filter(isGlobalCollectionMissing)
        .map((collection) => collection.source);
      if (!missingSources.length) {
        return;
      }
      const collections = await loadMissingGlobalCollections(missingSources);
      asyncState.state.value.push(...collections);
      triggerRef(asyncState.state);
    });

    return {
      asyncState,
      async refreshGlobalCollection(collection: IGlobalEmoteCollection) {
        const newIdbCollection = await refreshGlobalCollection(collection);
        const index = asyncState.state.value.findIndex(
          (collection) => collection.source === newIdbCollection.source,
        );
        assert.ok(
          index >= 0,
          "Can not update the collection which is not exist",
        );
        asyncState.state.value.splice(index, 1, newIdbCollection);
        triggerRef(asyncState.state);
      },
    };
  },
);
