import { assert } from "~/utils/error";
import { isArray } from "~/utils/guard";

// LINK: https://7tv.io/docs

async function getPersonSet(setId: string) {
  const response = await fetch(`https://7tv.io/v3/emote-sets/${setId}`);
  assert.response.ok(response, "Failed to load emote set from SevenTV");
  const json = await response.json();
  assert.ok(
    isArray(json?.emotes),
    new TypeError("Failed to load user emotes from SevenTV"),
  );
  return json as ISevenTV.API.SetWithEmotes;
}

async function getPersonProfile(
  twitchId: TwitchUserId,
  login?: TwitchUserLogin,
) {
  const response = await fetch(`https://7tv.io/v3/users/twitch/${twitchId}`);
  assert.response.ok(
    response,
    new PersonIntegrationNotFoundError("SevenTV", login),
  );
  const json = await response.json();
  return json as ISevenTV.API.UserProfile;
}

async function getGlobalEmotesSet() {
  const response = await fetch("https://7tv.io/v3/emote-sets/global");
  assert.response.ok(
    response,
    new Error("Failed to load SevenTV global emotes"),
  );
  const json = await response.json();
  assert.ok(isArray(json?.emotes));
  return json as ISevenTV.API.SetWithEmotes;
}

export const api = {
  getGlobalEmotesSet,
  getPersonProfile,
  getPersonSet,
};
