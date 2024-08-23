import type { SevenTVApi } from "$/emote-integrations/integrations/seventv/server/utils/api-types";

// LINK: https://7tv.io/docs

export async function fetchSevenTVUserSet(setId: string) {
  const response = await fetch(`https://7tv.io/v3/emote-sets/${setId}`);
  assert.response.ok(response, "Failed to load emote set from SevenTV");
  const json = await response.json();
  assert.ok(
    isArray(json?.emotes),
    new TypeError("Failed to load user emotes from SevenTV"),
  );
  return json as SevenTVApi.SetWithEmotes;
}

export async function fetchSevenTVUser(
  twitchId: TwitchUserId,
  login?: TwitchUserLogin,
) {
  const response = await fetch(`https://7tv.io/v3/users/twitch/${twitchId}`);
  assert.response.ok(
    response,
    new PersonEmotesIntegrationNotFoundError("SevenTV", login),
  );
  const json = await response.json();
  return json as SevenTVApi.UserProfile;
}
