import type { EmoteSource } from "./emote-source";

export class PersonIntegrationNotFoundError extends Error {
  constructor(
    private readonly source: EmoteSource,
    private readonly login?: string,
  ) {
    super();
  }

  override get message() {
    return `⚠️ ${this.source} does not have ${
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
      source: this.source,
      login: this.login,
    };
  }
}
