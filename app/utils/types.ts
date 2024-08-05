export type Nullish<T> = T | null | undefined;

export type MaybePromise<T> = T | Promise<T>;

export type MaybeGetter<T> = T | (() => T);

export type Unwrap<T> = Omit<T, never>;

export type OmitFirst<A> = A extends [first: unknown, ...other: infer AO]
  ? AO
  : never;

export type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

export type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

export type Tuple<
  O extends { length: number; of: unknown },
  Accumulator extends O["of"][] = [],
> = O["length"] extends Accumulator["length"]
  ? Readonly<Accumulator>
  : Tuple<O, [...Accumulator, O["of"]]>;
