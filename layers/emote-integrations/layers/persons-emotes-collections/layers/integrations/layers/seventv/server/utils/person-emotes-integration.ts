import type { TSevenTV } from "#t_seventv";
import type { PersonEmotesIntegrationWithFailControl } from "$persons-emotes-collections/server/utils/make-integration";

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
