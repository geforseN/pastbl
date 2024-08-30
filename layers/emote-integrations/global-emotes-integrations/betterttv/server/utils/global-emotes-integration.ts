import type { TBetterTTV } from "$/emote-integrations/integrations/betterttv/server/utils/types-namespace";
import type { GlobalEmotesIntegrationWithFailControl } from "$/emote-integrations/global-emotes-integrations/_/server/utils/make-integration";
import consola from "consola";

export class BetterTTVGlobalEmotesIntegration {
  constructor(
    private readonly withFailControl: GlobalEmotesIntegrationWithFailControl,
  ) {}

  get source() {
    return "BetterTTV" as const;
  }

  async get() {
    return await this.withFailControl.handle<
      TBetterTTV.Global.ReadyIntegration,
      TBetterTTV.Global.FailedIntegration
    >(async () => {
      const apiEmotes = await fetchBetterTTVGlobalEmotes();
      consola.info("BetterTTV getGlobalIntegration emotes", apiEmotes);
      const set = makeBetterTTVGlobalSet(apiEmotes);
      return makeBetterTTVGlobalIntegration([set]);
    });
  }
}
