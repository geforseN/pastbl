import { FailedIntegration, ReadyIntegration } from "../../../../../../../../shared/abstract/types";
import type * as TBetterTTV from "#t_betterttv";
import type { PersonEmotesIntegrationWithFailControl } from "$persons-emotes-collections/server/utils/make-integration";

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
