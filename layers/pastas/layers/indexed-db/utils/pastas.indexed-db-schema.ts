import type { DBSchema } from "idb";
import type { OmegaPasta } from "../../chat-pasta/utils/pasta";

export interface PastasIndexedDBSchema extends DBSchema {
  list: {
    key: OmegaPasta["id"];
    value: OmegaPasta;
  };
  bin: {
    key: OmegaPasta["id"];
    value: OmegaPasta;
  };
}
