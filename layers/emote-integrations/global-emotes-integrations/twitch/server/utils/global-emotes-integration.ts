import type { TTwitch } from "$/emote-integrations/integrations/twitch/server/utils/types";

export class TwitchGlobalEmotesIntegration {
  get source() {
    return "Twitch" as const;
  }

  async get(): Promise<TTwitch.Global.SettledIntegration> {
    try {
      const response = await fetchTwitchGlobalEmotes();
      const set = getTwitchGlobalEmoteSet(response);
      return makeTwitchGlobalIntegration([set]);
    } catch (error) {
      return {
        status: "failed",
        source: this.source,
        code: "GLOBAL_EMOTES_FETCH_FAILED",
        reason: findErrorMessage(
          error,
          `Failed to load ${this.source} Global Emote Integration`,
        ),
      };
    }
  }
}
