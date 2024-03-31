import { getBetterTTVGlobalCollection } from "./BetterTTV.get";
import { getFrankerFaceZGlobalCollection } from "./FrankerFaceZ.get";
import { getSevenTVGlobalCollection } from "./SevenTv.get";
import { getTwitchGlobalCollection } from "./Twitch.get";

export default defineEventHandler(async () => {
  // TODO: add timeout
  // TODO: ? add streaming ?
  const [BetterTTV, FrankerFaceZ, SevenTV, Twitch] = await Promise.all([
    getBetterTTVGlobalCollection(),
    getFrankerFaceZGlobalCollection(),
    getSevenTVGlobalCollection(),
    getTwitchGlobalCollection(),
  ]);
  return {
    BetterTTV,
    FrankerFaceZ,
    SevenTV,
    Twitch,
  };
});
