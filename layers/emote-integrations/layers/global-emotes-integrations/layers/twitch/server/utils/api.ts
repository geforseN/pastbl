import type { TwitchApi } from "#integrations_twitch/api-types";

export function fetchTwitchGlobalEmotes() {
  return fetchTwitchApi<TwitchApi.ChatEmotesResponse>("/chat/emotes/global");
}
