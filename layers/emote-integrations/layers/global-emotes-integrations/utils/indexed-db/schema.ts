import type { DBSchema } from "idb";
import type { TEmoteIntegrations } from "$/emote-integrations";

export interface GlobalEmotesIntegrationsIndexedDBSchema extends DBSchema {
  "global-integrations": {
    key: EmoteSource;
    value: TEmoteIntegrations.Global.Settled;
  };
}
