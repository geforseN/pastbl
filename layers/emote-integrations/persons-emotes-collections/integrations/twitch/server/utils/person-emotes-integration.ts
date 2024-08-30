import type { TTwitch } from "$/emote-integrations/integrations/twitch/server/utils/types";
import { PersonEmotesIntegrationWithFailControl } from "$/emote-integrations/persons-emotes-collections/_/server/utils/make-integration";

export class PersonTwitchEmoteIntegration {
  constructor(
    private readonly withFailControl: PersonEmotesIntegrationWithFailControl,
  ) {}

  get source() {
    return "Twitch" as const;
  }

  async get(twitch: PersonTwitch) {
    return await this.withFailControl.handle<
      TTwitch.Person.ReadyIntegration,
      TTwitch.Person.FailedIntegration
    >(async () => {
      const { data } = await fetchTwitchChatEmotes(twitch.id);
      const sets = makeTwitchPersonSets(data);
      const owner = makeTwitchOwner(twitch);
      return makePersonTwitchEmoteIntegration(sets, owner);
    });
  }
}
