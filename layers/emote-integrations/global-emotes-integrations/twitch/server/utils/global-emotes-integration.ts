import type { TTwitch } from "~~/layers/emote-integrations/integrations/twitch/server/utils/types";

export class TwitchGlobalEmotesIntegration {
  get source() {
    return "Twitch" as const;
  }

  async get(): Promise<TTwitch.Global.ReadyIntegration> {
    const response = await fetchTwitchGlobalEmotes();
    const set = getTwitchGlobalEmoteSet(response);
    return makeTwitchGlobalIntegration([set]);
  }
}
