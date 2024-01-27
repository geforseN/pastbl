// NOTE: using rule disable below because ts types are defined at the bottom
/* eslint-disable no-use-before-define */

import { UserNotFoundError } from "../UserNotFoundError";
import { assert } from "~/utils/error";

// NOTE: FFZ documentation
// LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1

export async function getFFZUserByTwitchLogin(
  login: Lowercase<string>,
): Promise<{
  badges: Record<`${number}`, FrankerFaceZApiBadge>;
  sets: Record<`${number}`, never>;
  user: FrankerFaceZApiUser;
}> {
  const response = await fetch(`https://api.frankerfacez.com/v1/user/${login}`);
  assert.response.ok(response, new UserNotFoundError("FrankerFaceZ", login));
  return response.json();
}

export async function getFFZUserRoomByTwitchId(twitchId: number): Promise<{
  room: FrankerFaceZApiRoom;
  sets: Record<`${number}`, FrankerFaceZApiEmoteSet>;
}> {
  const response = await fetch(
    `https://api.frankerfacez.com/v1/room/id/${twitchId}`,
  );
  assert.response.ok(
    response.clone(),
    "Failed to load FrankerFaceZ user emotes",
  );
  return response.json();
}

export async function getFFZGlobalEmoteSets(): Promise<{
  default_sets: number[];
  sets: Record<`${number}`, FrankerFaceZApiEmoteSet>;
  users: Record<`${number}`, string>;
}> {
  const response = await fetch("https://api.frankerfacez.com/v1/set/global");
  assert.response.ok(response, "Failed to load FrankerFaceZ global emotes");
  return response.json();
}

export const FrankerFaceZApi = {
  async getUser(
    id: number,
    login: Lowercase<string>,
  ): Promise<{
    badges: Record<`${number}`, FrankerFaceZApiBadge>;
    sets: Record<`${number}`, never>;
    user: FrankerFaceZApiUser;
  }> {
    const response = await fetch(
      `https://api.frankerfacez.com/v1/user/id/${id}`,
    );
    assert.response.ok(response, new UserNotFoundError("FrankerFaceZ", login));
    return response.json();
  },
  getRoom: getFFZUserRoomByTwitchId,
};

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

export type FrankerFaceZApiRoom = {
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

export type FrankerFaceZApiUser = {
  avatar: `https://cdn.frankerfacez.com/avatar/${"twitch"}/${number}`;
  badges: number[];
  display_name: string;
  emote_sets: unknown[];
  id: number;
  is_donor: boolean;
  max_emoticons: number;
  name: Lowercase<FrankerFaceZApiUser["display_name"]>;
  // NOTE: maybe twitch_id can not be null, because ffz allows registration only with TwitchOAuth
  twitch_id: number | null;
  youtube_id: number | null;
};

export type FrankerFaceZApiBadge = {
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
