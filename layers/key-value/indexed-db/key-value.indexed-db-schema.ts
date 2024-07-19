import type { DBSchema } from "idb";
import type { KeyValueSchema } from "../key-value.schema";

export interface KeyValueIndexedDBSchema extends DBSchema {
  "key-value": {
    key: keyof KeyValueSchema;
    value: KeyValueSchema[keyof KeyValueSchema];
  };
}
