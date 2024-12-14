import type { Primitive, Scalars } from "zod";
import { assert } from "~/utils/assert";

// https://egghead.io/blog/using-branded-types-in-typescript
declare const __brand: unique symbol;
type Brand<N> = { [__brand]: N };
type Branded<T extends { valueOf: () => unknown }, N extends string> = T &
  Brand<N>;

type UnbrandNonNullablePrimitive<T extends NonNullable<Primitive>> = ReturnType<
  Omit<T, typeof __brand>["valueOf"]
>;

export type Unbranded<B extends Scalars> = B extends (infer T)[]
  ? T extends NonNullable<Primitive>
    ? UnbrandNonNullablePrimitive<T>[]
    : never
  : B extends NonNullable<Primitive>
    ? UnbrandNonNullablePrimitive<B>
    : never;

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
