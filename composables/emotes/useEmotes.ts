import type { EmoteSource, IEmote } from "~/integrations";

type RecordOfEmotesMap = Record<EmoteSource, EmotesMap>;

type MinimalEmoteIntegration = Record<
  EmoteSource,
  {
    source: EmoteSource;
    sets: { emotes?: IEmote[] }[];
  }
>;

export function useEmotes<T extends MinimalEmoteIntegration>(
  integrationsCb: () => Partial<T>,
  onReady?: () => void,
) {
  const record = ref<Partial<RecordOfEmotesMap>>({});

  watch(integrationsCb, (value) => {
    const integrations = Object.values(
      value as Partial<MinimalEmoteIntegration>,
    );
    const integrationsRecord = flatGroupBy(
      integrations,
      (integration) => integration.source,
      (integration) => {
        const emotes = integration.sets.flatMap((set) => set.emotes ?? []);
        const emoteEntries = emotes.map((emote: IEmote) => {
          return [emote.token, emote] as const;
        });
        return new Map(emoteEntries);
      },
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
  sourceToWatchCb: () => Partial<MinimalEmoteIntegration>,
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
