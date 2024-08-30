import type { TSevenTV } from "$/emote-integrations/integrations/seventv/server/utils/types";
import type { GlobalEmotesIntegrationWithFailControl } from "$/emote-integrations/global-emotes-integrations/_/server/utils/make-integration";

export class SevenTVGlobalEmotesIntegration {
  constructor(
    private readonly withFailControl: GlobalEmotesIntegrationWithFailControl,
  ) {}

  get source() {
    return "SevenTV" as const;
  }

  async get() {
    return await this.withFailControl.handle<
      TSevenTV.Global.ReadyIntegration,
      TSevenTV.Global.FailedIntegration
    >(async () => {
      const apiSet = await fetchSevenTVGlobalEmotesSet();
      const set = makeSevenTVGlobalSet(apiSet);
      return makeSevenTVGlobalIntegration([set]);
    });
  }
}
