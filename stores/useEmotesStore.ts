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
    this.#cache.clear();
  }
}

type EmoteMapRecord = Record<EmoteSource, EmoteMap>;

function useEmotes<
  T extends IGlobalEmoteCollectionRecord | IUserEmoteIntegrationRecord,
>(sourceToWatchCb: () => Partial<T>, onReady = () => {}) {
  const record = ref<Partial<EmoteMapRecord>>({});
  const sources = computed(() => objectKeys(record.value));

  watch(sourceToWatchCb, (source) => {
    const integrations = Object.values(source);
    const integrationsRecord = flatGroupBy(
      integrations,
      (integration) => integration.source,
      (integration) => {
        const emotes = integration.sets.flatMap(
          (set: { emotes: IEmote[] }) => set.emotes,
        );
        const emoteEntries = emotes.map((emote: IEmote): [string, IEmote] => {
          return [emote.token, emote];
        });
        return new Map(emoteEntries);
      },
    );
    record.value = integrationsRecord;
    onReady();
  });

  return {
    findEmote(token: IEmote["token"], onEmoteFound?: (emote: IEmote) => void) {
      for (const source of sources.value) {
        const emote = record.value[source]!.get(token);
        if (emote) {
          onEmoteFound?.(emote);
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
      pastasStore.triggerRerender();
    },
  );

  return {
    findEmote(token: string) {
      return (
        emotesCache.get(token) ||
        userEmotes.findEmote(token, emotesCache.set) ||
        globalEmotes.findEmote(token, emotesCache.set)
      );
    },
    // NOTE: MUST use it in global emotes component OR there is a change that emote with same token in userEmote will be found, but global emote expected
    findGlobalEmote(token: string) {
      return globalEmotes.findEmote(token);
    },
    isInitialUserEmotesReady: userEmotes.isInitialEmotesReady,
  };
});
