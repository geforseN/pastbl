import type { TFrankerFaceZ } from "$/emote-integrations/integrations/frankerfacez/server/utils/types";
import { PersonEmotesIntegrationWithFailControl } from "$/emote-integrations/persons-emotes-collections/_/server/utils/make-integration";

export class PersonFrankerFaceZEmoteIntegration {
  constructor(
    private readonly withFailControl: PersonEmotesIntegrationWithFailControl,
  ) {}

  get source() {
    return "FrankerFaceZ" as const;
  }

  async get(twitch: PersonTwitch) {
    return this.withFailControl.handle<
      TFrankerFaceZ.Person.ReadyIntegration,
      TFrankerFaceZ.Person.FailedIntegration
    >(async () => {
      const [profile, room] = await Promise.all([
        fetchFrankerFaceZUser(twitch.id, twitch.login),
        fetchFrankerFaceZRoom(twitch.id),
      ]);
      const owner = makeFrankerFaceZEmoteIntegrationOwner(profile);
      const sets = makeFrankerFaceZChannelSets(
        room.sets,
        profile.user.max_emoticons,
      );
      return makeFrankerFaceZPersonIntegration(sets, owner);
    });
  }
}
