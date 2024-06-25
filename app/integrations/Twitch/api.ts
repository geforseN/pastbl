import assert from "node:assert";
import { $fetch } from "ofetch";
import { environment } from "~~/server/utils/environment";

export const twitchApi = {
  fetch: createTwitchApiFetch(),
};

export function createTwitchApiFetch(token?: TwitchToken) {
  const headers = new Headers({
    "Client-ID": environment.TWITCH_APP_CLIENT_ID,
  });
  if (token) {
    headers.append("Authorization", `Bearer ${token.access_token}`);
  }
  return $fetch.create({
    baseURL: "https://api.twitch.tv/helix",
    headers,
  });
}

export async function fetchTwitchUser(login: TwitchUserLogin) {
  const { data } = await twitchApi.fetch<ITwitch.API.GetUsersResponse>(
    "/users",
    {
      query: { login },
    },
  );
  assert.ok(
    data.length === 1,
    new Error("User with login=" + login + " not found"),
  );
  return data[0];
}

export function fetchTwitchChannels(string: string) {
  return twitchApi.fetch<ITwitch.API.GetSearchChannelsResponse>(
    "/search/channels",
    {
      query: { query: string, first: 8 },
    },
  );
}

export function fetchTwitchGlobalEmotes() {
  return twitchApi.fetch<ITwitch.API.ChatEmotesResponse>("/chat/emotes/global");
}

export function fetchTwitchChatEmoteSet(setId: string) {
  return twitchApi.fetch<ITwitch.API.GetEmoteSetResponse>("/chat/emotes/set", {
    query: { emote_set_id: setId },
  });
}

export function fetchTwitchChatEmotes(broadcasterId: string) {
  return twitchApi.fetch<ITwitch.API.GetChatEmotesResponse>("/chat/emotes", {
    query: { broadcaster_id: broadcasterId },
  });
}
