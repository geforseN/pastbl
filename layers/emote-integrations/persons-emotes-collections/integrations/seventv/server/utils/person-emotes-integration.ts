import type { TSevenTV } from "$/emote-integrations/integrations/seventv/server/utils/types";
import { PersonEmotesIntegrationWithFailControl } from "$/emote-integrations/persons-emotes-collections/_/server/utils/make-integration";

export class PersonSevenTVEmoteIntegration {
  constructor(
    private readonly withFailControl: PersonEmotesIntegrationWithFailControl,
  ) {}

  get source() {
    return "SevenTV" as const;
  }

  async get(twitch: PersonTwitch) {
    return await this.withFailControl.handle<
      TSevenTV.Person.ReadyIntegration,
      TSevenTV.Person.FailedIntegration
    >(async () => {
      const apiUser = await fetchSevenTVUser(twitch.id, twitch.login);
      const apiSet = await getSevenTVApiUserEmoteSet(apiUser);
      const set = makeSevenTVChannelSet(apiSet);
      const owner = makeSevenTVEmoteIntegrationOwner(apiUser);
      return makePersonSevenTVEmoteIntegration([set], owner);
    });
  }
}
