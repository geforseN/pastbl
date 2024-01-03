import type { DBSchema } from "idb";
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
import { collectionsIdb } from "~/client-only/IndexedDB/emote-collections";
import { pastasIdb } from "~/client-only/IndexedDB/pastas";
import { emotesIdb } from "~/client-only/IndexedDB/emotes";

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

export interface EmotesSchema {
  emotes: {
    key: [IEmote["id"], IEmote["source"]];
    value: IEmote & { updatedAt: number };
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

export const idb = {
  collections: collectionsIdb,
  emotes: emotesIdb,
  pastas: pastasIdb,
};
