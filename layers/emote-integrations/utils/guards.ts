import type { TEmoteIntegrations } from "$/emote-integrations";
export {
  isEmotesIntegrationReady,
  isEmotesIntegrationFailed
} from "$/emote-integrations/server/utils/guards";

export function isEmotesIntegrationRefreshing(
  integration: TEmoteIntegrations.__Some__,
) {
  return integration.status === "refreshing";
}

export function isEmotesIntegrationLoading(
  integration: TEmoteIntegrations.__Some__,
) {
  return integration.status === "loading";
}
