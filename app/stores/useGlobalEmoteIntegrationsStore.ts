export const useGlobalEmoteIntegrationsStore = defineStore(
  "global-emote-integrations",
  () => {
    const integrationsState = useGlobalEmoteIntegrationsState(
      globalEmoteIntegrationsService.getAll,
    );
    const checkedSources = useGlobalEmoteIntegrationsCheckedSources();

    const integrationsLoad = useEmoteIntegrationsLoad(
      globalEmoteIntegrationsService,
    );

    const readySources = computed(() =>
      Object.values(integrationsState.state).filter((integration) =>
        integration?.isReady?.(),
      ),
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
      integrations: {
        ...integrationsState,
        computed(source: SomeEmoteSource) {
          const emoteSource = getEmoteSource(source);
          return computed(() => integrationsState.state.value[emoteSource]);
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
          for (const source of allEmoteSources) {
            integrationsState.asUpdated(source);
          }
          const all = await integrationsLoad.executeAll();
          const sorted = objectSorted(all);
          integrationsState.assign(sorted);
        },
        checked: computed(() => {
          const checked = integrationsState.values.filter((integration) =>
            checkedSources.has(integration.source),
          );
          return flatGroupBySource(checked);
        }),
        async refresh(source: SomeEmoteSource) {
          const emoteSource = getEmoteSource(source);
          const old = integrationsState.get(emoteSource);
          integrationsState.asRefreshing(emoteSource);
          const refreshed = await integrationsLoad.execute(emoteSource);
          if (old.status === "ready" && refreshed.status === "failed") {
            // useMyToast: can not refresh integration, fail on server
            integrationsState.put(old);
            return await globalEmoteIntegrationsService.__put(old);
          }
          integrationsState.put(refreshed);
        },
        async load(source: SomeEmoteSource) {
          const emoteSource = getEmoteSource(source);
          integrationsState.asLoading(emoteSource);
          const integration = await integrationsLoad.execute(emoteSource);
          integrationsState.put(integration);
        },
      },
    };
  },
);
