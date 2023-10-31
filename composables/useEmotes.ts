import { EmoteMap } from "~/integrations";

export const useEmotes = (emoteCollectionsGetters: Promise<EmoteMap>[]) => {
  const emoteMaps = ref<EmoteMap[]>([]);
  const failReasons = ref<unknown[]>([]);
  const isLoaded = ref(false);

  Promise.allSettled<Promise<EmoteMap>>(emoteCollectionsGetters).then(
    (settledEmotes) =>
      ([emoteMaps.value, failReasons.value] =
        tupleSettledPromises(settledEmotes)),
  );

  return {
    isLoaded,
    emoteMaps,
    failReasons,
  };
};
