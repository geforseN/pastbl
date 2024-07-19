import assert from "node:assert";

export async function fetchTwitchUser(login: TwitchUserLogin) {
  const { data } = await fetchTwitchApi<ITwitch.API.GetUsersResponse>(
    "/users",
    {
      query: { login },
    },
  );
  assert.ok(
    data.length === 1,
    new Error(`Received ${data.length} users, expected 1`),
  );
  const user = data[0];
  assert.ok(user, new Error(`User with login ${login} not found`));
  return user;
}

export function fetchTwitchChannels(channelName: string) {
  return fetchTwitchApi<ITwitch.API.GetSearchChannelsResponse>(
    "/search/channels",
    {
      query: { query: channelName, first: 8 },
    },
  );
}

export function fetchTwitchGlobalEmotes() {
  return fetchTwitchApi<ITwitch.API.ChatEmotesResponse>("/chat/emotes/global");
}

export function fetchTwitchChatEmoteSet(setId: string) {
  return fetchTwitchApi<ITwitch.API.GetEmoteSetResponse>("/chat/emotes/set", {
    query: { emote_set_id: setId },
  });
}

export function fetchTwitchChatEmotes(broadcasterId: string) {
  return fetchTwitchApi<ITwitch.API.GetChatEmotesResponse>("/chat/emotes", {
    query: { broadcaster_id: broadcasterId },
  });
}
