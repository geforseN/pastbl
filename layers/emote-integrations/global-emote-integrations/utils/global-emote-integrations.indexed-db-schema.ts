import type { DBSchema } from "idb";
import type { TEmoteIntegrations } from "$/emote-integrations/base/EmoteIntegration";

export interface GlobalEmoteIntegrationsIndexedDBSchema extends DBSchema {
  "global-integrations": {
    key: EmoteSource;
    value: TEmoteIntegrations.Global.Settled;
  };
}
