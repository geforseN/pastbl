export function fetchTwitchChannels(channelName: string) {
  return fetchTwitchApi<TwitchApi.GetSearchChannelsResponse>(
    "/search/channels",
    {
      query: { query: channelName, first: 8 },
    },
  );
}
