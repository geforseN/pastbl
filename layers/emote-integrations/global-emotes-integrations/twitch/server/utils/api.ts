import type { TwitchApi } from "~~/layers/emote-integrations/integrations/twitch/server/utils/api-types";

export function fetchTwitchGlobalEmotes() {
  return fetchTwitchApi<TwitchApi.ChatEmotesResponse>("/chat/emotes/global");
}
