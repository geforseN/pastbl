// NOTE: FFZ documentation
// LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1

export async function getFFZByUserTwitchNickname(
  userTwitchNickname: string,
): Promise<{
  badges: Record<`${number}`, FrankerFaceZApiBadge>;
  sets: Record<string, never>;
  user: FrankerFaceZApiUser;
}> {
  const response = await fetch(
    `https://api.frankerfacez.com/v1/user/${userTwitchNickname.toLowerCase()}`,
  );
  if (response.status === 404) {
    throw new Error(
      `FrankerFaceZ does not have user with nickname ${userTwitchNickname}`,
    );
  }
  return responseJson(response);
}

export async function getFFZUserRoomByTwitchId(twitchId: number): Promise<{
  room: FrankerFaceZApiRoom;
  sets: Record<`${number}`, FrankerFaceZApiEmoteSet>;
}> {
  const response = await fetch(
    `https://api.frankerfacez.com/v1/room/id/${twitchId}`,
  );
  return responseJson(response);
}

export async function getFFZGlobalEmoteSets(): Promise<{
  default_sets: number[];
  sets: Record<`${number}`, FrankerFaceZApiEmoteSet>;
  users: Record<`${number}`, string>;
}> {
  const response = await fetch("https://api.frankerfacez.com/v1/set/global");
  return responseJson(response);
}

export type FrankerFaceZApiEmote = {
  artist: { _id: number; name: string; display_name: string } | null;
  created_at: ReturnType<Date["toISOString"]>;
  // NOTE: css is DEPRECATED field
  css: string | null;
  height: number;
  hidden: boolean;
  id: number;
  last_updated: ReturnType<Date["toISOString"]>;
  // NOTE: margins is DEPRECATED field
  margins: string | null;
  // NOTE: modifier_flags is bitmap
  // LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1#emote-effects
  modifier_flags: number;
  modifier: boolean;
  name: string;
  // NOTE: offset is DEPRECATED field
  offset: string | null;
  owner: { _id: number; name: string; display_name: string } | null;
  public: true;
  // NOTE: status is a numeric status for emotes in our system. This should always be 1 in APIv1 responses as that represents an emote that has been approved.
  status: 1;
  urls: {
    1: `https://cdn.frankerfacez.com/emote/${string}/1`;
    2: `https://cdn.frankerfacez.com/emote/${string}/2`;
    4: `https://cdn.frankerfacez.com/emote/${string}/4`;
  };
  usage_count: number;
  width: number;
};

export type FrankerFaceZApiEmoteSet = {
  _type: number;
  css: null;
  emoticons: FrankerFaceZApiEmote[];
  icon: null;
  id: number;
  title: string;
};

type FrankerFaceZApiRoom = {
  _id: number;
  twitch_id: number;
  youtube_id: string | null;
  nullable: true;
  id: string;
  is_group: boolean;
  display_name: string | null;
  set: number;
  moderator_badge: string | null;
  vip_badge: { 1: string; 2: string | null; 4: string | null } | null;
  mod_urls: { 1: string; 2: string | null; 4: string | null } | null;
  user_badges: Record<string, never>;
  user_badge_ids: Record<string, never>;
  css: string | null;
};

type FrankerFaceZApiUser = {
  avatar: string;
  badges: number[];
  display_name: string;
  emote_sets: unknown[];
  id: number;
  is_donor: boolean;
  max_emoticons: number;
  name: string;
  // NOTE: maybe twitch_id can not be null, because ffz allows registration only with TwitchOAuth
  twitch_id: number | null;
  youtube_id: number | null;
};

type FrankerFaceZApiBadge = {
  id: number;
  name: string;
  title: string;
  slot: number;
  replaces: null;
  // NOTE: color is HEX format
  color: string;
  image: `https://cdn.frankerfacez.com/badge/${FrankerFaceZApiBadge["id"]}/1`;
  urls: {
    "1": `https://cdn.frankerfacez.com/badge/${FrankerFaceZApiBadge["id"]}/1`;
    "2": `https://cdn.frankerfacez.com/badge/${FrankerFaceZApiBadge["id"]}/2`;
    "4": `https://cdn.frankerfacez.com/badge/${FrankerFaceZApiBadge["id"]}/4`;
  };
  css: null;
};
