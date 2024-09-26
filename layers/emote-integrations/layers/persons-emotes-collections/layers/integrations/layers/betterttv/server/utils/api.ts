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
    new PersonEmotesIntegrationNotFoundError("BetterTTV", login),
  );
  const json = await response.json();
  return json as TBetterTTV.Api.User;
}
