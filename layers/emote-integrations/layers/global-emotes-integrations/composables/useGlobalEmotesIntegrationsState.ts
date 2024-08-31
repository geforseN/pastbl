import type { TEmoteIntegrations } from "$/emote-integrations";

export function useGlobalEmotesIntegrationsState(
  getIntegrations: () => Promise<TEmoteIntegrations.Global.SettledRecord>,
) {
  const integrations_ =
    useAsyncObject<TEmoteIntegrations.Global.SettledRecord>(getIntegrations);

  return {
    ...integrations_,
    *[Symbol.iterator]() {
      yield* this.values;
    },
    get values() {
      return Object.values(integrations_.state.value || {});
    },
    assign(integrations: SettledEmoteIntegrationsRecord) {
      integrations_.state.value = integrations;
    },
    find(source: EmoteSource) {
      return integrations_.state.value[source];
    },
    get(source: EmoteSource) {
      return this.find(source) || raise();
    },
    put(...integrations: TEmoteIntegrations.Global.Settled[]) {
      integrations_.state.value = objectSorted({
        ...integrations_.state.value,
        ...flatGroupBySource(integrations),
      }) as SettledEmoteIntegrationsRecord;
    },
    set<S extends EmoteSource>(
      source: S,
      integration: TEmoteIntegrations.Global.Of<S>,
    ) {
      integrations_.state.value = {
        ...integrations_.state.value,
        [source]: integration,
      };
    },
    asRefreshing(source: EmoteSource) {
      const integration = this.get(source);
      assert.ok(integration.status === "ready");
      const refreshing = { ...integration, status: "refreshing" } as const;
      this.set(source, refreshing);
      return refreshing;
    },
    asLoading(source: EmoteSource) {
      const loading = { source, status: "loading" } as const;
      this.set(source, loading);
      return loading;
    },
    asUpdated(source: EmoteSource) {
      const integration = this.find(source);
      if (!integration || integration.status !== "ready") {
        return this.asLoading(source);
      }
      return this.asRefreshing(source);
    },
  };
}
