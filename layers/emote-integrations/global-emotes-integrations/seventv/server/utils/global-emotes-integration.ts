import type { TSevenTV } from "$/emote-integrations/integrations/seventv/server/utils/types";

export class SevenTVGlobalEmotesIntegration {
  get source() {
    return "SevenTV" as const;
  }

  async get(): Promise<TSevenTV.Global.ReadyIntegration> {
    const apiSet = await fetchSevenTVGlobalEmotesSet();
    const set = makeSevenTVGlobalSet(apiSet);
    return makeSevenTVGlobalIntegration([set]);
  }
}
