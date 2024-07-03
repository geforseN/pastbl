import type { DBSchema } from "idb";
import type { TEmoteIntegrations } from "~/integrations/abstract";
import type { TPersonEmoteCollection } from "~/integrations/abstract/PersonEmoteCollection";
import type { EmoteSource } from "~/integrations/emote-source";

export interface CollectionsSchema extends DBSchema {
  users: {
    key: TwitchUserLogin;
    value: TPersonEmoteCollection.SettledIndexedDB;
  };
  global: {
    key: EmoteSource;
    value: TEmoteIntegrations.Global.Settled;
  };
}
