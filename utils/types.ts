export type Nullish<T> = T | null | undefined;

export type MaybePromise<T> = T | Promise<T>;

export type Unwrap<T> = Omit<T, never>;
