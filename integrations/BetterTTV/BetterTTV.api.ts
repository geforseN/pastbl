// LINK: https://betterttv.com/developers/api

export async function getBetterTTVGlobalEmotes(): Promise<
  BetterTTVApiGlobalEmote[]
> {
  const response = await fetch(
    "https://api.betterttv.net/3/cached/emotes/global",
  );
  return responseJson(response);
}

export async function getBetterTTVUserById(
  userId: string,
): Promise<BetterTTVApiUser> {
  // NOTE: url for fetch is on api site is wrong, will be 404
  // wrong url: fetch('https://api.betterttv.net/3/cached/users/{provider}/{providerId})
  const response = await fetch(`https://api.betterttv.net/3/users/${userId}`);
  return responseJson(response);
}

export async function getBetterTTVUserByTwitchId(
  providerId: number | string /* providerId means twitchId or youtubeId */,
): Promise<BetterTTVApiUser> {
  // LINK: https://betterttv.com/developers/api#user-emotes
  // NOTE: url for fetch is on api site is wrong, will be 404
  // wrong url: fetch('https://api.betterttv.net/3/cached/users/{provider}/{providerId})
  const response = await fetch(
    `https://apibetterttv.net/3/cached/users/twitch/${providerId}`,
  );
  return responseJson(response);
}

type BetterTTVApiGlobalEmote = {
  animated: boolean;
  code: string;
  id: string;
  imageType: "png" | "webp" | "gif";
  modifier: boolean;
  userId: string;
  hight?: number;
  width?: number;
};

type _BetterTTVApiBaseUserEmote = {
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

type BetterTTVApiChannelEmote = _BetterTTVApiBaseUserEmote & {
  userId: string;
};

type BetterTTVApiSharedEmote = _BetterTTVApiBaseUserEmote & {
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

type BetterTTVApiUser = {
  bots: string[];
  channelEmotes: BetterTTVApiChannelEmote[];
  displayName: string;
  id: string;
  name: string;
  providerId: string;
  sharedEmotes: BetterTTVApiSharedEmote[];
};
