import { BetterTTVApi } from "~/integrations/BetterTTV/api";
import { BetterTTV } from "~/integrations";

export async function getBetterTTVGlobalCollection() {
  const globalEmotes = await BetterTTVApi.getGlobalEmotes();
  return BetterTTV.giveGlobalCollection(globalEmotes);
}

export default defineEventHandler(async () => {
  console.log("GET api/collections/global/BetterTTV");
  return await getBetterTTVGlobalCollection();
});
