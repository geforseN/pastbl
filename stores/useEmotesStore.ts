import type {
  IEmote,
  EmoteSource,
  IGlobalEmoteCollectionRecord,
  IUserEmoteIntegrationRecord,
} from "~/integrations";

type EmoteCache = Map<IEmote["token"], IEmote>;
type EmoteCacheRecord = Record<EmoteSource, EmoteCache>;

function useEmotes<
  T extends IGlobalEmoteCollectionRecord | IUserEmoteIntegrationRecord,
>(sourceToWatchCb: () => Partial<T>) {
  const emotesRecord = ref<Partial<EmoteCacheRecord>>({});
  const emoteSources = computed(
    () => Object.keys(emotesRecord.value) as (keyof EmoteCacheRecord)[],
  );

  watch(sourceToWatchCb, (source) => {
    emotesRecord.value = groupBy2(
      Object.values(source),
      (integration) => integration.source,
      (integration) => {
        const emoteEntries = integration.sets
          .flatMap((set: { emotes: IEmote[] }) => set.emotes)
          .map((emote: IEmote): [string, IEmote] => [emote.token, emote]);
        return new Map(emoteEntries);
      },
    );
  });

  return {
    emotesRecord,
    emoteSources,
    findEmote(token: IEmote["token"], onEmoteFoundCb: (emote: IEmote) => void) {
      for (const source of emoteSources.value) {
        const emote = emotesRecord.value[source]!.get(token);
        if (emote) {
          onEmoteFoundCb(emote);
          return emote;
        }
      }
    },
  };
}

export const useEmotesStore = defineStore("emotes", () => {
  const userCollectionsStore = useUserCollectionsStore();
  const globalCollectionsStore = useGlobalCollectionsStore();

  const emotesCache: EmoteCache = new Map();

  const userCollection = useEmotes(
    () => userCollectionsStore.selectedCollection?.state?.integrations ?? {},
  );

  const globalCollection = useEmotes(
    () => globalCollectionsStore.collections.state,
  );

  watch(
    () => userCollection.emotesRecord,
    () => {
      emotesCache.clear();
    },
  );

  return {
    findEmote(token: IEmote["token"]) {
      return (
        emotesCache.get(token) ||
        userCollection.findEmote(token, (emote) =>
          emotesCache.set(token, emote),
        ) ||
        globalCollection.findEmote(token, (emote) =>
          emotesCache.set(token, emote),
        )
      );
    },
  };
});
