import { UserNotFoundError } from "../UserNotFoundError";
import { assert } from "~/utils/error";
import type { GlobalEmote, User } from "./api-types";

export const api = {
  // LINK: https://betterttv.com/developers/api#user
  async getUserByTwitchId(twitchId: TwitchUserId, login?: TwitchUserLogin) {
    const response = await fetch(
      `https://api.betterttv.net/3/cached/users/twitch/${twitchId}`,
    );
    assert.response.ok(response, new UserNotFoundError("BetterTTV", login));
    const json = await response.json();
    return json as User;
  },
  // LINK: https://betterttv.com/developers/api#global-emotes
  async getGlobalEmotes() {
    const response = await fetch(
      "https://api.betterttv.net/3/cached/emotes/global",
    );
    assert.response.ok(response, "Failed to load BetterTTV global emotes");
    const json = await response.json();
    return json as GlobalEmote[];
  },
};
