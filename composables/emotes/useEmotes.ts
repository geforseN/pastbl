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
  getIntegrations: () => Partial<T>,
  options: { onCallEnd?: () => void } = {},
) {
  const record = ref<Partial<RecordOfEmotesMap>>({});

  watch(getIntegrations, (value) => {
    const integrations = Object.values(
      value as Partial<MinimalEmoteIntegrationRecord>,
    );
    const integrationsRecord = flatGroupBy(
      integrations,
      (integration) => integration.source,
      getEmotesMapFromIntegration,
    );
    record.value = integrationsRecord;
    options.onCallEnd?.();
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
  sourceToWatchFn: () => Partial<MinimalEmoteIntegrationRecord>,
) {
  const isInitialized = useBool(false);

  const emotes = useEmotes(sourceToWatchFn, {
    onCallEnd: isInitialized.tryMakeTrue,
  });

  return {
    ...emotes,
    isInitialEmotesReady: isInitialized.state,
  };
}
