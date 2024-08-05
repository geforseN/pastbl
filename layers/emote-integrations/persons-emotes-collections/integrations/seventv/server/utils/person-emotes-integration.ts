import type { TSevenTV } from "$/emote-integrations/integrations/seventv/server/utils/types";

export class PersonSevenTVEmoteIntegration {
  get source() {
    return "SevenTV" as const;
  }

  async get(twitch: PersonTwitch): Promise<TSevenTV.Person.SettledIntegration> {
    try {
      const apiUser = await fetchSevenTVUser(twitch.id, twitch.login);
      const apiSet = await getSevenTVApiUserEmoteSet(apiUser);
      const set = makeSevenTVChannelSet(apiSet);
      const owner = makeSevenTVEmoteIntegrationOwner(apiUser);
      return makePersonSevenTVEmoteIntegration([set], owner);
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
