import type { DBSchema, IDBPDatabase, OpenDBCallbacks } from "idb";
import { collectionsIdb } from "~/client-only/IndexedDB/emote-collections";
import { pastasIdb } from "~/client-only/IndexedDB/pastas";
import { emotesIdb } from "~/client-only/IndexedDB/emotes";
import { kvIdb } from "~/client-only/IndexedDB/keyValue";
import type {
  IEmote,
  IEmoteSet,
  IUserEmoteIntegration,
  IUserEmoteCollection,
  IGlobalEmoteCollection,
  FrankerFaceZUserIntegration,
  FrankerFaceZSet,
  FrankerFaceZEmote,
  BetterTTVUserIntegration,
  BetterTTVSet,
  BetterTTVEmote,
  I7TVUserCollection,
  I7TVSet,
  I7TVEmote,
  AvailableEmoteSource,
} from "~/integrations";

export async function openIdb<T extends DBSchema>(
  name: string,
  version: number,
  upgrade: OpenDBCallbacks<T>["upgrade"],
) {
  if (typeof window === "undefined") {
    return {} as IDBPDatabase<T>;
  }
  const { openDB } = await import("idb");
  return openDB<T>(name, version, { upgrade });
}

type GenericIndexedDBUserEmoteIntegration<
  SourceT extends AvailableEmoteSource,
  IntegrationT extends IUserEmoteIntegration,
  EmoteT extends IEmote,
  EmoteSetT extends IEmoteSet<SourceT, EmoteT>,
> = Omit<IntegrationT, "sets"> & {
  sets: Array<
    Omit<EmoteSetT, "emotes"> & {
      emoteIds: EmoteT["id"][];
    }
  >;
};

export type IndexedDBUserEmoteIntegrationRecord = {
  FrankerFaceZ: GenericIndexedDBUserEmoteIntegration<
    "FrankerFaceZ",
    FrankerFaceZUserIntegration,
    FrankerFaceZEmote,
    FrankerFaceZSet
  >;
  BetterTTV: GenericIndexedDBUserEmoteIntegration<
    "BetterTTV",
    BetterTTVUserIntegration,
    BetterTTVEmote,
    BetterTTVSet
  >;
  SevenTV: GenericIndexedDBUserEmoteIntegration<
    "SevenTV",
    I7TVUserCollection,
    I7TVEmote,
    I7TVSet
  >;
};

export type IndexedDBUserEmoteIntegration =
  IndexedDBUserEmoteIntegrationRecord[keyof IndexedDBUserEmoteIntegrationRecord];

export type IndexedDBUserEmoteCollection = Omit<
  IUserEmoteCollection,
  "integrations"
> & {
  integrations: Partial<IndexedDBUserEmoteIntegrationRecord>;
};

export interface CollectionsSchema extends DBSchema {
  users: {
    key: IndexedDBUserEmoteCollection["twitch"]["username"];
    value: IndexedDBUserEmoteCollection;
  };
  global: {
    key: IGlobalEmoteCollection["source"];
    value: IGlobalEmoteCollection;
  };
  "key-value": {
    key: "active-user-collection-username";
    value: IndexedDBUserEmoteCollection["twitch"]["username"] | "";
  };
}

export interface EmotesSchema extends DBSchema {
  emotes: {
    key: [IEmote["id"], IEmote["source"]];
    value: IEmote;
    indexes: {
      byId: IEmote["id"];
      bySource: IEmote["source"];
      byToken: IEmote["token"];
      byTags: string;
    };
  };
}

export interface PastasSchema extends DBSchema {
  list: {
    key: IDBMegaPasta["id"];
    value: IDBMegaPasta;
    indexes: {
      byLength: IDBMegaPasta["length"];
      byCreatedAt: IDBMegaPasta["createdAt"];
      byText: IDBMegaPasta["text"];
      byTags: IDBMegaPasta["tags"];
      byValidTokens: IDBMegaPasta["validTokens"];
    };
  };
  bin: {
    key: IDBMegaPasta["id"];
    value: IDBMegaPasta;
  };
}

export type MyKeyValueSchema = {
  "nickname:value": string;
  "nickname:color": string;
  "pasta:oncopy": "none" | "alert" | "sound" | "alert&sound";
  "badges:count": number;
  "active-user-collection:username":
    | IndexedDBUserEmoteCollection["twitch"]["username"]
    | "";
  "pasta:text": string;
  "pasta:tags": string[];
  "pasta:tag": string;
};
export interface KeyValueSchema extends DBSchema {
  "key-value": {
    key: keyof MyKeyValueSchema;
    value: MyKeyValueSchema[keyof MyKeyValueSchema];
  };
}

export const idb = {
  collections: collectionsIdb,
  emotes: emotesIdb,
  pastas: pastasIdb,
  kv: kvIdb,
};
