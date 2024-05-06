import type { IEmote } from "~/integrations";

export const useEmotesStore = defineStore("emotes", () => {
  const emotesCache = new EmotesCache();

  const pastasStore = usePastasStore();
  const userCollectionsStore = useUserCollectionsStore();
  const globalCollectionStore = useGlobalCollectionStore();

  const globalEmotes = useEmotes(
    () => globalCollectionStore.integrations.checked,
  );
  const userEmotes = useEmotesWithInitialReady(
    () => userCollectionsStore.selectedCollection.readyIntegrations,
  );

  watch(
    [
      () => userCollectionsStore.selectedCollection.state,
      () => globalCollectionStore.checkedSources.state,
    ],
    () => {
      emotesCache.clear();
      pastasStore.triggerRerender();
    },
  );

  function setEmoteInCache(emote: IEmote) {
    return emotesCache.set(emote);
  }

  return {
    findEmote(token: string) {
      return (
        emotesCache.get(token) ||
        userEmotes.findEmote(token, setEmoteInCache) ||
        globalEmotes.findEmote(token, setEmoteInCache)
      );
    },
    // NOTE: MUST use it in global emotes component OR there is a chance that emote with same token in userEmote will be found, but global emote expected
    findGlobalEmote(token: string) {
      return globalEmotes.findEmote(token);
    },
    isInitialUserEmotesReady: userEmotes.isInitialEmotesReady,
    canUseUserEmotes: computed(
      () =>
        userCollectionsStore.selectedLogin.isEmpty ||
        userEmotes.isInitialEmotesReady.value,
    ),
  };
});
