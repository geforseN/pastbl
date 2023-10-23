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
  twitchId: number | string,
): Promise<BetterTTVApiUser> {
  const response = await fetch(
    `https://api.betterttv.net/3/cached/users/twitch/${twitchId}`,
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
