import {
  emoteSources,
  type IGlobalEmoteIntegrationRecord,
} from "~/integrations";
import { service } from "~/client-only/services/globalCollections";
import type {
  ReadyOrFailedEmoteIntegrationsRecord,
  ReadyOrFailedIntegration,
} from "~/integrations/integrations";

export const useGlobalCollectionStore = defineStore(
  "global-collections",
  () => {
    const integrations = useGlobalIntegrations(service.getAll);

    const checkedSources = useGlobalIntegrationsCheckedSources();

    const integrationsLoad = useEmoteIntegrationsLoad<
      ReadyOrFailedIntegration,
      ReadyOrFailedEmoteIntegrationsRecord
    >(service);

    watchOnce(integrations.state, async (state) => {
      const missingSources = emoteSources.filter(
        (source) => state[source]?.status === "failed",
      );
      if (missingSources.length) {
        const missing = await integrationsLoad.executeMany(missingSources);
        integrations.put(...missing);
      }
    });

    return {
      checkedSources,
      integrations: {
        ...integrations,
        async loadAll() {
          const all = await integrationsLoad.executeAll();
          const sorted = objectSorted(all);
          integrations.assign(sorted);
        },
        checked: computed(() => {
          const checked = integrations.values.filter((integration) =>
            checkedSources.has(integration.source),
          );
          const record = flatGroupBySource(checked);
          return record as Partial<IGlobalEmoteIntegrationRecord>;
        }),
        async load(source: SomeEmoteSource) {
          const emoteSource = getEmoteSource(source);
          const refreshed = await integrationsLoad.execute(emoteSource);
          integrations.update(emoteSource, refreshed);
        },
        isCurrentlyLoading(source: SomeEmoteSource) {
          return integrationsLoad.isCurrentlyLoading(getEmoteSource(source));
        },
      },
    };
  },
);
