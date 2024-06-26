import type { DBSchema } from "idb";
import { collectionsIdb } from "~/client-only/IndexedDB/emote-collections";
import { pastasIdb } from "~/client-only/IndexedDB/pastas";
import { emotesIdb } from "~/client-only/IndexedDB/emotes";
import { kvIdb } from "~/client-only/IndexedDB/keyValue";
import type {
  IEmote,
  IEmoteSet,
  EmoteSource,
  InternalGenericUserIntegration,
  IBasicUserEmoteCollection__,
} from "~/integrations";
import type { SettledEmoteIntegration } from "~/integrations/integrations";
import type { IEmoteIntegration } from "~/integrations/abstract";

interface GenericIndexedDBUserEmoteIntegration<
  SourceT extends EmoteSource,
  IntegrationT extends IEmoteIntegration,
  EmoteT extends IEmote,
  EmoteSetT extends IEmoteSet<SourceT, EmoteT>,
> extends InternalGenericUserIntegration<SourceT, IntegrationT> {
  sets: Array<
    Omit<EmoteSetT, "emotes"> & {
      emoteIds: EmoteT["id"][];
    }
  >;
}

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

export type IndexedDBUserEmoteCollection = IBasicUserEmoteCollection__ & {
  integrations: Partial<IndexedDBUserEmoteIntegrationRecord>;
};

export type IndexedDBUserEmoteSetRecord = {
  [K in EmoteSource]: IndexedDBUserEmoteIntegrationRecord[K]["sets"][number];
};

export type IndexedDBUserEmoteSet =
  IndexedDBUserEmoteSetRecord[keyof IndexedDBUserEmoteSetRecord];

export interface CollectionsSchema extends DBSchema {
  users: {
    key: IndexedDBUserEmoteCollection["user"]["twitch"]["login"];
    value: IndexedDBUserEmoteCollection;
  };
  global: {
    key: SettledEmoteIntegration["source"];
    value: SettledEmoteIntegration;
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
    key: OmegaPasta["id"];
    value: OmegaPasta;
  };
  bin: {
    key: OmegaPasta["id"];
    value: OmegaPasta;
  };
}

export type MyKeyValueSchema = {
  "app:daisyui-theme": "system" | "dark" | "light";
  "nickname:value": string;
  "nickname:color": string;
  "pasta:oncopy": "none" | "alert" | "sound" | "alert&sound";
  "badges:count": number;
  "active-user-collection:login": SelectedLogin;
  "pasta:text": string;
  "pasta:tags": string[];
  "pasta:tag": string;
  "pasta:is-public": boolean;
  "pastas:work-mode": "server" | "client";
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
