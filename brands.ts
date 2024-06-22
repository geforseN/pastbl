type Brand<T, B> = T & { __brand: B };

export type PastaTag = Brand<string, "PastaTag">;
export type PastaTags = Brand<string[], "PastaTags">;
export type PastaText = Brand<string, "PastaText">;

export type EmoteSource = Brand<
  "FrankerFaceZ" | "BetterTTV" | "SevenTV" | "Twitch",
  "EmoteSource"
>;

export type ServerPastasCursor = Brand<number, "ServerPastasCursor">;
