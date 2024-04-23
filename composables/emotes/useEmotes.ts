import type {
  EmoteSource,
  IEmote,
  IGlobalEmoteIntegrationRecord,
  IUserEmoteIntegrationRecord,
} from "~/integrations";

type EmoteMapRecord = Record<EmoteSource, EmotesMap>;

export function useEmotes<
  T extends IGlobalEmoteIntegrationRecord | IUserEmoteIntegrationRecord,
>(integrationsCb: () => Partial<T>, onReady?: () => void) {
  const record = ref<Partial<EmoteMapRecord>>({});
  const sources = computed(() => objectKeys(record.value));

  watch(integrationsCb, (value) => {
    const integrations = Object.values(value);
    const integrationsRecord = flatGroupBy(
      integrations,
      (integration) => integration.source,
      (integration) => {
        const emotes = integration.sets.flatMap(
          (set: { emotes: IEmote[] }) => set.emotes ?? [],
        );
        const emoteEntries = emotes.map((emote: IEmote) => {
          return [emote.token, emote] as const;
        });
        return new Map(emoteEntries);
      },
    );
    record.value = integrationsRecord;
    onReady?.();
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

export function useUserEmotes(
  sourceToWatchCb: () => Partial<IUserEmoteIntegrationRecord>,
) {
  const isInitialEmotesReady = ref(false);

  const userEmotes = useEmotes(sourceToWatchCb, function onUserEmotesReady() {
    if (!isInitialEmotesReady.value) {
      isInitialEmotesReady.value = true;
    }
  });

  return {
    ...userEmotes,
    isInitialEmotesReady,
  };
}
