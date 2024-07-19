import type {
  IEmoteIntegration,
  IPersonEmoteCollection,
  TEmoteIntegrations,
} from "~/integrations/abstract";
import type { EmoteSource } from "~/integrations/emote-source";
import type { TPersonEmoteCollection } from "$/emote-integrations/internal/PersonEmoteCollection";

class IntegrationEmotes {
  constructor(private readonly integration: TEmoteIntegrations.__Some__) {}

  get canBe() {
    return (
      this.integration.status !== "failed" &&
      this.integration.status !== "loading"
    );
  }

  get asMap() {
    const emotes = this.integration.sets.flatMap((set) => set.emotes ?? []);
    const emoteEntries = emotes.map((emote) => [emote.token, emote] as const);
    return new Map(emoteEntries);
  }

  get sets() {
    return this.integration.sets;
  }

  get source() {
    return this.integration.source;
  }

  get formedAt() {
    return this.integration.formedAt;
  }

  get status() {
    return this.integration.status;
  }
}

class Integration {
  status;
  emotes;

  constructor(private readonly integration: IEmoteIntegration) {
    this.status = new IntegrationStatus(integration);
    this.emotes = new IntegrationEmotes(integration);
  }

  get sets() {
    return this.integration.sets;
  }

  get formedAt() {
    return this.integration.formedAt;
  }

  get source() {
    return this.integration.source;
  }

  toIndexedDB() {
    return {
      ...this.integration,
      sets: this.sets.map((set) => {
        const { emotes, ...idbSet } = set;
        return {
          ...idbSet,
          emoteIds: (emotes ?? []).map((emote) => emote.id),
        };
      }),
    };
  }
}

class IntegrationStatus {
  constructor(private readonly integration: IEmoteIntegration) {}

  get asEmoji() {
    return this.integration.status === "ready" ? "✅" : "❌";
  }
}

class IntegrationsEmotes {
  private readonly integrations: Integration[];

  constructor(integrations: IPersonEmoteCollection["integrations"]) {
    this.integrations = Object.values(integrations).map(
      (integration) => new Integration(integration),
    );
  }

  get asArray() {
    return Object.values(this.integrations)
      .filter((integration) => integration.emotes.canBe)
      .flatMap((integration) =>
        integration.emotes.sets.flatMap((set) => set.emotes),
      );
  }

  get asMap() {
    const values = Object.values(this.integrations).filter(
      (integration) => integration.emotes.canBe,
    );
    const emotes = values
      .flatMap((integration) => integration.sets)
      .flatMap((set) => set.emotes ?? []);
    const emotesEntries = emotes.map((emote) => [emote.token, emote] as const);
    return new Map(emotesEntries);
  }
}

class Integrations {
  emotes;
  _status;

  constructor(
    private readonly integrations: TPersonEmoteCollection.Default["integrations"],
  ) {
    this.emotes = new IntegrationsEmotes(integrations);
    this._status = new IntegrationsStatus(integrations);
  }

  get status() {
    return this._status;
  }

  *[Symbol.iterator]() {
    yield* Object.values(this.integrations);
  }

  get ready() {
    return Object.values(this.integrations).filter(
      (integration) => integration.status === "ready",
    );
  }
}

class IntegrationsStatus {
  constructor(
    private readonly integrations: TPersonEmoteCollection.Default["integrations"],
  ) {}

  static #sourceMap = new Map<EmoteSource, string>([
    ["FrankerFaceZ", "🐶"],
    ["BetterTTV", "🅱️"],
    ["SevenTV", "7️⃣"],
    ["Twitch", "🟣"],
  ]);

  get asEmojiString() {
    return Object.values(this.integrations)
      .map((integration) => {
        const emojiStatus = new IntegrationStatus(integration).asEmoji;
        const sourceEmoji = IntegrationsStatus.#sourceMap.get(
          integration.source,
        );
        assert.ok(sourceEmoji);
        return sourceEmoji + emojiStatus;
      })
      .join(", ");
  }
}

export class PersonEmoteCollection {
  integrations;

  constructor(private readonly collection: IPersonEmoteCollection) {
    this.integrations = new Integrations(collection.integrations);
  }
}

export const personEmoteCollection = {
  Integrations,
  Integration,
  IntegrationsEmotes,
};
