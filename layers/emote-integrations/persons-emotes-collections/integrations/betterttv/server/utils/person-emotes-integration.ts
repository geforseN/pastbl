import type { TBetterTTV } from "~~/layers/emote-integrations/integrations/betterttv/server/utils/types-namespace";

export class PersonBetterTTVEmoteIntegration {
  get source() {
    return "BetterTTV" as const;
  }

  async get(
    personTwitch: PersonTwitch,
  ): Promise<TBetterTTV.Person.SettledIntegration> {
    try {
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
    } catch (error) {
      return {
        status: "failed",
        source: this.source,
        code: "ASD",
        reason: findErrorMessage(
          error,
          "Failed to load BetterTTV Person Emotes Integration",
        ),
      };
    }
  }
}
