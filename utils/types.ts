export type Nullish<T> = T | null | undefined;

export type MaybePromise<T> = T | Promise<T>;

export type Unwrap<T> = Omit<T, never>;

export type OmitFirst<A> = A extends [first: unknown, ...other: infer AO]
  ? AO
  : never;

export type ExcludeNotJoinedWithAmpersand<S extends string> =
  S extends `${string}&${string}` ? never : S;
