export const useEmotesStore = defineStore("emotes", () => {
  const emotesCache = new EmotesCache<IEmote>();

  const pastasStore = usePastasStore();
  const personsEmoteCollections = usePersonsEmoteCollectionsStore();
  const globalEmotesIntegrationsStore = useGlobalEmotesIntegrationsStore();

  const globalEmotes = useEmotes(
    () => globalEmotesIntegrationsStore.checkedIntegrations,
  );
  const userEmotes = useEmotesWithInitialReady(
    () => personsEmoteCollections.selectedCollection.readyIntegrations,
  );

  watch(
    [
      () => personsEmoteCollections.selectedCollection.state,
      () => globalEmotesIntegrationsStore.checkedSources.state,
    ],
    () => {
      emotesCache.clear();
      pastasStore.cancelPastasShowForOneTick();
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
        (personsEmoteCollections.selectedLogin.isEmpty ||
          userEmotes.isInitialEmotesReady.value) satisfies boolean,
    ),
  };
});
