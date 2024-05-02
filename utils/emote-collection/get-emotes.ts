import type {
  MinimalEmoteIntegration,
  MinimalEmoteIntegrationRecord,
} from "~/composables/emotes/useEmotes";

export function getEmotesMapFromIntegration<T extends MinimalEmoteIntegration>(
  integration: T,
) {
  const emotes = integration.sets.flatMap((set) => set.emotes ?? []);
  const emoteEntries = emotes.map((emote) => [emote.token, emote] as const);
  return new Map(emoteEntries);
}

export function getEmotesMapFromIntegrations<
  T extends Partial<MinimalEmoteIntegrationRecord>,
>(integrations: T) {
  const values = Object.values(integrations);
  const emotes = values
    .flatMap((integration) => integration.sets ?? [])
    .flatMap((set) => set.emotes ?? []);
  const emotesEntries = emotes.map((emote) => [emote.token, emote] as const);
  return new Map(emotesEntries);
}
