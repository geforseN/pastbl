// NOTE: using rule disable below because ts types are defined at the bottom
/* eslint-disable no-use-before-define */

import { UserNotFoundError } from "../UserNotFoundError";

// LINK: https://betterttv.com/developers/api#global-emotes
export async function getBetterTTVGlobalEmotes(): Promise<
  BetterTTVApiGlobalEmote[]
> {
  const response = await fetch(
    "https://api.betterttv.net/3/cached/emotes/global",
  );
  return responseJson(response);
}

// LINK: https://betterttv.com/developers/api#user
export async function getBetterTTVUserByTwitchId(
  twitchId: number,
  username?: Lowercase<string>,
): Promise<BetterTTVApiUser> {
  const response = await fetch(
    `https://api.betterttv.net/3/cached/users/twitch/${twitchId}`,
  );
  if (response.status === 404) {
    throw new UserNotFoundError(
      `⚠️ BetterTTV does not have ${
        username ? `user with nickname ${username}` : "such user"
      }`,
    );
  }
  return responseJson(response);
}

export type BetterTTVApiGlobalEmote = {
  animated: boolean;
  code: string;
  id: string;
  imageType: "png" | "webp" | "gif";
  modifier: boolean;
  userId: string;
  hight?: number;
  width?: number;
};

export type BetterTTVApiBaseUserEmote = {
  animated: boolean;
  approvalStatus: string | "APPROVED";
  code: string;
  createdAt: ReturnType<Date["toISOString"]>;
  global: boolean;
  id: string;
  imageType: "png" | "webp" | "gif";
  live: boolean;
  sharing: boolean;
  updatedAt: ReturnType<Date["toISOString"]>;
};

export type BetterTTVApiChannelEmote = BetterTTVApiBaseUserEmote & {
  userId: string;
};

export type BetterTTVApiSharedEmote = BetterTTVApiBaseUserEmote & {
  user: {
    displayName: string;
    id: string;
    name: string;
    providerId: string;
  };
};

export type BetterTTVApiEmote =
  | BetterTTVApiGlobalEmote
  | BetterTTVApiChannelEmote
  | BetterTTVApiSharedEmote;

export type BetterTTVApiUser = {
  bots: string[];
  channelEmotes: BetterTTVApiChannelEmote[];
  id: string;
  avatar: string;
  sharedEmotes: BetterTTVApiSharedEmote[];
};
