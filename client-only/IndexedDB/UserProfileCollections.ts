import type { Emote, EmoteCollection, EmoteSet } from "~/integrations";

export type EmoteSetWithEmoteIds = Omit<EmoteSet, "emotes"> & {
  emoteIds: Emote["id"][];
};

export type EmoteCollectionWithSetsLike = Omit<EmoteCollection, "sets"> & {
  sets: EmoteSetWithEmoteIds[];
};

export type ProfileT = {
  user: {
    twitch: {
      nickname: string;
      id: number;
      username: Lowercase<ProfileT["user"]["twitch"]["nickname"]>;
    };
    avatarSources: Record<
      "FrankerFaceZ" | "BetterTTV" | "SevenTV" | "Twitch",
      string
    >;
  };
  collectionsRecord: Record<
    "FrankerFaceZ" | "BetterTTV" | "SevenTV",
    EmoteCollectionWithSetsLike
  >;
};

export interface IUserProfile {
  twitch: {
    nickname: string;
    id: number;
    username: Lowercase<ProfileT["user"]["twitch"]["nickname"]>;
  };
  updatedAt: number;
  collections: Record<
    "BetterTTV" /* | "Twitch" */ | "SevenTV" | "FrankerFaceZ",
    // FIXME: uncomment above when twitch will be implemented
    EmoteCollectionWithSetsLike
  >;
}

export class UserProfile implements IUserProfile {
  twitch;
  updatedAt;
  collections;

  constructor(data: ProfileT) {
    this.twitch = data.user.twitch;
    this.updatedAt = Date.now();
    this.collections = data.collectionsRecord;
  }
}

export function toSetLike(set: EmoteSet) {
  return {
    id: set.id,
    name: set.name,
    source: set.source,
    updatedAt: set.updatedAt,
    emoteIds: set.emotes.map((emote) => emote.id),
  };
}

export function createUserProfileForIDB(
  userCollections: NonNullable<
    Awaited<ReturnType<typeof useAsyncEmotesState>>["fetch"]["state"]["value"]
  >,
) {
  const collectionEntries = [
    ["FrankerFaceZ", userCollections.ffzCollection],
    ["BetterTTV", userCollections.bttvCollection],
    ["SevenTV", userCollections.sevenTvCollection],
  ] as const;
  const betterCollections = collectionEntries.reduce(
    (record, [name, collection]) => {
      record[name] = {
        ...collection,
        sets: collection.sets.map(toSetLike),
      };
      return record;
    },
    {} as Record<
      "FrankerFaceZ" | "BetterTTV" | "SevenTV",
      EmoteCollectionWithSetsLike
    >,
  );
  const data: ProfileT = {
    user: {
      twitch: {
        id:
          userCollections.ffzCollection.owner.twitchId ||
          raise("No twitchId, can save profile to idb"),
        nickname: userCollections.ffzCollection.owner.displayName,
        username:
          userCollections.ffzCollection.owner.displayName.toLowerCase() as Lowercase<string>,
      },
      avatarSources: {
        FrankerFaceZ: userCollections.ffzCollection.owner.avatarUrl as string,
        SevenTV: userCollections.sevenTvCollection.owner.avatarUrl as string,
        // FIXME: add avatarUrl from BetterTTV
        // BetterTTV: userCollections.bttvCollection,
        // FIXME: add avatarUrl from Twitch
      } as ProfileT["user"]["avatarSources"],
    },
    collectionsRecord: betterCollections,
  };
  return new UserProfile(data);
}

export function createUserEmotesForIDB(
  userCollections: Record<string, EmoteCollection>,
) {
  return Object.values(userCollections).flatMap((collection: EmoteCollection) =>
    collection.sets.flatMap((set) => set.emotes),
  );
}
