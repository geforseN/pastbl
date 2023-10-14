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
  ).then(returnResponseJSON);
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
    number,
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
    returnResponseJSON,
  );
}
