export type Prettify<T> = {
  [K in keyof T]: Prettify<T[K]>;
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type Nullish<T> = T | null | undefined;

export type MaybePromise<T> = T | Promise<T>;
