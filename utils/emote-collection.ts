import { isReadyUserIntegration, type EmoteSource } from "~/integrations";
import { flatGroupBy } from "~/utils/object";

export { getUserLogin } from "~/utils/emote-collection/emote-collection-user-login";
export type {
  LoginSource,
  SelectableLogin,
  SelectedLogin,
} from "~/utils/emote-collection/emote-collection-user-login";
export { getEmoteIntegrationsStatus } from "~/utils/emote-collection/emote-collection-user-status";
export { getEmoteSource } from "~/utils/emote-collection/emote-integrations-source";
export type { SomeEmoteSource } from "~/utils/emote-collection/emote-integrations-source";
export {
  getEmotesMapFromIntegration,
  getEmotesMapFromIntegrations,
} from "~/utils/emote-collection/get-emotes";

export function getReadyUserIntegrations(collection: IUserEmoteCollection) {
  const values = Object.values(collection.integrations);
  return values.filter(isReadyUserIntegration);
}

export function getReadyUserIntegrationsRecord(
  collection: IUserEmoteCollection,
) {
  const ready = getReadyUserIntegrations(collection);
  return flatGroupBy(
    ready,
    (integration) => integration.source,
  ) as IUserEmoteIntegrationRecord;
}

export function flatGroupBySource<T extends { source: EmoteSource }>(
  items: T[],
) {
  return flatGroupBy(items, (item) => item.source);
}
