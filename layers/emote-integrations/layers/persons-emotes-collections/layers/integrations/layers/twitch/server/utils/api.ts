import type * as TTwitch from "#t_twitch";

export function fetchTwitchChatEmoteSet(setId: string) {
  return fetchTwitchApi<TTwitch.Api.GetEmoteSetResponse>("/chat/emotes/set", {
    query: { emote_set_id: setId },
  });
}

export function fetchTwitchChatEmotes(broadcasterId: string) {
  return fetchTwitchApi<TTwitch.Api.GetChatEmotesResponse>("/chat/emotes", {
    query: { broadcaster_id: broadcasterId },
  });
}
