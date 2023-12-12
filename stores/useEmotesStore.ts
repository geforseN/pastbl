import { defineStore } from "pinia";
import {
  availableEmoteSources,
  type AvailableEmoteSource,
  type IEmote,
} from "~/integrations";

export const useEmotesStore = defineStore("emotes", () => {
  const userCollectionsStore = useUserCollectionsStore();
  const globalCollectionsStore = useGlobalCollectionsStore();

  const usersEmotesCache = new Map<
    AvailableEmoteSource,
    Map<IEmote["id"], IEmote>
  >([
    ["BetterTTV", new Map()],
    ["FrankerFaceZ", new Map()],
    ["SevenTV", new Map()],
  ]);

  const activeUserEmotesCache = new Map<IEmote["token"], IEmote>();

  // FIXME: fix ts-expect-error comments
  const activeUserEmotes = computedWithControl(
    () => userCollectionsStore.selectedCollection?.state,
    () => {
      const activeUserEmotes = groupBy2(
        Object.values(
          userCollectionsStore.selectedCollection?.state?.collections ?? {},
        ),
        (collection) => collection.source,
        (collection) => {
          return new Map<IEmote["token"], IEmote>(
            // @ts-expect-error idk for now
            collection.sets
              // @ts-expect-error idk for now
              .flatMap((set) => set.emotes)
              // @ts-expect-error idk for now
              .map((emote) => [emote.token, emote]),
          );
        },
      );
      for (const source of availableEmoteSources) {
        if (!activeUserEmotes[source]) {
          activeUserEmotes[source] = new Map();
        }
      }
      return activeUserEmotes;
    },
  );
  const globalEmotes = computedWithControl(
    () => globalCollectionsStore.collections.state,
    () => {
      const globalEmotes = groupBy2(
        globalCollectionsStore.collections.state,
        (collection) => collection.source,
        (collection) => {
          return new Map<IEmote["token"], IEmote>(
            collection.sets
              .flatMap((set) => set.emotes)
              .map((emote) => [emote.token, emote]),
          );
        },
      );
      for (const source of availableEmoteSources) {
        if (!globalEmotes[source]) {
          globalEmotes[source] = new Map();
        }
      }
      return globalEmotes;
    },
  );

  watch(
    () => activeUserEmotes.value,
    () => {
      activeUserEmotesCache.clear();
    },
  );

  return {
    usersEmotesCache,
    activeUserEmotes,
    globalEmotes,
    findEmoteInActiveUser(token: IEmote["token"]) {
      const cachedEmote = activeUserEmotesCache.get(token);
      if (cachedEmote) {
        return cachedEmote;
      }
      for (const source of ["FrankerFaceZ", "BetterTTV", "SevenTV"] as const) {
        const sourceEmote = activeUserEmotes.value[source].get(token);
        if (sourceEmote) {
          activeUserEmotesCache.set(token, sourceEmote);
          return sourceEmote;
        }
      }
    },
    findEmoteInGlobal(token: IEmote["token"]) {
      for (const source of ["FrankerFaceZ", "BetterTTV", "SevenTV"] as const) {
        const sourceEmote = globalEmotes.value[source].get(token);
        if (sourceEmote) {
          activeUserEmotesCache.set(token, sourceEmote);
          return sourceEmote;
        }
      }
    },
    _activeUserEmotesCache: activeUserEmotesCache,
  };
});
