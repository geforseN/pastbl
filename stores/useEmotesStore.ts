import type {
  IEmote,
  EmoteSource,
  IGlobalEmoteCollectionRecord,
  IUserEmoteIntegrationRecord,
} from "~/integrations";

type EmoteMap = Map<IEmote["token"], IEmote>;

class EmotesCache {
  readonly #cache: EmoteMap;

  constructor() {
    this.#cache = new Map<string, IEmote>();
    this.set = this.set.bind(this);
  }

  get(token: IEmote["token"]) {
    return this.#cache.get(token);
  }

  set(emote: IEmote) {
    this.#cache.set(emote.token, emote);
  }

  clear() {
    withLogSync([...this.#cache], "userChangedClearingCache");
    this.#cache.clear();
  }
}

type EmoteMapRecord = Record<EmoteSource, EmoteMap>;

function useEmotes<
  T extends IGlobalEmoteCollectionRecord | IUserEmoteIntegrationRecord,
>(sourceToWatchCb: () => Partial<T>, onReady = () => {}) {
  const record = ref<Partial<EmoteMapRecord>>({});
  const sources = computed(
    () => Object.keys(record.value) as (keyof EmoteMapRecord)[],
  );

  watch(sourceToWatchCb, (source) => {
    record.value = flatGroupBy(
      Object.values(source),
      (integration) => integration.source,
      (integration) => {
        const emoteEntries = integration.sets
          .flatMap((set: { emotes: IEmote[] }) => set.emotes)
          .map((emote: IEmote): [string, IEmote] => [emote.token, emote]);
        return new Map(emoteEntries);
      },
    );
    onReady();
  });

  return {
    findEmote(token: IEmote["token"], onEmoteFound: (emote: IEmote) => void) {
      for (const source of sources.value) {
        const emote = record.value[source]!.get(token);
        if (emote) {
          onEmoteFound(emote);
          return emote;
        }
      }
    },
  };
}

function useUserEmotes(
  sourceToWatchCb: () => Partial<IUserEmoteIntegrationRecord>,
) {
  const isInitialEmotesReady = ref(false);

  const userEmotes = useEmotes(sourceToWatchCb, function onUserEmotesReady() {
    if (isInitialEmotesReady.value) {
      return;
    }
    isInitialEmotesReady.value = true;
  });

  return {
    ...userEmotes,
    isInitialEmotesReady,
  };
}

export const useEmotesStore = defineStore("emotes", () => {
  const emotesCache = new EmotesCache();

  const pastasStore = usePastasStore();
  const userCollectionsStore = useUserCollectionsStore();
  const globalCollectionsStore = useGlobalCollectionsStore();

  const globalEmotes = useEmotes(
    () => globalCollectionsStore.checkedCollections,
  );
  const userEmotes = useUserEmotes(
    () => userCollectionsStore.readyIntegrations,
  );

  watch(
    [
      () => userCollectionsStore.selectedCollection.state,
      () => globalCollectionsStore.checkedSources.state,
    ],
    () => {
      emotesCache.clear();
      return pastasStore.makeHack();
    },
  );

  return {
    findEmote(token: IEmote["token"]) {
      return (
        emotesCache.get(token) ||
        userEmotes.findEmote(token, emotesCache.set) ||
        globalEmotes.findEmote(token, emotesCache.set)
      );
    },
    isInitialUserEmotesReady: userEmotes.isInitialEmotesReady,
  };
});
