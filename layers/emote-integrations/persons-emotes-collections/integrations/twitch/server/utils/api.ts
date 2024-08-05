import type { TwitchApi } from "$/emote-integrations/integrations/twitch/server/utils/api-types";

export function fetchTwitchChatEmoteSet(setId: string) {
  return fetchTwitchApi<TwitchApi.GetEmoteSetResponse>("/chat/emotes/set", {
    query: { emote_set_id: setId },
  });
}

export function fetchTwitchChatEmotes(broadcasterId: string) {
  return fetchTwitchApi<TwitchApi.GetChatEmotesResponse>("/chat/emotes", {
    query: { broadcaster_id: broadcasterId },
  });
}
