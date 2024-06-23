import { emoteSources, type EmoteSource } from "~/integrations/emote-source";
import { service } from "~/client-only/services/global-integrations";
import type {
  SettledEmoteIntegrationsRecord,
  SettledEmoteIntegration,
  SomeEmoteIntegration,
} from "~/integrations/integrations";

export const useGlobalCollectionStore = defineStore("global-collection", () => {
  const integrations = useGlobalIntegrations(service.getAll);
  // TODO: useGlobalEmoteIntegrationsConvert(integrations.state)
  // TODO: useUpdatingEmoteIntegrations(): () => { state: ShallowRef<T>}
  const checkedSources = useGlobalIntegrationsCheckedSources();

  const integrationsLoad = useEmoteIntegrationsLoad<
    SettledEmoteIntegration,
    SettledEmoteIntegrationsRecord
  >(service);

  watchOnce(integrations.state, async (state) => {
    const missingSources = emoteSources.filter(
      (source) => state[source]?.status === "failed",
    );
    if (missingSources.length > 0) {
      for (const source of missingSources) {
        integrations.asLoading(source);
      }
      const missing = await integrationsLoad.executeMany(missingSources);
      integrations.put(...missing);
    }
  });

  return {
    checkedSources,
    integrations: {
      ...integrations,
      computed(source: SomeEmoteSource) {
        const emoteSource = getEmoteSource(source);
        return computed(() => integrations.state.value[emoteSource]);
      },
      update<SO extends EmoteSource>(integration: SomeEmoteIntegration<SO>) {
        switch (integration.status) {
          case "loading":
          case "refreshing": {
            return raise(
              'Can not update integration in "loading" or "refreshing" status',
            );
          }
          case "empty":
          case "failed": {
            return this.load(integration.source);
          }
          case "ready": {
            return this.refresh(integration);
          }
        }
      },
      async updateAll() {
        for (const source of emoteSources) {
          integrations.asUpdated(source);
        }
        const all = await integrationsLoad.executeAll();
        const sorted = objectSorted(all);
        integrations.assign(sorted);
      },
      checked: computed(() => {
        const checked = integrations.values.filter((integration) =>
          checkedSources.has(integration.source),
        );
        return flatGroupBySource(checked);
      }),
      async refresh(source: SomeEmoteSource) {
        const emoteSource = getEmoteSource(source);
        const old = integrations.get(emoteSource);
        integrations.asRefreshing(emoteSource);
        const refreshed = await integrationsLoad.execute(emoteSource);
        if (old.status === "ready" && refreshed.status === "failed") {
          // useMyToast: can not refresh integration, fail on server
          integrations.put(old);
          return await service.__put(old);
        }
        integrations.put(refreshed);
      },
      async load(source: SomeEmoteSource) {
        const emoteSource = getEmoteSource(source);
        integrations.asLoading(emoteSource);
        const integration = await integrationsLoad.execute(emoteSource);
        integrations.put(integration);
      },
    },
  };
});
