export type Prettify<T> = {
  [K in keyof T]: Prettify<T[K]>;
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type Nullish<T> = T | null | undefined;

export type MaybePromise<T> = T | Promise<T>;

export type Unwrap<T> = Omit<T, never>;

// type NonFunctionKeys<T> = {
//   [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
// }[keyof T];

// type PropertyKeys<T> = {
//   [K in keyof T]: T[K] extends PropertyDescriptor ? K : never;
// }[keyof T];

// type ObjectProperties<T> = Pick<T, NonFunctionKeys<T> & PropertyKeys<T>>;
// type OnlyProperties<T> = Pick<
//   T,
//   {
//     [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
//   }[keyof T]
// >;
// type G = ObjectProperties<IBetterTTVEmote>;
// type GG = OnlyProperties<IBetterTTVEmote>;
