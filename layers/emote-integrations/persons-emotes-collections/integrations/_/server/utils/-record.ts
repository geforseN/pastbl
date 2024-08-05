import { PersonBetterTTVEmoteIntegration } from "$/emote-integrations/persons-emotes-collections/integrations/betterttv/server/utils/person-emotes-integration";
import { PersonFrankerFaceZEmoteIntegration } from "$/emote-integrations/persons-emotes-collections/integrations/frankerfacez/server/utils/person-emotes-integration";
import { PersonSevenTVEmoteIntegration } from "$/emote-integrations/persons-emotes-collections/integrations/seventv/server/utils/person-emotes-integration";
import { PersonTwitchEmoteIntegration } from "$/emote-integrations/persons-emotes-collections/integrations/twitch/server/utils/person-emotes-integration";

export const personEmoteIntegrations = {
  BetterTTV: new PersonBetterTTVEmoteIntegration(),
  FrankerFaceZ: new PersonFrankerFaceZEmoteIntegration(),
  SevenTV: new PersonSevenTVEmoteIntegration(),
  Twitch: new PersonTwitchEmoteIntegration(),
  of<T extends EmoteSource>(source: T) {
    return this[source] || raise();
  },
  *[Symbol.iterator]() {
    yield this.BetterTTV;
    yield this.FrankerFaceZ;
    yield this.SevenTV;
    yield this.Twitch;
  },
} as const;

export class PersonEmoteIntegrations {
  constructor(private readonly personTwitch: PersonTwitch) {}

  async *[Symbol.asyncIterator]() {
    for (const integration of personEmoteIntegrations) {
      yield await integration.get(this.personTwitch);
    }
  }

  get [Symbol.toStringTag]() {
    return "PersonEmoteIntegrations";
  }
}
