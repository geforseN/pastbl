import type * as TTwitch from "#t_twitch";

export function fetchTwitchGlobalEmotes() {
  return fetchTwitchApi<TTwitch.Api.ChatEmotesResponse>("/chat/emotes/global");
}
