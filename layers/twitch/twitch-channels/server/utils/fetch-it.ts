import type * as TTwitch from "#t_twitch";

export function fetchTwitchChannels(channelName: string) {
  return fetchTwitchApi<TTwitch.Api.GetSearchChannelsResponse>(
    "/search/channels",
    {
      query: { query: channelName, first: 8 },
    },
  );
}
