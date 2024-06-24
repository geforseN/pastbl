// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare module ISevenTV.API {
  type EmoteFileFormat = "webp" | "avif";
  type EmoteFileSize = "1x" | "2x" | "3x" | "4x";

  type SetOwner = {
    avatar_url: string;
    display_name: string;
    id: string;
    roles: string[];
    style: { color?: number };
    username: Lowercase<SetOwner["display_name"]>;
  };

  export type Emote = {
    actor_id: string | null;
    data: {
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
      owner: SetOwner;
      tags?: string[];
      host: {
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
    };
    id: string;
    name: string;
    // NOTE: as i could understand, flags is bit map
    // if equal to 0, then emote is basic
    // if equal to 1, then emote is zero-width
    flags: number;
    timestamp: number;
  };

  export type EmoteSet = {
    capacity: number;
    emote_count: number;
    // NOTE: if no emotes in collection, then api return does not contain emotes field (so emotes field is undefined)
    emotes?: Emote[];
    flags: number;
    id: string;
    immutable: boolean;
    name: string;
    owner: SetOwner;
    privileged: boolean;
    tags: string[];
  };

  export type EmoteSetWithEmotes = Unwrap<
    Omit<EmoteSet, "emotes"> & {
      emotes: Emote[];
    }
  >;

  type User = Unwrap<SetOwner> & {
    biography: string;
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

  export type UserData = {
    avatar_url: string;
    biography: string;
    connections: {
      display_name: string;
      emote_capacity: number;
      emote_set: {
        capacity: number;
        flags: number;
        id: string;
        immutable: boolean;
        name: string;
        owner: null;
        privileged: boolean;
        tags: string[];
      };
      emote_set_id: string | null;
      id: string;
      linked_at: number;
      platform: "YOUTUBE" | "TWITCH";
      username: string;
    }[];
    created_at: number;
    display_name: string;
    emote_sets: {
      capacity: number;
      flags: number | 4 | 0;
      id: string;
      name: string;
      tags: unknown[];
    }[];
    id: string;
    roles: string[];
    style: { color?: number };
    username: string;
  };

  export type UserProfile = {
    display_name: string;
    emote_capacity: number;
    emote_set: EmoteSet;
    emote_set_id: null;
    id: `${number}`;
    linked_at: number;
    platform: "TWITCH" | "7TV";
    user: Unwrap<User>;
    username: Lowercase<string>;
  };

  export type UserProfileWithValidEmoteSet = Omit<UserProfile, "emote_set"> & {
    emote_set: EmoteSetWithEmotes;
  };
}
