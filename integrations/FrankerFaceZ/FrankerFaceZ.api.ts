export async function fetchFFZByUserTwitchNickname(
  userTwitchNickname: string,
): Promise<{
  badges: object;
  sets: object;
  user: {
    avatar: string;
    badges: number[];
    display_name: string;
    emote_sets: unknown[];
    id: number;
    is_donor: boolean;
    max_emoticons: number;
    name: string;
    twitch_id: number | null; // NOTE: maybe twitch_id can be bot null, because ffz allows registration only with TwitchOAuth
    youtube_id: number | null;
  };
}> {
  return fetch(
    `https://api.frankerfacez.com/v1/user/${userTwitchNickname.toLowerCase()}`,
  ).then((response: Response) => {
    if (response.status === 404) {
      throw new Error(
        `FrankerFaceZ does not have user with nickname ${userTwitchNickname}`,
      );
    }
    return responseJson(response);
  });
}

export async function fetchFFZUserRoomByTwitchId(twitchId: number): Promise<{
  room: {
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
  sets: Record<
    `${number}`,
    {
      css: string | null;
      emoticons: {
        artist: { _id: number; name: string; display_name: string } | null;
        created_at: ReturnType<Date["toISOString"]>;
        css: string | null; // NOTE: DEPRECATED field
        height: number;
        hidden: boolean;
        id: number;
        last_updated: ReturnType<Date["toISOString"]>;
        margins: string | null; // NOTE: DEPRECATED field
        modifier: boolean;
        modifier_flags: number;
        name: string;
        offset: string | null; // NOTE: DEPRECATED field
        owner: { _id: number; name: string; display_name: string } | null;
        public: true;
        status: 1;
        urls: {
          1: `https://cdn.frankerfacez.com/emote/${string}/1`;
          2: `https://cdn.frankerfacez.com/emote/${string}/2`;
          4: `https://cdn.frankerfacez.com/emote/${string}/4`;
        };
        usage_count: number;
        width: number;
      }[];
      icon: string | null;
      id: number;
      title: string | null;
      _type: number;
    }
  >;
}> {
  return fetch(`https://api.frankerfacez.com/v1/room/id/${twitchId}`).then(
    responseJson,
  );
}

export async function fetchFFZGlobalEmoteSets(): Promise<{
  default_sets: number[];
  sets: Record<`${number}`, FrankerFaceZEmoteSetFromApi>;
  users: Record<`${number}`, string>;
}> {
  return fetch("https://api.frankerfacez.com/v1/set/global").then(responseJson);
}

export type FrankerFaceZEmoteFromApi = {
  id: number;
  name: string;
  height: number;
  width: number;
  public: true;
  hidden: boolean;
  modifier: boolean;
  // NOTE: modifier_flags is bitmap
  // LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1#emote-effects
  modifier_flags: number;
  // NOTE: offset is DEPRECATED field
  offset: string | null;
  // NOTE: margins is DEPRECATED field
  margins: string | null;
  // NOTE: css is DEPRECATED field
  css: string | null;
  owner: { _id: number; name: string; display_name: string } | null;
  artist: { _id: number; name: string; display_name: string } | null;
  urls: {
    1: `https://cdn.frankerfacez.com/emote/${string}/1`;
    2: `https://cdn.frankerfacez.com/emote/${string}/2`;
    4: `https://cdn.frankerfacez.com/emote/${string}/4`;
  };
  // NOTE: from FFZ api documentation:
  // status - A numeric status for emotes in our system. This should always be 1 in APIv1 responses as that represents an emote that has been approved.
  status: 1;
  usage_count: number;
  created_at: ReturnType<Date["toISOString"]>;
  last_updated: ReturnType<Date["toISOString"]>;
};

export type FrankerFaceZEmoteSetFromApi = {
  id: number;
  _type: number;
  icon: null;
  title: string;
  css: null;
  emoticons: FrankerFaceZEmoteFromApi[];
};
