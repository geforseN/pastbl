import type { DBSchema } from "idb";
import type { EmoteSource } from "~/integrations/emote-source";

export type IndexedDBKeyValueStoreSchema = {
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
    key: keyof IndexedDBKeyValueStoreSchema;
    value: IndexedDBKeyValueStoreSchema[keyof IndexedDBKeyValueStoreSchema];
  };
}
