import type { DBSchema } from "idb";
import type { KeyValueSchema } from "../../utils/schema";

export interface KeyValueIndexedDBSchema extends DBSchema {
  "key-value": {
    key: keyof KeyValueSchema;
    value: KeyValueSchema[keyof KeyValueSchema];
  };
}
