import { EmoteMap } from "~/integrations";

export default function useEmotes(
  emoteCollectionsGetters: Promise<EmoteMap>[],
) {
  const emoteCollections = ref<EmoteMap[]>([]);
  const failedEmoteCollectionsReasons = ref<EmoteMap[]>([]);
  const isLoaded = ref(false);

  Promise.allSettled<Promise<EmoteMap>>(emoteCollectionsGetters).then(
    (settledEmotesCollections) => {
      emoteCollections.value = settledEmotesCollections
        .filter(
          (collection): collection is PromiseFulfilledResult<EmoteMap> =>
            collection.status === "fulfilled",
        )
        .flatMap((result) => result.value);

      failedEmoteCollectionsReasons.value = settledEmotesCollections
        .filter(
          (collection): collection is PromiseRejectedResult =>
            collection.status === "rejected",
        )
        .map((result) => result.reason);
      console.log(failedEmoteCollectionsReasons, emoteCollections);
    },
  );

  return {
    isLoaded,
    emoteCollections,
    failedEmoteCollectionsReasons,
  };
}
