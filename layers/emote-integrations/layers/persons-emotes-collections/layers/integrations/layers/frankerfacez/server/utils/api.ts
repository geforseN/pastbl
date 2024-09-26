// LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1

export async function fetchFrankerFaceZUser(
  id: TwitchUserId,
  login: TwitchUserLogin,
) {
  const response = await fetch(`https://api.frankerfacez.com/v1/user/id/${id}`);
  assert.response.ok(
    response,
    new PersonEmotesIntegrationNotFoundError("FrankerFaceZ", login),
  );
  const json = await response.json();
  return json as TFrankerFaceZ.Api.UserStruct;
}

export async function fetchFrankerFaceZRoom(twitchId: TwitchUserId) {
  const response = await fetch(
    `https://api.frankerfacez.com/v1/room/id/${twitchId}`,
  );
  assert.response.ok(
    response.clone(),
    "Failed to load FrankerFaceZ user emotes",
  );
  const json = await response.json();
  return json as TFrankerFaceZ.Api.RoomStruct;
}
