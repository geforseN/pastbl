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
    const collections = useAsyncState(
      async () => {
        if (typeof window === "undefined") {
          return [];
        }
        return await getAllGlobalCollections();
      },
      [],
      { shallow: true },
    );

    watch(collections.state, async (state) => {
      const missingSources = state
        .filter(isGlobalCollectionMissing)
        .map((collection) => collection.source);
      if (!missingSources.length) {
        return;
      }
      const missingCollections =
        await loadMissingGlobalCollections(missingSources);
      collections.state.value.push(...missingCollections);
      triggerRef(collections.state);
    });

    return {
      collections,
      async refreshGlobalCollection(collection: IGlobalEmoteCollection) {
        const newIdbCollection = await refreshGlobalCollection(collection);
        const index = collections.state.value.findIndex(
          (collection) => collection.source === newIdbCollection.source,
        );
        assert.ok(
          index >= 0,
          "Can not update the collection which is not exist",
        );
        collections.state.value.splice(index, 1, newIdbCollection);
        triggerRef(collections.state);
      },
    };
  },
);
