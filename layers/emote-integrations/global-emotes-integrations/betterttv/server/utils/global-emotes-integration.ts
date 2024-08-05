import consola from "consola";
import type { TBetterTTV } from "$/emote-integrations/integrations/betterttv/server/utils/types-namespace";

export class BetterTTVGlobalEmotesIntegration {
  source = "BetterTTV" as const;

  async get(): Promise<TBetterTTV.Global.ReadyIntegration> {
    const apiEmotes = await fetchBetterTTVGlobalEmotes();
    consola.info("BetterTTV getGlobalIntegration emotes", apiEmotes);
    const set = makeBetterTTVGlobalSet(apiEmotes);
    return makeBetterTTVGlobalIntegration([set]);
  }
}
