import type { BetterTTVApi } from "~~/layers/emote-integrations/integrations/betterttv/server/utils/api-types";

// LINK: https://betterttv.com/developers/api#user
export async function fetchBetterTTVUser(
  twitchId: TwitchUserId,
  login?: TwitchUserLogin,
) {
  const response = await fetch(
    `https://api.betterttv.net/3/cached/users/twitch/${twitchId}`,
  );
  assert.response.ok(
    response,
    new PersonEmoteIntegrationNotFoundError("BetterTTV", login),
  );
  const json = await response.json();
  return json as BetterTTVApi.User;
}
