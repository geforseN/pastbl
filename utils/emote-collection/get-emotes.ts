import type {
  SettledEmoteIntegrationsRecord,
  SettledEmoteIntegration,
} from "~/integrations/integrations";

export function getEmotesMapFromIntegration<T extends SettledEmoteIntegration>(
  integration: T,
) {
  if (integration.status === "failed" || integration.status === "loading") {
    return new Map();
  }
  const emotes = integration.sets.flatMap((set) => set.emotes ?? []);
  const emoteEntries = emotes.map((emote) => [emote.token, emote] as const);
  return new Map(emoteEntries);
}

export function getEmotesMapFromIntegrations<
  T extends Partial<SettledEmoteIntegrationsRecord>,
>(integrations: T) {
  const values = Object.values(integrations);
  const emotes = values
    .flatMap((integration) => integration.sets ?? [])
    .flatMap((set) => set.emotes ?? []);
  const emotesEntries = emotes.map((emote) => [emote.token, emote] as const);
  return new Map(emotesEntries);
}
