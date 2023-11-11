import { type DBSchema } from "idb";
import { emotesIdb } from "./IndexedDB/emotes";
import type {
  IEmote,
  IEmoteCollection,
  IEmoteSet,
  IGlobalEmoteCollection,
} from "~/integrations";
import { emoteCollectionsIdb } from "~/client-only/IndexedDB/emote-collections";
import { pastasIdb } from "~/client-only/IndexedDB/pastas";

export type IndexedDBEmoteSet = Omit<IEmoteSet, "emotes"> & {
  emoteIds: IEmote["id"][];
};

export type IndexedDBEmoteCollection = Omit<IEmoteCollection, "sets"> & {
  sets: IndexedDBEmoteSet[];
};

export interface IndexedDBUserCollection {
  isActive: boolean;
  twitch: {
    nickname: string;
    id: number;
    username: Lowercase<IndexedDBUserCollection["twitch"]["nickname"]>;
  };
  updatedAt: number;
  collections: Record<
    "BetterTTV" /* | "Twitch" */ | "SevenTV" | "FrankerFaceZ",
    // FIXME: uncomment above when twitch api calls will be implemented
    IndexedDBEmoteCollection
  >;
  failedCollectionsReasons:
    | Record<"BetterTTV" | "SevenTV" | "FrankerFaceZ", string>
    | Record<string, never>;
}

export interface EmoteCollectionsSchema extends DBSchema {
  users: {
    key: IndexedDBUserCollection["twitch"]["username"];
    value: IndexedDBUserCollection;
  };
  global: {
    key: IGlobalEmoteCollection["source"];
    value: IGlobalEmoteCollection;
  };
}

export interface EmotesSchema {
  emotes: {
    key: [IEmote["id"], IEmote["source"]];
    value: IEmote & { updatedAt: number };
    indexes: {
      byId: IEmote["id"];
      bySource: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
      byToken: IEmote["token"];
      byTags: string[];
    };
  };
}

export const idb = {
  emoteCollections: emoteCollectionsIdb,
  emotes: emotesIdb,
  pastas: pastasIdb,
};
