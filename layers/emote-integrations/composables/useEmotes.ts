type EmotesMapRecord = Record<EmoteSource, EmotesMap<IEmote>>;

export type IEmoteIntegrationRecord = Record<
  EmoteSource,
  TEmoteIntegrations.Settled
>;

export function useEmotes<T extends IEmoteIntegrationRecord>(
  getIntegrations: () => Partial<T>,
  options: { onCallEnd?: () => void } = {},
) {
  const record = ref<Partial<EmotesMapRecord>>({});

  watch(getIntegrations, (value) => {
    const integrations = Object.values(
      value as Partial<IEmoteIntegrationRecord>,
    ).filter(
      (integration) =>
        isNotNullable(integration) && isEmotesIntegrationReady(integration),
    );
    const integrationsRecord = flatGroupBySource(integrations, (integration) =>
      getEmotesMapInReadyEmotesIntegration(integration),
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
  sourceToWatchFn: () => Partial<IEmoteIntegrationRecord>,
) {
  const isInitialized = useBool(false);

  const emotes = useEmotes(sourceToWatchFn, {
    onCallEnd() {
      isInitialized.trySet(true);
    },
  });

  return {
    ...emotes,
    isInitialEmotesReady: isInitialized.state,
  };
}
