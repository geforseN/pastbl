import type { DBSchema } from "idb";

export interface KeyValueIndexedDBSchema extends DBSchema {
  "key-value": {
    key: keyof KeyValueSchema;
    value: KeyValueSchema[keyof KeyValueSchema];
  };
}
