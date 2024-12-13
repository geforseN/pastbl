import { computed, watch } from "vue";
import { useEmotesWithInitialReady, useEmotes } from "../../layers/emote-integrations/composables/useEmotes";
import type { IEmote } from "../../layers/emote-integrations/shared/abstract/types";
import { EmotesCache } from "../../layers/emote-integrations/utils/emotes-cache";
import { defineStore } from "../../node_modules//@pinia+nuxt@0@0@4@5@3@5/node_modules/@pinia/nuxt/dist/runtime/composables";
import { useGlobalEmotesIntegrationsStore } from "./useGlobalEmotesIntegrationsStore";
import { usePersonsEmoteCollectionsStore } from "./usePersonsEmoteCollectionsStore";
import { usePastasStore } from "./usePastasStore";

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
        emotesCache.get(token)
        || userEmotes.findEmote(token, setEmoteInCache)
        || globalEmotes.findEmote(token, setEmoteInCache)
      );
    },
    // NOTE: MUST use it in global emotes component OR there is a chance that emote with same token in userEmote will be found, but global emote expected
    findGlobalEmote(token: string) {
      return globalEmotes.findEmote(token);
    },
    isInitialUserEmotesReady: userEmotes.isInitialEmotesReady,
    canUseUserEmotes: computed(
      () =>
        (personsEmoteCollections.selectedLogin.isEmpty
          || userEmotes.isInitialEmotesReady.value) satisfies boolean,
    ),
  };
});
