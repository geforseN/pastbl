import type { TEmoteIntegrations } from "$/emote-integrations/base/EmoteIntegration";

export function useGlobalEmoteIntegration(
  integration: MaybeRefOrGetter<TEmoteIntegrations.Global.Settled>,
) {
  const source = computed(() => toValue(integration).source);

  return {
    source,
    styles: computed(() => emoteIntegrationsStyles[source.value]),
  };
}
