export const useGlobalEmotesIntegrationsStore = defineStore(
  "global-emotes-integrations",
  () => {
    const integrationsState = useGlobalEmotesIntegrationsState(
      async () => await globalEmotesIntegrationsService.getAll(),
    );
    const checkedSources = useGlobalEmotesIntegrationsCheckedSources();

    const integrationsLoad = useEmoteIntegrationsLoad(
      globalEmotesIntegrationsService,
    );

    const integrationsValues = computed(() =>
      Object.values(integrationsState.state),
    );

    const readySources = computed(() =>
      integrationsValues.value.filter(isEmotesIntegrationReady),
    );

    watchOnce(integrationsState.state, async (state) => {
      const missingSources = allEmoteSources.filter(
        (source) => state[source]?.status === "failed",
      );
      if (missingSources.length > 0) {
        for (const source of missingSources) {
          integrationsState.asLoading(source);
        }
        const missing = await integrationsLoad.executeMany(missingSources);
        integrationsState.put(...missing);
      }
    });

    return {
      checkedSources,
      updateIntegration<SO extends EmoteSource>(
        integration: SomeEmoteIntegration<SO>,
      ) {
        switch (integration.status) {
          case "loading":
          case "refreshing": {
            return raise(
              'Can not update integration in "loading" or "refreshing" status',
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
