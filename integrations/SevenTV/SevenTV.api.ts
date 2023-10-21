export class SevenTVApi {
  // LINK: https://7tv.io/docs
  async fetchUserBySevenTVId(
    sevenTVAccountId: string,
  ): Promise<__SevenTV__UserData__> {
    return fetch(`https://7tv.io/v3/users/${sevenTVAccountId}`).then(
      responseJson,
    );
  }

  // LINK: https://7tv.io/docs
  async fetchEmoteSetById(
    collectionId: string,
  ): Promise<__SevenTV__EmoteSetFromApi__> {
    return fetch(`https://7tv.io/v3/emote-sets/${collectionId}`).then(
      responseJson,
    );
  }

  async fetchUserByTwitchId(twitchId: number): Promise<{
    display_name: string;
    emote_capacity: number;
    emote_set: __SevenTV__EmoteSetFromApi__;
    emote_set_id: null;
    id: `${number}`;
    linked_at: number;
    platform: "TWITCH" | "7TV";
    user: {
      avatar_url: string;
      biography: string;
      connections: []; // TODO
      created_at: ReturnType<typeof Date.now>;
      display_name: string;
      id: string;
      roles: string[];
      style?: { color: number };
      username: Lowercase<string>;
    };
    username: Lowercase<string>;
  }> {
    return fetch(`https://7tv.io/v3/users/twitch/${twitchId}`).then(
      (response) => {
        if (response.status === 404) {
          throw new Error(
            `SevenTV does not have user with twitch id ${twitchId}`,
          );
        }
        return responseJson(response);
      },
    );
  }

  async globalEmotesSet() {
    return this.fetchEmoteSetById("62cdd34e72a832540de95857");
  }

  async globalHalloweenEmotesSet() {
    // NOTE: also can be fetched through https://7tv.io/v3/emote-sets/global until halloween celebration is over i guess
    return this.fetchEmoteSetById("63237427e062d588b69f84d0");
  }
}

export const sevenTVApi = new SevenTVApi();

export type __SevenTV__EmoteSetFromApi__ = {
  capacity: number;
  emote_count: number;
  // NOTE: if no emotes in collection, then api return does not contain emotes field (so emotes field is undefined)
  emotes?: __SevenTV__UserSetEmote__[];
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

export type __SevenTV__UserSetEmote__ = {
  // NOTE: basicly, actor_id field is equal to __SevenTV__EmoteCollection__['id']
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
