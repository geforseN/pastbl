import type { Emote, EmoteSet } from "~/integrations";
import { EmoteCollection } from "~/integrations/EmoteCollection";

export type EmoteIDBSet = Omit<EmoteSet, "emotes"> & {
  emoteIds: Emote["id"][];
};

export type EmoteIDBCollection = Omit<EmoteCollection, "sets"> & {
  sets: EmoteIDBSet[];
};

export interface IUserProfile {
  twitch: {
    nickname: string;
    id: number;
    username: Lowercase<IUserProfile["twitch"]["nickname"]>;
  };
  updatedAt: number;
  collections: Record<
    "BetterTTV" /* | "Twitch" */ | "SevenTV" | "FrankerFaceZ",
    // FIXME: uncomment above when twitch will be implemented
    EmoteIDBCollection
  >;
}

export class UserProfile implements IUserProfile {
  twitch;
  updatedAt;
  collections;

  constructor(profile: IUserProfile) {
    this.twitch = profile.twitch;
    this.updatedAt = Date.now();
    this.collections = profile.collections;
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

export function toSet(
  setLike: EmoteIDBSet,
  cb: (id: Emote["id"]) => Promise<
    | (Emote & {
        updatedAt: number;
      })
    | undefined
  >,
) {
  return {
    id: setLike.id,
    name: setLike.name,
    source: setLike.source,
    updatedAt: setLike.updatedAt,
    emotes: setLike.emoteIds.map(cb),
  };
}

export function createUserProfileForIDB(
  userCollections: NonNullable<Awaited<ReturnType<typeof useUserIntegrations>>>,
) {
  const collectionsRecord = {
    FrankerFaceZ:
      userCollections.ffz.fullCollection.state.value ||
      raise("No ffz collection"),
    BetterTTV: userCollections.bttv.state.value || raise("No bttv collection"),
    SevenTV:
      userCollections.sevenTv.fullCollection.state.value ||
      raise("No 7tv collection"),
  };

  const data = {
    user: {
      twitch: {
        id:
          collectionEntries[0][1].owner.twitchId ||
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
    // TODO map
    collectionsRecord,
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
