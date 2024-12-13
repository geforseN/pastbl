export function fetchTwitchGlobalEmotes() {
  return fetchTwitchApi<TTwitch.Api.ChatEmotesResponse>("/chat/emotes/global");
}
