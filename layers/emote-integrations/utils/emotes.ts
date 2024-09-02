

export type EmoteToken = string;

export function getEmotesMapInReadyEmotesIntegration(
  readyIntegration: TEmoteIntegrations.Ready,
) {
  const emotes = readyIntegration.sets.flatMap((set) => set.emotes ?? []);
  const emoteEntries = emotes.map((emote) => [emote.token, emote] as const);
  return new Map(emoteEntries);
}

export function getEmotesMapInEmotesIntegrations(
  integrations: TEmoteIntegrations.SettledRecord,
) {
  const readyIntegrations = objectValues(integrations).filter((integration) =>
    isEmotesIntegrationReady(integration),
  );
  const emotes = readyIntegrations
    .flatMap((integration) => integration.sets ?? [])
    .flatMap((set) => set.emotes ?? []);
  const emotesEntries = emotes.map((emote) => [emote.token, emote] as const);
  return new Map(emotesEntries);
}
