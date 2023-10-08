export type SevenTvUserBasicEmoteSet = {
  id: string;
  name: string;
  capacity: number;
};

type _OWNER = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  style: { color?: number };
  roles: string[];
};

export type _SevenTvUserExtendedEmoteSet = {
  capacity: number;
  emote_count: number;
  emotes?: _SevenTvEmote[];
  flags: number;
  id: string;
  immutable: boolean;
  name: string;
  owner: _OWNER;
  privileged: boolean;
  tags: string[];
};

export type Stored7TvUser = {
  id: string;
  avatarUrl: string;
  createdAt: number;
  emoteSets: SevenTvUserBasicEmoteSet[];
  displayName: string;
  username: string;
  fetchTime: number;
};

export type _SevenTvEmote = {
  id: string;
  name: string;
  flags: number;
  timestamp: number;
  actor_id: null | any;
  data: {
    id: string;
    name: string;
    flags: number;
    lifecycle: number;
    state: ("NO_PERSONAL" | "LISTED" | "PERSONAL")[];
    listed: boolean;
    animated: boolean;
    owner: _OWNER;
    tags?: string[];
    host: {
      url: string;
      files: {
        name: string;
        static_name: string;
        width: number;
        height: number;
        frame_count: number;
        size: number;
        format: "WEBP" | "AVIF";
      }[];
    };
  };
};

export type SevenTvEmote = {
  id: string;
  chatName: string;
  originalName?: string;
  url: string;
  isPubliclyListed: boolean;
  isAnimated: boolean;
  state: ("NO_PERSONAL" | "LISTED" | "PERSONAL")[];
  tags: string[];
};
