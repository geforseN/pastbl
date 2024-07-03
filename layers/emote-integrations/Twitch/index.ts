import {
  makeOwner,
  makePersonIntegration,
  makePersonSets,
  getGlobalEmoteSet,
  makeGlobalIntegration,
} from "./_internal";
import { fetchTwitchChatEmotes, fetchTwitchGlobalEmotes } from "./api";

import type { TTwitch } from "./types";

export const Twitch = {
  async getPersonIntegration(
    twitch: PersonTwitch,
  ): Promise<TTwitch.Person.ReadyIntegration> {
    const { data } = await fetchTwitchChatEmotes(twitch.id);
    const sets = makePersonSets(data);
    const owner = makeOwner(twitch);
    return makePersonIntegration(sets, owner);
  },
  async getGlobalIntegration(): Promise<TTwitch.Global.ReadyIntegration> {
    const response = await fetchTwitchGlobalEmotes();
    const set = getGlobalEmoteSet(response);
    return makeGlobalIntegration([set]);
  },
  get name() {
    return "Twitch" as const;
  },
};
