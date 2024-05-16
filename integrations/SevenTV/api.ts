import { UserNotFoundError } from "../UserNotFoundError";
import type { API } from "./api-types";
import { assert } from "~/utils/error";

// LINK: https://7tv.io/docs

async function get7TVSetById(setId: string) {
  const response = await fetch(`https://7tv.io/v3/emote-sets/${setId}`);
  assert.response.ok(response, "Failed to load emote set from SevenTV");
  const json = await response.json();
  assert.ok(
    Array.isArray(json?.emotes),
    new TypeError("Failed to load user emotes from SevenTV"),
  );
  return json as API.EmoteSetWithEmotes;
}

async function get7TVUserProfileByTwitchId(
  twitchId: TwitchUserId,
  login?: TwitchUserLogin,
) {
  const response = await fetch(`https://7tv.io/v3/users/twitch/${twitchId}`);
  assert.response.ok(response, new UserNotFoundError("SevenTV", login));
  const json = await response.json();
  return json as API.UserProfile;
}

async function get7TVGlobalEmotesSet() {
  const response = await fetch("https://7tv.io/v3/emote-sets/global");
  assert.response.ok(
    response,
    new Error("Failed to load SevenTV global emotes"),
  );
  const json = await response.json();
  assert.ok(Array.isArray(json?.emotes));
  return json as API.EmoteSetWithEmotes;
}

export const api = {
  getGlobalEmotesSet: get7TVGlobalEmotesSet,
  getPersonProfile: get7TVUserProfileByTwitchId,
  getPersonSet: get7TVSetById,
};
