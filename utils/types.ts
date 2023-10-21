export type Prettify<T> = {
  [k in keyof T]: T[k];
} & {};

export type Nullish<T> = T | null | undefined;
