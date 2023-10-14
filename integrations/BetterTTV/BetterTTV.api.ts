type BetterTTVGlobalEmote = {
  animated: boolean;
  code: string;
  id: string;
  imageType: "png" | "webp" | "gif";
  modifier: boolean;
  userId: string;
  hight?: number;
  width?: number;
};

type BetterTTVBaseUserEmote = {
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

type BetterTTVChannelEmote = BetterTTVBaseUserEmote & {
  userId: string; // NOTE: this is equal to __BTTV__UserData__['id']
};

type BetterTTVSharedEmote = BetterTTVBaseUserEmote & {
  user: {
    displayName: string;
    id: string;
    name: string;
    providerId: string; // NOTE: this is equal to __BTTV__UserData__['providerId']
  };
};

export type BetterTTVEmoteFromAPI =
  | BetterTTVGlobalEmote
  | BetterTTVBaseUserEmote
  | BetterTTVChannelEmote
  | BetterTTVSharedEmote;

type BetterTTVUser = {
  bots: string[];
  channelEmotes: BetterTTVChannelEmote[];
  displayName: string;
  id: string;
  name: string;
  providerId: string; // NOTE: this is string, which contains numbers and probably no letters
  sharedEmotes: BetterTTVSharedEmote[];
};

// NOTE: result of fetch includes modifier emote (e.g. c!, h!, l!) which are not yet supported
export async function fetchBetterTTVGlobalEmotes(): Promise<
  BetterTTVGlobalEmote[]
> {
  // LINK: https://betterttv.com/developers/api#global-emotes
  return fetch("https://api.betterttv.net/3/cached/emotes/global").then(
    returnResponseJSON,
  );
}

export async function fetchBetterTTVUserById(
  userId: string,
): Promise<BetterTTVUser> {
  // LINK: https://betterttv.com/developers/api#user-emotes
  // NOTE: url for fetch is on api site is wrong, will be 404
  // wrong url: fetch('https://api.betterttv.net/3/cached/users/{provider}/{providerId})
  return fetch(`https://api.betterttv.net/3/users/${userId}`).then(
    returnResponseJSON,
  );
}

export async function fetchBetterTTVUserByTwitchId(
  providerId: number | string /* providerId means twitchId or youtubeId */,
): Promise<BetterTTVUser> {
  // LINK: https://betterttv.com/developers/api#user-emotes
  // NOTE: url for fetch is on api site is wrong, will be 404
  // wrong url: fetch('https://api.betterttv.net/3/cached/users/{provider}/{providerId})
  return fetch(
    `https://api.betterttv.net/3/cached/users/twitch/${providerId}`,
  ).then(returnResponseJSON);
}
