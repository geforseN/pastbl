import type { EmoteSource, IEmote } from "~/integrations";

type RecordOfEmotesMap = Record<EmoteSource, EmotesMap>;

export type MinimalEmoteIntegration = {
  source: EmoteSource;
  sets: { emotes?: IEmote[] }[];
};

export type MinimalEmoteIntegrationRecord = Record<
  EmoteSource,
  MinimalEmoteIntegration
>;

export function useEmotes<T extends MinimalEmoteIntegrationRecord>(
  integrationsCb: () => Partial<T>,
  onReady?: () => void,
) {
  const record = ref<Partial<RecordOfEmotesMap>>({});

  watch(integrationsCb, (value) => {
    const integrations = Object.values(
      value as Partial<MinimalEmoteIntegrationRecord>,
    );
    const integrationsRecord = flatGroupBy(
      integrations,
      (integration) => integration.source,
      getEmotesMapFromIntegration,
    );
    record.value = integrationsRecord;
    onReady?.();
  });

  const sources = computed(() => objectKeys(record.value));

  return {
    findEmote(token: string, onEmoteFound?: (emote: IEmote) => void) {
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

export function useEmotesWithInitialReady(
  sourceToWatchCb: () => Partial<MinimalEmoteIntegrationRecord>,
) {
  const isInitialEmotesReady = ref(false);

  const emotes = useEmotes(sourceToWatchCb, function onUserEmotesReady() {
    if (!isInitialEmotesReady.value) {
      isInitialEmotesReady.value = true;
    }
  });

  return {
    ...emotes,
    isInitialEmotesReady,
  };
}
