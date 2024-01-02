import { defineStore } from "pinia";
import type { IGlobalEmoteCollection } from "~/integrations";
import {
  getAllGlobalCollections,
  loadMissingGlobalCollections,
  refreshGlobalCollection,
} from "~/client-only/IndexedDB/emote-collections";

export const useGlobalCollectionsStore = defineStore(
  "global-collections",
  () => {
    const collections = useAsyncState(
      getAllGlobalCollections,
      {},
      { shallow: true },
    );

    watch(collections.state, async (state) => {
      const missingCollections = await loadMissingGlobalCollections(state);
      for (const collection of missingCollections) {
        // @ts-expect-error TypeScript is weird or what?
        collections.state.value[collection.source] = collection;
      }
      triggerRef(collections.state);
    });

    return {
      frankerFaceZCollection: computed(
        () => collections.state.value.FrankerFaceZ,
      ),
      betterTTVCollection: computed(() => collections.state.value.BetterTTV),
      sevenTvCollection: computed(() => collections.state.value.SevenTV),
      twitchCollection: computed(() => collections.state.value.Twitch),
      collections,
      async refreshGlobalCollection(source: IGlobalEmoteCollection["source"]) {
        const refreshedCollection = await refreshGlobalCollection(source);
        // @ts-expect-error TypeScript is weird or what?
        collections.state.value[source] = refreshedCollection;
        triggerRef(collections.state);
      },
    };
  },
);
