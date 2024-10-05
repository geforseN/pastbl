import { PersonBetterTTVEmoteIntegration } from "$persons-emotes-collections/layers/integrations/layers/betterttv/server/utils/person-emotes-integration";
import { PersonFrankerFaceZEmoteIntegration } from "$persons-emotes-collections/layers/integrations/layers/frankerfacez/server/utils/person-emotes-integration";
import { PersonSevenTVEmoteIntegration } from "$persons-emotes-collections/layers/integrations/layers/seventv/server/utils/person-emotes-integration";
import { PersonTwitchEmoteIntegration } from "$persons-emotes-collections/layers/integrations/layers/twitch/server/utils/person-emotes-integration";
import { PersonEmotesIntegrationWithFailControl } from "$persons-emotes-collections/server/utils/make-integration";

export type PersonEmoteIntegrationRecord = {
  BetterTTV: PersonBetterTTVEmoteIntegration;
  FrankerFaceZ: PersonFrankerFaceZEmoteIntegration;
  SevenTV: PersonSevenTVEmoteIntegration;
  Twitch: PersonTwitchEmoteIntegration;
};

export const personEmoteIntegrations = {
  BetterTTV: new PersonBetterTTVEmoteIntegration(
    new PersonEmotesIntegrationWithFailControl("BetterTTV"),
  ),
  FrankerFaceZ: new PersonFrankerFaceZEmoteIntegration(
    new PersonEmotesIntegrationWithFailControl("FrankerFaceZ"),
  ),
  SevenTV: new PersonSevenTVEmoteIntegration(
    new PersonEmotesIntegrationWithFailControl("SevenTV"),
  ),
  Twitch: new PersonTwitchEmoteIntegration(
    new PersonEmotesIntegrationWithFailControl("Twitch"),
  ),
  of<S extends EmoteSource>(source: S) {
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
