declare namespace IFrankerFaceZ.API {
  export interface EmoteRelatedPerson {
    _id: number;
    name: string;
    display_name: string;
  }

  export interface Emote {
    artist: EmoteRelatedPerson | null;
    created_at: ReturnType<Date["toISOString"]>;
    css: string | null;
    height: number;
    hidden: boolean;
    id: number;
    last_updated: ReturnType<Date["toISOString"]>;
    margins: string | null;
    // LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1#emote-effects
    modifier_flags: number;
    modifier: boolean;
    name: string;
    offset: string | null;
    owner: EmoteRelatedPerson | null;
    public: boolean;
    status: number;
    urls: {
      [n in 1 | 2 | 4]: `https://cdn.frankerfacez.com/emote/${string}/${n}`;
    };
    usage_count: number;
    width: number;
  }

  export interface EmoteSet {
    _type: number;
    css: null;
    emoticons: Emote[];
    icon: null;
    id: number;
    title: string;
  }

  export interface Room {
    _id: number;
    twitch_id: number;
    youtube_id: string | null;
    nullable: true;
    id: string;
    is_group: boolean;
    display_name: string | null;
    set: number;
    moderator_badge: string | null;
    vip_badge: { [n in 1 | 2 | 4]: string | null } | null;
    mod_urls: { [n in 1 | 2 | 4]: string | null } | null;
    user_badges: Record<string, never>;
    user_badge_ids: Record<string, never>;
    css: string | null;
  }

  interface User {
    avatar: `https://cdn.frankerfacez.com/avatar/${"twitch"}/${number}` | null;
    badges: number[];
    display_name: string;
    emote_sets: number[];
    id: number;
    is_donor: boolean;
    is_subwoofer: boolean;
    max_emoticons: number;
    name: Lowercase<User["display_name"]>;
    twitch_id: number | null;
    youtube_id: number | null;
  }

  interface Badge {
    id: number;
    name: string;
    title: string;
    slot: number;
    replaces: null;
    /** color in HEX format */
    color: string;
    image: `https://cdn.frankerfacez.com/badge/${Badge["id"]}/1`;
    urls: {
      [n in
        | 1
        | 2
        | 4]: `https://cdn.frankerfacez.com/badge/${Badge["id"]}/${n}`;
    };
    css: null;
  }

  export interface UserStruct {
    badges: Record<`${number}`, Badge>;
    sets: Record<`${number}`, never>;
    user: User;
  }

  export type EmoteSetsRecord = Record<`${number}`, EmoteSet>;

  export interface GlobalStruct {
    default_sets: number[];
    sets: EmoteSetsRecord;
    user_ids: Record<`${number}`, number[]>;
  }

  export interface RoomStruct {
    room: Room;
    sets: EmoteSetsRecord;
  }
}
