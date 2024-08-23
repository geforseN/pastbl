import type { TwitchApi } from "$/emote-integrations/integrations/twitch/server/utils/api-types";

export function fetchTwitchChannels(channelName: string) {
  return fetchTwitchApi<TwitchApi.GetSearchChannelsResponse>("/search/channels", {
    query: { query: channelName, first: 8 },
  });
}
