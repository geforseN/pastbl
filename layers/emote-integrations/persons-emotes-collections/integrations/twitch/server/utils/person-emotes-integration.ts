import type { TTwitch } from "$/emote-integrations/integrations/twitch/server/utils/types";

export class PersonTwitchEmoteIntegration {
  get source() {
    return "Twitch" as const;
  }

  async get(twitch: PersonTwitch): Promise<TTwitch.Person.SettledIntegration> {
    try {
      const { data } = await fetchTwitchChatEmotes(twitch.id);
      const sets = makeTwitchPersonSets(data);
      const owner = makeTwitchOwner(twitch);
      return makePersonTwitchEmoteIntegration(sets, owner);
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
