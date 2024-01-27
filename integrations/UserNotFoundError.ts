export class UserNotFoundError extends Error {
  source: "BetterTTV" | "SevenTV" | "FrankerFaceZ";

  constructor(
    source: "BetterTTV" | "SevenTV" | "FrankerFaceZ",
    login?: string,
  ) {
    super(
      `⚠️ ${source} does not have ${
        login ? `user with login ${login}` : "such user"
      }`,
    );
    this.source = source;
  }
}
