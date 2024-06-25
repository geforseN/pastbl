import type { EmoteSource, IEmote } from "~/integrations";
import type { IEmoteIntegration } from "~/integrations/abstract";

type RecordOfEmotesMap = Record<EmoteSource, EmotesMap>;

export type IEmoteIntegrationRecord = Record<EmoteSource, IEmoteIntegration>;

export function useEmotes<T extends IEmoteIntegrationRecord>(
  getIntegrations: () => Partial<T>,
  options: { onCallEnd?: () => void } = {},
) {
  const record = ref<Partial<RecordOfEmotesMap>>({});

  watch(getIntegrations, (value) => {
    const integrations = Object.values(
      value as Partial<IEmoteIntegrationRecord>,
    );
    const integrationsRecord = flatGroupBy(
      integrations.map(
        (integration) => new personEmoteCollection.Integration(integration),
      ),
      (integration) => integration.source,
      (integration) => integration.emotes.asMap,
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
