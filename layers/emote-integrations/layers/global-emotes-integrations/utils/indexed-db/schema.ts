import type { DBSchema } from "idb";
import type * as TEmoteIntegrations from "../../../../shared/types";
import type { EmoteSource } from "../../../emote-sources/utils/external";

export interface GlobalEmotesIntegrationsIndexedDBSchema extends DBSchema {
  "global-integrations": {
    key: EmoteSource;
    value: TEmoteIntegrations.Global.Settled;
  };
}
