import { defineStore } from "pinia";
import type { IGlobalEmoteCollection } from "~/integrations";
import { globalCollectionsService } from "~/client-only/services";

export const useGlobalCollectionsStore = defineStore(
  "global-collections",
  () => {
    const collections = useAsyncState(
      () => {
        return globalCollectionsService.getAll();
      },
      {},
      { shallow: true, throwError: true },
    );

    watch(
      collections.state,
      async (state) => {
        const missingCollections =
          await globalCollectionsService.loadMissing(state);
        if (!missingCollections.length) {
          return;
        }
        for (const collection of missingCollections) {
          // @ts-expect-error TypeScript is weird or what?
          collections.state.value[collection.source] = collection;
        }
        triggerRef(collections.state);
      },
      { once: true },
    );

    return {
      frankerFaceZCollection: computed(
        () => collections.state.value.FrankerFaceZ,
      ),
      betterTTVCollection: computed(() => collections.state.value.BetterTTV),
      sevenTvCollection: computed(() => collections.state.value.SevenTV),
      twitchCollection: computed(() => collections.state.value.Twitch),
      collections,
      async refreshGlobalCollection(source: IGlobalEmoteCollection["source"]) {
        const refreshedCollection =
          await globalCollectionsService.refresh(source);
        // @ts-expect-error TypeScript is weird or what?
        collections.state.value[source] = refreshedCollection;
        triggerRef(collections.state);
      },
    };
  },
);
