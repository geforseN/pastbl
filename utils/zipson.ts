import { parse, stringify } from "zipson";

export const zipsonSerializer = {
  read: (value: unknown) => {
    if (!value) {
      return;
    }
    if (typeof value !== "string") {
      throw new TypeError("Argument is not a string");
    }
    return parse(value);
  },
  write: (value: unknown) => {
    return stringify(value);
  },
};

export const zipsonStoreSerializer = {
  deserialize: parse,
  serialize: stringify,
};
