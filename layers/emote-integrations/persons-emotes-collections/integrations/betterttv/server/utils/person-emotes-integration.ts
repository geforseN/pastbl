import type { TBetterTTV } from "$/emote-integrations/integrations/betterttv/server/utils/types-namespace";
import { PersonEmotesIntegrationWithFailControl } from "$/emote-integrations/persons-emotes-collections/_/server/utils/make-integration";

export class PersonBetterTTVEmoteIntegration {
  constructor(
    private readonly withFailControl: PersonEmotesIntegrationWithFailControl,
  ) {}

  get source() {
    return "BetterTTV" as const;
  }

  async get(personTwitch: PersonTwitch) {
    return this.withFailControl.handle<
      TBetterTTV.Person.ReadyIntegration,
      TBetterTTV.Person.FailedIntegration
    >(async () => {
      const bttv = await fetchBetterTTVUser(
        personTwitch.id,
        personTwitch.login,
      );
      const sets = [
        makeBetterTTVChannelSet(bttv.channelEmotes),
        makeBetterTTVSharedSet(bttv.sharedEmotes),
      ];
      const owner = makeBetterTTVEmoteIntegrationOwner(bttv, personTwitch);
      return makePersonBetterTTVEmoteIntegration(sets, owner);
    });
  }
}
