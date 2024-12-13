import { raise } from "../../../app/utils/raise";
import { emoteIntegrationsStyles } from "../utils/styles";
import type * as TEmoteIntegrations from "../shared/types";

export function useEmoteIntegration(
  integration: MaybeRefOrGetter<TEmoteIntegrations.__Some__>,
) {
  const source = computed(() => toValue(integration).source);

  return {
    source,
    styles: computed(() => emoteIntegrationsStyles[source.value] || raise()),
  };
}
