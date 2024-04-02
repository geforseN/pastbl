import { UserNotFoundError } from "../../UserNotFoundError";
import type { Emote, GlobalEmote, User } from "./types";
import { assert } from "~/utils/error";
import { withLog, countKeys } from "~/utils/dev-only";

export type IBetterTTVApi = {
  Emote: Emote;
  User: User;
  Global: {
    Emote: GlobalEmote;
  };
};

export const BetterTTVApi = {
  // LINK: https://betterttv.com/developers/api#user
  async getUserByTwitchId(twitchId: TwitchUserId, login?: Lowercase<string>) {
    const response = await fetch(
      `https://api.betterttv.net/3/cached/users/twitch/${twitchId}`,
    );
    assert.response.ok(response, new UserNotFoundError("BetterTTV", login));
    const json = await response.json();
    withLog(
      countKeys([...json.channelEmotes, ...json.sharedEmotes]),
      "BetterTTV user emotes keys",
    );
    return json as IBetterTTVApi["User"];
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
