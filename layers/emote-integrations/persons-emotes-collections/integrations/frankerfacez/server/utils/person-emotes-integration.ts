import type { TFrankerFaceZ } from "$/emote-integrations/integrations/frankerfacez/server/utils/types";

export class PersonFrankerFaceZEmoteIntegration {
  get source() {
    return "FrankerFaceZ" as const;
  }

  async get(
    twitch: PersonTwitch,
  ): Promise<TFrankerFaceZ.Person.SettledIntegration> {
    try {
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
    } catch (error) {
      return {
        status: "failed",
        source: this.source,
        code: "ASD",
        reason: findErrorMessage(
          error,
          `Failed to load ${this.source} Person Emotes Integration`,
        ),
      };
    }
  }
}
