export function fetchTwitchGlobalEmotes() {
  return fetchTwitchApi<TwitchApi.ChatEmotesResponse>("/chat/emotes/global");
}
