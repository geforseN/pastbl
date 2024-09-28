function findFailedEmoteIntegrationsSources(
  integrations: SettledEmoteIntegrationsRecord,
) {
  return allEmoteSources.filter(
    (source) => integrations[source]?.status === "failed",
  );
}

export const useGlobalEmotesIntegrationsStore = defineStore(
  "global-emotes-integrations",
  () => {
    const integrationsState = useGlobalEmotesIntegrationsState(
      async () => await globalEmotesIntegrationsService.getAll(),
    );
    const integrations = computed(() => integrationsState.state.value);

    const checkedSources = useGlobalEmotesIntegrationsCheckedSources();

    const integrationsLoad = useEmoteIntegrationsLoad(
      globalEmotesIntegrationsService,
    );

    watchOnce(integrations, async (integrations) => {
      const failedSources = findFailedEmoteIntegrationsSources(integrations);
      if (failedSources.length > 0) {
        for (const source of failedSources) {
          integrationsState.asLoading(source);
        }
        const missing = await integrationsLoad.executeMany(failedSources);
        integrationsState.put(...missing);
      }
    });

    useOutdatedGlobalEmotesIntegrations(
      integrations,
      async function refreshMany(integrations: TEmoteIntegrations.Ready[]) {
        for (const integration of integrations) {
          integrationsState.asRefreshing(integration.source);
        }
        const sources = integrations.map((integration) => integration.source);
        const refreshed = await integrationsLoad.executeMany(sources);
        const readyRefreshed = refreshed.filter(isEmotesIntegrationReady);
        for (const integration of readyRefreshed) {
          if (isEmotesIntegrationReady(integration)) {
            integrationsState.put(integration);
          }
        }
        return refreshed;
      },
      useUserStore().emotesIntegrationsRefreshInterval
        .isEmotesIntegrationExpired,
    );

    return {
      checkedSources,
      updateIntegration<SO extends EmoteSource>(
        integration: SomeEmoteIntegration<SO>,
      ) {
        switch (integration.status) {
          case "loading":
          case "refreshing": {
            return raise(
              "Can not update integration in \"loading\" or \"refreshing\" status",
            );
          }
          case "empty":
          case "failed": {
            return this.loadIntegration(integration.source);
          }
          case "ready": {
            return this.refreshIntegration(integration);
          }
        }
      },
      async refreshIntegration(source: SomeEmoteSource) {
        const emoteSource = getEmoteSource(source);
        const old = integrationsState.get(emoteSource);
        integrationsState.asRefreshing(emoteSource);
        const refreshed = await integrationsLoad.execute(emoteSource);
        if (old.status === "ready" && refreshed.status === "failed") {
          // TODO add toast - can not refresh integration, reason - failure on server
          integrationsState.put(old);
          return await globalEmotesIntegrationsService.__put(old);
        }
        integrationsState.put(refreshed);
      },
      async loadIntegration(source: SomeEmoteSource) {
        const emoteSource = getEmoteSource(source);
        integrationsState.asLoading(emoteSource);
        const integration = await integrationsLoad.execute(emoteSource);
        integrationsState.put(integration);
      },
      async updateAllIntegrations() {
        for (const source of allEmoteSources) {
          integrationsState.asUpdated(source);
        }
        const all = await integrationsLoad.executeAll();
        const sorted = objectSorted(all);
        integrationsState.assign(sorted);
      },
      checkedIntegrations: computed(() => {
        const checked = integrationsState.values.filter((integration) =>
          checkedSources.has(integration.source),
        );
        return flatGroupBySource(checked);
      }),
      integrationsState,
    };
  },
);
