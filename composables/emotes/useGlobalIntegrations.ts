import type { EmoteSource } from "~/integrations";
import type {
  ReadyOrFailedEmoteIntegrationsRecord,
  ReadyOrFailedIntegration,
} from "~/integrations/integrations";

export function useGlobalIntegrations(
  getIntegrations: () => Promise<Partial<ReadyOrFailedEmoteIntegrationsRecord>>,
) {
  const integrations_ = useAsyncObject(getIntegrations);

  return {
    ...integrations_,
    get values() {
      return Object.values(integrations_.state.value);
    },
    assign(integrations: ReadyOrFailedEmoteIntegrationsRecord) {
      integrations_.state.value = integrations;
    },
    find(source: EmoteSource) {
      return integrations_.state.value[source];
    },
    put(...integrations: ReadyOrFailedIntegration[]) {
      integrations_.state.value = {
        ...integrations_.state.value,
        ...integrations,
      };
    },
    update<S extends EmoteSource>(
      source: S,
      integration: ReadyOrFailedEmoteIntegrationsRecord[S],
    ) {
      integrations_.state.value = {
        ...integrations_.state.value,
        [source]: integration,
      };
    },
  };
}
