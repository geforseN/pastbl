import assert from "node:assert";
import type { TwitchApi } from "./twitch-api.types";

export const twitchApi = {
  fetch: createTwitchApiFetch(),
};

export function createTwitchApiFetch(token?: TwitchToken) {
  const headers = new Headers({
    "Client-ID": env.twitchClientId,
  });
  if (token !== undefined) {
    headers.append("Authorization", `Bearer ${token.access_token}`);
  }
  return $fetch.create({
    baseURL: "https://api.twitch.tv/helix",
    headers,
  });
}

export async function fetchTwitchUser(login: Lowercase<string>) {
  const { data } = await twitchApi.fetch<TwitchApi["getUser"]["response"]>(
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

export function fetchTwitchChannels(query: string) {
  return twitchApi.fetch<TwitchApi["getSearchChannels"]["response"]>(
    "/search/channels",
    {
      query: { query, first: 8 },
    },
  );
}

export function fetchTwitchGlobalEmotes() {
  return twitchApi.fetch<TwitchApi["getGlobalEmotes"]["response"]>(
    "/chat/emotes/global",
  );
}

export function fetchTwitchChatEmoteSet(setId: string) {
  return twitchApi.fetch<TwitchApi["getChatEmotesSet"]["response"]>(
    "/chat/emotes/set",
    {
      query: { emote_set_id: setId },
    },
  );
}

export function fetchTwitchChatEmotes(broadcasterId: string) {
  return twitchApi.fetch<TwitchApi["getChatEmotes"]["response"]>(
    "/chat/emotes",
    {
      query: { broadcaster_id: broadcasterId },
    },
  );
}
