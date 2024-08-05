// https://egghead.io/blog/using-branded-types-in-typescript
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
type Branded<T, B> = T & Brand<B>;

export type PastaTag = Branded<string, "PastaTag">;
export type PastaTags = Branded<string[], "PastaTags">;
export type PastaText = Branded<string, "PastaText">;

export type EmoteSource = Branded<
  "FrankerFaceZ" | "BetterTTV" | "SevenTV" | "Twitch",
  "EmoteSource"
>;

export type RemotePastasPaginationCursor = Branded<
  number,
  "RemotePastasPaginationCursor"
> | null;

export function assertIsRemotePastasPaginationCursor(
  value: unknown,
): asserts value is RemotePastasPaginationCursor {
  assert.ok(value === null || typeof value === "number");
}

export type EmoteId = string;
