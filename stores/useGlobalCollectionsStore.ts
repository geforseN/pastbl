import {
  emoteSources,
  isEmoteSource,
  type IGlobalEmoteIntegrationRecord,
} from "~/integrations";
import { globalCollectionsService } from "~/client-only/services";

export const useGlobalIntegrationsStore = defineStore(
  "global-collections",
  () => {
    const integrations = useAsyncObject(globalCollectionsService.getAll);

    const checkedSources = useIndexedDBKeyValue(
      "global-collections:checked-sources",
      [...emoteSources],
    );

    const integrationsLoad = useGlobalIntegrationsLoad(
      globalCollectionsService,
    );

    watchOnce(integrations.state, async (state) => {
      const missingSources = emoteSources.filter((source) => !state[source]);
      if (!missingSources.length) {
        return;
      }
      const missing = await integrationsLoad.executeMany(missingSources);
      integrations.state.value = {
        ...integrations.state.value,
        ...missing,
      };
    });

    return {
      checkedSources,
      integrations,
      checkedIntegrations: computed(() => {
        const values = Object.values(integrations.state.value);
        const checked = values.filter((collection) =>
          checkedSources.state.value.includes(collection.source),
        );
        const record = flatGroupBy(checked, (collection) => collection.source);
        return record as Partial<IGlobalEmoteIntegrationRecord>;
      }),
      async loadIntegration(source: SomeEmoteSource) {
        const emoteSource = getEmoteSource(source);
        const refreshed = await integrationsLoad.execute(emoteSource);
        integrations.state.value = {
          ...integrations.state.value,
          [emoteSource]: refreshed,
        };
      },
      async loadAllIntegrations() {
        const all = await integrationsLoad.executeAll();
        // NOTE: for loop and triggerRef could be replaced with => collections.state.value = all
        // HOWEVER: order of entries will change and view of global collections will change order
        for (const [source, collection] of Object.entries(all)) {
          assert.ok(isEmoteSource(source));
          // @ts-expect-error weird type error
          integrations.state.value[source] = collection;
        }
        triggerRef(integrations.state);
      },
      isCurrentlyLoading(source: SomeEmoteSource) {
        return integrationsLoad.isCurrentlyLoading(getEmoteSource(source));
      },
    };
  },
);
