export class PersonEmoteIntegrationNotFoundError extends Error {
  constructor(
    private readonly integrationSource: EmoteSource,
    private readonly login?: string,
    public override readonly cause?: Error,
  ) {
    super();
  }

  override get message() {
    return `⚠️ ${this.integrationSource} does not have ${
      this.login ? `person with login ${this.login}` : "such person"
    }`;
  }

  get code() {
    return "PERSON_INTEGRATION_NOT_FOUND";
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      source: this.integrationSource,
      login: this.login,
    };
  }
}
