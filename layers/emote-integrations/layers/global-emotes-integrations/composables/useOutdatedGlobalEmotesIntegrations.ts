export function useOutdatedGlobalEmotesIntegrations(
  allIntegrations: Ref<TEmoteIntegrations.Global.SettledRecord>,
  refreshMany: (
    integrations: TEmoteIntegrations.Ready[],
  ) => Promise<TEmoteIntegrations.Global.Settled[]>,
  isEmotesIntegrationExpired: (
    integration: TEmoteIntegrations.Ready,
  ) => boolean,
) {
  const outdatedIntegrations = computed(() =>
    Object.values(allIntegrations.value)
      .filter(isEmotesIntegrationReady)
      .filter(isEmotesIntegrationExpired),
  );

  const toast = useGlobalEmotesRefreshToasts();

  let isRefreshingOutdatedIntegrations = false;
  return watch(outdatedIntegrations, async (outdatedIntegrations) => {
    if (isRefreshingOutdatedIntegrations) {
      return log(
        "debug",
        "Already refreshing outdated global emote integrations, this refresh is skipped",
      );
    }
    if (outdatedIntegrations.length === 0) {
      return log("debug", "No outdated global emote integrations");
    }
    isRefreshingOutdatedIntegrations = true;
    log("debug", "Refreshing outdated global emote integrations", {
      outdatedIntegrations,
    });
    const refreshed = await refreshMany(outdatedIntegrations).finally(() => {
      isRefreshingOutdatedIntegrations = false;
    });
    toast.success(
      refreshed.length,
      refreshed
        .map((integration) => emoteSourcesAsEmojis.get(integration.source))
        .join(" "),
    );
    log("debug", "Refreshed outdated global emote integrations", {
      refreshed,
    });
  });
}
