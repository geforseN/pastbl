export class SevenTVApi {
  // LINK: https://7tv.io/docs
  async fetchUserBySevenTVId(
    sevenTVAccountId: string,
  ): Promise<__SevenTV__UserData__> {
    return fetch(`https://7tv.io/v3/users/${sevenTVAccountId}`).then(
      (response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP error, status = ${response.status} error: ${response.text()}`,
          );
        }
        return response.json();
      },
    );
  }

  // LINK: https://7tv.io/docs
  async fetchEmoteSetById(
    collectionId: string,
  ): Promise<__SevenTV__EmoteCollection__> {
    return fetch(`https://7tv.io/v3/emote-sets/${collectionId}`).then(
      returnResponseJSON,
    );
  }

  // FIXME: update return type
  async fetchUserByTwitchId(twitchId: number): Promise<{
    emote_set: {
      emotes: __SevenTV__UserCollectionEmote__[];
      name: string;
      id: string;
      capacity: number;
    };
  }> {
    // NOTE: error may happen on first request: net::ERR_QUIC_PROTOCOL_ERROR 200 (OK)
    // NOTE: so, we need to retry and set timeout for cancel first request
    return $fetch(`https://7tv.io/v3/users/twitch/${twitchId}`, {
      retry: 2,
      timeout: 10_000,
      ignoreResponseError: true,
      retryStatusCodes: [200],
    });
  }
}

export const sevenTVApi = new SevenTVApi();

export type __SevenTV__EmoteCollection__ = {
  capacity: number;
  emote_count: number;
  // NOTE: if no emotes in collection, then api return does not contain emotes field (so emotes field is undefined)
  emotes?: __SevenTV__UserCollectionEmote__[];
  flags: number;
  id: string;
  immutable: boolean;
  name: string;
  owner: __SevenTV__CollectionOwner__;
  privileged: boolean;
  tags: string[];
};

type __SevenTV__CollectionOwner__ = {
  avatar_url: string;
  display_name: string;
  id: string;
  roles: string[];
  style: { color?: number };
  username: string;
};

export type __SevenTV__UserCollectionEmote__ = {
  // NOTE: basicly, this field is equal to __SevenTV__EmoteCollection__['id']
  // can be null if emote was add in some early times, at new added emotes it is not null
  actor_id: string | null;
  data: __SevenTV__UserCollectionEmoteData;
  id: string;
  name: string;
  // NOTE: as i could understand, flags is bit map
  // if equal to 0, then emote is basic
  // if equal to 1, then emote is zero-width
  flags: number;
  timestamp: number;
};

type __SevenTV__UserCollectionEmoteData = {
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
  owner: __SevenTV__CollectionOwner__;
  tags?: string[];
  host: EmoteDataHost;
};

type EmoteDataHost = {
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

export type __SevenTV__UserData__ = {
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
  }[]; //TODO
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
