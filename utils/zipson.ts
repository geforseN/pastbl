import { parse, stringify } from "zipson";

export const zipsonSerializer = {
  read: (value: any) => {
    if (!value) {
      return;
    }
    return parse(value);
  },
  write: (value: any) => {
    return stringify(value);
  },
};

export const zipsonStoreSerializer = {
  deserialize: parse,
  serialize: stringify,
};
