import type { TEmoteIntegrations } from "$/emote-integrations";

export function useEmoteIntegration(
  integration: MaybeRefOrGetter<TEmoteIntegrations.__Some__>,
) {
  const source = computed(() => toValue(integration).source);

  return {
    source,
    styles: computed(() => emoteIntegrationsStyles[source.value] || raise()),
  };
}
