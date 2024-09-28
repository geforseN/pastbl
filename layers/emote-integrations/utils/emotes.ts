import { objectValues } from "../../../app/utils/object";

export type EmoteToken = string;

export function getEmotesMapInReadyEmotesIntegration(
  readyIntegration: TEmoteIntegrations.Ready,
) {
  const emotes = readyIntegration.sets.flatMap((set) => set.emotes ?? []);
  const emoteEntries = emotes.map((emote) => [emote.token, emote] as const);
  return new Map(emoteEntries);
}

export const EMOTES_INTEGRATIONS_HAS_NO_SETS_EVENT_NAME
  = "ready-emotes-integration-have-no-sets" as const;

const tryDispatchNoSetsEvent = () =>
  tryDispatchEvent(EMOTES_INTEGRATIONS_HAS_NO_SETS_EVENT_NAME);

export const EMOTES_INTEGRATIONS_HAS_NO_EMOTES_EVENT_NAME
  = "ready-emotes-integration-have-no-emotes" as const;

const tryDispatchNoEmotesEvent = () =>
  tryDispatchEvent(EMOTES_INTEGRATIONS_HAS_NO_EMOTES_EVENT_NAME);

export function getEmotesMapInEmotesIntegrations(
  integrations: TEmoteIntegrations.SettledRecord,
) {
  const readyIntegrations = objectValues(integrations).filter((integration) =>
    isEmotesIntegrationReady(integration),
  );
  const emotes = readyIntegrations
    .flatMap(
      (integration) => integration.sets ?? (tryDispatchNoSetsEvent() && []),
    )
    .flatMap((set) => set.emotes ?? (tryDispatchNoEmotesEvent() && []));
  const emotesEntries = emotes.map((emote) => [emote.token, emote] as const);
  return new Map(emotesEntries);
}
