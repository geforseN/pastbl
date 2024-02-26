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
  IBetterTTVSet,
  IBetterTTVEmote,
  ISevenTVUserIntegration,
  I7TVSet,
  I7TVEmote,
  EmoteSource,
  ITwitchUserIntegration,
} from "~/integrations";
import type { ITwitchEmote, ITwitchEmoteSet } from "~/integrations/Twitch";

export async function openIdb<T extends DBSchema>(
  name: string,
  version: number,
  upgrade: OpenDBCallbacks<T>["upgrade"],
) {
  if (process.server) {
    return {} as IDBPDatabase<T>;
  }
  const { openDB } = await import("idb");
  return openDB<T>(name, version, { upgrade });
}

type GenericIndexedDBUserEmoteIntegration<
  SourceT extends EmoteSource,
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
    IBetterTTVEmote,
    IBetterTTVSet
  >;
  SevenTV: GenericIndexedDBUserEmoteIntegration<
    "SevenTV",
    ISevenTVUserIntegration,
    I7TVEmote,
    I7TVSet
  >;
  Twitch: GenericIndexedDBUserEmoteIntegration<
    "Twitch",
    ITwitchUserIntegration,
    ITwitchEmote,
    ITwitchEmoteSet
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
    key: IndexedDBUserEmoteCollection["user"]["twitch"]["login"];
    value: IndexedDBUserEmoteCollection;
  };
  global: {
    key: IGlobalEmoteCollection["source"];
    value: IGlobalEmoteCollection;
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
  };
  bin: {
    key: IDBMegaPasta["id"];
    value: IDBMegaPasta;
  };
}

export type MyKeyValueSchema = {
  "app:daisyui-theme": "dark" | "light";
  "nickname:value": string;
  "nickname:color": string;
  "pasta:oncopy": "none" | "alert" | "sound" | "alert&sound";
  "badges:count": number;
  "active-user-collection:login":
    | IndexedDBUserEmoteCollection["user"]["twitch"]["login"]
    | "";
  "pasta:text": string;
  "pasta:tags": string[];
  "pasta:tag": string;
  "create-pasta-form-collapse:is-open": boolean;
  "global-collections:checked-sources": EmoteSource[];
  "user-collection-fetch:must-select-onload": true;
  "pasta-list:sort-strategy": PastaSortStrategy;
  "pasta-list:show-strategy": PastaShowStrategy;
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
