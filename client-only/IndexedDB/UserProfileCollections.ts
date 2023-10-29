import type { Emote, EmoteCollection, EmoteSet } from "~/integrations";

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

export type EmoteSetWithEmoteIds = Omit<EmoteSet, "emotes"> & {
  emoteIds: Emote["id"][];
};

export type EmoteCollectionWithSetsLike = Omit<EmoteCollection, "sets"> & {
  sets: EmoteSetWithEmoteIds[];
};

export interface IUserProfile {
  twitch: {
    nickname: string;
    id: number;
    username: Lowercase<ProfileT["user"]["twitch"]["nickname"]>;
  };
  updatedAt: number;
  collections: Record<
    "BetterTTV" | "SevenTV" | "FrankerFaceZ",
    // FIXME: uncomment me when will be implemented
    // | "Twitch"
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
