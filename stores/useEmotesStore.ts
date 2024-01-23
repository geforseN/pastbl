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
  const emotesRecord = ref<Partial<EmoteMapRecord>>({});
  const emoteSources = computed(
    () => Object.keys(emotesRecord.value) as (keyof EmoteMapRecord)[],
  );

  watch(sourceToWatchCb, (source) => {
    emotesRecord.value = flatGroupBy(
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
    emotesRecord,
    emoteSources,
    findEmote(token: IEmote["token"], onEmoteFound: (emote: IEmote) => void) {
      for (const source of emoteSources.value) {
        const emote = emotesRecord.value[source]!.get(token);
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
  const isInitialUserEmotesReady = ref(false);
  function onUserEmotesReady() {
    if (isInitialUserEmotesReady.value) {
      return;
    }
    isInitialUserEmotesReady.value = true;
  }
  const userCollection = useEmotes(sourceToWatchCb, onUserEmotesReady);
  return {
    userCollection,
    isInitialUserEmotesReady,
  };
}

export const useEmotesStore = defineStore("emotes", () => {
  const emotesCache = new EmotesCache();

  const pastasStore = usePastasStore();
  const userCollectionsStore = useUserCollectionsStore();
  const globalCollectionsStore = useGlobalCollectionsStore();

  const globalCollection = useEmotes(
    () => globalCollectionsStore.collections.state,
  );
  const { userCollection, isInitialUserEmotesReady } = useUserEmotes(
    () => userCollectionsStore.selectedCollection?.state?.integrations ?? {},
  );

  watch(
    () => userCollectionsStore.selectedCollection.state,
    () => {
      emotesCache.clear();
      return pastasStore.makeHack();
    },
  );

  return {
    findEmote(token: IEmote["token"]) {
      return (
        emotesCache.get(token) ||
        userCollection.findEmote(token, emotesCache.set) ||
        globalCollection.findEmote(token, emotesCache.set)
      );
    },
    isInitialUserEmotesReady,
  };
});
