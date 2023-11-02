export class UserNotFoundError extends Error {
  source: "BetterTTV" | "SevenTV" | "FrankerFaceZ";

  constructor(
    source: "BetterTTV" | "SevenTV" | "FrankerFaceZ",
    username?: string,
  ) {
    super(
      `⚠️ ${source} does not have ${
        username ? `user with username ${username}` : "such user"
      }`,
    );
    this.source = source;
  }
}
