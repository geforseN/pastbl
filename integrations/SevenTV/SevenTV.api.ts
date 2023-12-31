// NOTE: using rule disable below because ts types are defined at the bottom
/* eslint-disable no-use-before-define */

import { UserNotFoundError } from "../UserNotFoundError";

// LINK: https://7tv.io/docs

export async function get7TVUserBy7TVId(
  accountId: string,
): Promise<SevenTVApiUserData> {
  const response = await fetch(`https://7tv.io/v3/users/${accountId}`);
  assertResponse(response);
  return response.json();
}

export async function get7TVSetById(
  setId: string,
): Promise<SevenTVApiEmoteSet<true>> {
  const response = await fetch(`https://7tv.io/v3/emote-sets/${setId}`);
  assertResponse(response);
  const json = await response.json();
  if (!Array.isArray(json?.emotes)) {
    throw new TypeError("Failed to load user emotes from SevenTV");
  }
  return json;
}

export async function get7TVUserProfileByTwitchId(
  twitchId: number,
  username?: Lowercase<string>,
): Promise<SevenTVApiUserProfile> {
  const response = await fetch(`https://7tv.io/v3/users/twitch/${twitchId}`);
  if (response.statusText.startsWith("4")) {
    throw new UserNotFoundError("SevenTV", username);
  }
  return response.json();
}

export async function get7TVGlobalEmotesSet(): Promise<
  SevenTVApiEmoteSet<true>
> {
  const response = await fetch("https://7tv.io/v3/emote-sets/global");
  if (response.statusText.startsWith("4")) {
    throw new Error("Failed to load SevenTV global emotes");
  }
  return response.json();
}

export type SevenTVApiEmoteSet<IsEmotesIncluded extends boolean = false> = {
  capacity: number;
  emote_count: number;
  // NOTE: if no emotes in collection, then api return does not contain emotes field (so emotes field is undefined)
  emotes: IsEmotesIncluded extends true ? SevenTVApiSetEmote[] : undefined;
  flags: number;
  id: string;
  immutable: boolean;
  name: string;
  owner: SevenTVApiSetOwner;
  privileged: boolean;
  tags: string[];
};

type SevenTVApiUser = SevenTVApiSetOwner & {
  biography: string;
  // FIXME: add type for connections
  connections: unknown[];
  created_at: ReturnType<typeof Date.now>;
  emote_sets: {
    capacity: number;
    flags: number;
    id: string;
    name: string;
    tags: string[];
  }[];
};

type SevenTVApiSetOwner = {
  avatar_url: string;
  display_name: string;
  id: string;
  roles: string[];
  style: { color?: number };
  username: Lowercase<SevenTVApiSetOwner["display_name"]>;
};

export type SevenTVApiSetEmote = {
  // NOTE: basicly, actor_id field is equal to __SevenTV__EmoteCollection__['id']
  // can be null if emote was add in some early times, at new added emotes it is not null
  actor_id: string | null;
  data: SevenTVApiEmoteData;
  id: string;
  name: string;
  // NOTE: as i could understand, flags is bit map
  // if equal to 0, then emote is basic
  // if equal to 1, then emote is zero-width
  flags: number;
  timestamp: number;
};

type SevenTVApiEmoteData = {
  id: string;
  name: string;
  // NOTE: as i could understand, flags is bit map
  // if equal to 0, then emote is basic
  // if equal to 256, then emote is zero-width
  flags: number;
  lifecycle: number;
  state: ("NO_PERSONAL" | "LISTED" | "PERSONAL")[];
  listed: boolean;
  animated: boolean;
  owner: SevenTVApiSetOwner;
  tags?: string[];
  host: SevenTVApiEmoteDataHost;
};

type SevenTVApiEmoteDataHost = {
  url: string;
  files: {
    format: Uppercase<EmoteFileFormat>;
    frame_count: number;
    height: number;
    name: `${EmoteFileSize}.${EmoteFileFormat}`;
    size: number;
    static_name: `${EmoteFileSize}_static.${EmoteFileFormat}`;
    width: number;
  }[];
};

type EmoteFileFormat = "webp" | "avif";
type EmoteFileSize = "1x" | "2x" | "3x" | "4x";

export type SevenTVApiUserData = {
  avatar_url: string;
  biography: string;
  connections: {
    display_name: string;
    emote_capacity: number;
    emote_set: {
      capacity: number;
      // NOTE: do not know what this field means
      // TODO add information what it is
      flags: number;
      id: string;
      immutable: boolean;
      name: string;
      owner: null; // TODO do not know why null, maybe can be not bull
      privileged: boolean;
      tags: string[];
    };
    emote_set_id: string | null; // TODO do not know why can be null
    id: string;
    linked_at: number;
    platform: "YOUTUBE" | "TWITCH";
    username: string;
  }[];
  created_at: number;
  display_name: string;
  emote_sets: {
    capacity: number;
    flags: number | 4 | 0; // NOTE: do not know what this field means
    id: string;
    name: string;
    tags: unknown[]; // NOTE: probably string[], note unknown[]
  }[];
  id: string;
  roles: string[];
  style: { color?: number };
  username: string;
};

export type SevenTVApiUserProfile = {
  display_name: string;
  emote_capacity: number;
  emote_set: SevenTVApiEmoteSet;
  emote_set_id: null;
  id: `${number}`;
  linked_at: number;
  platform: "TWITCH" | "7TV";
  user: SevenTVApiUser;
  username: Lowercase<string>;
};
