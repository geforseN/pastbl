import type { DBSchema } from "idb";

export interface PastasSchema extends DBSchema {
  list: {
    key: OmegaPasta["id"];
    value: OmegaPasta;
  };
  bin: {
    key: OmegaPasta["id"];
    value: OmegaPasta;
  };
}
