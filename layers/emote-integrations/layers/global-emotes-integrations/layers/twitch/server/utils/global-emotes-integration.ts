import type { GlobalEmotesIntegrationWithFailControl } from "$global-emotes-integrations/server/utils/make-integration";

export class TwitchGlobalEmotesIntegration {
  constructor(
    private readonly withFailControl: GlobalEmotesIntegrationWithFailControl,
  ) {}

  get source() {
    return "Twitch" as const;
  }

  async get() {
    return await this.withFailControl.handle<
      TTwitch.Global.ReadyIntegration,
      TTwitch.Global.FailedIntegration
    >(async () => {
      const response = await fetchTwitchGlobalEmotes();
      const set = getTwitchGlobalEmoteSet(response);
      return makeTwitchGlobalIntegration([set]);
    });
  }
}
