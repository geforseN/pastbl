import { api } from "./api";
import {
  makeChannelSet,
  makeSharedSet,
  makeOwner,
  makePersonIntegration,
  makeGlobalSet,
  makeGlobalIntegration,
} from "./_internal";
import type { TBetterTTV } from "./types";
import consola from "consola";

export const BetterTTV = {
  async getPersonIntegration(
    twitch: PersonTwitch,
  ): Promise<TBetterTTV.Person.ReadyIntegration> {
    const bttv = await api.getUserByTwitchId(twitch.id, twitch.login);
    const sets = [
      makeChannelSet(bttv.channelEmotes),
      makeSharedSet(bttv.sharedEmotes),
    ];
    const owner = makeOwner(bttv, twitch);
    return makePersonIntegration(sets, owner);
  },
  async getGlobalIntegration(): Promise<TBetterTTV.Global.ReadyIntegration> {
    const apiEmotes = await api.getGlobalEmotes();
    consola.info("BetterTTV getGlobalIntegration emotes", apiEmotes);
    const set = makeGlobalSet(apiEmotes);
    return makeGlobalIntegration([set]);
  },
  get name() {
    return "BetterTTV" as const;
  },
};
