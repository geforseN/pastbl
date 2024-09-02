import type { DBSchema } from "idb";

export interface GlobalEmotesIntegrationsIndexedDBSchema extends DBSchema {
  "global-integrations": {
    key: EmoteSource;
    value: TEmoteIntegrations.Global.Settled;
  };
}
